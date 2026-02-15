import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tag, ArrowRight, Clock } from 'lucide-react';
import { getProducts } from '../../services/api';
import { ProductGrid } from '../product';
import { Button, Badge } from '../ui';

export default function PromotionSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    loadProducts();
    startCountdown();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await getProducts({ onSale: true, limit: 4 });
      const data = response.data;
      const productList = Array.isArray(data) ? data : (Array.isArray(data?.products) ? data.products : []);
      setProducts(productList);
    } catch (error) {
      // Mock data for demo
      setProducts([
        {
          id: 5,
          name: 'Jaqueta Jeans Vintage',
          price: 249.90,
          promoPrice: 179.90,
          category: 'Feminino',
          images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400'],
          colors: ['#3B82F6'],
        },
        {
          id: 6,
          name: 'Tênis Esportivo Running',
          price: 399.90,
          promoPrice: 299.90,
          category: 'Calçados',
          images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'],
          colors: ['#EF4444', '#000000'],
        },
        {
          id: 7,
          name: 'Blazer Feminino Elegante',
          price: 329.90,
          promoPrice: 229.90,
          category: 'Feminino',
          images: ['https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400'],
          colors: ['#000000', '#6B7280'],
        },
        {
          id: 8,
          name: 'Calça Jogger Masculina',
          price: 179.90,
          promoPrice: 129.90,
          category: 'Masculino',
          images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400'],
          colors: ['#000000', '#6B7280', '#22C55E'],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const startCountdown = () => {
    // Set end date to 3 days from now
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 3);

    const timer = setInterval(() => {
      const now = new Date();
      const diff = endDate - now;

      if (diff <= 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(timer);
  };

  const TimeBox = ({ value, label }) => (
    <div className="text-center">
      <motion.div 
        key={value}
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#0a0a0a]/80 backdrop-blur-sm text-white font-bold text-xl md:text-3xl px-4 py-3 rounded-xl border border-white/10 min-w-[55px] shadow-lg"
      >
        {String(value).padStart(2, '0')}
      </motion.div>
      <span className="text-xs text-white/70 mt-2 block font-medium uppercase tracking-wider">{label}</span>
    </div>
  );

  return (
    <section className="py-16 md:py-20">
      {/* Promo Banner - Premium Design */}
      <div className="relative overflow-hidden mb-16">
        {/* Multi-layer gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f] via-[#2563eb] to-[#3b82f6]" />
        <div className="absolute inset-0 opacity-30" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}} />
        
        {/* Glowing orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#1e3a5f]/50 rounded-full blur-[80px]" />
        
        <div className="container mx-auto px-4 py-12 md:py-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            {/* Premium badge */}
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6"
            >
              <Tag size={18} />
              <span className="font-semibold">Promoções da Semana</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 tracking-tight">
              Até <span className="text-yellow-300">50%</span> OFF
            </h2>
            <p className="text-white/80 mb-8 text-lg">
              Aproveite enquanto durar o estoque!
            </p>

            {/* Countdown - Premium Style */}
            <div className="flex items-center justify-center gap-4 md:gap-6 mb-10">
              <div className="flex items-center gap-3 md:gap-4 bg-black/20 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <Clock className="text-yellow-300" size={28} />
                <div className="flex items-center gap-2 md:gap-3">
                  <TimeBox value={timeLeft.days} label="Dias" />
                  <span className="text-white/50 text-3xl font-light">:</span>
                  <TimeBox value={timeLeft.hours} label="Horas" />
                  <span className="text-white/50 text-3xl font-light">:</span>
                  <TimeBox value={timeLeft.minutes} label="Min" />
                  <span className="text-white/50 text-3xl font-light">:</span>
                  <TimeBox value={timeLeft.seconds} label="Seg" />
                </div>
              </div>
            </div>

            <Link to="/catalog?category=promocoes">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 25px 50px rgba(0,0,0,0.3)" }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-4 bg-white text-[#1e3a5f] font-bold text-lg rounded-xl shadow-2xl hover:bg-gray-100 transition-colors"
              >
                🔥 Ver Ofertas
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Products with elegant section */}
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-[#3b82f6] font-semibold text-sm uppercase tracking-wider">Ofertas Especiais</span>
          <h3 className="text-2xl md:text-3xl font-bold text-white mt-2">Produtos em Promoção</h3>
        </motion.div>
        
        <ProductGrid products={products} loading={loading} />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to="/catalog?onSale=true">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-8 py-3 border-2 border-[#3b82f6]/30 text-[#3b82f6] font-semibold rounded-xl hover:bg-[#3b82f6]/10 hover:border-[#3b82f6]/50 transition-all duration-300"
            >
              Ver todas as promoções
              <ArrowRight size={18} />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
