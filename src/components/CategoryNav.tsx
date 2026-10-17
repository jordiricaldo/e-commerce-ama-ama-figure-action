import React from 'react';
import { Sparkles, Layers, Box, Flame, Clock } from 'lucide-react';
import { ProductStatus, HobbyCategory } from '../types';

export type MainTab = 'all' | 'preorder' | 'ready' | 'promo' | 'categories_view';

interface CategoryNavProps {
  activeMainTab: MainTab;
  onSelectMainTab: (tab: MainTab) => void;
  activeHobbyCategory: HobbyCategory | 'all';
  onSelectHobbyCategory: (cat: HobbyCategory | 'all') => void;
  productCount: number;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  activeMainTab,
  onSelectMainTab,
  activeHobbyCategory,
  onSelectHobbyCategory,
  productCount
}) => {
  const mainTabs: { id: MainTab; label: string; icon: React.ReactNode; countLabel?: string }[] = [
    { id: 'all', label: 'Semua Produk', icon: <Box className="w-3.5 h-3.5" /> },
    { id: 'preorder', label: 'Pre-Order', icon: <Clock className="w-3.5 h-3.5" />, countLabel: 'DP Aman' },
    { id: 'ready', label: 'Ready Stock', icon: <Sparkles className="w-3.5 h-3.5" />, countLabel: 'Siap Kirim' },
    { id: 'promo', label: 'Promo', icon: <Flame className="w-3.5 h-3.5" />, countLabel: 'Diskon' },
    { id: 'categories_view', label: 'Kategori', icon: <Layers className="w-3.5 h-3.5" /> },
  ];

  const hobbyPills: { id: HobbyCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'Semua Tipe' },
    { id: 'scale', label: 'Scale Figure' },
    { id: 'nendoroid', label: 'Nendoroid/Figma' },
    { id: 'gunpla', label: 'Gunpla/Mecha' },
    { id: 'merch', label: 'Merch/Plushie' },
    { id: 'tcg', label: 'TCG/Cards' },
  ];

  return (
    <div className="sticky top-[108px] sm:top-[68px] z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-md">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        {/* Main Sticky Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 scrollbar-none border-b border-slate-200/50">
          {mainTabs.map((tab) => {
            const isActive = activeMainTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectMainTab(tab.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-extrabold tracking-tight transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-md shadow-pink-600/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.countLabel && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                    isActive ? 'bg-black/20 text-slate-900' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {tab.countLabel}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick category filter sub-bar: Dropdown/Pills */}
        {activeMainTab !== 'categories_view' && (
          <div className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex-shrink-0 hidden sm:inline">
              Filter:
            </span>
            {hobbyPills.map((pill) => {
              const isSelected = activeHobbyCategory === pill.id;
              return (
                <button
                  key={pill.id}
                  onClick={() => onSelectHobbyCategory(pill.id)}
                  className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-blue-500 text-white shadow-sm shadow-blue-500/20 font-black'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
