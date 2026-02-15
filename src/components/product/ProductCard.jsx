import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { Badge } from '../ui';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isFavorite = isInWishlist(product.id);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const discount = product.promoPrice 
    ? Math.round(((product.price - product.promoPrice) / product.price) * 100) 
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, product.sizes?.[0], product.colors?.[0]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <Link to={`/product/${product.id}`} className="block">
        <motion.div 
          whileHover={{ y: -8 }}
          transition={{ duration: 0.3 }}
          className="relative bg-[#111111] border border-gray-800/50 rounded-2xl overflow-hidden hover:border-[#3b82f6]/30 transition-all duration-500 hover:shadow-xl hover:shadow-[#3b82f6]/10"
        >
          {/* Glow effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#3b82f6]/0 to-[#3b82f6]/0 group-hover:from-[#3b82f6]/5 group-hover:to-transparent transition-all duration-500 pointer-events-none" />
          
          {/* Image Container */}
          <div className="relative aspect-[4/5] overflow-hidden">
            <img
              src={product.images?.[0] || product.image || 'https://via.placeholder.com/300'}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />

            {/* Premium gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.promoPrice && (
                <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-bold rounded-full shadow-lg">
                  -{discount}%
                </span>
              )}
              {product.featured && (
                <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-xs font-bold rounded-full shadow-lg">
                  ⭐ Destaque
                </span>
              )}
              {product.isNew && (
                <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                  Novo
                </span>
              )}
            </div>

            {/* Quick Actions */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleWishlist(product);
                }}
                className={`w-10 h-10 backdrop-blur-md bg-black/40 border border-white/10 rounded-xl shadow-lg flex items-center justify-center transition-all duration-300 ${
                  isFavorite ? 'text-red-500 bg-red-500/20' : 'text-white hover:bg-white/20'
                }`}
                aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              >
                <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 backdrop-blur-md bg-black/40 border border-white/10 rounded-xl shadow-lg flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
                aria-label="Ver produto"
              >
                <Eye size={18} />
              </motion.button>
            </div>

            {/* Add to Cart Button */}
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="w-full py-3 bg-gradient-to-r from-[#1e3a5f] to-[#3b82f6] text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#3b82f6]/25 hover:shadow-[#3b82f6]/40 transition-all duration-300"
              >
                <ShoppingCart size={18} />
                Adicionar ao Carrinho
              </motion.button>
            </div>

            {/* Out of Stock Overlay */}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                <span className="px-6 py-3 bg-[#111111] text-white font-bold rounded-xl border border-gray-700">
                  Esgotado
                </span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-5">
            <p className="text-xs text-[#3b82f6] font-semibold uppercase tracking-wider mb-2">
              {product.category}
            </p>
            <h3 className="font-bold text-white mb-3 line-clamp-2 group-hover:text-[#3b82f6] transition-colors duration-300 leading-tight">
              {product.name}
            </h3>
            
            {/* Price */}
            <div className="flex items-baseline gap-2 flex-wrap mb-2">
              {product.promoPrice ? (
                <>
                  <span className="text-xl font-black text-white">
                    {formatPrice(product.promoPrice)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                </>
              ) : (
                <span className="text-xl font-black text-white">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Installments */}
            <p className="text-xs text-gray-500">
              ou <span className="text-gray-400">12x</span> de <span className="text-gray-400">{formatPrice((product.promoPrice || product.price) / 12)}</span>
            </p>

            {/* Colors Preview */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-gray-800/50">
                {product.colors.slice(0, 4).map((color, i) => (
                  <span
                    key={i}
                    className="w-5 h-5 rounded-full border-2 border-gray-700 hover:scale-110 transition-transform cursor-pointer"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
                {product.colors.length > 4 && (
                  <span className="text-xs text-gray-500 ml-1 font-medium">
                    +{product.colors.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
