"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Toaster } from "react-hot-toast";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
    name: z.string().min(2, "Name is required"),
    phone: z.string().min(10, "Valid phone number is required"),
    email: z.string().email("Valid email is required"),
    date: z.date(),
    time: z.string().min(1, "Please select a time"),
    guests: z.string().min(1, "Please select number of guests"),
    occasion: z.string().optional(),
    requests: z.string().optional(),
});

export function ReservationForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            phone: "",
            email: "",
            time: "",
            guests: "2",
            occasion: "",
            requests: "",
        },
    });


    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            // Format date to ISO string for API
            const submissionData = {
                ...values,
                date: values.date.toISOString(),
            };

            const response = await fetch("/api/reservations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(submissionData),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || "Something went wrong.");
                return;
            }

            // Redirect to confirmation page
            window.location.href = `/reservations/confirmation/${data.reservationNumber}`;
            // OR use router: 
            // router.push(`/reservations/confirmation/${data.reservationNumber}`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to submit reservation. Please try again.");
        }
    }

    return (
        <section className="py-20 bg-muted/30 relative" id="reservation">
            <Toaster position="top-center" />
            <div className="container mx-auto px-4 md:px-6 z-10 relative">
                <div className="max-w-3xl mx-auto rounded-none md:rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-card">
                    <div className="p-8 md:p-12">
                        <div className="text-center mb-10">
                            <span className="text-accent text-xs tracking-[0.2em] uppercase mb-2 block">Book Your Table</span>
                            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">Request a Reservation</h2>
                            <p className="text-muted-foreground text-sm">Real-time availability checking enabled.</p>
                            <p className="mt-2 text-xs text-accent cursor-pointer hover:underline">
                                <a href="/reservations/track">Track an existing booking</a>
                            </p>
                        </div>
                        {/* Form implementation remains the same, just wrapped onSubmit */}
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                {/* ... fields ... */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Your Name" {...field} className="bg-background/50 border-white/10 focus:border-accent rounded-none h-12" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Phone</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="+91 XXXXX XXXXX" {...field} className="bg-background/50 border-white/10 focus:border-accent rounded-none h-12" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="email@example.com" {...field} className="bg-background/50 border-white/10 focus:border-accent rounded-none h-12" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="guests"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Guests</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="bg-background/50 border-white/10 focus:border-accent rounded-none h-12">
                                                            <SelectValue placeholder="Select guests" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {[2, 3, 4, 5, 6, 7, 8].map((num) => (
                                                            <SelectItem key={num} value={num.toString()}>{num} Guests</SelectItem>
                                                        ))}
                                                        <SelectItem value="8+">8+ Guests</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="date"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-full pl-3 text-left font-normal bg-background/50 border-white/10 hover:bg-background/80 hover:text-white rounded-none h-12",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value ? (
                                                                    format(field.value, "PPP")
                                                                ) : (
                                                                    <span>Pick a date</span>
                                                                )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) =>
                                                                date < new Date()
                                                            }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="time"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Time</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="bg-background/50 border-white/10 focus:border-accent rounded-none h-12">
                                                            <SelectValue placeholder="Select time" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {["7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM", "10:00 PM", "10:30 PM"].map((time) => (
                                                            <SelectItem key={time} value={time}>{time}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="requests"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Special Requests</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Dietary requirements, special occasion (Birthday, Anniversary)..."
                                                    className="resize-none bg-background/50 border-white/10 focus:border-accent min-h-[100px] rounded-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground py-6 text-lg uppercase tracking-widest transition-colors rounded-none">
                                    Confirm Request
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </section>
    );
}
