import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Button from './Button';

interface HeroProps {
    onGoToShop: () => void;
    onLearnMore: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGoToShop, onLearnMore }) => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    const [displayText, setDisplayText] = useState('');
    const [displayDesc, setDisplayDesc] = useState('');
    const fullText = "BeeBridge";
    const fullDesc = "We're the bridge between the farmer's field, the beekeeper's hive, to the honey in your home.";

    useEffect(() => {
        let isMounted = true;
        let i = 0;
        let j = 0;

        const brandTimer = setInterval(() => {
            if (!isMounted) return;
            if (i <= fullText.length) {
                setDisplayText(fullText.slice(0, i));
                i++;
            } else {
                clearInterval(brandTimer);
                const descTimer = setInterval(() => {
                    if (!isMounted) return;
                    if (j <= fullDesc.length) {
                        setDisplayDesc(fullDesc.slice(0, j));
                        j++;
                    } else {
                        clearInterval(descTimer);
                    }
                }, 40);
            }
        }, 120);

        return () => {
            isMounted = false;
            clearInterval(brandTimer);
        };
    }, []);

    return (
        <div className="relative min-h-[90vh] flex flex-col justify-center items-center overflow-hidden bg-honeybee-background honeycomb-pattern">
            {/* Parallax Background Elements */}
            <motion.div
                style={{ y: y1, opacity }}
                className="absolute top-20 right-10 w-64 h-64 bg-honeybee-primary/10 rounded-full blur-3xl pointer-events-none"
            />
            <motion.div
                style={{ y: y2, opacity }}
                className="absolute bottom-20 left-10 w-96 h-96 bg-honeybee-secondary/5 rounded-full blur-3xl pointer-events-none"
            />

            {/* SVG Drip Decoration */}
            <div className="absolute top-0 left-0 w-full pointer-events-none z-0 opacity-20">
                <svg viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                    <path d="M0 0C48 32 96 64 144 64C192 64 240 32 288 32C336 32 384 64 432 64C480 64 528 32 576 32C624 32 672 64 720 64C768 64 816 32 864 32C912 32 960 64 1008 64C1056 64 1104 32 1152 32C1200 32 1248 64 1296 64C1344 64 1392 32 1440 32L1440 0L0 0Z" fill="#FFB800" />
                </svg>
            </div>

            <div className="relative z-10 max-w-7xl w-full px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-left max-w-2xl"
                >
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-honeybee-secondary mb-6 leading-tight tracking-tight">
                        <span className="text-honeybee-primary">{displayText}</span>
                        <motion.span
                            animate={{ opacity: displayDesc === '' ? [1, 0] : 0 }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className="inline-block w-1.5 h-12 md:h-16 lg:h-20 bg-honeybee-secondary ml-2 align-middle"
                        />
                    </h1>
                    <div
                        className="text-honeybee-secondary/70 mb-10 text-lg md:text-xl font-medium leading-relaxed min-h-[5rem] flex items-center"
                    >
                        <span>
                            {displayDesc}
                            {displayDesc.length < fullDesc.length && displayDesc.length > 0 && (
                                <motion.span
                                    animate={{ opacity: [1, 0] }}
                                    transition={{ duration: 0.5, repeat: Infinity }}
                                    className="inline-block w-1.5 h-6 bg-honeybee-primary ml-1 align-middle"
                                />
                            )}
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            <Button onClick={onGoToShop} variant="primary" className="px-10 py-5 rounded-2xl shadow-2xl shadow-honeybee-primary/30">
                                Explore The Shop
                            </Button>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                        >
                            <Button onClick={onLearnMore} variant="light" className="px-10 py-5 rounded-2xl border border-honeybee-secondary/10">
                                Discover Our Story
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 1.2, ease: "circOut" }}
                    className="relative w-full max-w-md lg:max-w-xl"
                >
                    <div className="absolute inset-0 bg-honeybee-primary/20 rounded-full blur-[100px] animate-pulse" />
                    <img
                        src="https://img.freepik.com/free-vector/cute-bees-flying-around-honey-jar-yellow-background_1308-102497.jpg"
                        alt="Premium honey collection"
                        className="relative z-10 w-full h-auto object-contain rounded-[3rem] shadow-2xl transform transition-transform hover:scale-105 duration-700"
                    />
                </motion.div>
            </div>

            {/* Parallax Honey Drip Bottom */}
            <motion.div
                style={{ y: y1 }}
                className="absolute bottom-0 left-0 w-full pointer-events-none opacity-40 z-0"
            >
                <svg viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto translate-y-20">
                    <path d="M0 224L48 208C96 192 192 160 288 165.3C384 171 480 213 576 202.7C672 192 768 128 864 117.3C960 107 1056 149 1152 160C1248 171 1344 149 1392 138.7L1440 128V320H1392C1344 320 1248 320 1152 320C1056 320 960 320 864 320C768 320 672 320 576 320C480 320 384 320 288 320C192 320 96 320 48 320H0V224Z" fill="#FFB800" fillOpacity="0.1" />
                </svg>
            </motion.div>
        </div>
    );
};

export default Hero;
