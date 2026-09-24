import React from 'react';
import { X, Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { formatRupiah } from '../utils/format';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistItems: Product[];
  onRemoveWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistItems,
  onRemoveWishlist,
  onAddToCart,
  onSelectProduct
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[#161622] h-full flex flex-col z-10 border-l border-slate-700/80 shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#1A1A26]">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#FF2A6D] fill-current" />
            <h2 className="text-base font-black text-white font-['Poppins']">
              Wishlist Koleksi ({wishlistItems.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            aria-label="Tutup wishlist"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {wishlistItems.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Heart className="w-12 h-12 mx-auto mb-3 opacity-30 text-slate-500" />
              <p className="text-sm font-bold text-slate-300">Belum ada figure di wishlist</p>
              <p className="text-xs text-slate-500 mt-1">Ketuk ikon hati pada figure incaranmu untuk menyimpannya.</p>
            </div>
          ) : (
            wishlistItems.map((product) => (
              <div
                key={product.id}
                className="flex gap-3 p-3 rounded-xl bg-[#1C1C2A] border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="w-16 h-16 object-cover rounded-lg bg-[#14141E] cursor-pointer"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <span className="text-[9px] font-bold text-[#05D9E8] uppercase block">
                        {product.series}
                      </span>
                      <h4
                        onClick={() => {
                          onSelectProduct(product);
                          onClose();
                        }}
                        className="text-xs font-bold text-white line-clamp-1 cursor-pointer hover:text-[#05D9E8]"
                      >
                        {product.title}
                      </h4>
                    </div>
                    <button
                      onClick={() => onRemoveWishlist(product.id)}
                      className="text-slate-500 hover:text-[#FF2A6D] p-1"
                      title="Hapus dari wishlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-black text-[#FF2A6D]">
                      {formatRupiah(product.price)}
                    </span>

                    <button
                      onClick={() => {
                        onAddToCart(product);
                        onRemoveWishlist(product.id);
                      }}
                      className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-cyan-500/20 text-[#05D9E8] border border-cyan-500/40 hover:bg-cyan-500/30 flex items-center gap-1"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Pindah Keranjang</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
