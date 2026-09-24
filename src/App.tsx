import React, { useState, useMemo } from 'react';
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
import { PRODUCTS } from './data/products';
import { STORE_VOUCHERS } from './data/vouchers';
import { Product, CartItem, Voucher, HobbyCategory } from './types';
import { Sparkles, ShoppingBag, CheckCircle, PackageOpen } from 'lucide-react';

export default function App() {
  // Products & Vouchers
  const [products] = useState<Product[]>(PRODUCTS);
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

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
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

  return (
    <div className="min-h-screen bg-[#12121A] text-slate-100 flex flex-col selection:bg-[#FF2A6D] selection:text-white">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#222234] border border-[#05D9E8]/50 text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl shadow-2xl shadow-cyan-500/20 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-[#05D9E8]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Search */}
      <Header
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onResetSearch={() => {
          setSearchQuery('');
          setActiveMainTab('all');
          setActiveHobbyCategory('all');
        }}
      />

      <main className="flex-1 pb-12">
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
              <div className="px-3 sm:px-4 pt-3 flex items-center justify-between text-xs bg-slate-900/60 p-2.5 mx-3 sm:mx-4 mt-2 rounded-xl border border-slate-800">
                <span className="text-slate-300">
                  Hasil pencarian untuk: <strong className="text-[#05D9E8]">"{searchQuery}"</strong>
                </span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-[#FF2A6D] font-bold hover:underline"
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
                <div className="py-16 text-center bg-[#1A1A26] rounded-2xl border border-slate-800 p-6 my-4">
                  <PackageOpen className="w-12 h-12 mx-auto mb-3 text-slate-500 opacity-40" />
                  <h3 className="text-base font-bold text-white font-['Poppins']">
                    Tidak ada figure yang cocok dengan kriteria filter
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Coba ubah kata kunci pencarian atau ganti kategori hobi di bilah navigasi.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveMainTab('all');
                      setActiveHobbyCategory('all');
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs"
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
    </div>
  );
}
