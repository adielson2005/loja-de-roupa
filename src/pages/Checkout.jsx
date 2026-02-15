import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Phone, 
  MapPin, 
  CreditCard,
  CheckCircle,
  ArrowLeft,
  MessageCircle,
  Lock
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { createOrder } from '../services/api';
import { Button, Input } from '../components/ui';
import { paymentMethods } from '../config/storeDefaults';
import toast from 'react-hot-toast';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, getCartDiscount, clearCart } = useCart();
  const { storeConfig } = useStore();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'pix',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const subtotal = getCartTotal();
  const discount = getCartDiscount();
  const shipping = subtotal >= 199 ? 0 : 19.90;
  const pixDiscount = formData.paymentMethod === 'pix' ? subtotal * 0.1 : 0;
  const total = subtotal + shipping - pixDiscount;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
    if (formData.phone && !/^\d{10,11}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Telefone inválido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    if (cartItems.length === 0) {
      toast.error('Carrinho vazio');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        customer: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
        },
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.promoPrice || item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
        subtotal,
        discount: discount + pixDiscount,
        shipping,
        total,
      };

      await createOrder(orderData);
      
      // Send to WhatsApp
      sendToWhatsApp(orderData);
      
      // Clear cart
      clearCart();
      
      toast.success('Pedido realizado com sucesso!');
    } catch (error) {
      console.error('Order error:', error);
      // Even if API fails, send to WhatsApp
      const orderData = {
        customer: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
        },
        items: cartItems,
        paymentMethod: formData.paymentMethod,
        total,
      };
      sendToWhatsApp(orderData);
      clearCart();
    } finally {
      setLoading(false);
    }
  };

  const sendToWhatsApp = (orderData) => {
    const itemsText = cartItems
      .map(item => `• ${item.name} (${item.size || 'Único'}${item.color ? ', ' + item.color : ''}) x${item.quantity} - ${formatPrice((item.promoPrice || item.price) * item.quantity)}`)
      .join('\n');

    const message = encodeURIComponent(
      `🛒 *NOVO PEDIDO*\n\n` +
      `👤 *Cliente:* ${formData.name}\n` +
      `📱 *Telefone:* ${formData.phone}\n` +
      `${formData.address ? `📍 *Endereço:* ${formData.address}\n` : ''}` +
      `\n📦 *Itens:*\n${itemsText}\n\n` +
      `💳 *Pagamento:* ${paymentMethods.find(p => p.id === formData.paymentMethod)?.name}\n` +
      `${formData.notes ? `📝 *Observações:* ${formData.notes}\n` : ''}` +
      `\n💰 *Total:* ${formatPrice(total)}`
    );

    window.open(`https://wa.me/${storeConfig.whatsappNumber}?text=${message}`, '_blank');
    navigate('/');
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-8"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 text-gray-400 hover:text-[#3b82f6] mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            Voltar ao carrinho
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Finalizar Pedido
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <User size={20} className="text-[#3b82f6]" />
                  Dados Pessoais
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nome completo *"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    placeholder="Seu nome"
                    icon={User}
                  />
                  <Input
                    label="Telefone (WhatsApp) *"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    placeholder="(11) 99999-9999"
                    icon={Phone}
                  />
                </div>
              </div>

              {/* Address */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <MapPin size={20} className="text-[#3b82f6]" />
                  Endereço de Entrega (opcional)
                </h2>
                <Input
                  label="Endereço completo"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Rua, número, bairro, cidade"
                  icon={MapPin}
                />
              </div>

              {/* Payment Method */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <CreditCard size={20} className="text-[#3b82f6]" />
                  Forma de Pagamento
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`relative flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all
                        ${formData.paymentMethod === method.id
                          ? 'border-[#3b82f6] bg-[#3b82f6]/10'
                          : 'border-white/10 hover:border-[#3b82f6]/50 bg-white/5'
                        }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={formData.paymentMethod === method.id}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className="text-3xl mb-2">{method.icon}</span>
                      <span className="font-semibold text-white">{method.name}</span>
                      <span className="text-xs text-gray-400">{method.description}</span>
                      {formData.paymentMethod === method.id && (
                        <CheckCircle size={20} className="absolute top-2 right-2 text-[#3b82f6]" />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">
                  Observações (opcional)
                </h2>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Alguma observação sobre o pedido?"
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:border-[#3b82f6]/50 focus:ring-2 focus:ring-[#3b82f6]/20 transition-all"
                />
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sticky top-24">
              <h2 className="text-lg font-bold text-white mb-6">
                Resumo do Pedido
              </h2>

              {/* Items */}
              <div className="space-y-4 max-h-60 overflow-y-auto mb-6">
                {cartItems.map((item) => (
                  <div key={item.cartId} className="flex gap-3">
                    <img
                      src={item.images?.[0] || item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-xl"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.size && `Tam: ${item.size}`}
                        {item.color && ` • Cor: ${item.color}`}
                      </p>
                      <p className="text-sm text-gray-400">
                        {item.quantity}x {formatPrice(item.promoPrice || item.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="space-y-3 border-t border-white/10 pt-4">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">{formatPrice(subtotal + discount)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Desconto produtos</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}

                {pixDiscount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Desconto PIX (10%)</span>
                    <span>-{formatPrice(pixDiscount)}</span>
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
              </div>

              {/* Total */}
              <div className="border-t border-white/10 mt-4 pt-4">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold text-white">Total</span>
                  <span className="text-2xl font-bold text-[#3b82f6]">
                    {formatPrice(total)}
                  </span>
                </div>

                <Button 
                  type="submit"
                  size="xl" 
                  fullWidth 
                  icon={MessageCircle}
                  loading={loading}
                  onClick={handleSubmit}
                >
                  Finalizar Pedido
                </Button>

                <p className="text-xs text-center text-gray-500 mt-4 flex items-center justify-center gap-1">
                  <Lock size={12} />
                  Seus dados estão seguros
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
