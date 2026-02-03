import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get schedule for current month/future
        const { data: events } = await supabaseAdmin
            .from('GazalSchedule')
            .select('*')
            .gte('date', today.toISOString())
            .eq('isActive', true)
            .order('date', { ascending: true })
            .limit(10);

        return NextResponse.json(events || []);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch schedule" }, { status: 500 });
    }
}
