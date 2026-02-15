import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { categories } from '../../config/storeDefaults';

export default function CategoryCarousel() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-12 md:py-16 relative">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a]" />
      
      <div className="container mx-auto px-4 relative">
        {/* Section header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1e3a5f] to-[#3b82f6] rounded-xl flex items-center justify-center">
              <Layers size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white">
                Categorias
              </h2>
              <p className="text-sm text-gray-500">Encontre o que procura</p>
            </div>
          </div>
          <div className="hidden md:flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scroll('left')}
              className="w-11 h-11 bg-[#111111] border border-gray-800 hover:border-[#3b82f6] hover:bg-[#1a1a1a] text-gray-400 hover:text-white rounded-xl flex items-center justify-center transition-all duration-300"
              aria-label="Anterior"
            >
              <ChevronLeft size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scroll('right')}
              className="w-11 h-11 bg-[#111111] border border-gray-800 hover:border-[#3b82f6] hover:bg-[#1a1a1a] text-gray-400 hover:text-white rounded-xl flex items-center justify-center transition-all duration-300"
              aria-label="Próximo"
            >
              <ChevronRight size={20} />
            </motion.button>
          </div>
        </motion.div>

        <div
          ref={scrollRef}
          className="flex gap-5 md:gap-6 overflow-x-auto hide-scrollbar pb-4 -mx-4 px-4"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={`/catalog?category=${category.id}`}
                className="flex flex-col items-center gap-3 flex-shrink-0 group"
              >
                <motion.div 
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="relative"
                >
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-[#3b82f6]/0 group-hover:bg-[#3b82f6]/20 rounded-2xl blur-xl transition-all duration-500" />
                  
                  <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-2 border-gray-800 group-hover:border-[#3b82f6]/50 transition-all duration-300 shadow-lg group-hover:shadow-[#3b82f6]/20">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Icon */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-2xl">
                      {category.icon}
                    </div>
                  </div>
                </motion.div>
                <span className="text-sm font-semibold text-gray-400 group-hover:text-white transition-colors text-center">
                  {category.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
