import { Navbar } from "@/components/Navbar";
import { MenuCategories } from "@/components/MenuCategories";
import { Footer } from "@/components/Footer";

export default function MenuPage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="pt-32 pb-10 bg-black text-center">
                <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-4">Our Menu</h1>
                <p className="text-muted-foreground text-lg italic">A culinary journey through North India</p>
            </div>
            <MenuCategories />
            <Footer />
        </main>
    );
}
