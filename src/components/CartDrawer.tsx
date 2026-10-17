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
  isAuthenticated: boolean;
  onRequireLogin: () => void;
  onOrderCreated: () => Promise<void>;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  claimedVouchers,
  isAuthenticated,
  onRequireLogin,
  onOrderCreated
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

  const handleCompleteOrder = async () => {
    setIsCheckingOut(true);
    try {
      const { createOrder } = await import('../services/api');
      await createOrder({
        items: cartItems.map(item => ({
          productId: item.product.id,
          productTitle: item.product.title,
          productImage: item.product.image,
          quantity: item.quantity,
          unitPrice: (item.product.status === 'preorder' && item.isPreOrderPaymentType === 'dp' && item.product.downPayment) ? item.product.downPayment : item.product.price,
          paymentType: item.isPreOrderPaymentType || 'full',
        })),
        subtotal,
        discount,
        shippingFee,
        grandTotal
      });
      await onOrderCreated();
      setOrderCompleted(true);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Gagal membuat pesanan. Silakan coba lagi atau pastikan anda sudah login.');
    }
  };

  const handleFinish = () => {
    onClearCart();
    setOrderCompleted(false);
    setIsCheckingOut(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-white/95 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full flex flex-col z-10 border-l border-slate-200 shadow-2xl">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-black text-slate-900 font-['Poppins']">
              Keranjang Belanja ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900"
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
            <h3 className="text-xl font-black text-slate-900 font-['Poppins'] mb-1">
              Pesanan Figure Berhasil Disiapkan!
            </h3>
            <p className="text-xs text-slate-600 mb-6 max-w-xs">
              Terima kasih telah berbelanja di AMA AMA FIGURE ACTION. Tagihan & konfirmasi pengiriman telah dibuat.
            </p>

            <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left text-xs space-y-2 mb-6">
              <div className="flex justify-between text-slate-500">
                <span>No. Pesanan:</span>
                <span className="text-slate-900 font-mono font-bold">AMA-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Total Tagihan:</span>
                <span className="text-orange-600 font-bold">{formatRupiah(grandTotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Metode:</span>
                <span className="text-blue-700 font-bold">QRIS Instant & Garansi Anti-Bootleg</span>
              </div>
            </div>

            <a
              href="https://wa.me/6281234567890?text=Halo%20Admin%20AMA%20AMA%20FIGURE%20ACTION,%20saya%20sudah%20checkout%20pesanan%20koleksi!"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-900 font-bold text-xs flex items-center justify-center gap-2 mb-3"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Konfirmasi via WhatsApp Admin</span>
            </a>

            <button
              onClick={handleFinish}
              className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 font-bold text-xs"
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
                className="text-xs text-blue-600 font-bold hover:underline"
              >
                &larr; Ubah Keranjang
              </button>
            </div>

            <h3 className="text-lg font-black text-slate-900 font-['Poppins']">
              Pembayaran & Pengiriman
            </h3>

            {/* Packaging Guarantee Banner */}
            <div className="p-3 rounded-xl bg-slate-50 border border-blue-200 flex items-center gap-3 text-xs">
              <ShieldCheck className="w-7 h-7 text-blue-600 flex-shrink-0" />
              <div>
                <strong className="text-slate-900 block">Garansi Kardus Tebal & Bubble Wrap</strong>
                <span className="text-slate-500 text-[11px]">Figure dijamin tiba mulus tanpa penyok (MISB safe).</span>
              </div>
            </div>

            {/* QRIS Simulator Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2 flex items-center justify-center gap-1.5">
                <QrCode className="w-4 h-4 text-blue-600" />
                Scan QRIS Semua E-Wallet & Bank
              </div>
              <div className="w-40 h-40 mx-auto bg-white p-2 rounded-xl flex items-center justify-center shadow-lg mb-2">
                <img src="/qris-gopay.png" alt="QRIS Code" className="w-full h-full object-contain" onError={e => { (e.target as HTMLImageElement).src = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=AMA-AMA-PAYMENT'; }} />
              </div>
              <p className="text-[11px] text-slate-500">
                Mendukung: BCA, Mandiri, BRI, BNI, GoPay, OVO, ShopeePay, Dana
              </p>
            </div>

            {/* Summary */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Total Item:</span>
                <span>{formatRupiah(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-orange-600 font-semibold">
                  <span>Diskon Voucher:</span>
                  <span>-{formatRupiah(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>Ongkir (Garansi Box):</span>
                <span>{shippingFee === 0 ? <strong className="text-emerald-400">GRATIS</strong> : formatRupiah(shippingFee)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                <span>Total Bayar:</span>
                <span className="text-orange-600 text-base">{formatRupiah(grandTotal)}</span>
              </div>
            </div>

            <button
              onClick={handleCompleteOrder}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-black text-sm shadow-lg shadow-blue-500/10 active:scale-95 transition-all"
            >
              Konfirmasi & Selesaikan Pembayaran
            </button>
          </div>
        ) : (
          /* Regular Cart Items List */
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cartItems.length === 0 ? (
                <div className="py-16 text-center text-slate-500">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30 text-slate-500" />
                  <p className="text-sm font-bold text-slate-600">Keranjang masih kosong</p>
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
                      className="flex gap-3 p-3 rounded-xl bg-white border border-slate-200"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 object-cover rounded-lg bg-slate-100 flex-shrink-0"
                      />

                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <span className="text-[9px] font-bold text-blue-600 uppercase block">
                              {item.product.series}
                            </span>
                            <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                              {item.product.title}
                            </h4>
                          </div>
                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="text-slate-500 hover:text-orange-600 p-1"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Pre-Order DP notice */}
                        {item.product.status === 'preorder' && (
                          <span className="text-[10px] text-blue-700 font-semibold">
                            {item.isPreOrderPaymentType === 'dp' ? '★ Bayar DP (Down Payment)' : '★ Full Payment'}
                          </span>
                        )}

                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs font-black text-orange-600">
                            {formatRupiah(unitPrice * item.quantity)}
                          </span>

                          <div className="flex items-center border border-slate-200 rounded-lg bg-slate-100 px-1">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 text-slate-500 hover:text-slate-900"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold text-slate-900 px-2 font-mono">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 text-slate-500 hover:text-slate-900"
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
                  <div className="text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5 text-orange-600" />
                    <span>Gunakan Voucher Toko:</span>
                  </div>

                  {claimedVouchers.length === 0 ? (
                    <div className="p-2.5 rounded-xl bg-white text-[11px] text-slate-500 border border-slate-200 flex items-center justify-between">
                      <span>Belum ada voucher diklaim</span>
                      <span className="text-blue-600 font-bold">Klaim di beranda</span>
                    </div>
                  ) : (
                    <select
                      value={selectedVoucherId}
                      onChange={(e) => setSelectedVoucherId(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 focus:outline-none focus:border-[#05D9E8]"
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
              <div className="p-4 bg-white border-t border-slate-200 space-y-3">
                <div className="space-y-1.5 text-xs text-slate-500">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="text-slate-700 font-bold">{formatRupiah(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-orange-600 font-bold">
                      <span>Potongan Voucher:</span>
                      <span>-{formatRupiah(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Ongkos Kirim:</span>
                    <span>{shippingFee === 0 ? <strong className="text-emerald-400">GRATIS</strong> : formatRupiah(shippingFee)}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                    <span>Total Pembayaran:</span>
                    <span className="text-orange-600 text-base">{formatRupiah(grandTotal)}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      onRequireLogin();
                      return;
                    }
                    setIsCheckingOut(true);
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 hover:brightness-110 text-slate-900 font-black text-sm shadow-lg shadow-pink-600/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span>{isAuthenticated ? 'Checkout Sekarang' : 'Login atau Daftar untuk Checkout'}</span>
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
