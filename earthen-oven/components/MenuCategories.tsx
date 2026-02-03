"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

const menuItems = {
    biryani: [
        { name: "Gosht Awadh Biryani", price: "₹850", description: "Signature slow-cooked lamb biryani with authentic spices", signature: true },
        { name: "Murgh Dum Biryani", price: "₹750", description: "Classic chicken biryani cooked in dum style" },
        { name: "Subz Dum Biryani", price: "₹650", description: "Aromatic vegetable biryani with saffron" },
    ],
    tandoor: [
        { name: "Seekh Kebabs", price: "₹750", description: "Minced lamb skewers grilled to perfection in tandoor", signature: true },
        { name: "Tandoori Mixed Platter", price: "₹800", description: "Assortment of our finest kebabs and tikkas" },
        { name: "Murgh Malai Tikka", price: "₹600", description: "Creamy chicken chunks marinated in cheese and cream" },
        { name: "Paneer Tikka", price: "₹500", description: "Spiced cottage cheese cubes grilled in clay oven" },
    ],
    mains: [
        { name: "Dal Makhani", price: "₹450", description: "Black lentils slow-cooked overnight for 24 hours", signature: true },
        { name: "Rogan Josh", price: "₹850", description: "Traditional Kashmiri lamb curry with aromatic spices" },
        { name: "Butter Chicken", price: "₹700", description: "Tandoori chicken simmered in rich tomato butter gravy" },
        { name: "Paneer Lababdar", price: "₹550", description: "Cottage cheese in a rich, creamy tomato onion gravy" },
    ],
    desserts: [
        { name: "Bharwan Gulab Jamun", price: "₹350", description: "Stuffed milk solids dumplings in sugar syrup", signature: true },
        { name: "Shahi Tukda", price: "₹300", description: "Royal bread pudding with saffron milk and nuts" },
        { name: "Kulfi Falooda", price: "₹280", description: "Traditional Indian ice cream with vermicelli and rose syrup" },
    ]
};

const categories = [
    { id: "biryani", label: "Biryanis" },
    { id: "tandoor", label: "Tandoor" },
    { id: "mains", label: "Curries" },
    { id: "desserts", label: "Desserts" },
];

export function MenuCategories() {
    return (
        <section className="py-20 bg-background relative" id="menu">
            <div className="container mx-auto px-4 md:px-6 z-10 relative">
                <div className="text-center mb-16">
                    <span className="text-accent text-sm tracking-[0.2em] uppercase mb-2 block">Culinary Excellence</span>
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">Signature Menu</h2>
                    <div className="w-24 h-1 bg-accent mx-auto"></div>
                </div>

                <Tabs defaultValue="biryani" className="w-full max-w-4xl mx-auto">
                    <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full h-auto bg-transparent border-b border-white/10 p-0 mb-12">
                        {categories.map((cat) => (
                            <TabsTrigger
                                key={cat.id}
                                value={cat.id}
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:text-accent text-muted-foreground uppercase tracking-widest py-4 text-xs md:text-sm hover:text-white transition-colors"
                            >
                                {cat.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {Object.entries(menuItems).map(([key, items]) => (
                        <TabsContent key={key} value={key} className="mt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {items.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                    >
                                        <Card className="bg-card/50 border-white/5 hover:border-accent/30 transition-colors h-full backdrop-blur-sm">
                                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                                <div className="flex flex-col gap-1">
                                                    <CardTitle className="text-lg md:text-xl font-heading text-foreground flex items-center gap-2">
                                                        {item.name}
                                                        {item.signature && (
                                                            <Badge variant="outline" className="text-[10px] text-accent border-accent/50 px-1 py-0 h-4 leading-none font-normal tracking-wide bg-accent/5">SIGNATURE</Badge>
                                                        )}
                                                    </CardTitle>
                                                </div>
                                                <span className="text-accent font-medium text-lg font-heading">{item.price}</span>
                                            </CardHeader>
                                            <CardContent>
                                                <CardDescription className="text-muted-foreground/80 font-light text-sm leading-relaxed">
                                                    {item.description}
                                                </CardDescription>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>

                <div className="mt-16 text-center">
                    <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-black uppercase tracking-widest rounded-none px-8 py-6" asChild>
                        <Link href="/menu">View Full Menu</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
