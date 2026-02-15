import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { ProductGridSkeleton } from '../ui/Skeleton';

export default function ProductGrid({ products, loading, columns = 4 }) {
  // Garantir que products seja sempre um array
  const productList = Array.isArray(products) ? products : [];

  if (loading) {
    return <ProductGridSkeleton count={8} />;
  }

  if (productList.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Nenhum produto encontrado.</p>
      </div>
    );
  }

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`grid ${gridCols[columns] || gridCols[4]} gap-4 md:gap-6`}
    >
      {productList.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </motion.div>
  );
}
