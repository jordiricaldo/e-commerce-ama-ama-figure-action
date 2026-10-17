import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppFloatingButton: React.FC = () => {
  return (
    <a
      href="https://wa.me/62881025277204?text=Halo%20Admin%20AMA%20AMA%20FIGURE%20ACTION,%20saya%20mau%20tanya%20stock%20atau%20konsultasi%20figure%20Jepang!"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-4 sm:right-6 z-30 flex items-center gap-2 py-2.5 px-3.5 sm:px-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-900 font-bold text-xs sm:text-sm shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/50 hover:scale-105 active:scale-95 transition-all group"
      aria-label="Konsultasi Pre-Order via WhatsApp"
    >
      <div className="relative">
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-300 rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-300 rounded-full" />
      </div>
      <span className="hidden sm:inline font-extrabold tracking-tight">Tanya Pre-Order</span>
      <span className="sm:hidden font-extrabold">CS WA</span>
    </a>
  );
};
