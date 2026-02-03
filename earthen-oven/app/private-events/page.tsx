"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";

export default function PrivateEventsPage() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        data.date = new Date().toISOString(); // Default to today or add date picker
        // For simplicity reusing the fields or assuming partial data. 
        // Let's make sure we send correct fields
        // API expects: name, phone, email, date, guests, eventType, message

        // Add a date field to form or just mock it for inquiry as "Flexible"
        // But API validates date string. Let's add a date input.

        try {
            const res = await fetch("/api/private-events", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                toast.success("Inquiry sent successfully!");
                (e.target as HTMLFormElement).reset();
            } else {
                toast.error("Failed to send inquiry.");
            }
        } catch {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />
            <Toaster />
            <div className="pt-32 pb-20 bg-black text-center px-4">
                <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">Private Events</h1>
                <p className="text-muted-foreground text-lg italic max-w-2xl mx-auto">
                    Host your corporate dinners, celebrations, and intimate gatherings in our exclusive private dining areas.
                </p>
            </div>

            <section className="py-20 container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-heading font-bold text-white">Celebrate with Excellence</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Whether it&apos;s a corporate milestone, an anniversary, or a family gathering, Earthen Oven provides the perfect backdrop. With capacity for 50-125 guests, customized menus, and impeccable service, your event will be unforgettable.
                        </p>
                        <ul className="space-y-4 pt-4">
                            <li className="flex items-center gap-3 text-white"><span className="w-1.5 h-1.5 bg-accent rounded-full"></span> Customizable Menus</li>
                            <li className="flex items-center gap-3 text-white"><span className="w-1.5 h-1.5 bg-accent rounded-full"></span> Private Dining Areas</li>
                            <li className="flex items-center gap-3 text-white"><span className="w-1.5 h-1.5 bg-accent rounded-full"></span> Audio/Visual Support</li>
                            <li className="flex items-center gap-3 text-white"><span className="w-1.5 h-1.5 bg-accent rounded-full"></span> Dedicated Event Staff</li>
                        </ul>
                    </div>

                    {/* Inquiry Form */}
                    <div className="bg-card p-8 rounded-lg border border-white/10">
                        <h3 className="text-xl font-bold text-white mb-6">Send an Inquiry</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input name="name" placeholder="Your Name" required className="bg-black/50 border-white/10" />
                            <div className="grid grid-cols-2 gap-4">
                                <Input name="phone" placeholder="Phone" required className="bg-black/50 border-white/10" />
                                <Input name="email" type="email" placeholder="Email" required className="bg-black/50 border-white/10" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input name="date" type="date" required className="bg-black/50 border-white/10" />
                                <Input name="guests" type="number" placeholder="Guests" required className="bg-black/50 border-white/10" />
                            </div>
                            <Input name="eventType" placeholder="Event Type (Corporate, Birthday...)" className="bg-black/50 border-white/10" />
                            <Textarea name="message" placeholder="Details or Requirements..." className="bg-black/50 border-white/10 resize-none h-24" />
                            <Button type="submit" disabled={loading} className="w-full bg-accent text-black hover:bg-white">
                                {loading ? "Sending..." : "Submit Inquiry"}
                            </Button>
                        </form>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
}
