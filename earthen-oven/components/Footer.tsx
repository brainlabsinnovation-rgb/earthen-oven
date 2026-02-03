import Link from "next/link";
import { Facebook, Instagram, Twitter, Phone, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
    return (
        <footer className="bg-black text-white pt-20 pb-10 border-t border-white/10">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-block">
                            <span className="text-3xl font-heading font-bold text-primary italic tracking-wide">
                                Earthen Oven
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Experience the finest North Indian & Mughlai cuisine on the 14th floor of Fortune Landmark. A 28-year legacy of culinary excellence.
                        </p>
                        <div className="flex gap-4">
                            <Button size="icon" variant="outline" className="rounded-full border-white/20 hover:bg-accent hover:text-black hover:border-accent w-10 h-10">
                                <Facebook className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="outline" className="rounded-full border-white/20 hover:bg-accent hover:text-black hover:border-accent w-10 h-10">
                                <Instagram className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="outline" className="rounded-full border-white/20 hover:bg-accent hover:text-black hover:border-accent w-10 h-10">
                                <Twitter className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h4 className="text-lg font-heading text-white tracking-wider uppercase">Quick Links</h4>
                        <ul className="space-y-3">
                            <li><Link href="/menu" className="text-muted-foreground hover:text-accent transition-colors text-sm">Signature Menu</Link></li>
                            <li><Link href="/reservations" className="text-muted-foreground hover:text-accent transition-colors text-sm">Book a Table</Link></li>
                            <li><Link href="/private-events" className="text-muted-foreground hover:text-accent transition-colors text-sm">Private Events</Link></li>
                            <li><Link href="/gallery" className="text-muted-foreground hover:text-accent transition-colors text-sm">Gallery</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-6">
                        <h4 className="text-lg font-heading text-white tracking-wider uppercase">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-muted-foreground text-sm">
                                <MapPin className="w-5 h-5 text-accent shrink-0" />
                                <span>Fortune Landmark, 14th Floor, Ashram Road, Usmanpura, Ahmedabad, Gujarat 380013</span>
                            </li>
                            <li className="flex items-center gap-3 text-muted-foreground text-sm">
                                <Phone className="w-5 h-5 text-accent shrink-0" />
                                <span>+91 79 6682 4444</span>
                            </li>
                            <li className="flex items-center gap-3 text-muted-foreground text-sm">
                                <Clock className="w-5 h-5 text-accent shrink-0" />
                                <span>Mon - Sun: 7:00 PM - 11:00 PM</span>
                            </li>
                        </ul>
                    </div>

                    {/* Maps */}
                    <div className="space-y-6 h-full min-h-[200px] rounded-none overflow-hidden border border-white/10">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.6967267568165!2d72.5698!3d23.0408!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDAyJzI2LjkiTiA3MsKwMzQnMTEuMyJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0, minHeight: '200px' }}
                            allowFullScreen={true}
                            loading="lazy"
                            className="grayscale hover:grayscale-0 transition-all duration-500"
                        ></iframe>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-muted-foreground/50 uppercase tracking-widest">© 2026 Earthen Oven. All Rights Reserved.</p>
                    <p className="text-xs text-muted-foreground/50 uppercase tracking-widest">Fortune Landmark</p>
                </div>
            </div>
        </footer>
    );
}
