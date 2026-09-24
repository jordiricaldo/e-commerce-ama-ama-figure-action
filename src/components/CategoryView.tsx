import React from 'react';
import { CATEGORY_LIST } from '../data/categories';
import { HobbyCategory } from '../types';
import { Sparkles, Smile, Cpu, Heart, Layers, ArrowRight, ShieldCheck, Box } from 'lucide-react';

interface CategoryViewProps {
  onSelectCategory: (category: HobbyCategory, subgenre?: string) => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({ onSelectCategory }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-[#05D9E8]" />;
      case 'Smile':
        return <Smile className="w-5 h-5 text-[#FF2A6D]" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-cyan-400" />;
      case 'Heart':
        return <Heart className="w-5 h-5 text-pink-400" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-amber-400" />;
      default:
        return <Box className="w-5 h-5 text-[#05D9E8]" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4">
      {/* Category Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-[#05D9E8] border border-cyan-500/30">
            AKIHABARA DIRECTORY
          </span>
          <span className="text-xs text-slate-400 font-medium">Navigasi Seluruh Koleksi Hobi</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white font-['Poppins']">
          Eksplorasi Menurut Kategori
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
          Pilih kategori hobi spesifik untuk menelusuri ratusan figure berlisensi resmi, Gunpla, Nendoroid, dan kartu koleksi Jepang.
        </p>
      </div>

      {/* Structured Vertical Category List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        {CATEGORY_LIST.map((cat) => (
          <div
            key={cat.id}
            className="group relative bg-[#1A1A26] hover:bg-[#1F1F30] border border-slate-800 hover:border-slate-700/90 rounded-2xl p-4 sm:p-5 transition-all duration-200 shadow-md hover:shadow-xl flex flex-col justify-between"
          >
            <div>
              {/* Category Top Row */}
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#232336] border border-slate-700/60 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                    {getIcon(cat.icon)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-black text-white font-['Poppins'] group-hover:text-[#05D9E8] transition-colors">
                        {cat.name}
                      </h3>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded font-mono">
                        {cat.itemCount}+
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400 tracking-wide font-mono">
                      {cat.japaneseName}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectCategory(cat.id)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#FF2A6D] text-slate-300 hover:text-white flex items-center justify-center transition-colors flex-shrink-0"
                  aria-label={`Buka seluruh produk ${cat.name}`}
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Tagline */}
              <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                {cat.tagline}
              </p>

              {/* Subgenres Pills */}
              <div className="mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Sub-kategori populer:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {cat.subgenres.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => onSelectCategory(cat.id, sub)}
                      className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#222233] hover:bg-[#05D9E8]/20 hover:text-[#05D9E8] hover:border-cyan-500/40 text-slate-300 border border-slate-700/60 transition-colors"
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Featured manufacturers footer */}
            <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
              <span className="truncate max-w-[280px]">
                Brand: <strong className="text-slate-300">{cat.featuredNote}</strong>
              </span>
              <button
                onClick={() => onSelectCategory(cat.id)}
                className="text-[#05D9E8] font-bold hover:underline flex-shrink-0"
              >
                Lihat Semua &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
