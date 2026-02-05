import React from 'react';

const MarqueeSection: React.FC = () => {
    const marqueeItems = [
        'Sustainability',
        'Quality',
        'Community',
        'Become a Seller',
        'Quick Payments',
    ];

    // Create 4 sets of the items to ensure we fill even wide screens
    // and can loop smoothly by scrolling just one set's worth (25%)
    const sets = [1, 2, 3, 4];

    return (
        <section className="py-24 bg-[#0a0a0a] relative overflow-hidden w-full">
            <style>{`
                .scroller {
                    max-width: 100%;
                }
                
                .scroller__inner {
                    padding-block: 1rem;
                    display: flex;
                    flex-wrap: nowrap;
                    gap: 3rem; /* Adjustable gap */
                    width: max-content;
                }
                
                .scroller[data-animated="true"] {
                    overflow: hidden;
                    /* Edge fading mask */
                    -webkit-mask: linear-gradient(90deg, transparent, white 10%, white 90%, transparent);
                    mask: linear-gradient(90deg, transparent, white 10%, white 90%, transparent);
                }
                
                .scroller[data-animated="true"] .scroller__inner {
                    width: max-content;
                    flex-wrap: nowrap;
                    /* Move -25% because we have 4 identical sets */
                    animation: scroll 30s forwards linear infinite;
                }
                
                .scroller[data-animated="true"] .scroller__inner:hover {
                    animation-play-state: paused;
                }

                @keyframes scroll {
                    to {
                        /* Move exactly one set's length (1/4 of default total) */
                        transform: translate(-25%);
                    }
                }
            `}</style>

            {/* Header content matching the requested layout */}
            <div className="max-w-7xl mx-auto px-4 text-center mb-16 relative z-10">
                <div className="flex flex-wrap justify-center gap-6 mb-6">
                    {['Code', 'Plan', 'Collaborate', 'Automate', 'Secure'].map((item, index) => (
                        <span key={index} className="text-sm font-semibold text-gray-500 uppercase tracking-widest hover:text-honeybee-primary transition-colors cursor-default">
                            {item}
                        </span>
                    ))}
                </div>
                <h3 className="text-2xl text-gray-300 font-medium">
                    Built for modern beekeeping
                </h3>
            </div>

            {/* The Scroller */}
            <div className="scroller" data-animated="true">
                <div className="scroller__inner">
                    {sets.map((setNum) => (
                        <div key={setNum} className="flex gap-12 shrink-0">
                            {marqueeItems.map((item, index) => (
                                <span
                                    key={`${setNum}-${index}`}
                                    className="text-4xl md:text-5xl font-bold text-white uppercase tracking-widest whitespace-nowrap hover:text-honeybee-primary transition-colors cursor-default"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MarqueeSection;
