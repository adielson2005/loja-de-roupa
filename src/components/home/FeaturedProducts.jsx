import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { getProducts } from '../../services/api';
import { ProductGrid } from '../product';
import { Button } from '../ui';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await getProducts({ featured: true, limit: 8 });
      const data = response.data;
      const productList = Array.isArray(data) ? data : (Array.isArray(data?.products) ? data.products : []);
      setProducts(productList);
    } catch (error) {
      // Mock data for demo
      setProducts([
        {
          id: 1,
          name: 'Vestido Floral Elegante',
          price: 189.90,
          promoPrice: 149.90,
          category: 'Feminino',
          featured: true,
          images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400'],
          colors: ['#000000', '#FFFFFF', '#EC4899'],
        },
        {
          id: 2,
          name: 'Camisa Social Premium',
          price: 159.90,
          category: 'Masculino',
          featured: true,
          images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400'],
          colors: ['#FFFFFF', '#3B82F6', '#000000'],
        },
        {
          id: 3,
          name: 'Conjunto Infantil Colorido',
          price: 129.90,
          promoPrice: 99.90,
          category: 'Infantil',
          featured: true,
          images: ['https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400'],
          colors: ['#EF4444', '#22C55E', '#3B82F6'],
        },
        {
          id: 4,
          name: 'Bolsa de Couro Premium',
          price: 299.90,
          category: 'Acessórios',
          featured: true,
          images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400'],
          colors: ['#000000', '#8B4513'],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-20 relative">
      {/* Background decoration */}
      <div className="absolute right-0 top-1/4 w-96 h-96 bg-[#3b82f6]/5 rounded-full blur-[100px]" />
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#3b82f6] to-[#60a5fa] rounded-2xl flex items-center justify-center shadow-lg shadow-[#3b82f6]/25">
                <Sparkles className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Destaques
                </h2>
                <p className="text-gray-500 text-sm">
                  Produtos selecionados especialmente para você
                </p>
              </div>
            </div>
          </div>
          <Link to="/catalog?featured=true" className="mt-4 md:mt-0">
            <motion.button
              whileHover={{ x: 5 }}
              className="flex items-center gap-2 text-gray-400 hover:text-[#3b82f6] font-medium transition-colors"
            >
              Ver todos
              <ArrowRight size={18} />
            </motion.button>
          </Link>
        </motion.div>

        <ProductGrid products={products} loading={loading} />
      </div>
    </section>
  );
}
