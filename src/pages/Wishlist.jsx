import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Trash2, 
  ShoppingCart, 
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui';

export default function Wishlist() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
  };

  if (wishlist.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[60vh] flex flex-col items-center justify-center px-4"
      >
        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
          <Heart size={48} className="text-gray-500" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Sua lista de favoritos está vazia</h1>
        <p className="text-gray-400 mb-8">Adicione produtos que você gosta para comprá-los depois!</p>
        <Link to="/catalog">
          <Button size="lg" icon={ArrowRight}>
            Explorar Produtos
          </Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-8"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Meus Favoritos
            </h1>
            <p className="text-gray-400">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'itens'}
            </p>
          </div>
          <button
            onClick={clearWishlist}
            className="text-sm text-red-400 hover:text-red-300 font-medium transition-colors"
          >
            Limpar tudo
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {wishlist.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden group hover:bg-white/[0.07] transition-all"
              >
                <Link to={`/product/${product.id}`} className="block relative">
                  <img
                    src={product.image || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeFromWishlist(product.id);
                    }}
                    className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl text-red-400 hover:bg-red-500/20 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </Link>

                <div className="p-4">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-semibold text-white hover:text-[#3b82f6] transition-colors line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-2 mb-4">
                    {product.promoPrice ? (
                      <>
                        <span className="font-bold text-[#3b82f6] text-lg">
                          {formatPrice(product.promoPrice)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(product.price)}
                        </span>
                      </>
                    ) : (
                      <span className="font-bold text-white text-lg">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>

                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    icon={ShoppingCart}
                    onClick={() => handleAddToCart(product)}
                  >
                    Adicionar ao Carrinho
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Continue Shopping */}
        <div className="mt-8">
          <Link 
            to="/catalog"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#3b82f6] transition-colors"
          >
            <ArrowLeft size={18} />
            Continuar comprando
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
