import React from 'react';
import { ShoppingBag, Heart, Star, Check, ShieldCheck, Sparkles, Clock } from 'lucide-react';
import { Product } from '../types';
import { formatRupiah, formatCompactNumber } from '../utils/format';
import { ProductArtwork } from './ProductArtwork';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, event?: React.MouseEvent) => void;
  onClick: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onClick
}) => {
  const isPreOrder = product.status === 'preorder';
  const hasPromo = product.status === 'promo' && product.originalPrice;

  return (
    <div
      onClick={() => onClick(product)}
      className="group relative flex flex-col justify-between bg-white rounded-2xl border border-slate-200 hover:border-slate-200 shadow-md hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-300 overflow-hidden cursor-pointer active:scale-[0.99]"
    >
      {/* Top Image Container */}
      <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
        <ProductArtwork product={product} />

        {/* Promo / Pre-Order / Rare Status Tag Overlay */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {isPreOrder && (
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-500 text-white shadow-md shadow-blue-500/20">
              <Clock className="w-2.5 h-2.5" />
              Pre-Order
            </span>
          )}

          {hasPromo && (
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-orange-500 text-white shadow-md shadow-orange-500/20">
              <Sparkles className="w-2.5 h-2.5" />
              Promo Spesial
            </span>
          )}

          {product.isRare && !hasPromo && !isPreOrder && (
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 shadow-md">
              Rare Item
            </span>
          )}

          {product.status === 'ready' && !product.isRare && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/90 text-slate-900 shadow-sm">
              Ready Stock
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-2 right-2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-90 ${isWishlisted
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'bg-white/80 text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          aria-label={isWishlisted ? 'Hapus dari wishlist' : 'Tambah ke wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Authenticity / Condition Tag */}
        <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1">
          <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-white/90 text-blue-700 border border-blue-200 backdrop-blur-sm">
            <ShieldCheck className="w-3 h-3 text-blue-600" />
            {product.condition}
          </span>
          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-white/90 text-slate-600 backdrop-blur-sm truncate max-w-[90px] sm:max-w-[120px]">
            {product.manufacturer.split('/')[0]}
          </span>
        </div>
      </div>

      {/* Product Information Body */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between gap-2">
        <div>
          {/* Series origin */}
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5 truncate">
            {product.series}
          </div>

          {/* Product Title */}
          <h3 className="text-xs sm:text-sm font-black text-slate-800 font-['Poppins'] line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
            {product.title}
          </h3>

          {/* Rating and Sold */}
          <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500">
            <div className="flex items-center text-amber-400 font-bold">
              <Star className="w-3 h-3 fill-current text-amber-400 mr-0.5" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-slate-600">•</span>
            <span>{formatCompactNumber(product.soldCount)} Terjual</span>
          </div>
        </div>

        {/* Price & DP Block */}
        <div className="pt-2 border-t border-slate-200">
          <div className="flex flex-col">
            {/* Original strike-through price if on sale */}
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <span className="line-through">{formatRupiah(product.originalPrice)}</span>
                <span className="text-orange-600 font-bold">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              </div>
            )}

            {/* Main Price */}
            <div className="flex items-baseline gap-1">
              <span className="text-sm sm:text-base font-black text-orange-600 font-['Poppins'] tracking-tight">
                {formatRupiah(product.price)}
              </span>
            </div>

            {/* Down Payment (DP) for Pre-Order */}
            {isPreOrder && product.downPayment && (
              <div className="text-[10px] sm:text-[11px] font-extrabold text-blue-600 flex items-center gap-1 mt-0.5">
                <span className="bg-blue-100 border border-blue-200 px-1 rounded text-[9px]">DP</span>
                <span>{formatRupiah(product.downPayment)}</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product, e);
            }}
            className={`w-full mt-2.5 py-2 px-3 rounded-xl text-xs font-black transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 ${isPreOrder
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:brightness-110 shadow-sm shadow-blue-500/10'
                : 'bg-slate-100 hover:bg-orange-500 text-slate-800 hover:text-white border border-slate-200 hover:border-transparent'
              }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isPreOrder ? 'Ikut PO Sekarang' : '+ Keranjang'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
