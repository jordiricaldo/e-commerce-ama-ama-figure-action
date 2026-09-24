import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Flame, Clock, Sparkles, Tag, ShieldCheck } from 'lucide-react';
import matsuriBannerImg from '../assets/images/matsuri_banner_1789641376893.jpg';

interface HeroBannerProps {
  onSelectPromoFilter: () => void;
  onSelectPreOrderFilter: () => void;
  onSelectScaleFilter: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onSelectPromoFilter,
  onSelectPreOrderFilter,
  onSelectScaleFilter
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Countdown timer simulation for the Summer Matsuri Flash Sale
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const slides = [
    {
      id: 1,
      badge: 'FESTIVAL AKIHABARA',
      tagline: 'SUMMER MATSURI SALE 2024',
      title: 'DISKON HINGGA 70%',
      subtitle: 'Koleksi Scale Figure, Nendoroid & Gunpla Original Jepang. Flash deal terbatas!',
      ctaText: 'Belanja Diskon Matsuri',
      ctaAction: onSelectPromoFilter,
      image: matsuriBannerImg,
      accentColor: 'from-[#FF2A6D] to-[#9400D3]',
      hasTimer: true
    },
    {
      id: 2,
      badge: 'SLOT RESMI JEPANG',
      tagline: 'PRE-ORDER WAVE TERBARU',
      title: 'DP MULAI Rp100.000',
      subtitle: 'Good Smile Company, Alter, & Bandai Spirits. 100% Anti-Cut Order bergaransi.',
      ctaText: 'Cek Pre-Order Sekarang',
      ctaAction: onSelectPreOrderFilter,
      image: matsuriBannerImg,
      accentColor: 'from-[#05D9E8] to-[#0077B6]',
      hasTimer: false
    },
    {
      id: 3,
      badge: 'KOLEKSI PREMIUM',
      tagline: 'SCALE 1/7 & 1/4 MASTERPIECE',
      title: 'SPECIAL MISB EDITION',
      subtitle: 'Hatsune Miku Symphony, Jujutsu Kaisen, Spy x Family, dan model kit Gunpla langka.',
      ctaText: 'Lihat Scale Figures',
      ctaAction: onSelectScaleFilter,
      image: matsuriBannerImg,
      accentColor: 'from-[#7928CA] to-[#FF0080]',
      hasTimer: false
    }
  ];

  useEffect(() => {
    const autoSlide = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(autoSlide);
  }, [slides.length]);

  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % slides.length);

  return (
    <section className="relative w-full overflow-hidden px-3 sm:px-4 pt-3 pb-2 max-w-6xl mx-auto">
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#1A1A28] border border-slate-700/60 shadow-2xl">
        {/* Banner Carousel Frame */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] md:aspect-[24/9] min-h-[220px] sm:min-h-[260px] w-full">
          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background Image with Ambient Glow and Gradient Overlay */}
              <img
                src={slide.image}
                alt={slide.tagline}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center filter brightness-75 scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#12121A] via-[#12121A]/85 to-transparent sm:w-3/4" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12121A] via-transparent to-black/30" />

              {/* Slide Content Overlay */}
              <div className="absolute inset-0 p-4 sm:p-7 flex flex-col justify-center max-w-lg z-20">
                {/* Badge & Flash Timer */}
                <div className="flex flex-wrap items-center gap-2 mb-1.5 sm:mb-2">
                  <span className={`inline-flex items-center gap-1 text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gradient-to-r ${slide.accentColor} text-white shadow-md`}>
                    <Sparkles className="w-3 h-3" />
                    {slide.badge}
                  </span>

                  {slide.hasTimer && (
                    <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-mono font-bold">
                      <Clock className="w-3 h-3 text-[#FF2A6D] animate-pulse" />
                      <span>
                        {String(timeLeft.hours).padStart(2, '0')}:
                        {String(timeLeft.minutes).padStart(2, '0')}:
                        {String(timeLeft.seconds).padStart(2, '0')}
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-[#05D9E8] font-bold text-xs sm:text-sm tracking-wider uppercase font-['Poppins']">
                  {slide.tagline}
                </p>

                <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight sm:leading-none my-1 font-['Poppins']">
                  {slide.title}
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 max-w-sm mb-3">
                  {slide.subtitle}
                </p>

                <div className="flex items-center gap-3">
                  <button
                    onClick={slide.ctaAction}
                    className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#FF2A6D] to-[#ff477e] hover:from-[#ff477e] hover:to-[#FF2A6D] text-white text-xs sm:text-sm font-black shadow-lg shadow-pink-600/30 active:scale-95 transition-all"
                  >
                    <Flame className="w-4 h-4 fill-current text-amber-300" />
                    {slide.ctaText}
                  </button>

                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-[#05D9E8]" />
                    <span>Garansi Anti-Bootleg</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            aria-label="Slide sebelumnya"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm border border-white/10 transition-all opacity-80 hover:opacity-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Slide berikutnya"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm border border-white/10 transition-all opacity-80 hover:opacity-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Buka slide ${index + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'w-5 bg-[#05D9E8]' : 'w-1.5 bg-slate-500 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
