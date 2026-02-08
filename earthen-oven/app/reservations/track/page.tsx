"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { format } from "date-fns";

export default function TrackReservationPage() {
    const [search, setSearch] = useState("");
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setResult(null);
        setLoading(true);

        try {
            const cleanSearch = search.trim();
            const isPhone = cleanSearch.replace(/\D/g, '').length >= 10;
            const params = new URLSearchParams();
            if (isPhone) {
                params.append("phone", cleanSearch);
            } else {
                params.append("reservationNumber", cleanSearch.toUpperCase());
            }

            const res = await fetch(`/api/reservations?${params.toString()}`);
            const data = await res.json();

            if (data.error) throw new Error(data.error);
            if (Array.isArray(data) && data.length === 0) throw new Error("No reservation found.");

            // If phone search, data is array. If number search, data is array of 1.
            setResult(data);
        } catch (err: any) {
            setError(err.message || "Search failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="pt-32 pb-20 container mx-auto px-4 max-w-lg">
                <h1 className="text-3xl font-heading font-bold text-center mb-8 text-white">Track Reservation</h1>

                <Card className="bg-card/50 border-white/10 mb-8">
                    <CardContent className="pt-6">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <Input
                                placeholder="Reservation Number (EO...) or Phone"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="bg-black/50 border-white/10"
                            />
                            <Button type="submit" disabled={loading} className="bg-primary hover:bg-accent">
                                <Search className="w-4 h-4" />
                            </Button>
                        </form>
                        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                    </CardContent>
                </Card>

                {result && (
                    <div className="space-y-4">
                        {Array.isArray(result) && result.map((res: any) => (
                            <Card key={res.id} className="bg-card border-l-4 border-l-primary border-t-0 border-r-0 border-b-0 shadow-lg">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-accent text-xs font-bold uppercase tracking-wider">#{res.reservationNumber}</p>
                                            <h3 className="text-xl font-bold text-white mt-1">{format(new Date(res.date), "PPP")}</h3>
                                            <p className="text-muted-foreground text-sm">{res.timeSlot} • {res.numberOfGuests} Guests</p>
                                        </div>
                                        <div className={`px-3 py-1 rounded text-xs font-bold border ${res.status === 'CONFIRMED' ? 'text-green-500 border-green-500/30 bg-green-500/10' :
                                            res.status === 'PENDING' ? 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10' :
                                                'text-gray-500'
                                            }`}>
                                            {res.status}
                                        </div>
                                    </div>
                                    {res.tableNumber && (
                                        <div className="mt-4 p-3 bg-white/5 rounded text-sm text-center">
                                            Table Assigned: <span className="font-bold text-white">{res.tableNumber}</span>
                                            {res.seatingArea && <span className="text-muted-foreground"> ({res.seatingArea})</span>}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </main>
    );
}
