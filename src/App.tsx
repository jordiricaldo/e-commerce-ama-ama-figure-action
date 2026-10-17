import React, { useEffect, useState, useMemo } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { VouchersSection } from './components/VouchersSection';
import { CategoryNav, MainTab } from './components/CategoryNav';
import { SortBar, SortOption } from './components/SortBar';
import { ProductCard } from './components/ProductCard';
import { CategoryView } from './components/CategoryView';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { Footer } from './components/Footer';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { AdminDashboard } from './components/AdminDashboard';
import { LoginModal } from './components/LoginModal';
import { RegisterModal } from './components/RegisterModal';
import { UserOrdersModal } from './components/UserOrdersModal';
import { PRODUCTS } from './data/products';
import { STORE_VOUCHERS } from './data/vouchers';
import { Product, CartItem, Voucher, HobbyCategory } from './types';
import { Sparkles, ShoppingBag, CheckCircle, PackageOpen } from 'lucide-react';
import { createProduct, deleteProduct, getProducts, getSession, updateProduct, logout } from './services/api';

export default function App() {
  // Products & Vouchers
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [session, setSession] = useState(getSession());
  const [vouchers] = useState<Voucher[]>(STORE_VOUCHERS);
  const [claimedVoucherIds, setClaimedVoucherIds] = useState<string[]>(['v-50k']);

  // Cart & Wishlist State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>(['prod-miku-symphony']);

  // Filters & Tabs State
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('all');
  const [activeHobbyCategory, setActiveHobbyCategory] = useState<HobbyCategory | 'all'>('all');
  const [currentSort, setCurrentSort] = useState<SortOption>('popular');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(() => getSession()?.user.role === 'admin');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [loginRole, setLoginRole] = useState<'admin' | 'user' | null>(() => window.location.pathname === '/admin-panel' ? 'admin' : null);

  useEffect(() => {
    const handleOpenRegister = () => setIsRegisterOpen(true);
    window.addEventListener('open-register', handleOpenRegister);
    return () => window.removeEventListener('open-register', handleOpenRegister);
  }, []);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const refreshProducts = async () => {
    try {
      setProducts(await getProducts());
    } catch {
      showToast('API belum aktif, menampilkan katalog lokal.');
    }
  };

  useEffect(() => {
    const handleFocus = () => { void refreshProducts(); };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') void refreshProducts();
    };
    void refreshProducts();
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Add Product (Admin Action)
  const handleAddProduct = async (newProduct: Product) => {
    try {
      const created = await createProduct(newProduct);
      setProducts(prev => [created, ...prev]);
    } catch { showToast('Produk gagal ditambahkan ke backend.'); }
  };

  // Update Product (Admin Action)
  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      const updated = await updateProduct(updatedProduct);
      setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
    } catch { showToast('Produk gagal diperbarui di backend.'); }
  };

  // Delete Product (Admin Action)
  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch { showToast('Produk gagal dihapus dari backend.'); }
  };

  // Cart Actions
  const handleAddToCart = (product: Product, quantity = 1, paymentType: 'full' | 'dp' = 'full') => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.isPreOrderPaymentType === paymentType);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id && item.isPreOrderPaymentType === paymentType
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, isPreOrderPaymentType: paymentType }];
    });
    showToast(`✓ "${product.title}" dimasukkan ke keranjang`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item dihapus dari keranjang');
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Wishlist Actions
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds(prev => {
      const isSaved = prev.includes(product.id);
      if (isSaved) {
        showToast(`Dihapus dari wishlist: ${product.title}`);
        return prev.filter(id => id !== product.id);
      } else {
        showToast(`❤️ Ditambahkan ke wishlist: ${product.title}`);
        return [...prev, product.id];
      }
    });
  };

  // Voucher Toggle
  const handleToggleClaimVoucher = (voucher: Voucher) => {
    setClaimedVoucherIds(prev => {
      if (prev.includes(voucher.id)) {
        showToast(`Voucher ${voucher.code} dilepas`);
        return prev.filter(id => id !== voucher.id);
      } else {
        showToast(`🎉 Voucher ${voucher.title} berhasil diklaim!`);
        return [...prev, voucher.id];
      }
    });
  };

  // Switch category from Category View
  const handleCategoryViewSelect = (category: HobbyCategory, subgenre?: string) => {
    setActiveMainTab('all');
    setActiveHobbyCategory(category);
    if (subgenre) {
      setSearchQuery(subgenre);
    }
    // Smooth scroll to top of product grid
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    return products
      .filter(item => {
        // Main Tab Status Filter
        if (activeMainTab === 'preorder' && item.status !== 'preorder') return false;
        if (activeMainTab === 'ready' && item.status !== 'ready') return false;
        if (activeMainTab === 'promo' && item.status !== 'promo' && !item.originalPrice) return false;

        // Hobby Category Filter
        if (activeHobbyCategory !== 'all' && item.category !== activeHobbyCategory) return false;

        // Search Query Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchSeries = item.series.toLowerCase().includes(q);
          const matchMfg = item.manufacturer.toLowerCase().includes(q);
          const matchCat = item.categoryName.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          return matchTitle || matchSeries || matchMfg || matchCat || matchDesc;
        }

        return true;
      })
      .sort((a, b) => {
        switch (currentSort) {
          case 'popular':
            return (b.rating * b.soldCount) - (a.rating * a.soldCount);
          case 'newest':
            return b.id.localeCompare(a.id);
          case 'bestseller':
            return b.soldCount - a.soldCount;
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          default:
            return 0;
        }
      });
  }, [products, activeMainTab, activeHobbyCategory, searchQuery, currentSort]);

  // Wishlisted full objects
  const wishlistedProducts = useMemo(() => {
    return products.filter(p => wishlistIds.includes(p.id));
  }, [products, wishlistIds]);

  const claimedVouchers = useMemo(() => {
    return vouchers.filter(v => claimedVoucherIds.includes(v.id));
  }, [vouchers, claimedVoucherIds]);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  if (isAdminOpen && session?.user.role === 'admin') {
    return (
      <AdminDashboard
        products={products}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onBackToStore={() => setIsAdminOpen(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-orange-500 selection:text-slate-900 relative">
      {/* Animated Pop Background */}
      <div className="fixed inset-0 bg-anime-pattern opacity-90 pointer-events-none z-0" />
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-white border border-[#05D9E8]/50 text-slate-900 text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl shadow-2xl shadow-blue-500/10 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Search */}
      <div className="relative z-50">
        <Header
          cartCount={totalCartCount}
          wishlistCount={wishlistIds.length}
          searchQuery={searchQuery}
          user={session?.user || null}
          onSearchChange={setSearchQuery}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenWishlist={() => setIsWishlistOpen(true)}
          onOpenLogin={() => setLoginRole('user')}
          onOpenOrders={() => setIsOrdersOpen(true)}
          onLogout={() => {
            logout();
            setSession(null);
            showToast('Berhasil keluar dari akun.');
          }}
          onResetSearch={() => {
            setSearchQuery('');
            setActiveMainTab('all');
            setActiveHobbyCategory('all');
          }}
        />
      </div>

      <main className="flex-1 pb-12 relative z-10">
        {/* Store Hero Banner Carousel (Shown on main product views) */}
        {activeMainTab !== 'categories_view' && !searchQuery && (
          <HeroBanner
            onSelectPromoFilter={() => {
              setActiveMainTab('promo');
              setActiveHobbyCategory('all');
            }}
            onSelectPreOrderFilter={() => {
              setActiveMainTab('preorder');
              setActiveHobbyCategory('all');
            }}
            onSelectScaleFilter={() => {
              setActiveMainTab('all');
              setActiveHobbyCategory('scale');
            }}
            onSelectHobbyCategory={(category) => {
              setSearchQuery('');
              setActiveMainTab('all');
              setActiveHobbyCategory(category);
              window.scrollTo({ top: 380, behavior: 'smooth' });
            }}
          />
        )}

        {/* Claimable Store Vouchers Section */}
        {activeMainTab !== 'categories_view' && !searchQuery && (
          <VouchersSection
            vouchers={vouchers}
            claimedVoucherIds={claimedVoucherIds}
            onToggleClaim={handleToggleClaimVoucher}
          />
        )}

        {/* Main Category Filter / Navigation Tabs */}
        <CategoryNav
          activeMainTab={activeMainTab}
          onSelectMainTab={setActiveMainTab}
          activeHobbyCategory={activeHobbyCategory}
          onSelectHobbyCategory={setActiveHobbyCategory}
          productCount={filteredProducts.length}
        />

        {/* Conditional View: Category Directory vs 2-Column Product Grid */}
        {activeMainTab === 'categories_view' ? (
          <CategoryView onSelectCategory={handleCategoryViewSelect} />
        ) : (
          <div className="max-w-6xl mx-auto">
            {/* Search active notice banner */}
            {searchQuery && (
              <div className="px-3 sm:px-4 pt-3 flex items-center justify-between text-xs bg-slate-100/60 p-2.5 mx-3 sm:mx-4 mt-2 rounded-xl border border-slate-200">
                <span className="text-slate-600">
                  Hasil pencarian untuk: <strong className="text-blue-600">"{searchQuery}"</strong>
                </span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-orange-600 font-bold hover:underline"
                >
                  Reset Filter
                </button>
              </div>
            )}

            {/* Product Sorting Bar */}
            <SortBar
              currentSort={currentSort}
              onSortChange={setCurrentSort}
              totalCount={filteredProducts.length}
            />

            {/* 2-Column Product Grid (Main Shopping Area) */}
            <div className="px-3 sm:px-4 py-2">
              {filteredProducts.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-6 my-4">
                  <PackageOpen className="w-12 h-12 mx-auto mb-3 text-slate-500 opacity-40" />
                  <h3 className="text-base font-bold text-slate-900 font-['Poppins']">
                    Tidak ada figure yang cocok dengan kriteria filter
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Coba ubah kata kunci pencarian atau ganti kategori hobi di bilah navigasi.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveMainTab('all');
                      setActiveHobbyCategory('all');
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-700 text-blue-700 font-bold text-xs"
                  >
                    Tampilkan Semua Produk
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isWishlisted={wishlistIds.includes(product.id)}
                      onToggleWishlist={handleToggleWishlist}
                      onAddToCart={(prod) => handleAddToCart(prod, 1, prod.status === 'preorder' ? 'dp' : 'full')}
                      onClick={setSelectedProduct}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Product Quick View & Details Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        claimedVouchers={claimedVouchers}
        isAuthenticated={session?.user.role === 'user'}
        onRequireLogin={() => setLoginRole('user')}
        onOrderCreated={refreshProducts}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlistedProducts}
        onRemoveWishlist={(id) => setWishlistIds(prev => prev.filter(item => item !== id))}
        onAddToCart={(prod) => handleAddToCart(prod, 1, 'full')}
        onSelectProduct={setSelectedProduct}
      />

      {/* Direct WhatsApp Consultation Button */}
      <WhatsAppFloatingButton />

      {/* Footer & Trust Badges */}
      <Footer />

      <LoginModal
        role={loginRole}
        onClose={() => setLoginRole(null)}
        onSuccess={() => {
          const nextSession = getSession();
          setSession(nextSession);
          if (nextSession?.user.role === 'admin') setIsAdminOpen(true);
        }}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={() => {
          const nextSession = getSession();
          setSession(nextSession);
        }}
        onSwitchToLogin={() => {
          setIsRegisterOpen(false);
          setLoginRole('user');
        }}
      />

      <UserOrdersModal 
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
      />
    </div>
  );
}
