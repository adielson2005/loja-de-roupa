import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  RefreshCw,
  ChevronRight,
  Minus,
  Plus,
  MessageCircle,
  Check
} from 'lucide-react';
import { getProduct, getProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { useWishlist } from '../context/WishlistContext';
import { Button, Badge } from '../components/ui';
import { ProductGrid } from '../components/product';
import { ProductGridSkeleton } from '../components/ui/Skeleton';
import toast from 'react-hot-toast';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { storeConfig } = useStore();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const response = await getProduct(id);
      setProduct(response.data);
      loadRelatedProducts(response.data.category);
    } catch (error) {
      // Mock data for demo
      const mockProduct = {
        id: parseInt(id),
        name: 'Vestido Floral Elegante Premium',
        description: 'Um vestido elegante e versátil, perfeito para diversas ocasiões. Confeccionado com tecido de alta qualidade que proporciona conforto e caimento impecável. Design exclusivo com estampa floral delicada que combina com qualquer estação.',
        price: 289.90,
        promoPrice: 199.90,
        category: 'Feminino',
        stock: 15,
        featured: true,
        sizes: ['PP', 'P', 'M', 'G', 'GG'],
        colors: ['#000000', '#FFFFFF', '#EC4899', '#3B82F6'],
        images: [
          'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600',
          'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600',
          'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600',
          'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600',
        ],
        specifications: [
          { label: 'Material', value: '100% Algodão' },
          { label: 'Modelo', value: 'Midi' },
          { label: 'Manga', value: 'Curta' },
          { label: 'Decote', value: 'V' },
        ],
      };
      setProduct(mockProduct);
      loadRelatedProducts(mockProduct.category);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedProducts = async (category) => {
    try {
      const response = await getProducts({ category, limit: 4 });
      const data = response.data;
      const productList = Array.isArray(data) ? data : (Array.isArray(data?.products) ? data.products : []);
      setRelatedProducts(productList);
    } catch (error) {
      // Mock related products
      setRelatedProducts([
        {
          id: 101,
          name: 'Vestido Midi Estampado',
          price: 199.90,
          category: 'Feminino',
          images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400'],
          colors: ['#EC4899', '#3B82F6'],
        },
        {
          id: 102,
          name: 'Blusa Cropped',
          price: 89.90,
          promoPrice: 69.90,
          category: 'Feminino',
          images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400'],
          colors: ['#FFFFFF', '#000000'],
        },
        {
          id: 103,
          name: 'Saia Plissada',
          price: 149.90,
          category: 'Feminino',
          images: ['https://images.unsplash.com/photo-1583496661160-fb5886a0aacc?w=400'],
          colors: ['#000000', '#EC4899'],
        },
        {
          id: 104,
          name: 'Calça Pantalona',
          price: 179.90,
          category: 'Feminino',
          images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400'],
          colors: ['#000000', '#6B7280'],
        },
      ]);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Por favor, selecione um tamanho');
      return;
    }
    if (product.colors?.length > 0 && !selectedColor) {
      toast.error('Por favor, selecione uma cor');
      return;
    }
    
    addToCart(product, quantity, selectedSize, selectedColor);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const handleWhatsApp = () => {
    const price = product.promoPrice || product.price;
    const message = encodeURIComponent(
      `Olá! Tenho interesse no produto:\n\n` +
      `*${product.name}*\n` +
      `Tamanho: ${selectedSize || 'Não selecionado'}\n` +
      `Cor: ${selectedColor || 'Não selecionada'}\n` +
      `Quantidade: ${quantity}\n` +
      `Valor: ${formatPrice(price * quantity)}`
    );
    window.open(`https://wa.me/${storeConfig.whatsappNumber}?text=${message}`, '_blank');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="skeleton aspect-square rounded-2xl bg-white/5" />
          <div className="space-y-4">
            <div className="skeleton h-8 w-3/4 bg-white/5 rounded-lg" />
            <div className="skeleton h-4 w-1/2 bg-white/5 rounded-lg" />
            <div className="skeleton h-12 w-1/3 bg-white/5 rounded-lg" />
            <div className="skeleton h-24 w-full bg-white/5 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-gray-400 mb-4">Produto não encontrado.</p>
        <Link to="/catalog">
          <Button>Ver catálogo</Button>
        </Link>
      </div>
    );
  }

  const discount = product.promoPrice 
    ? Math.round(((product.price - product.promoPrice) / product.price) * 100) 
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-16"
    >
      {/* Breadcrumb */}
      <div className="bg-white/5 py-3 border-b border-white/5">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-gray-400">
            <Link to="/" className="hover:text-[#3b82f6] transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/catalog" className="hover:text-[#3b82f6] transition-colors">Catálogo</Link>
            <ChevronRight size={14} />
            <Link to={`/catalog?category=${product.category?.toLowerCase()}`} className="hover:text-[#3b82f6] transition-colors">
              {product.category}
            </Link>
            <ChevronRight size={14} />
            <span className="text-white font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Swiper */}
            <Swiper
              modules={[Navigation, Pagination, Thumbs]}
              navigation
              pagination={{ clickable: true }}
              thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
              className="rounded-2xl overflow-hidden bg-white/5 border border-white/10"
            >
              {product.images?.map((image, index) => (
                <SwiperSlide key={index}>
                  <div className="aspect-square">
                    <img
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <Swiper
                modules={[Thumbs]}
                onSwiper={setThumbsSwiper}
                slidesPerView={4}
                spaceBetween={12}
                className="thumbs-swiper"
              >
                {product.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-[#3b82f6] cursor-pointer transition-all bg-white/5">
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>

          {/* Info */}
          <div>
            {/* Badges */}
            <div className="flex gap-2 mb-3">
              {product.promoPrice && <Badge variant="danger">-{discount}% OFF</Badge>}
              {product.featured && <Badge variant="secondary">⭐ Destaque</Badge>}
              {product.stock > 0 && product.stock <= 5 && (
                <Badge variant="warning">Últimas unidades!</Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {product.name}
            </h1>

            {/* Category */}
            <p className="text-gray-400 mb-4">{product.category}</p>

            {/* Price */}
            <div className="mb-6">
              {product.promoPrice ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl md:text-4xl font-bold text-[#3b82f6]">
                    {formatPrice(product.promoPrice)}
                  </span>
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                </div>
              ) : (
                <span className="text-3xl md:text-4xl font-bold text-white">
                  {formatPrice(product.price)}
                </span>
              )}
              <p className="text-sm text-gray-400 mt-1">
                ou 12x de {formatPrice((product.promoPrice || product.price) / 12)} sem juros
              </p>
              <p className="text-sm text-green-400 font-medium mt-1">
                💸 10% de desconto no PIX
              </p>
            </div>

            {/* Description */}
            <p className="text-gray-400 mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Size */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Tamanho: <span className="text-[#3b82f6]">{selectedSize || 'Selecione'}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[48px] h-12 px-4 rounded-xl border-2 font-semibold transition-all
                        ${selectedSize === size
                          ? 'bg-[#1e3a5f] text-white border-[#3b82f6]'
                          : 'border-white/20 text-gray-300 hover:border-[#3b82f6]/50 bg-white/5'
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Cor: <span className="text-[#3b82f6]">{selectedColor || 'Selecione'}</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 relative
                        ${selectedColor === color ? 'border-[#3b82f6] scale-110 ring-2 ring-[#3b82f6]/30' : 'border-white/20'}
                      `}
                      style={{ backgroundColor: color }}
                    >
                      {selectedColor === color && (
                        <Check 
                          size={20} 
                          className="absolute inset-0 m-auto" 
                          style={{ color: color === '#FFFFFF' || color === '#FFFF00' ? '#000' : '#FFF' }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Quantidade:
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-white/10 rounded-xl bg-white/5">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-12 text-center font-semibold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    disabled={quantity >= product.stock}
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {product.stock} disponíveis
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Button 
                size="xl" 
                fullWidth 
                icon={ShoppingCart}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                Adicionar ao Carrinho
              </Button>
              <Button 
                size="xl" 
                variant={isInWishlist(product.id) ? 'primary' : 'outline'}
                icon={Heart}
                className="sm:w-auto"
                onClick={() => toggleWishlist(product)}
              >
                <span className="sm:hidden">{isInWishlist(product.id) ? 'Favoritado' : 'Favoritar'}</span>
              </Button>
            </div>

            {/* WhatsApp */}
            <button
              onClick={handleWhatsApp}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-500/20"
            >
              <MessageCircle size={20} fill="white" />
              Comprar pelo WhatsApp
            </button>

            {/* Benefits */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                <Truck size={24} className="mx-auto text-[#3b82f6] mb-2" />
                <p className="text-xs text-gray-300">Frete Grátis</p>
                <p className="text-xs text-gray-500">acima de R$199</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                <Shield size={24} className="mx-auto text-[#3b82f6] mb-2" />
                <p className="text-xs text-gray-300">Compra Segura</p>
                <p className="text-xs text-gray-500">100% protegido</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                <RefreshCw size={24} className="mx-auto text-[#3b82f6] mb-2" />
                <p className="text-xs text-gray-300">Troca Fácil</p>
                <p className="text-xs text-gray-500">em até 30 dias</p>
              </div>
            </div>

            {/* Specifications */}
            {product.specifications && (
              <div className="mt-8 border-t border-white/10 pt-6">
                <h3 className="font-semibold text-white mb-4">Especificações</h3>
                <dl className="grid grid-cols-2 gap-3">
                  {product.specifications.map((spec, index) => (
                    <div key={index} className="flex justify-between py-2 border-b border-white/5">
                      <dt className="text-gray-500">{spec.label}</dt>
                      <dd className="font-medium text-white">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-8">
            Produtos Relacionados
          </h2>
          {relatedProducts.length > 0 ? (
            <ProductGrid products={relatedProducts} />
          ) : (
            <ProductGridSkeleton count={4} />
          )}
        </section>
      </div>
    </motion.div>
  );
}
