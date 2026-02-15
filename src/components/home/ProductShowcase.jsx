import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Grid3X3, ArrowRight } from 'lucide-react';
import { getProducts } from '../../services/api';
import { ProductGrid } from '../product';
import { Button } from '../ui';

export default function ProductShowcase() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await getProducts({ limit: 12 });
      const data = response.data;
      const productList = Array.isArray(data) ? data : (Array.isArray(data?.products) ? data.products : []);
      setProducts(productList);
    } catch (error) {
      // Mock data for demo
      setProducts([
        {
          id: 9,
          name: 'Vestido Midi Estampado',
          price: 199.90,
          category: 'Feminino',
          images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400'],
          colors: ['#EC4899', '#3B82F6'],
          isNew: true,
        },
        {
          id: 10,
          name: 'Polo Masculina Classic',
          price: 119.90,
          category: 'Masculino',
          images: ['https://images.unsplash.com/photo-1625910513413-5fc1c35b4437?w=400'],
          colors: ['#22C55E', '#3B82F6', '#000000'],
        },
        {
          id: 11,
          name: 'Short Jeans Feminino',
          price: 89.90,
          promoPrice: 69.90,
          category: 'Feminino',
          images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400'],
          colors: ['#3B82F6'],
        },
        {
          id: 12,
          name: 'Camiseta Oversized',
          price: 79.90,
          category: 'Masculino',
          images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'],
          colors: ['#FFFFFF', '#000000', '#6B7280'],
          isNew: true,
        },
        {
          id: 13,
          name: 'Saia Plissada',
          price: 149.90,
          category: 'Feminino',
          images: ['https://images.unsplash.com/photo-1583496661160-fb5886a0uj2aa?w=400'],
          colors: ['#000000', '#EC4899'],
        },
        {
          id: 14,
          name: 'Bermuda Cargo',
          price: 139.90,
          promoPrice: 99.90,
          category: 'Masculino',
          images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400'],
          colors: ['#6B7280', '#22C55E'],
        },
        {
          id: 15,
          name: 'Sandália Rasteira',
          price: 89.90,
          category: 'Calçados',
          images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400'],
          colors: ['#8B4513', '#000000'],
        },
        {
          id: 16,
          name: 'Relógio Minimalista',
          price: 199.90,
          category: 'Acessórios',
          images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400'],
          colors: ['#000000', '#C0C0C0'],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-20 relative overflow-hidden">
      {/* Premium background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0f1419] to-[#0a0a0a]" />
      
      {/* Decorative elements */}
      <div className="absolute left-0 top-1/3 w-80 h-80 bg-[#1e3a5f]/10 rounded-full blur-[100px]" />
      <div className="absolute right-0 bottom-1/4 w-64 h-64 bg-[#3b82f6]/10 rounded-full blur-[80px]" />
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-[#111111] border border-gray-800 rounded-2xl flex items-center justify-center">
                <Grid3X3 className="text-[#3b82f6]" size={24} />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Vitrine
                </h2>
                <p className="text-gray-500 text-sm">
                  Explore nossa coleção completa
                </p>
              </div>
            </div>
          </div>
          <Link to="/catalog" className="mt-4 md:mt-0">
            <motion.button
              whileHover={{ x: 5 }}
              className="flex items-center gap-2 text-gray-400 hover:text-[#3b82f6] font-medium transition-colors"
            >
              Ver catálogo completo
              <ArrowRight size={18} />
            </motion.button>
          </Link>
        </motion.div>

        <ProductGrid products={products} loading={loading} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-14"
        >
          <Link to="/catalog">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.2)" }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-[#1e3a5f] to-[#3b82f6] text-white font-bold rounded-xl shadow-lg shadow-[#3b82f6]/20 transition-all duration-300"
            >
              Ver Todos os Produtos
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
