import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Star, Quote } from 'lucide-react';

/** Realistic testimonials from Indian honey marketplace users */
const testimonials = [
  {
    name: 'Arjun Mehta',
    role: 'Organic Farmer, Maharashtra',
    content:
      'Bee Bridge transformed my entire business. Within a week of listing, I had orders from across Maharashtra. The platform handles everything — I just focus on my bees.',
    rating: 5,
    initials: 'AM',
    gradient: 'from-amber-400 to-orange-500',
  },
  {
    name: 'Priya Nair',
    role: 'Home Chef, Kerala',
    content:
      'I\'ve tried honey from five different sellers on Bee Bridge. Every single one is pure, raw, and exactly as described. The traceability feature gives me complete peace of mind.',
    rating: 5,
    initials: 'PN',
    gradient: 'from-rose-400 to-pink-500',
  },
  {
    name: 'Rajesh Patil',
    role: 'Master Beekeeper, Pune',
    content:
      'After 15 years of selling through middlemen at a fraction of the price, Bee Bridge gave me direct access to customers. My income increased by 40% in the first three months.',
    rating: 5,
    initials: 'RP',
    gradient: 'from-emerald-400 to-teal-500',
  },
  {
    name: 'Sunita Sharma',
    role: 'Nutritionist, Delhi',
    content:
      'I recommend Bee Bridge to all my clients. The honey is genuinely unprocessed — you can taste the difference immediately. The Himalayan Wildflower variety is outstanding.',
    rating: 5,
    initials: 'SS',
    gradient: 'from-violet-400 to-purple-500',
  },
  {
    name: 'Mohammed Iqbal',
    role: 'Restaurant Owner, Hyderabad',
    content:
      'Our signature honey-glazed dishes rely on consistent quality. Bee Bridge sellers deliver every time. The bulk ordering feature and reliable shipping made this our go-to source.',
    rating: 5,
    initials: 'MI',
    gradient: 'from-blue-400 to-indigo-500',
  },
  {
    name: 'Kavita Reddy',
    role: 'Ayurvedic Practitioner, Bengaluru',
    content:
      'Medicinal honey requires purity above all else. Bee Bridge\'s verified seller program ensures I always get what\'s on the label. My patients\' results speak for themselves.',
    rating: 5,
    initials: 'KR',
    gradient: 'from-lime-400 to-green-500',
  },
  {
    name: 'Deepak Singh',
    role: 'Startup Founder, Jaipur',
    content:
      'We source all our honey-based product ingredients from Bee Bridge. The competitive pricing, transparent sourcing, and responsive seller community make scaling easy.',
    rating: 5,
    initials: 'DS',
    gradient: 'from-cyan-400 to-sky-500',
  },
  {
    name: 'Anita Kulkarni',
    role: 'Wellness Blogger, Mumbai',
    content:
      'I\'ve featured Bee Bridge in three of my articles. My readers trust my recommendations, and Bee Bridge hasn\'t let me down once. The product consistency is genuinely impressive.',
    rating: 5,
    initials: 'AK',
    gradient: 'from-yellow-400 to-amber-500',
  },
];

// Duplicate for seamless infinite loop
const CARDS = [...testimonials, ...testimonials];

const CARD_WIDTH = 340; // px
const CARD_GAP = 24;    // px — matches gap-6
const STEP = CARD_WIDTH + CARD_GAP;
const AUTO_SCROLL_SPEED = 0.6; // px per frame

const Testimonials: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const posRef = useRef(0);
  const pausedRef = useRef(false);
  const dragRef = useRef({ active: false, startX: 0, startPos: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const totalWidth = testimonials.length * STEP;

  // ── Infinite auto-scroll ───────────────────────────────────
  const tick = useCallback(() => {
    if (!trackRef.current || pausedRef.current) {
      rafRef.current = requestAnimationFrame(tick);
      return;
    }
    posRef.current += AUTO_SCROLL_SPEED;
    // Reset when we've scrolled one full set width to create seamless loop
    if (posRef.current >= totalWidth) {
      posRef.current -= totalWidth;
    }
    trackRef.current.style.transform = `translateX(-${posRef.current}px)`;
    rafRef.current = requestAnimationFrame(tick);
  }, [totalWidth]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  // ── Pause on hover / focus ─────────────────────────────────
  const pause = () => { pausedRef.current = true; };
  const resume = () => { pausedRef.current = false; };

  // ── Mouse wheel horizontal scroll ─────────────────────────
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    posRef.current = Math.max(
      0,
      Math.min(posRef.current + e.deltaY * 1.5, totalWidth - 1)
    );
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${posRef.current}px)`;
    }
  };

  // ── Drag (mouse + touch) ───────────────────────────────────
  const startDrag = (clientX: number) => {
    dragRef.current = { active: true, startX: clientX, startPos: posRef.current };
    setIsDragging(true);
    pausedRef.current = true;
  };

  const moveDrag = (clientX: number) => {
    if (!dragRef.current.active || !trackRef.current) return;
    const delta = dragRef.current.startX - clientX;
    let newPos = dragRef.current.startPos + delta;
    // Wrap
    if (newPos < 0) newPos += totalWidth;
    if (newPos >= totalWidth) newPos -= totalWidth;
    posRef.current = newPos;
    trackRef.current.style.transform = `translateX(-${posRef.current}px)`;
  };

  const endDrag = () => {
    dragRef.current.active = false;
    setIsDragging(false);
    pausedRef.current = false;
  };

  return (
    <section
      className="py-16 md:py-24 bg-white overflow-hidden"
      aria-label="Customer testimonials"
    >
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 md:mb-16">
        <div className="text-center">
          <span className="inline-block bg-honeybee-primary/10 text-honeybee-primary text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full mb-4">
            Customer Stories
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-honeybee-secondary mb-4 tracking-tight">
            What Our Customers Say
          </h2>
          <p className="text-honeybee-secondary/50 text-base md:text-lg font-medium max-w-xl mx-auto">
            Hear from farmers, beekeepers, chefs, and honey lovers who trust Bee Bridge.
          </p>
        </div>
      </div>

      {/* Carousel Viewport */}
      <div
        className="relative w-full select-none"
        onMouseEnter={pause}
        onMouseLeave={isDragging ? undefined : resume}
        onFocus={pause}
        onBlur={resume}
        onWheel={handleWheel}
        // Mouse drag
        onMouseDown={(e) => startDrag(e.clientX)}
        onMouseMove={(e) => moveDrag(e.clientX)}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        // Touch drag
        onTouchStart={(e) => startDrag(e.touches[0].clientX)}
        onTouchMove={(e) => moveDrag(e.touches[0].clientX)}
        onTouchEnd={endDrag}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        role="region"
        aria-label="Scrollable testimonials"
      >
        {/* Edge fade masks */}
        <div
          className="absolute left-0 top-0 h-full w-16 md:w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, white 0%, transparent 100%)' }}
        />
        <div
          className="absolute right-0 top-0 h-full w-16 md:w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, white 0%, transparent 100%)' }}
        />

        {/* Scrolling Track */}
        <div
          ref={trackRef}
          className="flex will-change-transform"
          style={{ gap: `${CARD_GAP}px`, paddingLeft: '24px', paddingBottom: '16px' }}
          aria-hidden="true"
        >
          {CARDS.map((t, idx) => (
            <article
              key={idx}
              className="flex-shrink-0 bg-white rounded-3xl p-7 border border-gray-100 shadow-lg shadow-gray-100/80 flex flex-col gap-4 hover:shadow-xl hover:border-honeybee-primary/20 transition-all duration-300"
              style={{ width: `${CARD_WIDTH}px` }}
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-honeybee-primary/20 flex-shrink-0" />

              {/* Stars */}
              <div className="flex gap-0.5">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-honeybee-primary fill-honeybee-primary" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 text-sm leading-relaxed flex-1 italic">
                "{t.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-black text-sm flex-shrink-0`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-black text-honeybee-secondary text-sm">{t.name}</p>
                  <p className="text-honeybee-primary text-xs font-semibold">{t.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Drag hint — mobile only */}
      <p className="text-center text-xs text-gray-400 mt-4 md:hidden">
        ← Swipe to explore →
      </p>
    </section>
  );
};

export default Testimonials;
