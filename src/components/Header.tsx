import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingBag, Heart, ShieldCheck, Sparkles, X, User as UserIcon, LogOut, PackageCheck } from 'lucide-react';
import { AuthSession } from '../services/api';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  searchQuery: string;
  user: AuthSession['user'] | null;
  onSearchChange: (query: string) => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenLogin?: () => void;
  onOpenOrders?: () => void;
  onLogout?: () => void;
  onResetSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  searchQuery,
  user,
  onSearchChange,
  onOpenCart,
  onOpenWishlist,
  onOpenLogin,
  onOpenOrders,
  onLogout,
  onResetSearch
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const quickKeywords = ['Anya', 'Gundam Aerial', 'Hatsune Miku', 'Gojo Satoru', 'Pokemon 151', 'Figma'];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-lg shadow-slate-200/50">
      {/* Announcement Bar above header */}
      <div className="w-full bg-gradient-to-r from-orange-500 via-rose-500 to-blue-500 text-white py-1.5 px-3 text-xs font-semibold tracking-wide">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5 truncate">
            <span className="bg-white/40 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold tracking-wider uppercase text-cyan-200">
              JAPAN IMPORT
            </span>
            <span className="truncate">
              ✨ 100% Original Japanese Authentic & Garansi Anti-Bootleg
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-900/90">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-700" /> Jaminan Uang Kembali
            </span>
            <span className="text-slate-900/40">•</span>
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
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#FF2A6D] via-[#9400D3] to-[#05D9E8] p-[2px] shadow-md shadow-orange-500/10">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center font-black text-transparent bg-clip-text bg-gradient-to-r from-[#05D9E8] to-[#FF2A6D] text-lg sm:text-xl font-['Poppins']">
                天
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 font-['Poppins']">
                  AMA AMA
                </span>
                <span className="text-[10px] sm:text-xs font-black px-1.5 py-0.2 rounded bg-blue-100 text-blue-600 border border-blue-200">
                  FIGURE
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-500 tracking-wider uppercase -mt-0.5">
                Action & Otaku Hobby
              </p>
            </div>
          </button>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-2 relative">
            <div className={`relative w-full transition-all duration-200 rounded-full ${
              isSearchFocused ? 'ring-2 ring-blue-500 bg-white' : 'bg-slate-100 hover:bg-slate-200'
            }`}>
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder="Cari action figure, Gunpla, Nendoroid, atau series anime..."
                className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent rounded-full focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900"
                  title="Hapus pencarian"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick search tags dropdown if focused */}
            {isSearchFocused && !searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl p-3 shadow-2xl z-50 animate-fadeIn">
                <div className="text-[11px] font-semibold text-slate-500 mb-2 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Populer di Akihabara:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {quickKeywords.map((tag) => (
                    <button
                      key={tag}
                      onMouseDown={() => onSearchChange(tag)}
                      className="text-xs px-2.5 py-1 rounded-full bg-slate-100 hover:bg-orange-500/20 hover:text-orange-600 text-slate-600 border border-slate-200 transition-colors"
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
            
            {/* User Menu / Login */}
            {user ? (
              <div className="relative hidden sm:block" ref={userMenuRef}>
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-blue-600" />
                  <span className="truncate max-w-[100px]">{user.name}</span>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                    </div>
                    {user.role === 'user' && (
                      <button 
                        onClick={() => { setIsUserMenuOpen(false); onOpenOrders?.(); }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <PackageCheck className="w-4 h-4 text-blue-500" /> Tracking Pesanan
                      </button>
                    )}
                    <button 
                      onClick={() => { setIsUserMenuOpen(false); onLogout?.(); }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              onOpenLogin && (
                <button onClick={onOpenLogin} className="hidden sm:flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200" title="Login user">
                  Login User
                </button>
              )
            )}

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 sm:p-2.5 rounded-xl bg-slate-100/80 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all active:scale-95"
              aria-label="Buka daftar wishlist"
              title="Wishlist Koleksi"
            >
              <Heart className="w-5 h-5 text-slate-600 group-hover:text-pink-400" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-orange-500 text-white text-[10px] font-black rounded-full px-1 shadow-sm shadow-orange-500/30 animate-bounce">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 py-2 px-3 sm:px-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-[#38e1ed] hover:to-[#05D9E8] text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/10 transition-all active:scale-95"
              aria-label="Buka keranjang belanja"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-white" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] flex items-center justify-center bg-orange-500 text-white text-[10px] font-black rounded-full px-1 shadow-sm">
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
          <div className="relative w-full rounded-xl bg-slate-100 border border-slate-200 focus-within:border-blue-500 transition-colors">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari figure, Gunpla, Nendoroid, seri anime..."
              className="w-full pl-9 pr-9 py-2 text-xs text-slate-800 placeholder-slate-400 bg-transparent rounded-xl focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900"
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
