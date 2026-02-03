import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const images = [
    "https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop",
    "/images/hero-rooftop.png",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?q=80&w=800&auto=format&fit=crop",
];

export default function GalleryPage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="pt-32 pb-20 bg-black text-center px-4">
                <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">Gallery</h1>
                <p className="text-muted-foreground text-lg italic max-w-2xl mx-auto">
                    A glimpse into the ambience and culinary artistry of Earthen Oven.
                </p>
            </div>

            <section className="py-20 container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((src, i) => (
                        <div key={i} className="aspect-[4/3] relative group overflow-hidden bg-muted rounded-sm">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: `url('${src}')` }}
                            ></div>
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500"></div>
                        </div>
                    ))}
                </div>
            </section>
            <Footer />
        </main>
    );
}
