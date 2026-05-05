import { cn } from '@/lib/cn';

type Variant = 'new' | 'sale' | 'bestseller' | 'oos';

const styles: Record<Variant, string> = {
  new: 'bg-ikea-blue text-white',
  sale: 'bg-ikea-yellow text-ikea-black',
  bestseller: 'bg-ikea-black text-white',
  oos: 'bg-ikea-gray-200 text-ikea-gray-600',
};

const labels: Record<Variant, string> = {
  new: 'New',
  sale: 'Lower price',
  bestseller: 'Bestseller',
  oos: 'Out of stock',
};

export function Badge({ variant, label }: { variant: Variant; label?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
        styles[variant],
      )}
    >
      {label ?? labels[variant]}
    </span>
  );
}
