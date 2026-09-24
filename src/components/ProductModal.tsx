import React, { useState } from 'react';
import { X, ShieldCheck, Heart, ShoppingBag, Star, Clock, Sparkles, Check, Truck, Box, HelpCircle } from 'lucide-react';
import { Product } from '../types';
import { formatRupiah } from '../utils/format';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number, paymentType?: 'full' | 'dp') => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onAddToCart
}) => {
  const [quantity, setQuantity] = useState(1);
  const [paymentType, setPaymentType] = useState<'full' | 'dp'>('full');
  const [isAdded, setIsAdded] = useState(false);

  if (!isOpen || !product) return null;

  const isPreOrder = product.status === 'preorder';

  const handleAddToCart = () => {
    onAddToCart(product, quantity, isPreOrder ? paymentType : 'full');
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-3xl max-h-[92vh] sm:max-h-[88vh] bg-[#161622] rounded-t-3xl sm:rounded-3xl border border-slate-700/80 shadow-2xl overflow-y-auto z-10 flex flex-col">
        {/* Sticky Header with Close Button */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#161622]/95 backdrop-blur-md border-b border-slate-800">
          <div className="flex items-center gap-2 truncate">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-[#05D9E8] border border-cyan-500/30">
              {product.categoryName}
            </span>
            <span className="text-xs text-slate-400 truncate">
              {product.series}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleWishlist(product)}
              className={`p-2 rounded-full border transition-colors ${
                isWishlisted
                  ? 'bg-pink-500/20 text-[#FF2A6D] border-pink-500/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
              title="Wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Product Photo & Trust Badges */}
          <div className="md:col-span-6 flex flex-col gap-3">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#12121A] border border-slate-700/80 shadow-inner">
              <img
                src={product.image}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                <span className="text-[11px] font-black uppercase px-2.5 py-1 rounded-full bg-cyan-950/90 text-cyan-300 border border-cyan-400/40 shadow-lg backdrop-blur-md">
                  {product.condition}
                </span>
                {isPreOrder && (
                  <span className="text-[11px] font-black uppercase px-2.5 py-1 rounded-full bg-[#05D9E8] text-slate-950 shadow-md">
                    Pre-Order Slot
                  </span>
                )}
              </div>
            </div>

            {/* Quality & Packing Guarantees */}
            <div className="bg-[#1C1C2B] rounded-xl p-3 border border-slate-700/60 text-xs space-y-2">
              <div className="flex items-center gap-2 text-cyan-300 font-bold">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                <span>100% Produk Original Berlisensi Resmi Jepang</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Box className="w-4 h-4 flex-shrink-0 text-amber-400" />
                <span>Packing Ekstra Aman (Bubble Wrap 5 Lapis + Kardus Box Tebal)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Truck className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                <span>Pengiriman ke Seluruh Indonesia via JNE, SiCepat, J&T & Instant</span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Specs, Options, Pricing */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-4">
            <div>
              {/* Manufacturer */}
              <div className="text-xs font-bold text-[#05D9E8] uppercase tracking-wider mb-1">
                {product.manufacturer}
              </div>

              {/* Title */}
              <h2 className="text-lg sm:text-xl font-black text-white font-['Poppins'] leading-snug">
                {product.title}
              </h2>

              {/* Japanese title */}
              {product.japaneseTitle && (
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  {product.japaneseTitle}
                </p>
              )}

              {/* Rating & Sold */}
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-300">
                <div className="flex items-center text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  <Star className="w-3.5 h-3.5 fill-current mr-1" />
                  <span>{product.rating.toFixed(1)}</span>
                </div>
                <span className="text-slate-400">Terjual {product.soldCount} item</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 font-semibold">Stok: {product.stock} pcs</span>
              </div>

              {/* Price Display */}
              <div className="mt-4 p-3.5 rounded-xl bg-[#1D1D2C] border border-slate-700/80">
                <div className="text-[11px] text-slate-400 font-medium">Harga Total:</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-[#FF2A6D] font-['Poppins']">
                    {formatRupiah(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-slate-400 line-through">
                      {formatRupiah(product.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Pre-Order Payment Option (DP vs Full) */}
                {isPreOrder && product.downPayment && (
                  <div className="mt-3 pt-3 border-t border-slate-700/70">
                    <div className="text-xs font-bold text-cyan-300 mb-2 flex items-center justify-between">
                      <span>Pilihan Pembayaran Pre-Order:</span>
                      <span className="text-[10px] text-slate-400 font-normal">Slot Terjamin 100%</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentType('dp')}
                        className={`p-2.5 rounded-xl text-left border transition-all ${
                          paymentType === 'dp'
                            ? 'bg-cyan-500/20 border-[#05D9E8] text-white shadow-sm shadow-cyan-500/20'
                            : 'bg-[#222232] border-slate-700 text-slate-300 hover:bg-[#28283a]'
                        }`}
                      >
                        <div className="text-[10px] uppercase font-bold text-[#05D9E8]">Bayar DP Saja</div>
                        <div className="text-sm font-black">{formatRupiah(product.downPayment)}</div>
                        <div className="text-[9px] text-slate-400 mt-0.5">Pelunasan saat rilis tiba</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentType('full')}
                        className={`p-2.5 rounded-xl text-left border transition-all ${
                          paymentType === 'full'
                            ? 'bg-pink-500/20 border-[#FF2A6D] text-white shadow-sm shadow-pink-500/20'
                            : 'bg-[#222232] border-slate-700 text-slate-300 hover:bg-[#28283a]'
                        }`}
                      >
                        <div className="text-[10px] uppercase font-bold text-[#FF2A6D]">Bayar Lunas (Full)</div>
                        <div className="text-sm font-black">{formatRupiah(product.price)}</div>
                        <div className="text-[9px] text-slate-400 mt-0.5">Prioritas kirim instan</div>
                      </button>
                    </div>

                    {product.poDeadline && (
                      <div className="mt-2 text-[11px] text-amber-300 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>Deadline PO: {product.poDeadline}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Technical Specifications Table */}
              <div className="mt-4">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Spesifikasi Koleksi:
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {product.scale && (
                    <div className="p-2 rounded-lg bg-[#1C1C2A] border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Skala / Tipe:</span>
                      <strong className="text-slate-200">{product.scale}</strong>
                    </div>
                  )}
                  {product.height && (
                    <div className="p-2 rounded-lg bg-[#1C1C2A] border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Tinggi / Ukuran:</span>
                      <strong className="text-slate-200">{product.height}</strong>
                    </div>
                  )}
                  {product.material && (
                    <div className="p-2 rounded-lg bg-[#1C1C2A] border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Material:</span>
                      <strong className="text-slate-200">{product.material}</strong>
                    </div>
                  )}
                  {product.releaseDate && (
                    <div className="p-2 rounded-lg bg-[#1C1C2A] border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Rilis Jepang:</span>
                      <strong className="text-slate-200">{product.releaseDate}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mt-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Deskripsi Produk:
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center gap-3">
              {/* Quantity selector */}
              <div className="flex items-center border border-slate-700 rounded-xl bg-[#1C1C2A] p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white font-bold"
                  aria-label="Kurangi jumlah"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-mono font-bold text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white font-bold"
                  aria-label="Tambah jumlah"
                >
                  +
                </button>
              </div>

              {/* Add to Cart / Pre-Order CTA */}
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 py-3 px-4 rounded-xl font-black text-xs sm:text-sm transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 ${
                  isAdded
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : isPreOrder
                    ? 'bg-gradient-to-r from-[#05D9E8] to-[#00b4d8] text-[#12121A] hover:brightness-110 shadow-lg shadow-cyan-500/20'
                    : 'bg-gradient-to-r from-[#FF2A6D] to-[#ff477e] text-white hover:brightness-110 shadow-lg shadow-pink-500/30'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Berhasil Masuk Keranjang!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      {isPreOrder
                        ? `Ikut Pre-Order (${paymentType === 'dp' ? 'Bayar DP' : 'Full Payment'})`
                        : '+ Masukkan Keranjang'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
