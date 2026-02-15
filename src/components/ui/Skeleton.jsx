import { motion } from 'framer-motion';

export default function Skeleton({ className = '', variant = 'rect' }) {
  const baseClasses = 'skeleton bg-gray-200 rounded';
  
  const variants = {
    rect: '',
    circle: 'rounded-full',
    text: 'h-4 w-full',
  };

  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm">
      <Skeleton className="w-full aspect-square" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array(count).fill(null).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="flex-shrink-0 w-24 flex flex-col items-center gap-2">
      <Skeleton className="w-20 h-20 rounded-full" />
      <Skeleton className="h-4 w-16" />
    </div>
  );
}

export function BannerSkeleton() {
  return <Skeleton className="w-full h-[300px] md:h-[500px] rounded-none" />;
}
