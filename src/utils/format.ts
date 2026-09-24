export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount).replace(/\s/g, '');
}

export function formatCompactNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace('.0', '') + 'rb';
  }
  return num.toString();
}
