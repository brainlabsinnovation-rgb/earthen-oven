"use client";

import { motion } from "framer-motion";
import { Music, Eye, Award } from "lucide-react";

const features = [
    { icon: Music, title: "Live Music", desc: "Indian Classical & Gazals" },
    { icon: Eye, title: "Panoramic Views", desc: "14th Floor Skyline" },
    { icon: Award, title: "28 Years Legacy", desc: "Established Excellence" },
];

export function AboutSection() {
    return (
        <section className="py-24 bg-card relative overflow-hidden" id="about">
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div>
                            <span className="text-accent text-sm tracking-[0.2em] uppercase mb-2 block">Our Story</span>
                            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6 leading-tight">
                                A Legacy of <br />
                                <span className="text-primary italic">Royal Flavors</span>
                            </h2>
                            <div className="w-16 h-1 bg-accent"></div>
                        </div>

                        <p className="text-muted-foreground text-lg leading-relaxed font-light">
                            Perched on the 14th floor of Fortune Landmark, Earthen Oven offers more than a meal—it&apos;s an experience spanning 28 years. Savor authentic North Indian and Mughlai delicacies while live music serenades you against Ahmedabad&apos;s glittering skyline.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-white/5">
                            {features.map((feature, idx) => (
                                <div key={idx} className="flex flex-col gap-3">
                                    <div className="w-10 h-10 rounded-full border border-accent/20 flex items-center justify-center bg-accent/5">
                                        <feature.icon className="w-5 h-5 text-accent" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium uppercase tracking-wide text-sm">{feature.title}</h4>
                                        <p className="text-muted-foreground text-xs mt-1">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="relative h-[500px] w-full"
                    >
                        <div className="absolute inset-0 bg-accent/10 transform rotate-3 z-0 rounded-none border border-accent/20"></div>
                        {/* Using a placeholder or external image for demo if generated image unavailable. 
                    Ideally this would be the generated interior image. */}
                        <div className="absolute inset-0 bg-black z-10 overflow-hidden rounded-none">
                            <div
                                className="w-full h-full bg-cover bg-center hover:scale-105 transition-transform duration-700"
                                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1470')" }}
                            >
                                <div className="absolute inset-0 bg-black/40"></div>
                            </div>
                        </div>
                        {/* Decoration */}
                        <div className="absolute -bottom-8 -right-8 w-64 h-64 border-[1px] border-accent/20 rounded-full hidden md:block z-0"></div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
