import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    try {
        let query = supabaseAdmin
            .from('Reservation')
            .select('*, customer:Customer(*)');

        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            query = query.gte('date', startOfDay.toISOString()).lte('date', endOfDay.toISOString());
        }

        if (status && status !== 'All') {
            query = query.eq('status', status);
        }

        if (search) {
            query = query.or(`reservationNumber.ilike.%${search}%,customer.name.ilike.%${search}%,customer.phone.ilike.%${search}%`);
        }

        query = query.order('date', { ascending: true });

        const { data: reservations, error } = await query;
        if (error) throw error;

        return NextResponse.json(reservations);

    } catch (error) {
        return NextResponse.json({ error: "Admin fetch failed" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { id, ...updates } = body;

        const { data: reservation, error } = await supabaseAdmin
            .from('Reservation')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(reservation);
    } catch (error) {
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}
