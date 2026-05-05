import { useState } from 'react';
import { cn } from '@/lib/cn';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  aspect?: 'square' | 'portrait' | 'landscape' | 'wide';
  rounded?: boolean;
}

const aspectClasses: Record<NonNullable<ImageProps['aspect']>, string> = {
  square: 'aspect-square',
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
  wide: 'aspect-[16/9]',
};

export function Image({
  src,
  alt,
  aspect = 'square',
  rounded = false,
  className,
  loading = 'lazy',
  ...rest
}: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-ikea-gray-100',
        aspectClasses[aspect],
        rounded && 'rounded-lg',
        className,
      )}
    >
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-ikea-gray-100" aria-hidden />
      )}
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={cn(
          'h-full w-full object-cover transition-opacity duration-300',
          loaded ? 'opacity-100' : 'opacity-0',
        )}
        {...rest}
      />
    </div>
  );
}
