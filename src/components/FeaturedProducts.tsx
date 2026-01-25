import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const products = [
    {
        id: 1,
        name: "Wild Forest Honey",
        price: "₹850",
        image: "https://images.unsplash.com/photo-1587049633562-ad3002f02521?auto=format&fit=crop&q=80&w=800",
        category: "Organic"
    },
    {
        id: 2,
        name: "Pure Acacia Honey",
        price: "₹1,200",
        image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&q=80&w=800",
        category: "Raw"
    },
    {
        id: 3,
        name: "Manuka Specialized",
        price: "₹3,500",
        image: "https://images.unsplash.com/photo-1471943311424-646960669fba?auto=format&fit=crop&q=80&w=800",
        category: "Medicinal"
    }
];

const FeaturedProducts: React.FC<{ onGoToShop: () => void }> = ({ onGoToShop }) => {
    return (
        <section className="py-24 md:py-32 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="max-w-2xl"
                    >
                        <h2 className="text-4xl md:text-5xl font-black text-honeybee-secondary mb-4 italic">Nature's Gold</h2>
                        <p className="text-honeybee-secondary/60 text-lg font-medium">Hand-picked from the most vibrant biodiverse regions across the country.</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <Button onClick={onGoToShop} variant="ghost" className="group flex items-center gap-2 font-black uppercase tracking-widest text-sm">
                            View All Products <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </motion.div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14">
                    {products.map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group cursor-pointer"
                        >
                            <div className="relative aspect-square overflow-hidden rounded-[3rem] mb-6 shadow-2xl shadow-honeybee-primary/10">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-honeybee-secondary/0 group-hover:bg-honeybee-secondary/20 transition-colors duration-500" />
                                <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-tighter text-honeybee-secondary">
                                    {product.category}
                                </div>
                                <div className="absolute bottom-6 right-6 translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                    <Button variant="primary" size="icon" className="shadow-2xl">
                                        <ShoppingBag className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                            <div className="flex justify-between items-start px-2">
                                <div>
                                    <h3 className="text-xl font-black text-honeybee-secondary mb-1 group-hover:text-honeybee-primary transition-colors">{product.name}</h3>
                                    <div className="text-honeybee-primary font-black text-lg">{product.price}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
