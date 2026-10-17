import React from 'react';
import { Ticket, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { Voucher } from '../types';

interface VouchersSectionProps {
  vouchers: Voucher[];
  claimedVoucherIds: string[];
  onToggleClaim: (voucher: Voucher) => void;
}

export const VouchersSection: React.FC<VouchersSectionProps> = ({
  vouchers,
  claimedVoucherIds,
  onToggleClaim
}) => {
  return (
    <section className="max-w-6xl mx-auto px-3 sm:px-4 py-3">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-orange-500/20 text-orange-600 flex items-center justify-center border border-[#FF2A6D]/30">
            <Ticket className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 font-['Poppins'] flex items-center gap-1.5">
              Klaim Voucher Toko
              <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/30">
                HEMAT S/D RP150RB
              </span>
            </h2>
          </div>
        </div>
        <span className="text-[11px] text-slate-500 font-medium">
          {claimedVoucherIds.length} Voucher Terklaim
        </span>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent snap-x">
        {vouchers.map((voucher) => {
          const isClaimed = claimedVoucherIds.includes(voucher.id);

          return (
            <div
              key={voucher.id}
              className={`min-w-[260px] sm:min-w-[290px] flex-shrink-0 snap-start relative rounded-xl overflow-hidden border transition-all duration-200 ${
                isClaimed
                  ? 'bg-blue-50 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                  : 'bg-slate-50 border-slate-200/70 hover:border-slate-300'
              }`}
            >
              {/* Decorative side ticket notches */}
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-50 border-r border-slate-200" />
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-50 border-l border-slate-200" />

              <div className="p-3 sm:p-3.5 flex flex-col justify-between h-full pl-4 pr-4">
                <div>
                  {/* Badge & Code */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-orange-600 border border-pink-500/30">
                      {voucher.badge}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-slate-600">
                      {voucher.code}
                    </span>
                  </div>

                  {/* Title & Amount */}
                  <h3 className="text-base sm:text-lg font-black text-slate-900 font-['Poppins'] tracking-tight">
                    {voucher.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 mb-2 leading-relaxed">
                    {voucher.description}
                  </p>
                </div>

                {/* Footer details & Claim Button */}
                <div className="pt-2 border-t border-dashed border-slate-200 flex items-center justify-between gap-2 mt-auto">
                  <span className="text-[10px] text-slate-500 font-medium">
                    Exp: {voucher.validUntil}
                  </span>

                  <button
                    onClick={() => onToggleClaim(voucher)}
                    className={`text-xs font-black px-3 py-1.5 rounded-lg transition-all active:scale-95 flex items-center gap-1 ${
                      isClaimed
                        ? 'bg-blue-100 text-blue-600 border border-[#05D9E8]/50 hover:bg-cyan-500/30'
                        : 'bg-orange-500 hover:bg-[#ff3d7c] text-slate-900 shadow-sm shadow-pink-600/30'
                    }`}
                  >
                    {isClaimed ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Terklaim</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3" />
                        <span>Klaim Voucher</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
