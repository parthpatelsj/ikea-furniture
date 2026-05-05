import { Star } from 'lucide-react';

interface RatingProps {
  value: number;
  count?: number;
  size?: 'sm' | 'md';
}

export function Rating({ value, count, size = 'sm' }: RatingProps) {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);
  const cls = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

  return (
    <div className="flex items-center gap-1.5" aria-label={`Rated ${value} out of 5`}>
      <div className="flex" role="presentation">
        {stars.map((s) => {
          const filled = value >= s;
          const half = !filled && value >= s - 0.5;
          return (
            <Star
              key={s}
              aria-hidden
              className={cls}
              strokeWidth={1.5}
              fill={filled ? '#111111' : half ? 'url(#half)' : 'none'}
              color={filled || half ? '#111111' : '#959595'}
            />
          );
        })}
      </div>
      {count != null && (
        <span className="text-xs text-ikea-gray-600">({count.toLocaleString()})</span>
      )}
    </div>
  );
}
