import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { z } from "zod";

const eventSchema = z.object({
    name: z.string().min(2),
    phone: z.string().min(10),
    email: z.string().email(),
    date: z.string(),
    guests: z.string(),
    eventType: z.string().optional(),
    message: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validated = eventSchema.parse(body);

        const eventDate = new Date(validated.date);
        const numberOfGuests = parseInt(validated.guests.replace(/\D/g, '')) || 50;

        const { data: inquiry, error } = await supabaseAdmin
            .from('PrivateEventInquiry')
            .insert({
                name: validated.name,
                phone: validated.phone,
                email: validated.email,
                eventDate: eventDate.toISOString(),
                numberOfGuests: numberOfGuests,
                eventType: validated.eventType,
                message: validated.message,
                status: "PENDING"
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(inquiry);
    } catch (error) {
        console.error("Private Event Error:", error);
        return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
    }
}
