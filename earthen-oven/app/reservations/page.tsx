import { Navbar } from "@/components/Navbar";
import { ReservationForm } from "@/components/ReservationForm";
import { Footer } from "@/components/Footer";

export default function ReservationsPage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="pt-32 pb-10 bg-black text-center">
                <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-4">Reservations</h1>
                <p className="text-muted-foreground text-lg italic">Secure your table at Earthen Oven</p>
            </div>
            <ReservationForm />
            <Footer />
        </main>
    );
}
