import React, { useState } from 'react';
import { Product } from '../types';

interface ProductArtworkProps {
  product: Product;
}

const categoryStyles: Record<Product['category'], { background: string; accent: string }> = {
  scale: { background: 'from-rose-100 via-white to-pink-200', accent: 'bg-rose-600' },
  nendoroid: { background: 'from-cyan-100 via-white to-sky-200', accent: 'bg-cyan-700' },
  gunpla: { background: 'from-slate-200 via-white to-blue-200', accent: 'bg-blue-800' },
  merch: { background: 'from-amber-100 via-white to-orange-200', accent: 'bg-orange-600' },
  tcg: { background: 'from-indigo-100 via-white to-cyan-100', accent: 'bg-indigo-700' },
};

export const ProductArtwork: React.FC<ProductArtworkProps> = ({ product }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const style = categoryStyles[product.category];
  const isVerifiedProductPhoto = product.image.startsWith('https://img.amiami.com/images/product/')
    || /^\/product-images\/.*\.(jpe?g)$/i.test(product.image);

  if (isVerifiedProductPhoto) {
    return (
      <div className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br ${style.background} p-3`}>
        {!imageFailed ? (
          <img
            src={product.image}
            alt={`${product.title} - foto produk`}
            referrerPolicy="no-referrer"
            loading="eager"
            onError={() => setImageFailed(true)}
            className="relative z-10 h-full w-full rounded-lg object-contain shadow-[0_14px_28px_-12px_rgba(15,23,42,0.35)] transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="relative z-10 flex h-full w-full items-center justify-center rounded-lg bg-white p-4 text-center text-sm font-black text-slate-700">
            {product.title}
          </div>
        )}
        <span className="absolute bottom-2 right-2 rounded-sm bg-white/85 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-slate-600">Foto produk</span>
      </div>
    );
  }

  if (product.category === 'tcg') {
    return (
      <div className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br ${style.background} p-3`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.95),transparent_58%)]" />
        {!imageFailed && (
          <img
            src={product.image}
            alt={`${product.title} - scan kartu`}
            referrerPolicy="no-referrer"
            loading="eager"
            onError={() => setImageFailed(true)}
            className="relative z-10 h-[92%] w-auto max-w-[72%] rounded-md object-contain shadow-[0_14px_28px_-12px_rgba(15,23,42,0.55)] transition-transform duration-300 group-hover:rotate-1 group-hover:scale-[1.03]"
          />
        )}
        {imageFailed && (
          <div className="relative z-10 flex aspect-[2/3] w-[58%] flex-col items-center justify-between rounded-lg border-[5px] border-amber-400 bg-slate-900 p-3 text-center text-white shadow-xl">
            <span className="text-[9px] font-black uppercase tracking-[0.16em]">Trading Card</span>
            <span className="text-sm font-black leading-tight">{product.series}</span>
            <span className="text-[10px] text-white/70">Card artwork unavailable</span>
          </div>
        )}
        <span className="absolute bottom-2 right-2 rounded-sm bg-white/80 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-slate-600">Card scan</span>
      </div>
    );
  }

  return (
    <div className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br ${style.background} p-3`}>
      <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full border border-white/70" />
      <div className="absolute -bottom-16 -left-10 h-44 w-44 rounded-full border border-white/70" />
      <div className="relative flex h-[94%] w-[76%] overflow-hidden rounded-[5px] border border-white/80 bg-slate-950 shadow-[7px_9px_18px_-7px_rgba(15,23,42,0.65)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-[-1deg]">
        <div className={`relative min-w-0 flex-1 overflow-hidden ${imageFailed ? 'bg-slate-900' : 'bg-slate-900'}`}>
          {!imageFailed && (
            <img
              src={product.image}
              alt={`${product.title} - visual konsep kemasan`}
              referrerPolicy="no-referrer"
              loading="lazy"
              onError={() => setImageFailed(true)}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent via-40% to-slate-950/95" />
          <div className="absolute inset-x-0 top-0 p-2 sm:p-2.5">
            <div className="flex items-center justify-between gap-1 text-[7px] sm:text-[8px] font-black uppercase tracking-[0.15em] text-white">
              <span>AMA AMA</span>
              <span className={`${style.accent} rounded-sm px-1.5 py-0.5 tracking-wider`}>{product.categoryName}</span>
            </div>
            <div className="mt-1 h-px bg-white/50" />
            <p className="mt-1 truncate text-[7px] sm:text-[8px] font-bold uppercase tracking-[0.12em] text-white/85">{product.series}</p>
          </div>
          {imageFailed && (
            <div className="absolute inset-0 flex items-center justify-center px-4 text-center text-white">
              <span className="text-xl font-black leading-tight">{product.series}</span>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 p-2 sm:p-2.5 text-white">
            <div className="mb-1 h-0.5 w-8 bg-white" />
            <p className="line-clamp-2 text-[10px] sm:text-xs font-black leading-tight">{product.title}</p>
            <p className="mt-1 text-[7px] sm:text-[8px] font-bold uppercase tracking-[0.15em] text-white/75">Collector series / visual concept</p>
          </div>
        </div>
        <div className={`flex w-[12%] items-center justify-center border-l border-white/30 ${style.accent}`}>
          <span className="[writing-mode:vertical-rl] text-[7px] font-black uppercase tracking-[0.2em] text-white/90">{product.series}</span>
        </div>
      </div>
      <span className="absolute bottom-2 right-2 rounded-sm bg-white/80 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-slate-600">Visual konsep</span>
    </div>
  );
};
