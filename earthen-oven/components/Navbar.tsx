"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, Phone } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "Gallery", href: "/gallery" },
    { name: "Private Events", href: "/private-events" },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-transparent",
                isScrolled
                    ? "bg-background/95 backdrop-blur-md py-4 border-white/10 shadow-lg"
                    : "bg-transparent py-6"
            )}
        >
            <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex flex-col items-center group">
                    <span className="text-2xl md:text-3xl font-heading font-bold text-primary italic tracking-wide group-hover:text-accent transition-colors">
                        Earthen Oven
                    </span>
                    <span className="text-[0.65rem] md:text-xs tracking-[0.2em] text-foreground/80 uppercase mt-1">
                        Fortune Landmark
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium tracking-widest uppercase hover:text-primary transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-primary after:transition-all hover:after:w-full"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Button
                        asChild
                        variant="outline"
                        className="border-primary text-primary hover:bg-primary hover:text-white transition-all uppercase tracking-wider text-xs px-6"
                    >
                        <Link href="/reservations">Reserve Table</Link>
                    </Button>
                </div>

                {/* Mobile Nav */}
                <div className="md:hidden flex items-center gap-4">
                    <a href="tel:+917966824444" className="text-primary">
                        <Phone className="h-5 w-5" />
                    </a>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-foreground">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="bg-background border-l-white/10">
                            <div className="flex flex-col h-full justify-between py-10">
                                <div className="flex flex-col space-y-8 items-center text-center">
                                    <Link href="/" className="mb-8">
                                        <span className="text-2xl font-heading font-bold text-primary italic">
                                            Earthen Oven
                                        </span>
                                    </Link>
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className="text-lg font-medium tracking-wide uppercase hover:text-primary transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                    <Link
                                        href="/reservations"
                                        className="text-lg font-medium tracking-wide uppercase text-primary"
                                    >
                                        Reservations
                                    </Link>
                                </div>

                                <div className="text-center text-sm text-muted-foreground">
                                    <p>+91 79 6682 4444</p>
                                    <p className="mt-2">14th Floor, Fortune Landmark</p>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
}
