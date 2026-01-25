import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface StatItemProps {
    value: number;
    label: string;
    suffix?: string;
}

const StatItem: React.FC<StatItemProps> = ({ value, label, suffix = "" }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) {
            let start = 0;
            const end = value;
            const duration = 2; // seconds
            const stepTime = Math.abs(Math.floor((duration * 1000) / end));

            const timer = setInterval(() => {
                start += 1;
                setCount(start);
                if (start >= end) clearInterval(timer);
            }, stepTime);

            return () => clearInterval(timer);
        }
    }, [isInView, value]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center p-8 bg-white/50 backdrop-blur-sm rounded-3xl border border-honeybee-primary/10 shadow-xl"
        >
            <div className="text-4xl md:text-5xl font-black text-honeybee-secondary mb-2">
                {count}{suffix}
            </div>
            <div className="text-honeybee-secondary/60 font-bold uppercase tracking-widest text-xs">
                {label}
            </div>
        </motion.div>
    );
};

const Stats: React.FC = () => {
    return (
        <section className="py-12 md:py-24 bg-honeybee-light/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                    <StatItem value={500} label="Active Beekeepers" suffix="+" />
                    <StatItem value={1200} label="Partner Farms" suffix="+" />
                    <StatItem value={15} label="Honey Varieties" />
                    <StatItem value={98} label="Happy Customers" suffix="%" />
                </div>
            </div>
        </section>
    );
};

export default Stats;
