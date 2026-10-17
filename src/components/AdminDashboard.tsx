import React, { useState, useMemo, useEffect } from "react";
import {
  LayoutDashboard, Package, Plus, Save, Trash2, Pencil, 
  AlertTriangle, CheckCircle, Clock, Tag, ChevronLeft, Image as ImageIcon,
  Search, X, Truck, PackageCheck, ShoppingCart, Users, ArrowLeft,
  Eye, ChevronDown, Hash, Calendar, MapPin, FileText, RefreshCw,
  TrendingUp, Box, ClipboardList
} from "lucide-react";
import { Product, HobbyCategory, ProductStatus, Order, OrderStatus } from "../types";
import { getAllOrders, updateOrderStatus as apiUpdateOrderStatus, getOrderStats } from "../services/api";
import { formatRupiah } from "../utils/format";

type AdminTab = "dashboard" | "orders" | "products" | "add" | "edit";

const CATEGORY_MAP: Record<HobbyCategory, string> = {
  scale: "Scale Figure",
  nendoroid: "Nendoroid/Figma",
  gunpla: "Gunpla/Mecha",
  merch: "Merch/Plushie",
  tcg: "TCG/Cards",
};

const STATUS_MAP: Record<ProductStatus, string> = {
  ready: "Ready Stock",
  preorder: "Pre-Order",
  promo: "Special Promo",
};

const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: any; bgColor: string }> = {
  processing: { label: "Diproses", color: "text-amber-700", icon: Clock, bgColor: "bg-amber-100" },
  shipped: { label: "Dikirim", color: "text-blue-700", icon: Truck, bgColor: "bg-blue-100" },
  delivered: { label: "Sampai", color: "text-emerald-700", icon: PackageCheck, bgColor: "bg-emerald-100" },
};

const EMPTY_FORM: Partial<Product> = {
  title: "", japaneseTitle: "", series: "", manufacturer: "",
  category: "scale", categoryName: "Scale Figure",
  status: "ready", statusBadge: "Ready Stock", condition: "MISB",
  price: 0, image: "", rating: 5.0, soldCount: 0, stock: 10,
  scale: "", material: "", height: "", releaseDate: "",
  poDeadline: "", etaArrival: "", description: "", isRare: false,
};

const formatRp = (v: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);

const inputCls = "w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white";

// ─── Product Form ───
const ProductForm: React.FC<{
  initial: Partial<Product>;
  onSave: (p: Product) => void;
  onCancel: () => void;
  isEdit?: boolean;
}> = ({ initial, onSave, onCancel, isEdit }) => {
  const [form, setForm] = useState<Partial<Product>>(initial);
  const [imageUrls, setImageUrls] = useState((initial.images?.length ? initial.images : initial.image ? [initial.image] : []).join('\n'));
  const [imgError, setImgError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const parsed =
      type === "checkbox" ? (e.target as HTMLInputElement).checked
      : type === "number" ? (value === "" ? undefined : Number(value))
      : value;
    setForm(prev => {
      const next = { ...prev, [name]: parsed };
      if (name === "category") next.categoryName = CATEGORY_MAP[value as HobbyCategory];
      if (name === "status") next.statusBadge = STATUS_MAP[value as ProductStatus];
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title?.trim()) { alert("Judul produk wajib diisi."); return; }
    if (!form.price || form.price <= 0) { alert("Harga produk wajib diisi dan lebih dari 0."); return; }
    if (!form.series?.trim()) { alert("Series wajib diisi."); return; }
    if (!form.manufacturer?.trim()) { alert("Manufacturer wajib diisi."); return; }
    if (!form.description?.trim()) { alert("Deskripsi produk wajib diisi."); return; }
    const images = imageUrls.split(/\r?\n/).map(url => url.trim()).filter(Boolean);
    const placeholderImage = "https://placehold.co/600x600/e2e8f0/64748b?text=No+Image";
    const saved: Product = {
      ...(form as Product),
      id: form.id || `prod-${Date.now()}`,
      image: images[0] || placeholderImage,
      images: images.length ? images : [placeholderImage],
      downPayment: form.status === "preorder" ? form.downPayment : undefined,
      poDeadline: form.status === "preorder" ? form.poDeadline : undefined,
      etaArrival: form.status === "preorder" ? form.etaArrival : undefined,
      originalPrice: (form.originalPrice && form.originalPrice > 0) ? form.originalPrice : undefined,
    };
    onSave(saved);
  };

  const isPreOrder = form.status === "preorder";
  const imageList = imageUrls.split(/\r?\n/).map(url => url.trim()).filter(Boolean);
  const previewImage = imageList[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Image Preview */}
      <div className="flex gap-4 items-start">
        <div className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 overflow-hidden bg-slate-100 flex-shrink-0">
          {previewImage && !imgError ? (
            <img src={previewImage} alt="Pratinjau foto utama" className="w-full h-full object-cover"
              onError={() => setImgError(true)} onLoad={() => setImgError(false)} />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-1">
              <ImageIcon className="w-6 h-6 text-slate-400" />
              <span className="text-[10px] text-slate-400">Preview</span>
            </div>
          )}
        </div>
        <div className="flex-1 space-y-1">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">URL Foto Produk</label>
          <textarea value={imageUrls} onChange={event => { setImgError(false); setImageUrls(event.target.value); }}
            placeholder={"https://example.com/foto-depan.jpg\nhttps://example.com/foto-samping.jpg"}
            className={inputCls + " resize-y"} rows={3} />
          <p className="text-xs text-slate-400">Masukkan satu URL gambar per baris. Foto pertama menjadi foto utama.</p>
          {imageList.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pt-2">
              {imageList.map((url, index) => (
                <img key={`${url}-${index}`} src={url} alt={`Pratinjau foto ${index + 1}`}
                  className="h-12 w-12 shrink-0 rounded-md border border-slate-200 object-cover" />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 space-y-1">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">Nama Produk <span className="text-red-500">*</span></label>
          <input required type="text" name="title" value={form.title || ""} onChange={handleChange}
            placeholder="Contoh: Nendoroid Anya Forger" className={inputCls} />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">Judul Jepang (Opsional)</label>
          <input type="text" name="japaneseTitle" value={form.japaneseTitle || ""} onChange={handleChange}
            placeholder="日本語タイトル" className={inputCls} />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">Series / Franchise <span className="text-red-500">*</span></label>
          <input required type="text" name="series" value={form.series || ""} onChange={handleChange}
            placeholder="Contoh: Spy x Family" className={inputCls} />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">Manufacturer <span className="text-red-500">*</span></label>
          <input required type="text" name="manufacturer" value={form.manufacturer || ""} onChange={handleChange}
            placeholder="Contoh: Good Smile Company" className={inputCls} />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">Kategori</label>
          <select name="category" value={form.category} onChange={handleChange} className={inputCls}>
            <option value="scale">Scale Figure</option>
            <option value="nendoroid">Nendoroid / Figma</option>
            <option value="gunpla">Gunpla / Mecha</option>
            <option value="merch">Merch / Plushie</option>
            <option value="tcg">TCG / Cards</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">Status Ketersediaan</label>
          <select name="status" value={form.status} onChange={handleChange} className={inputCls}>
            <option value="ready">Ready Stock</option>
            <option value="preorder">Pre-Order</option>
            <option value="promo">Special Promo</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">Kondisi</label>
          <select name="condition" value={form.condition} onChange={handleChange} className={inputCls}>
            <option value="MISB">MISB (Mint In Sealed Box)</option>
            <option value="Authentic Pre-Painted">Authentic Pre-Painted</option>
            <option value="New Sealed">New Sealed</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">
            Harga Jual (Rp) <span className="text-red-500">*</span>
            {form.price ? <span className="ml-2 text-green-600 normal-case font-normal">{formatRp(form.price)}</span> : null}
          </label>
          <input required type="number" name="price" value={form.price || ""} min={0} onChange={handleChange}
            placeholder="850000" className={inputCls} />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">Harga Asli / Coret (Rp)
            {form.originalPrice && form.originalPrice > 0 && form.price ? (
              <span className="ml-2 text-orange-600 normal-case font-normal">Diskon {Math.round((1 - form.price / form.originalPrice) * 100)}%</span>
            ) : null}
          </label>
          <input type="number" name="originalPrice" value={form.originalPrice || ""} min={0} onChange={handleChange}
            placeholder="950000 (opsional, isi jika ada diskon)" className={inputCls} />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">Stok <span className="text-red-500">*</span></label>
          <input required type="number" name="stock" value={form.stock ?? 10} min={0} onChange={handleChange}
            placeholder="10" className={inputCls} />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">Rating Awal (1.0 - 5.0)</label>
          <input type="number" name="rating" value={form.rating ?? 5.0} min={1} max={5} step={0.1} onChange={handleChange}
            className={inputCls} />
        </div>

        {isPreOrder && (
          <>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">Down Payment / DP (Rp)</label>
              <input type="number" name="downPayment" value={form.downPayment || ""} min={0} onChange={handleChange}
                placeholder="300000" className={inputCls} />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">Deadline Pre-Order</label>
              <input type="text" name="poDeadline" value={form.poDeadline || ""} onChange={handleChange}
                placeholder="Contoh: 30 Januari 2025" className={inputCls} />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">Estimasi Tiba</label>
              <input type="text" name="etaArrival" value={form.etaArrival || ""} onChange={handleChange}
                placeholder="Estimasi Tiba: Q2 2025 (2-3 Minggu setelah rilis Jepang)" className={inputCls} />
            </div>
          </>
        )}

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">Tanggal / Gelombang Rilis</label>
          <input type="text" name="releaseDate" value={form.releaseDate || ""} onChange={handleChange}
            placeholder="Contoh: Q1 2025 / Bandai Japan" className={inputCls} />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">Skala / Tipe</label>
          <input type="text" name="scale" value={form.scale || ""} onChange={handleChange}
            placeholder="Contoh: 1/7 Scale PVC Pre-Painted" className={inputCls} />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">Material</label>
          <input type="text" name="material" value={form.material || ""} onChange={handleChange}
            placeholder="Contoh: PVC & ABS" className={inputCls} />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">Tinggi (Height)</label>
          <input type="text" name="height" value={form.height || ""} onChange={handleChange}
            placeholder="Contoh: Kira-kira 250mm (25cm)" className={inputCls} />
        </div>

        <div className="md:col-span-2 space-y-1">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">Deskripsi Produk <span className="text-red-500">*</span></label>
          <textarea required name="description" value={form.description || ""} onChange={handleChange} rows={4}
            placeholder="Ceritakan detail lengkap produk ini untuk calon pembeli..." className={inputCls + " resize-none"} />
        </div>

        <div className="md:col-span-2 flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" name="isRare" checked={!!form.isRare} onChange={handleChange}
              className="w-4 h-4 rounded accent-orange-500" />
            <span className="text-sm font-medium text-slate-700">Tandai sebagai <strong>Rare Item 🔥</strong></span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <button type="button" onClick={onCancel}
          className="px-5 py-2.5 rounded-xl font-semibold text-sm text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 transition-colors">
          Batal
        </button>
        <button type="submit"
          className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20">
          <Save className="w-4 h-4" />
          {isEdit ? "Simpan Perubahan" : "Tambah Produk"}
        </button>
      </div>
    </form>
  );
};

// ─── Order Detail Modal ───
const OrderDetailModal: React.FC<{
  order: Order | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: OrderStatus, trackingNumber?: string, notes?: string) => void;
}> = ({ order, onClose, onUpdateStatus }) => {
  const [newStatus, setNewStatus] = useState<OrderStatus>(order?.status || 'processing');
  const [trackingNumber, setTrackingNumber] = useState(order?.trackingNumber || '');
  const [notes, setNotes] = useState(order?.notes || '');

  useEffect(() => {
    if (order) {
      setNewStatus(order.status);
      setTrackingNumber(order.trackingNumber || '');
      setNotes(order.notes || '');
    }
  }, [order]);

  if (!order) return null;

  const cfg = ORDER_STATUS_CONFIG[order.status];
  const StatusIcon = cfg.icon;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-2xl">
          <div>
            <h3 className="text-lg font-black text-slate-900">Detail Pesanan</h3>
            <p className="text-xs text-slate-500 font-mono">{order.orderNumber}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Status Badge */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${cfg.bgColor} flex items-center justify-center`}>
              <StatusIcon className={`w-5 h-5 ${cfg.color}`} />
            </div>
            <div>
              <p className={`text-sm font-bold ${cfg.color}`}>Status: {cfg.label}</p>
              <p className="text-xs text-slate-500">Dibuat: {new Date(order.createdAt).toLocaleString('id-ID')}</p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wide">Info Pelanggan</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-slate-500">Nama:</span> <span className="font-semibold text-slate-800">{order.userName}</span></div>
              <div><span className="text-slate-500">Email:</span> <span className="font-semibold text-slate-800">{order.userEmail}</span></div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-3">Item Pesanan ({order.items.length})</h4>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl">
                  <img src={item.productImage || 'https://placehold.co/80/e2e8f0/64748b?text=?'} alt={item.productTitle}
                    className="w-12 h-12 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                    onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/80/e2e8f0/64748b?text=?'; }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 line-clamp-1">{item.productTitle}</p>
                    <p className="text-xs text-slate-500">
                      {item.quantity}x @ {formatRupiah(item.unitPrice)}
                      {item.paymentType === 'dp' && <span className="ml-1 text-blue-600 font-bold">(DP)</span>}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-slate-800 whitespace-nowrap">{formatRupiah(item.unitPrice * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Summary */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal:</span><span>{formatRupiah(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-orange-600">
                <span>Diskon Voucher:</span><span>-{formatRupiah(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-500">
              <span>Ongkir:</span><span>{order.shippingFee === 0 ? <strong className="text-emerald-600">GRATIS</strong> : formatRupiah(order.shippingFee)}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-slate-900">
              <span>Total:</span><span className="text-orange-600 text-base">{formatRupiah(order.grandTotal)}</span>
            </div>
          </div>

          {/* Tracking Info */}
          {order.trackingNumber && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm">
              <span className="text-blue-600 font-bold">📦 No. Resi:</span>{' '}
              <span className="font-mono font-bold text-blue-800">{order.trackingNumber}</span>
            </div>
          )}
          {order.notes && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm">
              <span className="text-slate-600 font-bold">📝 Catatan:</span>{' '}
              <span className="text-slate-700">{order.notes}</span>
            </div>
          )}

          {/* Update Status Form */}
          <div className="p-4 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wide">Update Status Pesanan</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(['processing', 'shipped', 'delivered'] as OrderStatus[]).map(s => {
                const c = ORDER_STATUS_CONFIG[s];
                const Icon = c.icon;
                return (
                  <button key={s} onClick={() => setNewStatus(s)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                      newStatus === s ? `${c.bgColor} ${c.color} border-current` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}>
                    <Icon className="w-4 h-4" />{c.label}
                  </button>
                );
              })}
            </div>
            {newStatus === 'shipped' && (
              <input type="text" value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)}
                placeholder="Nomor resi pengiriman..." className={inputCls} />
            )}
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Catatan admin (opsional)..." className={inputCls + " resize-none"} rows={2} />
            <button
              onClick={() => { onUpdateStatus(order.id, newStatus, trackingNumber, notes); onClose(); }}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4" />Update Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


// ─── Main Admin Dashboard ───
interface AdminDashboardProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onBackToStore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products, onAddProduct, onUpdateProduct, onDeleteProduct, onBackToStore
}) => {
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderFilter, setOrderFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderStats, setOrderStats] = useState({ total: 0, processing: 0, shipped: 0, delivered: 0 });
  const [loadingOrders, setLoadingOrders] = useState(false);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const [ordersData, statsData] = await Promise.all([
        getAllOrders(orderFilter === 'all' ? undefined : orderFilter),
        getOrderStats()
      ]);
      setOrders(ordersData);
      setOrderStats(statsData);
    } catch {
      // Orders API may not be available yet
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [orderFilter]);

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus, trackingNumber?: string, notes?: string) => {
    try {
      await apiUpdateOrderStatus(orderId, status, trackingNumber, notes);
      showSuccess(`Status pesanan berhasil diubah ke "${ORDER_STATUS_CONFIG[status].label}"`);
      fetchOrders();
    } catch {
      showSuccess('Gagal mengubah status pesanan.');
    }
  };

  const stats = useMemo(() => ({
    total: products.length,
    ready: products.filter(p => p.status === "ready").length,
    preorder: products.filter(p => p.status === "preorder").length,
    promo: products.filter(p => p.status === "promo").length,
    lowStock: products.filter(p => p.stock > 0 && p.stock <= 5).length,
    outOfStock: products.filter(p => p.stock === 0).length,
    byCategory: Object.entries(CATEGORY_MAP).map(([key, name]) => ({
      key, name, count: products.filter(p => p.category === key as HobbyCategory).length
    }))
  }), [products]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return products.filter(p =>
      !q || p.title.toLowerCase().includes(q) || p.series.toLowerCase().includes(q) ||
      p.manufacturer.toLowerCase().includes(q) || p.categoryName.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  const handleAdd = (p: Product) => { onAddProduct(p); setTab("products"); showSuccess(`Produk "${p.title}" berhasil ditambahkan!`); };
  const handleUpdate = (p: Product) => { onUpdateProduct(p); setTab("products"); setEditTarget(null); showSuccess(`Produk "${p.title}" berhasil diperbarui!`); };
  const handleDelete = (id: string) => { const p = products.find(p => p.id === id); onDeleteProduct(id); setDeleteConfirm(null); showSuccess(`Produk "${p?.title}" dihapus.`); };
  const openEdit = (p: Product) => { setEditTarget(p); setTab("edit"); };

  const statusBadge = (status: ProductStatus) => {
    const cfg = { ready: "bg-green-100 text-green-700", preorder: "bg-blue-100 text-blue-700", promo: "bg-orange-100 text-orange-700" }[status];
    return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg}`}>{STATUS_MAP[status]}</span>;
  };

  const sidebarItems = [
    { id: "dashboard" as AdminTab, label: "Dashboard", icon: LayoutDashboard },
    { id: "orders" as AdminTab, label: "Pesanan", icon: ClipboardList, badge: orderStats.processing > 0 ? orderStats.processing : undefined },
    { id: "products" as AdminTab, label: "Produk", icon: Package },
    { id: "add" as AdminTab, label: "Tambah Produk", icon: Plus },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col flex-shrink-0 min-h-screen sticky top-0 max-h-screen">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center flex-shrink-0">
              <LayoutDashboard className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight">AMA-AMA</h1>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {sidebarItems.map(({ id, label, icon: Icon, badge }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}>
              <Icon className="w-4.5 h-4.5 flex-shrink-0" />
              <span className="flex-1 text-left">{label}</span>
              {badge !== undefined && (
                <span className="min-w-[20px] h-5 flex items-center justify-center bg-orange-500 text-white text-[10px] font-black rounded-full px-1.5">
                  {badge}
                </span>
              )}
            </button>
          ))}
          {tab === "edit" && (
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold bg-orange-600 text-white">
              <Pencil className="w-4.5 h-4.5" />Edit Produk
            </button>
          )}
        </nav>

        {/* Back to Store */}
        <div className="px-3 pb-5">
          <button onClick={onBackToStore}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Toko
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between shadow-sm">
          <div>
            <h2 className="text-lg font-black text-slate-900 font-['Poppins']">
              {tab === 'dashboard' && 'Dashboard Toko'}
              {tab === 'orders' && 'Manajemen Pesanan'}
              {tab === 'products' && 'Semua Produk'}
              {tab === 'add' && 'Tambah Produk Baru'}
              {tab === 'edit' && `Edit: ${editTarget?.title}`}
            </h2>
            <p className="text-xs text-slate-500">
              {tab === 'dashboard' && 'Ringkasan performa dan statistik toko'}
              {tab === 'orders' && 'Tracking pesanan dari diproses hingga sampai'}
              {tab === 'products' && `${products.length} produk terdaftar`}
              {tab === 'add' && 'Isi detail produk baru untuk ditampilkan di toko'}
              {tab === 'edit' && 'Perbarui informasi produk'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {successMsg && (
              <div className="text-xs bg-emerald-600 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-1.5 animate-bounce shadow-lg">
                <CheckCircle className="w-3.5 h-3.5" />
                {successMsg}
              </div>
            )}
          </div>
        </header>

        <div className="p-6">

          {/* ─── DASHBOARD TAB ─── */}
          {tab === "dashboard" && (
            <div className="space-y-6">
              {/* Top Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Produk", value: stats.total, color: "from-blue-500 to-blue-600", icon: Package },
                  { label: "Pesanan Diproses", value: orderStats.processing, color: "from-amber-500 to-orange-500", icon: Clock },
                  { label: "Sedang Dikirim", value: orderStats.shipped, color: "from-indigo-500 to-purple-500", icon: Truck },
                  { label: "Pesanan Sampai", value: orderStats.delivered, color: "from-emerald-500 to-teal-500", icon: PackageCheck },
                ].map(({ label, value, color, icon: Icon }) => (
                  <div key={label} className="bg-white rounded-2xl p-5 border border-slate-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-11 h-11 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <TrendingUp className="w-4 h-4 text-slate-300" />
                    </div>
                    <p className="text-3xl font-black text-slate-900">{value}</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              {/* Product Status Row */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Ready Stock", value: stats.ready, color: "bg-green-500", icon: CheckCircle },
                  { label: "Pre-Order", value: stats.preorder, color: "bg-indigo-500", icon: Clock },
                  { label: "Promo Aktif", value: stats.promo, color: "bg-orange-500", icon: Tag },
                ].map(({ label, value, color, icon: Icon }) => (
                  <div key={label} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
                    <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-slate-800">{value}</p>
                      <p className="text-xs text-slate-500">{label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stock Alerts */}
              {(stats.lowStock > 0 || stats.outOfStock > 0) && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" /> Peringatan Stok
                  </h3>
                  {stats.outOfStock > 0 && (
                    <div className="flex items-center gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span><strong>{stats.outOfStock} produk</strong> kehabisan stok (stok = 0)</span>
                    </div>
                  )}
                  {stats.lowStock > 0 && (
                    <div className="flex items-center gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span><strong>{stats.lowStock} produk</strong> hampir habis stok (stok 1-5)</span>
                    </div>
                  )}
                </div>
              )}

              {/* Category Breakdown */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <h3 className="text-sm font-bold text-slate-700 mb-4">Produk per Kategori</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {stats.byCategory.map(({ key, name, count }) => (
                    <div key={key} className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">
                      <span className="text-sm font-medium text-slate-700">{name}</span>
                      <span className="text-sm font-black text-slate-800 bg-white px-3 py-1 rounded-lg border border-slate-200">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Restock Needed */}
              {stats.lowStock + stats.outOfStock > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                  <h3 className="text-sm font-bold text-slate-700 mb-3">Produk Perlu Restock</h3>
                  <div className="space-y-2">
                    {products.filter(p => p.stock <= 5).map(p => (
                      <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt={p.title} className="w-8 h-8 rounded-lg object-cover bg-slate-200"
                            onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/80/e2e8f0/64748b?text=?'; }} />
                          <div>
                            <p className="text-sm font-semibold text-slate-800 line-clamp-1">{p.title}</p>
                            <p className="text-xs text-slate-500">{p.categoryName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${p.stock === 0 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                            Stok: {p.stock}
                          </span>
                          <button onClick={() => openEdit(p)} className="text-xs font-bold text-blue-600 hover:underline">Edit</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── ORDERS TAB ─── */}
          {tab === "orders" && (
            <div className="space-y-5">
              {/* Order Stats Bar */}
              <div className="grid grid-cols-4 gap-3">
                {([
                  { key: 'all', label: 'Semua', count: orderStats.total, color: 'bg-slate-600' },
                  { key: 'processing', label: 'Diproses', count: orderStats.processing, color: 'bg-amber-500' },
                  { key: 'shipped', label: 'Dikirim', count: orderStats.shipped, color: 'bg-blue-500' },
                  { key: 'delivered', label: 'Sampai', count: orderStats.delivered, color: 'bg-emerald-500' },
                ] as const).map(({ key, label, count, color }) => (
                  <button key={key} onClick={() => setOrderFilter(key)}
                    className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                      orderFilter === key
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className={`w-3 h-3 rounded-full ${color}`} />
                      <span className="text-xs font-semibold text-slate-600">{label}</span>
                    </div>
                    <p className="text-2xl font-black text-slate-900">{count}</p>
                  </button>
                ))}
              </div>

              {/* Refresh Button */}
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">Menampilkan {orders.length} pesanan</p>
                <button onClick={fetchOrders} disabled={loadingOrders}
                  className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50">
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingOrders ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>

              {/* Orders Table */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                {orders.length === 0 ? (
                  <div className="py-16 text-center">
                    <ClipboardList className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p className="text-sm font-bold text-slate-500">Belum ada pesanan</p>
                    <p className="text-xs text-slate-400 mt-1">Pesanan akan muncul di sini setelah customer checkout</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="text-left px-4 py-3 font-semibold text-xs text-slate-500 uppercase tracking-wide">No. Pesanan</th>
                          <th className="text-left px-3 py-3 font-semibold text-xs text-slate-500 uppercase tracking-wide">Pelanggan</th>
                          <th className="text-center px-3 py-3 font-semibold text-xs text-slate-500 uppercase tracking-wide">Item</th>
                          <th className="text-right px-3 py-3 font-semibold text-xs text-slate-500 uppercase tracking-wide">Total</th>
                          <th className="text-center px-3 py-3 font-semibold text-xs text-slate-500 uppercase tracking-wide">Status</th>
                          <th className="text-center px-3 py-3 font-semibold text-xs text-slate-500 uppercase tracking-wide">Tanggal</th>
                          <th className="text-center px-3 py-3 font-semibold text-xs text-slate-500 uppercase tracking-wide">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {orders.map(order => {
                          const sCfg = ORDER_STATUS_CONFIG[order.status];
                          const SIcon = sCfg.icon;
                          return (
                            <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-4 py-3">
                                <span className="font-mono font-bold text-xs text-slate-800">{order.orderNumber}</span>
                              </td>
                              <td className="px-3 py-3">
                                <p className="text-xs font-semibold text-slate-800">{order.userName}</p>
                                <p className="text-[11px] text-slate-500">{order.userEmail}</p>
                              </td>
                              <td className="px-3 py-3 text-center">
                                <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded-lg">{order.items.length}</span>
                              </td>
                              <td className="px-3 py-3 text-right">
                                <span className="text-xs font-bold text-slate-800">{formatRupiah(order.grandTotal)}</span>
                              </td>
                              <td className="px-3 py-3 text-center">
                                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${sCfg.bgColor} ${sCfg.color}`}>
                                  <SIcon className="w-3 h-3" />{sCfg.label}
                                </span>
                              </td>
                              <td className="px-3 py-3 text-center">
                                <span className="text-[11px] text-slate-500">{new Date(order.createdAt).toLocaleDateString('id-ID')}</span>
                              </td>
                              <td className="px-3 py-3 text-center">
                                <button onClick={() => setSelectedOrder(order)}
                                  className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors" title="Detail">
                                  <Eye className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── PRODUCTS LIST TAB ─── */}
          {tab === "products" && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Cari nama produk, series, manufacturer..."
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-300 focus:border-blue-500 outline-none bg-white" />
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="text-left px-4 py-3 font-semibold text-xs text-slate-500 uppercase tracking-wide whitespace-nowrap">Produk</th>
                        <th className="text-left px-3 py-3 font-semibold text-xs text-slate-500 uppercase tracking-wide hidden md:table-cell whitespace-nowrap">Kategori</th>
                        <th className="text-left px-3 py-3 font-semibold text-xs text-slate-500 uppercase tracking-wide whitespace-nowrap">Status</th>
                        <th className="text-right px-3 py-3 font-semibold text-xs text-slate-500 uppercase tracking-wide whitespace-nowrap">Harga</th>
                        <th className="text-center px-3 py-3 font-semibold text-xs text-slate-500 uppercase tracking-wide whitespace-nowrap">Stok</th>
                        <th className="text-center px-3 py-3 font-semibold text-xs text-slate-500 uppercase tracking-wide whitespace-nowrap">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProducts.length === 0 ? (
                        <tr><td colSpan={6} className="text-center py-12 text-sm text-slate-400">Tidak ada produk ditemukan</td></tr>
                      ) : filteredProducts.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img src={p.image} alt={p.title}
                                className="w-10 h-10 rounded-lg object-cover border border-slate-200 bg-slate-100 flex-shrink-0"
                                onError={e => { (e.target as HTMLImageElement).src = "https://placehold.co/100/e2e8f0/64748b?text=?"; }} />
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-800 line-clamp-1 text-xs">{p.title}</p>
                                <p className="text-[11px] text-slate-500">{p.manufacturer}</p>
                                {p.isRare && <span className="text-[10px] font-bold text-orange-600">🔥 Rare</span>}
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3 hidden md:table-cell"><span className="text-xs text-slate-600 whitespace-nowrap">{p.categoryName}</span></td>
                          <td className="px-3 py-3">{statusBadge(p.status)}</td>
                          <td className="px-3 py-3 text-right">
                            <p className="text-xs font-bold text-slate-800 whitespace-nowrap">{formatRp(p.price)}</p>
                            {p.originalPrice && <p className="text-[10px] text-slate-400 line-through whitespace-nowrap">{formatRp(p.originalPrice)}</p>}
                          </td>
                          <td className="px-3 py-3 text-center">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${p.stock === 0 ? "bg-red-100 text-red-700" : p.stock <= 5 ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>{p.stock}</span>
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center justify-center gap-1.5">
                              <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors" title="Edit"><Pencil className="w-3.5 h-3.5" /></button>
                              <button onClick={() => setDeleteConfirm(p.id)} className="p-1.5 rounded-lg hover:bg-red-100 text-red-500 transition-colors" title="Hapus"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="text-xs text-slate-400">Menampilkan {filteredProducts.length} dari {products.length} produk</p>
            </div>
          )}

          {/* ─── ADD PRODUCT TAB ─── */}
          {tab === "add" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-base font-bold text-slate-800 mb-5">Tambah Produk Baru</h2>
              <ProductForm initial={{ ...EMPTY_FORM }} onSave={handleAdd} onCancel={() => setTab("products")} />
            </div>
          )}

          {/* ─── EDIT PRODUCT TAB ─── */}
          {tab === "edit" && editTarget && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <button onClick={() => { setTab("products"); setEditTarget(null); }}
                className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-5 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Kembali ke Daftar
              </button>
              <h2 className="text-base font-bold text-slate-800 mb-5">Edit: {editTarget.title}</h2>
              <ProductForm initial={{ ...editTarget }} onSave={handleUpdate} onCancel={() => { setTab("products"); setEditTarget(null); }} isEdit />
            </div>
          )}
        </div>
      </main>

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={handleUpdateOrderStatus}
      />

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Hapus Produk?</h3>
                <p className="text-xs text-slate-500 mt-0.5">Tindakan ini tidak dapat dibatalkan.</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-5 bg-slate-50 p-3 rounded-xl border border-slate-200 font-medium">
              {products.find(p => p.id === deleteConfirm)?.title}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors">
                Batal
              </button>
              <button onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2.5 rounded-xl font-bold text-sm bg-red-600 text-white hover:bg-red-700 transition-colors">
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
