import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { AboutSection } from "@/components/AboutSection";
import { MenuCategories } from "@/components/MenuCategories";
import { ReservationForm } from "@/components/ReservationForm";
import { Footer } from "@/components/Footer";
import { LiveMusicSection } from "@/components/LiveMusicSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-black">
      <Navbar />
      <Hero />
      <AboutSection />
      <MenuCategories />
      <LiveMusicSection />
      <ReservationForm />
      <Footer />
    </main>
  );
}
