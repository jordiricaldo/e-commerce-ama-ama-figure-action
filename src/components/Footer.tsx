import React from 'react';
import { ShieldCheck, PackageCheck, CreditCard, MessageCircle, MapPin, Clock, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#12121A] border-t border-slate-800 text-slate-400 mt-8">
      {/* Trust Badges Section */}
      <div className="border-b border-slate-800/80 bg-[#161622]/60">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Badge 1: 100% Original */}
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#1A1A26] border border-slate-800 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/10 text-[#05D9E8] border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white font-['Poppins']">
                  100% Original Japan
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Garansi uang kembali 10x lipat bila terbukti bootleg/KW. Berlisensi resmi Good Smile, Bandai, Kadokawa.
                </p>
              </div>
            </div>

            {/* Badge 2: Safe Packaging */}
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#1A1A26] border border-slate-800 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-pink-500/10 text-[#FF2A6D] border border-pink-500/30 flex items-center justify-center flex-shrink-0">
                <PackageCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white font-['Poppins']">
                  Safe Packaging Box
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Free bubble wrap 5 lapis & kardus tebal double-wall. Kotak figure MISB aman tanpa penyok.
                </p>
              </div>
            </div>

            {/* Badge 3: Secure Payment */}
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#1A1A26] border border-slate-800 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white font-['Poppins']">
                  Pembayaran Fleksibel
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Mendukung QRIS instan, Transfer BCA/Mandiri, E-Wallet (GoPay, OVO, ShopeePay), dan Cicilan/PayLater.
                </p>
              </div>
            </div>

            {/* Badge 4: Direct WhatsApp Support */}
            <a
              href="https://wa.me/6281234567890?text=Halo%20Admin%20AMA%20AMA%20FIGURE%20ACTION,%20saya%20mau%20konsultasi%20Pre-Order%20atau%20tanya%20stock%20figure!"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#1A1A26] hover:bg-[#1E2232] border border-slate-800 hover:border-emerald-500/50 transition-all shadow-sm group"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-black text-white font-['Poppins'] group-hover:text-emerald-400 transition-colors">
                    Direct WhatsApp CS
                  </h4>
                  <span className="text-[9px] font-bold text-emerald-300 bg-emerald-500/20 px-1 rounded">ONLINE</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Konsultasi Pre-Order, request figure langka Jepang, cek status slot, atau tanya rekomendasi.
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Info */}
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-12 gap-8 text-xs">
        {/* Brand Col */}
        <div className="md:col-span-5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF2A6D] to-[#05D9E8] p-[1.5px]">
              <div className="w-full h-full bg-[#1A1A24] rounded-[6.5px] flex items-center justify-center font-black text-white text-sm font-['Poppins']">
                天
              </div>
            </div>
            <span className="font-extrabold text-base text-white tracking-tight font-['Poppins']">
              AMA AMA FIGURE ACTION
            </span>
          </div>
          <p className="text-slate-400 leading-relaxed max-w-sm">
            Toko hobi dan merchandise anime independen terpercaya. Membawa atmosfer otaku Akihabara langsung ke depan pintu rumahmu dengan kurasi figure kualitas kolektor tertinggi.
          </p>
          <div className="flex items-center gap-2 text-slate-400 pt-1">
            <MapPin className="w-4 h-4 text-[#05D9E8] flex-shrink-0" />
            <span>Gudang Hub: Jakarta Barat & Akihabara Direct Forwarding, Tokyo</span>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="md:col-span-3 space-y-2">
          <h4 className="font-bold text-white uppercase tracking-wider text-xs font-['Poppins']">
            Jam Layanan CS & Pengiriman
          </h4>
          <div className="space-y-1.5 text-slate-400">
            <p>Senin – Sabtu: 09:00 – 21:00 WIB</p>
            <p>Minggu & Libur: 10:00 – 18:00 WIB</p>
            <p className="text-emerald-400 font-semibold pt-1">
              ✓ Pengiriman Sameday & Instant diproses setiap hari
            </p>
          </div>
        </div>

        {/* Pre-Order Terms */}
        <div className="md:col-span-4 space-y-2">
          <h4 className="font-bold text-white uppercase tracking-wider text-xs font-['Poppins']">
            Jaminan Pre-Order Kami
          </h4>
          <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
            <li>Slot PO 100% aman (kami tidak melakukan over-booking).</li>
            <li>DP hangus hanya jika customer membatalkan sepihak.</li>
            <li>Notifikasi pelunasan via WhatsApp dan Email otomatis.</li>
            <li>Estimasi kedatangan 2-3 minggu setelah tanggal rilis resmi Jepang.</li>
          </ul>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-slate-800/80 py-4 px-4 text-center text-[11px] text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} AMA AMA FIGURE ACTION. All rights reserved.</span>
          <span className="flex items-center gap-1 text-slate-400">
            Crafted for Anime Enthusiasts & Figure Collectors with <Heart className="w-3.5 h-3.5 text-[#FF2A6D] fill-current" />
          </span>
        </div>
      </div>
    </footer>
  );
};
