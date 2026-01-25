import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const popularSearches = [
    "Wild Forest Honey",
    "Organic Raw Propolis",
    "Bee Pollen Granules",
    "Artisanal Mango Honey",
    "Eco-friendly Beehives"
];

const SearchBar: React.FC = () => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (query.trim().length > 1) {
            setSuggestions(popularSearches.filter(s => s.toLowerCase().includes(query.toLowerCase())));
            setIsOpen(true);
        } else {
            setSuggestions([]);
            setIsOpen(false);
        }
    }, [query]);

    // Click outside to close
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        window.addEventListener('mousedown', handleClick);
        return () => window.removeEventListener('mousedown', handleClick);
    }, []);

    return (
        <div ref={containerRef} className="relative w-full max-w-2xl mx-auto z-40 px-4">
            <div className={`flex items-center bg-white rounded-[2rem] shadow-2xl transition-all duration-300 border-2 ${isOpen ? 'border-honeybee-primary' : 'border-transparent'
                }`}>
                <div className="pl-6 py-4">
                    <Search className="w-5 h-5 text-honeybee-secondary/40" />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.trim().length > 1 && setIsOpen(true)}
                    placeholder="Search for pure honey, beekeepers, or farms..."
                    className="w-full bg-transparent border-none focus:ring-0 px-4 py-4 text-honeybee-secondary font-medium placeholder-honeybee-secondary/30"
                />
                {query && (
                    <button onClick={() => setQuery('')} className="pr-4 hover:text-honeybee-primary transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                )}
                <div className="pr-4 py-2">
                    <button className="bg-honeybee-secondary text-white px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-honeybee-accent transition-colors shadow-lg shadow-honeybee-secondary/20">
                        Search
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 right-0 mt-3 bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden py-4 mx-4"
                    >
                        <div className="px-6 py-2 text-[10px] font-black text-honeybee-secondary/40 uppercase tracking-[0.2em] mb-2">
                            Suggestions
                        </div>
                        {suggestions.length > 0 ? (
                            suggestions.map((s, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => { setQuery(s); setIsOpen(false); }}
                                    className="w-full text-left px-8 py-3.5 hover:bg-honeybee-light transition-colors flex items-center gap-4 group"
                                >
                                    <Search className="w-4 h-4 text-honeybee-primary group-hover:scale-110 transition-transform" />
                                    <span className="text-honeybee-secondary font-bold">{s}</span>
                                </button>
                            ))
                        ) : (
                            <div className="px-8 py-4 text-honeybee-secondary/40 font-medium italic">No results found for "{query}"</div>
                        )}

                        <div className="mt-4 pt-4 border-t border-gray-50 bg-honeybee-light/30">
                            <div className="px-6 py-2 text-[10px] font-black text-honeybee-secondary/40 uppercase tracking-[0.2em] mb-2">
                                Nearby Locations
                            </div>
                            <button className="w-full text-left px-8 py-3 hover:bg-white transition-colors flex items-center gap-4">
                                <MapPin className="w-4 h-4 text-honeybee-accent" />
                                <span className="text-honeybee-secondary font-bold">Bangalore Metro Region</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SearchBar;
