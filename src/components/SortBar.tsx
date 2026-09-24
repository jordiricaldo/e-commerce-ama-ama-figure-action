import React from 'react';
import { ArrowUpDown, Flame, Sparkles, TrendingUp } from 'lucide-react';

export type SortOption = 'popular' | 'newest' | 'bestseller' | 'price-asc' | 'price-desc';

interface SortBarProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalCount: number;
}

export const SortBar: React.FC<SortBarProps> = ({
  currentSort,
  onSortChange,
  totalCount
}) => {
  const isPriceSort = currentSort === 'price-asc' || currentSort === 'price-desc';

  const handlePriceToggle = () => {
    if (currentSort === 'price-asc') {
      onSortChange('price-desc');
    } else {
      onSortChange('price-asc');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 pt-3 pb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
        <span>Menampilkan</span>
        <span className="text-[#05D9E8] font-bold font-mono">{totalCount}</span>
        <span>koleksi figure & merchandise</span>
      </div>

      {/* Quick Sort Options */}
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0 hidden md:inline">
          Urutkan:
        </span>

        <button
          onClick={() => onSortChange('popular')}
          className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
            currentSort === 'popular'
              ? 'bg-slate-700 text-[#05D9E8] border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          Populer
        </button>

        <button
          onClick={() => onSortChange('newest')}
          className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
            currentSort === 'newest'
              ? 'bg-slate-700 text-[#05D9E8] border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          Terbaru
        </button>

        <button
          onClick={() => onSortChange('bestseller')}
          className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
            currentSort === 'bestseller'
              ? 'bg-slate-700 text-[#FF2A6D] border border-pink-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Flame className="w-3 h-3" />
          Terlaris
        </button>

        <button
          onClick={handlePriceToggle}
          className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
            isPriceSort
              ? 'bg-slate-700 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
          title="Urutkan berdasarkan harga"
        >
          <ArrowUpDown className="w-3 h-3" />
          <span>
            Harga {currentSort === 'price-asc' ? '↑ Terendah' : currentSort === 'price-desc' ? '↓ Tertinggi' : '↕'}
          </span>
        </button>
      </div>
    </div>
  );
};
