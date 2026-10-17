import React, { useState, useEffect } from 'react';
import { X, PackageCheck, Truck, Clock, RefreshCw, ClipboardList, AlertCircle } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { getMyOrders } from '../services/api';
import { formatRupiah } from '../utils/format';

interface UserOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: any; bgColor: string; progress: number }> = {
  processing: { label: "Diproses", color: "text-amber-700", icon: Clock, bgColor: "bg-amber-100", progress: 33 },
  shipped: { label: "Dikirim", color: "text-blue-700", icon: Truck, bgColor: "bg-blue-100", progress: 66 },
  delivered: { label: "Sampai", color: "text-emerald-700", icon: PackageCheck, bgColor: "bg-emerald-100", progress: 100 },
};

export const UserOrdersModal: React.FC<UserOrdersModalProps> = ({ isOpen, onClose }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat pesanan. Pastikan Anda sudah login.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
      setSelectedOrder(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl flex flex-col max-h-[90vh] overflow-hidden relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-5 text-white flex-shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-200">Riwayat Belanja</p>
              <h2 className="mt-1 text-xl font-black flex items-center gap-2">
                <ClipboardList className="w-6 h-6" /> Tracking Pesanan
              </h2>
            </div>
            <button type="button" onClick={onClose} className="rounded-lg p-2 text-white/70 hover:bg-white/20 transition-colors" aria-label="Tutup riwayat">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 relative">
          {loading && orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-3">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-sm font-semibold text-slate-500">Memuat data pesanan...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-3 text-red-500">
              <AlertCircle className="w-10 h-10" />
              <p className="text-sm font-semibold text-center">{error}</p>
              <button onClick={fetchOrders} className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-bold hover:bg-red-200 transition-colors">
                Coba Lagi
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-3 text-slate-400">
              <PackageCheck className="w-16 h-16 opacity-50" />
              <h3 className="text-lg font-bold text-slate-600">Belum ada pesanan</h3>
              <p className="text-sm">Anda belum pernah melakukan pemesanan.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Order List */}
              {!selectedOrder ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800">Semua Pesanan Anda ({orders.length})</h3>
                    <button onClick={fetchOrders} disabled={loading} className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50">
                      <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
                    </button>
                  </div>

                  {orders.map(order => {
                    const cfg = STATUS_CONFIG[order.status];
                    const StatusIcon = cfg.icon;
                    return (
                      <div key={order.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedOrder(order)}>
                        <div className="flex justify-between items-start mb-3 border-b border-slate-100 pb-3">
                          <div>
                            <p className="text-xs text-slate-500 font-mono mb-1">{order.orderNumber}</p>
                            <p className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${cfg.bgColor} ${cfg.color}`}>
                            <StatusIcon className="w-4 h-4" />
                            <span className="text-xs font-bold">{cfg.label}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {order.items[0]?.productImage ? (
                              <img src={order.items[0].productImage} alt={order.items[0].productTitle} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/80/e2e8f0/64748b?text=?'; }} />
                            ) : (
                              <PackageCheck className="w-6 h-6 text-slate-300" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-slate-800 truncate">{order.items[0]?.productTitle}</p>
                            <p className="text-xs text-slate-500 mt-1">{order.items.length > 1 ? `+${order.items.length - 1} item lainnya` : `${order.items[0]?.quantity}x Item`}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xs text-slate-500 mb-0.5">Total Belanja</p>
                            <p className="font-black text-slate-900">{formatRupiah(order.grandTotal)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Single Order Detail View */
                <div className="space-y-5 animate-fadeIn">
                  <button onClick={() => setSelectedOrder(null)} className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1 mb-2">
                    &larr; Kembali ke daftar pesanan
                  </button>
                  
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                    <div className="flex justify-between items-start mb-5 border-b border-slate-100 pb-4">
                      <div>
                        <h3 className="font-black text-lg text-slate-800">Detail Pesanan</h3>
                        <p className="text-sm font-mono text-slate-500 mt-0.5">{selectedOrder.orderNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400 mb-1">Tanggal Transaksi</p>
                        <p className="text-sm font-semibold text-slate-700">{new Date(selectedOrder.createdAt).toLocaleString('id-ID')}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-8 px-2">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Status Pengiriman</h4>
                      <div className="relative pt-2">
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-slate-200">
                          <div style={{ width: `${STATUS_CONFIG[selectedOrder.status].progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"></div>
                        </div>
                        <div className="flex justify-between text-xs font-semibold text-slate-500 relative top-[-10px]">
                          <span className={selectedOrder.status === 'processing' || selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered' ? 'text-blue-600' : ''}>Diproses</span>
                          <span className={selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered' ? 'text-blue-600' : ''}>Dikirim</span>
                          <span className={selectedOrder.status === 'delivered' ? 'text-emerald-600' : ''}>Sampai</span>
                        </div>
                      </div>

                      {/* Info Resi/Catatan */}
                      {(selectedOrder.trackingNumber || selectedOrder.notes) && (
                        <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-100 space-y-2">
                          {selectedOrder.trackingNumber && (
                            <p className="text-sm"><span className="font-bold text-blue-800">📦 No. Resi:</span> <span className="font-mono bg-white px-2 py-1 rounded text-blue-900 font-bold border border-blue-200">{selectedOrder.trackingNumber}</span></p>
                          )}
                          {selectedOrder.notes && (
                            <p className="text-sm text-slate-700"><span className="font-bold text-blue-800">📝 Catatan:</span> {selectedOrder.notes}</p>
                          )}
                        </div>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Daftar Produk</h4>
                    <div className="space-y-3 mb-6">
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="flex gap-3 items-center p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                          <img src={item.productImage} alt={item.productTitle} className="w-14 h-14 rounded bg-white object-cover border border-slate-200" onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/80/e2e8f0/64748b?text=?'; }} />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-slate-800 truncate">{item.productTitle}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{item.quantity}x @ {formatRupiah(item.unitPrice)} {item.paymentType === 'dp' && <span className="text-blue-600 font-bold ml-1">(DP)</span>}</p>
                          </div>
                          <p className="font-bold text-sm text-slate-800">{formatRupiah(item.quantity * item.unitPrice)}</p>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-slate-200 pt-4 space-y-2 text-sm">
                      <div className="flex justify-between text-slate-600"><span>Subtotal Produk</span><span>{formatRupiah(selectedOrder.subtotal)}</span></div>
                      {selectedOrder.discount > 0 && <div className="flex justify-between text-orange-500"><span>Diskon Voucher</span><span>-{formatRupiah(selectedOrder.discount)}</span></div>}
                      <div className="flex justify-between text-slate-600"><span>Ongkos Kirim</span><span>{selectedOrder.shippingFee === 0 ? <span className="text-emerald-500 font-bold">GRATIS</span> : formatRupiah(selectedOrder.shippingFee)}</span></div>
                      <div className="flex justify-between font-black text-lg text-slate-900 pt-2 border-t border-slate-100 mt-2"><span>Total Pesanan</span><span className="text-orange-600">{formatRupiah(selectedOrder.grandTotal)}</span></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
