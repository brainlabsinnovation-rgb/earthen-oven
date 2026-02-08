"use client";

import { use, useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Printer } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function ConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [reservation, setReservation] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRes = async () => {
            try {
                const res = await fetch(`/api/reservations?reservationNumber=${id}`);
                const data = await res.json();
                if (data && data.length > 0) {
                    setReservation(data[0]);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchRes();
    }, [id]);

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;

    if (!reservation) return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
            <h1 className="text-2xl mb-4">Reservation Not Found</h1>
            <Button asChild><Link href="/reservations">Back to Reservations</Link></Button>
        </div>
    );

    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="pt-32 pb-20 container mx-auto px-4 max-w-2xl">
                <div className="bg-card border border-primary/20 p-8 md:p-12 text-center rounded-lg shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-primary to-transparent"></div>

                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 text-4xl">
                        ✓
                    </div>

                    <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">Reservation Received</h1>
                    <p className="text-muted-foreground mb-8">We have received your request. You will receive a confirmation shortly.</p>

                    <div className="bg-black/40 border border-white/10 p-6 rounded-md mb-8">
                        <p className="text-xs uppercase tracking-[0.2em] text-accent mb-2">Reservation Number</p>
                        <p className="text-3xl font-mono text-white mb-6">{reservation.reservationNumber}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                            <div className="flex items-start gap-4">
                                <Calendar className="w-5 h-5 text-primary mt-1" />
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase">Date</p>
                                    <p className="text-white font-medium">
                                        {(() => {
                                            const [y, m, d] = reservation.date.split('T')[0].split('-').map(Number);
                                            return format(new Date(y, m - 1, d), "EEEE, MMMM do, yyyy");
                                        })()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Clock className="w-5 h-5 text-primary mt-1" />
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase">Time</p>
                                    <p className="text-white font-medium">{reservation.timeSlot}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <MapPin className="w-5 h-5 text-primary mt-1" />
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase">Location</p>
                                    <p className="text-white font-medium">Earthen Oven, 14th Floor</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-5 h-5 flex items-center justify-center text-primary font-bold mt-1 text-xs border border-primary rounded-full">
                                    {reservation.numberOfGuests}
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase">Guests</p>
                                    <p className="text-white font-medium">{reservation.numberOfGuests} People</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <Button variant="outline" className="border-white/20 hover:bg-white/10" onClick={() => window.print()}>
                            <Printer className="w-4 h-4 mr-2" />
                            Print Details
                        </Button>
                        <Button className="bg-primary text-white hover:bg-accent" asChild>
                            <Link href="/">Return to Home</Link>
                        </Button>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
