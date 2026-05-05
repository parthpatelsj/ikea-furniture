const formatters = new Map<string, Intl.NumberFormat>();

export function formatPrice(amount: number, currency = 'USD', locale = 'en-US'): string {
  const key = `${locale}-${currency}`;
  let nf = formatters.get(key);
  if (!nf) {
    nf = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    });
    formatters.set(key, nf);
  }
  return nf.format(amount);
}

export function formatDimension(value?: number): string {
  if (value == null) return '—';
  return `${value} cm`;
}

export function pluralize(n: number, singular: string, plural = `${singular}s`): string {
  return `${n} ${n === 1 ? singular : plural}`;
}
