import React, { useState } from 'react';
import { Search, ShoppingBag, Heart, ShieldCheck, Sparkles, X } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onResetSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  searchQuery,
  onSearchChange,
  onOpenCart,
  onOpenWishlist,
  onResetSearch
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const quickKeywords = ['Anya', 'Gundam Aerial', 'Hatsune Miku', 'Gojo Satoru', 'Pokemon 151', 'Figma'];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#161622]/95 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/20">
      {/* Announcement Bar above header */}
      <div className="w-full bg-gradient-to-r from-[#FF2A6D] via-[#7928CA] to-[#05D9E8] text-white py-1.5 px-3 text-xs font-semibold tracking-wide">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5 truncate">
            <span className="bg-black/30 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold tracking-wider uppercase text-cyan-200">
              JAPAN IMPORT
            </span>
            <span className="truncate">
              ✨ 100% Original Japanese Authentic & Garansi Anti-Bootleg
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[11px] text-white/90">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" /> Jaminan Uang Kembali
            </span>
            <span className="text-white/40">•</span>
            <span>Free Extra Bubble Wrap & Box Tebal</span>
          </div>
        </div>
      </div>

      {/* Main Top Bar */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Brand Logo */}
          <button
            onClick={onResetSearch}
            className="flex items-center gap-2 group text-left transition-transform active:scale-95 focus:outline-none"
            aria-label="Kembali ke Beranda AMA AMA FIGURE ACTION"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#FF2A6D] via-[#9400D3] to-[#05D9E8] p-[2px] shadow-md shadow-pink-500/20">
              <div className="w-full h-full bg-[#1A1A24] rounded-[10px] flex items-center justify-center font-black text-transparent bg-clip-text bg-gradient-to-r from-[#05D9E8] to-[#FF2A6D] text-lg sm:text-xl font-['Poppins']">
                天
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white font-['Poppins']">
                  AMA AMA
                </span>
                <span className="text-[10px] sm:text-xs font-black px-1.5 py-0.2 rounded bg-cyan-500/20 text-[#05D9E8] border border-cyan-500/30">
                  FIGURE
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase -mt-0.5">
                Action & Otaku Hobby
              </p>
            </div>
          </button>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-2 relative">
            <div className={`relative w-full transition-all duration-200 rounded-full ${
              isSearchFocused ? 'ring-2 ring-[#05D9E8] bg-[#1F1F2E]' : 'bg-[#222231] hover:bg-[#28283a]'
            }`}>
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder="Cari action figure, Gunpla, Nendoroid, atau series anime..."
                className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-400 bg-transparent rounded-full focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  title="Hapus pencarian"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick search tags dropdown if focused */}
            {isSearchFocused && !searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#20202F] border border-slate-700/80 rounded-xl p-3 shadow-2xl z-50 animate-fadeIn">
                <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#05D9E8]" /> Populer di Akihabara:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {quickKeywords.map((tag) => (
                    <button
                      key={tag}
                      onMouseDown={() => onSearchChange(tag)}
                      className="text-xs px-2.5 py-1 rounded-full bg-slate-800 hover:bg-[#FF2A6D]/20 hover:text-[#FF2A6D] text-slate-300 border border-slate-700/60 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons: Wishlist & Shopping Cart */}
          <div className="flex items-center gap-2">
            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 sm:p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all active:scale-95"
              aria-label="Buka daftar wishlist"
              title="Wishlist Koleksi"
            >
              <Heart className="w-5 h-5 text-slate-300 group-hover:text-pink-400" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-[#FF2A6D] text-white text-[10px] font-black rounded-full px-1 shadow-sm shadow-pink-500/50 animate-bounce">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 py-2 px-3 sm:px-3.5 rounded-xl bg-gradient-to-r from-[#05D9E8] to-[#00b4d8] hover:from-[#38e1ed] hover:to-[#05D9E8] text-[#12121A] font-bold text-xs sm:text-sm shadow-md shadow-cyan-500/20 transition-all active:scale-95"
              aria-label="Buka keranjang belanja"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-[#12121A]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] flex items-center justify-center bg-[#FF2A6D] text-white text-[10px] font-black rounded-full px-1 shadow-sm">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-extrabold tracking-tight">Keranjang</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-2.5 md:hidden">
          <div className="relative w-full rounded-xl bg-[#212130] border border-slate-700/60 focus-within:border-[#05D9E8] transition-colors">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari figure, Gunpla, Nendoroid, seri anime..."
              className="w-full pl-9 pr-9 py-2 text-xs text-slate-100 placeholder-slate-400 bg-transparent rounded-xl focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                title="Hapus pencarian"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
