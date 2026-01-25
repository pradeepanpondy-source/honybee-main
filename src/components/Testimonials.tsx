import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Local Beekeeper",
    content: "BeeBridge has completely transformed how I reach customers. The platform is intuitive and truly supports artisanal producers.",
    rating: 5
  },
  {
    name: "David Chen",
    role: "Sustainable Farmer",
    content: "The quality of honey I find here is incomparable. Knowing I'm supporting ethical beekeeping makes every jar even sweeter.",
    rating: 5
  },
  {
    name: "Elena Rodriguez",
    role: "Culinary Chef",
    content: "As a chef, purity is everything. BeeBridge provides the most authentic honey varieties with full transparency of source.",
    rating: 5
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-20 md:py-32 bg-honeybee-background honeycomb-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-black text-honeybee-secondary mb-4">Trusted by the Hive</h2>
          <p className="text-honeybee-secondary/60 text-lg md:text-xl font-medium max-w-2xl mx-auto">Hear from the farmers, beekeepers, and food enthusiasts who make our community buzz.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-honeybee-primary/5 border border-honeybee-primary/10 relative group"
            >
              <Quote className="absolute top-8 right-8 text-honeybee-primary/20 w-12 h-12" />
              <div className="flex mb-6">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-honeybee-primary fill-honeybee-primary" />
                ))}
              </div>
              <p className="text-honeybee-secondary/80 text-lg italic mb-8 leading-relaxed">"{t.content}"</p>
              <div>
                <div className="font-black text-honeybee-secondary text-xl">{t.name}</div>
                <div className="text-honeybee-primary font-bold text-sm uppercase tracking-wider">{t.role}</div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-2 bg-honeybee-primary scale-x-0 group-hover:scale-x-75 transition-transform duration-500 rounded-full mx-10 transform origin-center" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
