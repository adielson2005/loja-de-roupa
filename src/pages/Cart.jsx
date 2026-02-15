import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight,
  Tag,
  ArrowLeft,
  Loader2,
  X,
  CheckCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui';
import { validateCoupon } from '../services/api';
import toast from 'react-hot-toast';

export default function Cart() {
  const navigate = useNavigate();
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    getCartTotal,
    getCartDiscount 
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const subtotal = getCartTotal();
  const productDiscount = getCartDiscount();
  const couponDiscount = appliedCoupon?.discount || 0;
  const totalDiscount = productDiscount + couponDiscount;
  const shipping = subtotal >= 199 ? 0 : 19.90;
  const total = subtotal + shipping - couponDiscount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Digite um código de cupom');
      return;
    }

    setCouponLoading(true);
    try {
      const response = await validateCoupon(couponCode, subtotal);
      const data = response.data?.data || response.data;
      
      setAppliedCoupon({
        code: data.code,
        discount: data.discount,
        description: data.description,
        type: data.type,
        value: data.value
      });
      setCouponCode('');
      toast.success(`Cupom "${data.code}" aplicado!`);
    } catch (error) {
      const message = error.response?.data?.message || 'Cupom inválido';
      toast.error(message);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    toast.success('Cupom removido');
  };

  if (cartItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[60vh] flex flex-col items-center justify-center px-4"
      >
        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
          <ShoppingBag size={48} className="text-gray-500" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Seu carrinho está vazio</h1>
        <p className="text-gray-400 mb-8">Que tal explorar nossos produtos?</p>
        <Link to="/catalog">
          <Button size="lg" icon={ArrowRight}>
            Ver Catálogo
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
              Meu Carrinho
            </h1>
            <p className="text-gray-400">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'}
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-sm text-red-400 hover:text-red-300 font-medium transition-colors"
          >
            Limpar carrinho
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item.cartId}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/[0.07] transition-all"
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    <Link to={`/product/${item.id}`} className="flex-shrink-0">
                      <img
                        src={item.images?.[0] || item.image || 'https://via.placeholder.com/120'}
                        alt={item.name}
                        className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-xl"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link 
                        to={`/product/${item.id}`}
                        className="font-semibold text-white hover:text-[#3b82f6] transition-colors line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-400">
                        {item.size && (
                          <span>Tamanho: <strong className="text-white">{item.size}</strong></span>
                        )}
                        {item.color && (
                          <span className="flex items-center gap-1">
                            Cor: 
                            <span 
                              className="w-4 h-4 rounded-full border border-white/20"
                              style={{ backgroundColor: item.color }}
                            />
                          </span>
                        )}
                      </div>

                      {/* Price - Mobile */}
                      <div className="mt-3 md:hidden">
                        {item.promoPrice ? (
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#3b82f6]">
                              {formatPrice(item.promoPrice)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(item.price)}
                            </span>
                          </div>
                        ) : (
                          <span className="font-bold text-white">
                            {formatPrice(item.price)}
                          </span>
                        )}
                      </div>

                      {/* Quantity - Mobile */}
                      <div className="flex items-center justify-between mt-4 md:hidden">
                        <div className="flex items-center border border-white/10 rounded-xl bg-white/5">
                          <button
                            onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.cartId)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Price & Actions - Desktop */}
                    <div className="hidden md:flex flex-col items-end justify-between">
                      <div className="text-right">
                        {item.promoPrice ? (
                          <>
                            <span className="text-lg font-bold text-[#3b82f6]">
                              {formatPrice(item.promoPrice * item.quantity)}
                            </span>
                            <span className="block text-sm text-gray-500 line-through">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-white">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-white/10 rounded-xl bg-white/5">
                          <button
                            onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-10 text-center font-semibold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.cartId)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Continue Shopping */}
            <Link 
              to="/catalog"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-[#3b82f6] transition-colors mt-4"
            >
              <ArrowLeft size={18} />
              Continuar comprando
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sticky top-24">
              <h2 className="text-lg font-bold text-white mb-6">
                Resumo do Pedido
              </h2>

              {/* Coupon */}
              <div className="mb-6">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={18} className="text-green-400" />
                      <div>
                        <span className="font-medium text-green-400">{appliedCoupon.code}</span>
                        <p className="text-xs text-green-500">-{formatPrice(appliedCoupon.discount)}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Cupom de desconto"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                      className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 uppercase focus:border-[#3b82f6]/50 focus:ring-2 focus:ring-[#3b82f6]/20 transition-all"
                    />
                    <Button 
                      variant="outline" 
                      size="md"
                      onClick={handleApplyCoupon}
                      disabled={couponLoading}
                    >
                      {couponLoading ? <Loader2 size={18} className="animate-spin" /> : 'Aplicar'}
                    </Button>
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="space-y-3 border-t border-white/10 pt-4">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">{formatPrice(subtotal + productDiscount)}</span>
                </div>
                
                {productDiscount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span className="flex items-center gap-1">
                      <Tag size={14} />
                      Desconto produtos
                    </span>
                    <span>-{formatPrice(productDiscount)}</span>
                  </div>
                )}

                {appliedCoupon && couponDiscount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span className="flex items-center gap-1">
                      <Tag size={14} />
                      Cupom ({appliedCoupon.code})
                    </span>
                    <span>-{formatPrice(couponDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-400">
                  <span>Frete</span>
                  {shipping === 0 ? (
                    <span className="text-green-400 font-medium">Grátis</span>
                  ) : (
                    <span className="text-white">{formatPrice(shipping)}</span>
                  )}
                </div>

                {shipping > 0 && (
                  <p className="text-xs text-gray-500">
                    Frete grátis para compras acima de R$ 199,00
                  </p>
                )}
              </div>

              {/* Total */}
              <div className="border-t border-white/10 mt-4 pt-4">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold text-white">Total</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-[#3b82f6]">
                      {formatPrice(total)}
                    </span>
                    <p className="text-xs text-gray-500">
                      ou 12x de {formatPrice(total / 12)}
                    </p>
                  </div>
                </div>

                <Button 
                  size="xl" 
                  fullWidth 
                  icon={ArrowRight}
                  onClick={() => navigate('/checkout')}
                >
                  Finalizar Pedido
                </Button>

                {/* Payment Methods */}
                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500 mb-3">Formas de pagamento</p>
                  <div className="flex justify-center gap-2 opacity-60">
                    <img src="https://cdn-icons-png.flaticon.com/128/349/349221.png" alt="Visa" className="h-6" />
                    <img src="https://cdn-icons-png.flaticon.com/128/349/349228.png" alt="Mastercard" className="h-6" />
                    <img src="https://cdn-icons-png.flaticon.com/128/14079/14079434.png" alt="PIX" className="h-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
