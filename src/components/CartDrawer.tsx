import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Ticket, ShoppingBag, ShieldCheck, ArrowRight, CheckCircle2, QrCode, MessageCircle } from 'lucide-react';
import { CartItem, Voucher } from '../types';
import { formatRupiah } from '../utils/format';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  claimedVouchers: Voucher[];
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  claimedVouchers
}) => {
  const [selectedVoucherId, setSelectedVoucherId] = useState<string>('');
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [orderCompleted, setOrderCompleted] = useState<boolean>(false);

  if (!isOpen) return null;

  // Calculate Subtotal based on Full vs DP choice
  const subtotal = cartItems.reduce((sum, item) => {
    const itemPrice = (item.product.status === 'preorder' && item.isPreOrderPaymentType === 'dp' && item.product.downPayment)
      ? item.product.downPayment
      : item.product.price;
    return sum + (itemPrice * item.quantity);
  }, 0);

  // Voucher Calculation
  const activeVoucher = claimedVouchers.find(v => v.id === selectedVoucherId);
  let discount = 0;
  if (activeVoucher && subtotal >= activeVoucher.minPurchase) {
    if (activeVoucher.discountType === 'fixed') {
      discount = activeVoucher.discountAmount;
    } else {
      const calculated = (subtotal * activeVoucher.discountAmount) / 100;
      discount = activeVoucher.maxDiscount ? Math.min(calculated, activeVoucher.maxDiscount) : calculated;
    }
  }

  const shippingFee = subtotal > 300000 ? 0 : 25000;
  const grandTotal = Math.max(0, subtotal - discount + shippingFee);

  const handleCompleteOrder = () => {
    setOrderCompleted(true);
  };

  const handleFinish = () => {
    onClearCart();
    setOrderCompleted(false);
    setIsCheckingOut(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[#161622] h-full flex flex-col z-10 border-l border-slate-700/80 shadow-2xl">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#1A1A26]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#05D9E8]" />
            <h2 className="text-base font-black text-white font-['Poppins']">
              Keranjang Belanja ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            aria-label="Tutup keranjang"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Completed Screen */}
        {orderCompleted ? (
          <div className="p-6 flex flex-col items-center justify-center flex-1 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/30 animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-black text-white font-['Poppins'] mb-1">
              Pesanan Figure Berhasil Disiapkan!
            </h3>
            <p className="text-xs text-slate-300 mb-6 max-w-xs">
              Terima kasih telah berbelanja di AMA AMA FIGURE ACTION. Tagihan & konfirmasi pengiriman telah dibuat.
            </p>

            <div className="w-full bg-[#1F1F2F] rounded-2xl p-4 border border-slate-700 text-left text-xs space-y-2 mb-6">
              <div className="flex justify-between text-slate-400">
                <span>No. Pesanan:</span>
                <span className="text-white font-mono font-bold">AMA-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Tagihan:</span>
                <span className="text-[#FF2A6D] font-bold">{formatRupiah(grandTotal)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Metode:</span>
                <span className="text-cyan-300 font-bold">QRIS Instant & Garansi Anti-Bootleg</span>
              </div>
            </div>

            <a
              href="https://wa.me/6281234567890?text=Halo%20Admin%20AMA%20AMA%20FIGURE%20ACTION,%20saya%20sudah%20checkout%20pesanan%20koleksi!"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 mb-3"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Konfirmasi via WhatsApp Admin</span>
            </a>

            <button
              onClick={handleFinish}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold text-xs"
            >
              Kembali ke Beranda
            </button>
          </div>
        ) : isCheckingOut ? (
          /* Checkout Payment Simulator */
          <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCheckingOut(false)}
                className="text-xs text-[#05D9E8] font-bold hover:underline"
              >
                &larr; Ubah Keranjang
              </button>
            </div>

            <h3 className="text-lg font-black text-white font-['Poppins']">
              Pembayaran & Pengiriman
            </h3>

            {/* Packaging Guarantee Banner */}
            <div className="p-3 rounded-xl bg-[#1D1D2B] border border-cyan-500/30 flex items-center gap-3 text-xs">
              <ShieldCheck className="w-7 h-7 text-[#05D9E8] flex-shrink-0" />
              <div>
                <strong className="text-white block">Garansi Kardus Tebal & Bubble Wrap</strong>
                <span className="text-slate-400 text-[11px]">Figure dijamin tiba mulus tanpa penyok (MISB safe).</span>
              </div>
            </div>

            {/* QRIS Simulator Box */}
            <div className="p-4 rounded-2xl bg-[#1F1F30] border border-slate-700 text-center">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wide mb-2 flex items-center justify-center gap-1.5">
                <QrCode className="w-4 h-4 text-[#05D9E8]" />
                Scan QRIS Semua E-Wallet & Bank
              </div>
              <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl flex items-center justify-center shadow-lg mb-2">
                {/* Simulated QR Code */}
                <div className="w-full h-full bg-slate-900 rounded-lg p-1.5 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div className="w-7 h-7 bg-white rounded-sm border-2 border-slate-900" />
                    <div className="w-7 h-7 bg-white rounded-sm border-2 border-slate-900" />
                  </div>
                  <div className="text-[9px] font-black text-cyan-400 font-mono text-center">
                    AMA AMA QRIS
                  </div>
                  <div className="flex justify-between">
                    <div className="w-7 h-7 bg-white rounded-sm border-2 border-slate-900" />
                    <div className="w-7 h-7 bg-cyan-400 rounded-sm" />
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                Mendukung: BCA, Mandiri, BRI, BNI, GoPay, OVO, ShopeePay, Dana
              </p>
            </div>

            {/* Summary */}
            <div className="p-3.5 rounded-xl bg-[#1C1C2A] border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Total Item:</span>
                <span>{formatRupiah(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#FF2A6D] font-semibold">
                  <span>Diskon Voucher:</span>
                  <span>-{formatRupiah(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Ongkir (Garansi Box):</span>
                <span>{shippingFee === 0 ? <strong className="text-emerald-400">GRATIS</strong> : formatRupiah(shippingFee)}</span>
              </div>
              <div className="pt-2 border-t border-slate-700/80 flex justify-between text-sm font-black text-white">
                <span>Total Bayar:</span>
                <span className="text-[#FF2A6D] text-base">{formatRupiah(grandTotal)}</span>
              </div>
            </div>

            <button
              onClick={handleCompleteOrder}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#05D9E8] to-[#00b4d8] text-[#12121A] font-black text-sm shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
            >
              Konfirmasi & Selesaikan Pembayaran
            </button>
          </div>
        ) : (
          /* Regular Cart Items List */
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cartItems.length === 0 ? (
                <div className="py-16 text-center text-slate-400">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30 text-slate-500" />
                  <p className="text-sm font-bold text-slate-300">Keranjang masih kosong</p>
                  <p className="text-xs text-slate-500 mt-1">Pilih figure atau Gunpla favoritmu untuk mulai koleksi!</p>
                </div>
              ) : (
                cartItems.map((item) => {
                  const unitPrice = (item.product.status === 'preorder' && item.isPreOrderPaymentType === 'dp' && item.product.downPayment)
                    ? item.product.downPayment
                    : item.product.price;

                  return (
                    <div
                      key={item.product.id}
                      className="flex gap-3 p-3 rounded-xl bg-[#1C1C2A] border border-slate-800"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 object-cover rounded-lg bg-[#14141E] flex-shrink-0"
                      />

                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <span className="text-[9px] font-bold text-[#05D9E8] uppercase block">
                              {item.product.series}
                            </span>
                            <h4 className="text-xs font-bold text-white line-clamp-1">
                              {item.product.title}
                            </h4>
                          </div>
                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="text-slate-500 hover:text-[#FF2A6D] p-1"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Pre-Order DP notice */}
                        {item.product.status === 'preorder' && (
                          <span className="text-[10px] text-cyan-300 font-semibold">
                            {item.isPreOrderPaymentType === 'dp' ? '★ Bayar DP (Down Payment)' : '★ Full Payment'}
                          </span>
                        )}

                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs font-black text-[#FF2A6D]">
                            {formatRupiah(unitPrice * item.quantity)}
                          </span>

                          <div className="flex items-center border border-slate-700 rounded-lg bg-[#14141E] px-1">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 text-slate-400 hover:text-white"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold text-white px-2 font-mono">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 text-slate-400 hover:text-white"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Voucher Selector in Cart */}
              {cartItems.length > 0 && (
                <div className="pt-2">
                  <div className="text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5 text-[#FF2A6D]" />
                    <span>Gunakan Voucher Toko:</span>
                  </div>

                  {claimedVouchers.length === 0 ? (
                    <div className="p-2.5 rounded-xl bg-[#1C1C2A] text-[11px] text-slate-400 border border-slate-800 flex items-center justify-between">
                      <span>Belum ada voucher diklaim</span>
                      <span className="text-[#05D9E8] font-bold">Klaim di beranda</span>
                    </div>
                  ) : (
                    <select
                      value={selectedVoucherId}
                      onChange={(e) => setSelectedVoucherId(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl bg-[#1F1F30] text-slate-200 border border-slate-700 focus:outline-none focus:border-[#05D9E8]"
                    >
                      <option value="">-- Pilih Voucher Terklaim --</option>
                      {claimedVouchers.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.title} ({v.code})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}
            </div>

            {/* Cart Footer Calculation & CTA */}
            {cartItems.length > 0 && (
              <div className="p-4 bg-[#1A1A26] border-t border-slate-800 space-y-3">
                <div className="space-y-1.5 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="text-slate-200 font-bold">{formatRupiah(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-[#FF2A6D] font-bold">
                      <span>Potongan Voucher:</span>
                      <span>-{formatRupiah(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Ongkos Kirim:</span>
                    <span>{shippingFee === 0 ? <strong className="text-emerald-400">GRATIS</strong> : formatRupiah(shippingFee)}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-700/80 flex justify-between text-sm font-black text-white">
                    <span>Total Pembayaran:</span>
                    <span className="text-[#FF2A6D] text-base">{formatRupiah(grandTotal)}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsCheckingOut(true)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF2A6D] to-[#ff477e] hover:brightness-110 text-white font-black text-sm shadow-lg shadow-pink-600/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span>Checkout Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
