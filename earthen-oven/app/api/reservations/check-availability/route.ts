import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { format } from "date-fns";

export async function POST(req: Request) {
    try {
        const { date, time } = await req.json();

        if (!date || !time) {
            return NextResponse.json(
                { error: "Date and time are required" },
                { status: 400 }
            );
        }

        // Format date properly for Supabase query
        // "date" comes as string, e.g., "2024-02-03T18:30:00.000Z"
        // Our DB stores "date" as timestamptz. We seed it at 12:00:00 usually.
        // Let's create a range search for the whole day.

        const checkDate = new Date(date);
        const startOfDay = new Date(checkDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(checkDate);
        endOfDay.setHours(23, 59, 59, 999);

        const { data: availability, error } = await supabaseAdmin
            .from('TableAvailability')
            .select('*')
            .gte('date', startOfDay.toISOString())
            .lte('date', endOfDay.toISOString())
            .eq('timeSlot', time)
            .maybeSingle();

        if (error) throw error;

        if (!availability) {
            // Allow if no record found (assuming deafult 15)
            return NextResponse.json({ available: true, remaining: 15 });
        }

        const remaining = availability.totalTables - availability.bookedTables;

        return NextResponse.json({
            available: remaining > 0,
            remaining
        });

    } catch (error) {
        console.error("Availability Check Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
