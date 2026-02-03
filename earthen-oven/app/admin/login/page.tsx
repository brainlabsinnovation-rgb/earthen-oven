"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function AdminLogin() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === "earthen2026") {
            // Set a simple cookie or local storage for demo purposes
            // In production use proper auth (NextAuth)
            localStorage.setItem("adminAuth", "true");
            router.push("/admin/dashboard");
        } else {
            setError("Invalid password");
        }
    };

    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="flex items-center justify-center min-h-[80vh] px-4">
                <Card className="w-full max-w-md bg-card/50 border-white/10">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                            <Lock className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-2xl font-heading text-white">Admin Access</CardTitle>
                        <CardDescription>Enter admin password to continue</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-background/50 border-white/10 text-center text-lg tracking-widest"
                            />
                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                            <Button type="submit" className="w-full bg-primary hover:bg-accent text-white">
                                Login
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
            <Footer />
        </main>
    );
}
