"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronDown, Star } from "lucide-react";

export function Hero() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section ref={ref} className="relative h-screen w-full overflow-hidden">
            {/* Background Parallax */}
            <motion.div
                style={{ y, scale: 1.1 }}
                className="absolute inset-0 z-0"
            >
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: "url('/images/hero-rooftop.png')",
                    }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60" />
            </motion.div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex flex-col items-center"
                >
                    <div className="flex items-center gap-2 mb-4 text-accent tracking-widest uppercase text-sm font-medium">
                        <span className="h-[1px] w-8 bg-accent"></span>
                        <span>14th Floor | Fortune Landmark</span>
                        <span className="h-[1px] w-8 bg-accent"></span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-white mb-4 leading-tight drop-shadow-xl">
                        Earthen Oven
                    </h1>

                    <p className="text-xl md:text-2xl font-light text-foreground/90 italic mb-8 max-w-2xl font-heading">
                        Where Tradition Meets Elevation
                    </p>

                    <div className="flex items-center gap-1.5 mb-10 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                        <div className="flex text-accent">
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                            <div className="relative">
                                <Star className="w-4 h-4 text-accent/30 fill-current" />
                                <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
                                    <Star className="w-4 h-4 text-accent fill-current" />
                                </div>
                            </div>
                        </div>
                        <span className="text-sm font-medium text-white ms-2">4.4 (365+ Reviews)</span>
                    </div>

                    <Button
                        asChild
                        size="lg"
                        className="bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-black rounded-none px-10 py-6 text-lg tracking-widest uppercase transition-all duration-300"
                    >
                        <Link href="/reservations">Reserve Your Table</Link>
                    </Button>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                style={{ opacity }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/50"
            >
                <span className="text-[10px] uppercase tracking-[0.2em] mb-2">Scroll</span>
                <ChevronDown className="animate-bounce w-5 h-5" />
            </motion.div>
        </section>
    );
}
