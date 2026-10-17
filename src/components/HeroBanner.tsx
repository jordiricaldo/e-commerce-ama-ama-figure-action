import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Flame, Clock, Sparkles, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { HobbyCategory } from '../types';
import matsuriBannerImg from '../assets/images/matsuri_banner_1789641376893.jpg';
import mikuImg from '../assets/images/scale_miku_1789641335408.jpg';
import aerialImg from '../assets/images/gundam_aerial_1789641348337.jpg';
import anyaImg from '../assets/images/nendoroid_anya_1789641315285.jpg';
import pokemonImg from '../assets/images/pokemon_tcg_1789641421429.jpg';

interface HeroBannerProps {
  onSelectPromoFilter: () => void;
  onSelectPreOrderFilter: () => void;
  onSelectScaleFilter: () => void;
  onSelectHobbyCategory: (category: HobbyCategory) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onSelectPromoFilter,
  onSelectPreOrderFilter,
  onSelectScaleFilter,
  onSelectHobbyCategory
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
      accent: 'MATSURI DROP',
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
      image: mikuImg,
      accent: 'PRE-ORDER WAVE',
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
      image: aerialImg,
      accent: 'MECHA & FIGURE',
      hasTimer: false
    }
  ];

  const hobbySpots: { title: string; subtitle: string; category: HobbyCategory; image: string; tone: string }[] = [
    { title: 'Scale Figure', subtitle: 'Display-worthy', category: 'scale', image: mikuImg, tone: 'from-[#ff5b83]' },
    { title: 'Nendoroid & Figma', subtitle: 'Pose your story', category: 'nendoroid', image: anyaImg, tone: 'from-[#14b8a6]' },
    { title: 'Gunpla & Mecha', subtitle: 'Build your lineup', category: 'gunpla', image: aerialImg, tone: 'from-[#f59e0b]' },
    { title: 'TCG & Cards', subtitle: 'Rare pulls inside', category: 'tcg', image: pokemonImg, tone: 'from-[#4f8cff]' }
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
    <section className="relative w-full overflow-hidden px-3 sm:px-4 pt-4 pb-3 max-w-7xl mx-auto">
      <div className="relative rounded-2xl sm:rounded-[28px] overflow-hidden bg-[#111827] border border-slate-800 shadow-[0_24px_70px_-34px_rgba(15,23,42,0.65)]">
        <div className="relative min-h-[390px] sm:min-h-[360px] lg:min-h-[390px] w-full">
          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.tagline}
                referrerPolicy="no-referrer"
                className={`absolute inset-y-0 right-0 h-full w-[76%] sm:w-[64%] object-cover object-center opacity-75 sm:opacity-90 ${idx === currentSlide ? 'animate-hero-image' : ''}`}
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,#111827_0%,#111827_35%,rgba(17,24,39,0.88)_49%,rgba(17,24,39,0.1)_100%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_30%,rgba(20,184,166,0.2),transparent_29%),linear-gradient(0deg,rgba(17,24,39,0.6),transparent_38%)]" />
              <div className="absolute top-5 right-5 sm:top-8 sm:right-8 rounded-full border border-white/20 bg-black/25 px-3 py-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.16em] text-white/80 backdrop-blur-sm">
                {slide.accent}
              </div>

              <div className={`absolute inset-0 p-5 sm:p-8 lg:p-10 flex flex-col justify-center max-w-[620px] z-20 ${idx === currentSlide ? 'animate-hero-copy' : ''}`}>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#ff5b83] text-white shadow-lg shadow-rose-950/30">
                    <Sparkles className="w-3 h-3" />
                    {slide.badge}
                  </span>

                  {slide.hasTimer && (
                    <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md text-white border border-white/20 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold">
                      <Clock className="w-3 h-3 text-[#fbbf24] animate-pulse" />
                      <span className="tabular-nums">
                        {String(timeLeft.hours).padStart(2, '0')}:
                        {String(timeLeft.minutes).padStart(2, '0')}:
                        {String(timeLeft.seconds).padStart(2, '0')}
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-[#5eead4] font-extrabold text-xs sm:text-sm tracking-[0.12em] uppercase">
                  {slide.tagline}
                </p>

                <h1 className="text-[30px] sm:text-4xl lg:text-[48px] font-black text-white leading-[1.02] my-2 max-w-[520px]">
                  {slide.title}
                </h1>

                <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed line-clamp-3 max-w-sm mb-5">
                  {slide.subtitle}
                </p>

                <div className="flex items-center gap-3">
                  <button
                    onClick={slide.ctaAction}
                    className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-5 rounded-lg bg-[#ff5b83] hover:bg-[#ff7898] text-white text-xs sm:text-sm font-black shadow-lg shadow-rose-950/30 active:scale-95 transition-all"
                  >
                    <Flame className="w-4 h-4 fill-current text-[#fde68a]" />
                    {slide.ctaText}
                  </button>

                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-white/85">
                    <ShieldCheck className="w-4 h-4 text-[#5eead4]" />
                    <span>Garansi Original Jepang</span>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-5 right-7 z-10 hidden sm:flex items-center gap-2 text-white/75 [writing-mode:vertical-rl] text-xs font-bold tracking-[0.22em]">
                推しを飾ろう <span className="h-10 w-px bg-[#5eead4]/80" />
              </div>
            </div>
          ))}

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            aria-label="Slide sebelumnya"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/35 hover:bg-black/65 text-white flex items-center justify-center backdrop-blur-sm border border-white/30 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Slide berikutnya"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/35 hover:bg-black/65 text-white flex items-center justify-center backdrop-blur-sm border border-white/30 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Buka slide ${index + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'w-5 bg-[#5eead4]' : 'w-1.5 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {hobbySpots.map((spot, index) => (
          <button
            key={spot.category}
            onClick={() => onSelectHobbyCategory(spot.category)}
            className="group relative isolate h-[104px] sm:h-[124px] overflow-hidden rounded-xl bg-slate-900 text-left shadow-md shadow-slate-900/10"
          >
            <img src={spot.image} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
            <div className={`absolute inset-0 -z-10 bg-gradient-to-r ${spot.tone}/90 via-slate-950/45 to-slate-950/5 opacity-90 transition-opacity group-hover:opacity-100`} />
            <span className="absolute top-2.5 left-3 text-[9px] font-black tracking-[0.16em] text-white/75">0{index + 1} / HOBBY PICK</span>
            <span className="absolute left-3 bottom-3 right-10">
              <span className="block text-sm sm:text-base font-black leading-tight text-white">{spot.title}</span>
              <span className="block mt-0.5 text-[10px] sm:text-[11px] font-semibold text-white/80">{spot.subtitle}</span>
            </span>
            <span className="absolute right-3 bottom-3 w-7 h-7 rounded-full bg-white/15 text-white flex items-center justify-center transition-all group-hover:bg-white group-hover:text-slate-900 group-hover:-translate-y-0.5">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};
