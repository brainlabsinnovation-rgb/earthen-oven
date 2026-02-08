import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { z } from "zod";
import nodemailer from "nodemailer";
import { format } from "date-fns";

// Email transporter setup
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

const reservationSchema = z.object({
    name: z.string().min(2),
    phone: z.string().min(10),
    email: z.string().email(),
    date: z.string(), // YYYY-MM-DD string
    time: z.string(),
    guests: z.string(),
    occasion: z.string().optional(),
    requests: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validatedData = reservationSchema.parse(body);

        // Parse the YYYY-MM-DD date strictly as a UTC date
        const [year, month, day] = validatedData.date.split('-').map(Number);
        const reservationDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0)); // Noon UTC is safest
        const numberOfGuests = parseInt(validatedData.guests.replace(/\D/g, '')) || 2;

        // Check availability
        const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
        const endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

        const { data: availability } = await supabaseAdmin
            .from('TableAvailability')
            .select('*')
            .gte('date', startOfDay.toISOString())
            .lte('date', endOfDay.toISOString())
            .eq('timeSlot', validatedData.time)
            .maybeSingle();

        if (availability && availability.bookedTables >= availability.totalTables) {
            return NextResponse.json({ error: "Selected time slot is fully booked." }, { status: 409 });
        }

        // Create or find customer
        // Supabase upsert is useful here, but we need ID to link. 
        // Let's search first.
        let customerId;
        const { data: existingCustomer } = await supabaseAdmin
            .from('Customer')
            .select('id')
            .eq('phone', validatedData.phone)
            .maybeSingle();

        if (existingCustomer) {
            customerId = existingCustomer.id;
        } else {
            const { data: newCustomer, error: createError } = await supabaseAdmin
                .from('Customer')
                .insert({
                    name: validatedData.name,
                    phone: validatedData.phone,
                    email: validatedData.email
                })
                .select()
                .single();

            if (createError) throw createError;
            customerId = newCustomer.id;
        }

        // Generate Reservation ID
        const reservationNumber = "EO" + Date.now().toString().slice(-8) + Math.floor(Math.random() * 100);

        // Create Reservation
        const { data: reservation, error: resError } = await supabaseAdmin
            .from('Reservation')
            .insert({
                reservationNumber,
                customerId: customerId,
                date: reservationDate.toISOString(),
                timeSlot: validatedData.time,
                numberOfGuests,
                specialOccasion: validatedData.occasion,
                specialRequests: validatedData.requests,
                status: "PENDING"
            })
            .select()
            .single();

        if (resError) throw resError;

        // Update availability count
        if (availability) {
            await supabaseAdmin
                .from('TableAvailability')
                .update({ bookedTables: availability.bookedTables + 1 })
                .eq('id', availability.id);
        } else {
            // Create availability record
            // Create availability record at 12:00 UTC
            const dateForAvail = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
            await supabaseAdmin
                .from('TableAvailability')
                .insert({
                    date: dateForAvail.toISOString(),
                    timeSlot: validatedData.time,
                    totalTables: 15,
                    bookedTables: 1
                });
        }

        // Send confirmation email
        try {
            await transporter.sendMail({
                from: process.env.RESTAURANT_EMAIL,
                to: validatedData.email,
                subject: `Reservation Received - Earthen Oven #${reservationNumber}`,
                html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h1 style="color: #8B6F47;">Earthen Oven</h1>
                    <p>Dear ${validatedData.name},</p>
                    <p>Thank you for requesting a table at Earthen Oven. We have received your request.</p>
                    <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #8B6F47;">
                        <p><strong>Reservation Number:</strong> ${reservationNumber}</p>
                        <p><strong>Date:</strong> ${format(new Date(reservationDate), "EEEE, MMMM do, yyyy")}</p>
                        <p><strong>Time:</strong> ${validatedData.time}</p>
                        <p><strong>Guests:</strong> ${numberOfGuests}</p>
                    </div>
                    <p>Status: <strong>PENDING CONFIRMATION</strong></p>
                    <p>We will notify you once your table is assigned.</p>
                    <br/>
                    <p>Regards,<br/>Earthen Oven Team</p>
                </div>
            `,
            });
        } catch (emailError) {
            console.error("Email sending failed:", emailError);
        }

        return NextResponse.json(reservation);

    } catch (error) {
        console.error("Reservation Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");
    const reservationNumber = searchParams.get("reservationNumber") || searchParams.get("number");

    if (!phone && !reservationNumber) {
        return NextResponse.json({ error: "Phone or Reservation Number required" }, { status: 400 });
    }

    try {
        if (reservationNumber) {
            const { data: reservation } = await supabaseAdmin
                .from('Reservation')
                .select('*, customer:Customer(*)')
                .ilike('reservationNumber', reservationNumber)
                .maybeSingle();

            return NextResponse.json(reservation ? [reservation] : []);
        }

        if (phone) {
            // Try exact match first
            let { data: customer } = await supabaseAdmin
                .from('Customer')
                .select('*, reservations:Reservation(*)')
                .eq('phone', phone)
                .maybeSingle();

            // Fallback 1: If not found and phone doesn't start with +, try prepending it
            if (!customer && !phone.startsWith('+')) {
                const { data: altCustomer } = await supabaseAdmin
                    .from('Customer')
                    .select('*, reservations:Reservation(*)')
                    .eq('phone', `+${phone}`)
                    .maybeSingle();
                customer = altCustomer;
            }

            // Fallback 2: If still not found and phone starts with +, try removing it
            if (!customer && phone.startsWith('+')) {
                const { data: altCustomer } = await supabaseAdmin
                    .from('Customer')
                    .select('*, reservations:Reservation(*)')
                    .eq('phone', phone.substring(1))
                    .maybeSingle();
                customer = altCustomer;
            }

            if (customer && customer.reservations) {
                customer.reservations.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
                return NextResponse.json(customer.reservations);
            }
            return NextResponse.json([]);
        }
    } catch (error) {
        console.error("Fetch Reservation Error:", error);
        return NextResponse.json({ error: "Failed to fetch reservations" }, { status: 500 });
    }
}
