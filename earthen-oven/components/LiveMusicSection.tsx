"use client";

import { motion } from "framer-motion";
import { Music, Mic2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LiveMusicSection() {
    return (
        <section className="py-24 bg-muted/20 relative overflow-hidden">
            {/* Background Image with blur */}
            <div className="absolute inset-0 bg-black/70 z-0"></div>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-fixed bg-center blur-[2px] opacity-40 mix-blend-overlay"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-block p-4 rounded-full border border-accent/30 bg-black/40 backdrop-blur-md mb-8"
                    >
                        <Music className="w-10 h-10 text-accent" />
                    </motion.div>

                    <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6 tracking-tight">
                        Evenings with Live Gazals
                    </h2>

                    <p className="text-lg md:text-xl text-white/80 font-light mb-10 max-w-2xl mx-auto italic leading-relaxed">
                        &quot;Music is the wine that fills the cup of silence.&quot;
                        <br />
                        <span className="text-base not-italic text-white/50 mt-2 block">
                            Join us every evening for soul-stirring Indian classical music and Gazals.
                        </span>
                    </p>

                    <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full max-w-4xl bg-black/30 backdrop-blur-sm border border-white/5 p-8 rounded-sm">
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-accent uppercase tracking-widest text-xs font-bold">Timings</span>
                            <span className="text-white text-lg font-heading">8:00 PM - 10:30 PM</span>
                        </div>
                        <div className="w-px h-12 bg-white/10 hidden md:block"></div>
                        <div className="h-px w-24 bg-white/10 md:hidden"></div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-accent uppercase tracking-widest text-xs font-bold">Genre</span>
                            <span className="text-white text-lg font-heading">Gazal & Classical</span>
                        </div>
                        <div className="w-px h-12 bg-white/10 hidden md:block"></div>
                        <div className="h-px w-24 bg-white/10 md:hidden"></div>
                        <Button variant="ghost" className="text-white hover:text-accent hover:bg-transparent uppercase tracking-wider text-xs flex gap-2 items-center group">
                            <Mic2 className="w-4 h-4 group-hover:text-accent transition-colors" />
                            Request a Song
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
