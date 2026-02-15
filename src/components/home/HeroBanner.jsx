import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Button } from '../ui';
import { BannerSkeleton } from '../ui/Skeleton';

export default function HeroBanner() {
  const { storeConfig, loading } = useStore();

  if (loading) {
    return <BannerSkeleton />;
  }

  // Floating particles animation
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 10,
    x: Math.random() * 100,
  }));

  return (
    <section className="relative w-full h-[350px] md:h-[550px] lg:h-[650px] overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${storeConfig.bannerUrl})` }}
      >
        {/* Multi-layer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
      </motion.div>

      {/* Animated floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-[#3b82f6]/30"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              bottom: '-10px',
            }}
            animate={{
              y: [0, -800],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Decorative glowing orbs */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-[#3b82f6]/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-[#1e3a5f]/30 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl text-white"
        >
          {/* Premium badge with glow effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#1e3a5f] to-[#3b82f6] text-white text-sm font-semibold rounded-full mb-6 shadow-lg shadow-[#3b82f6]/25"
          >
            <Sparkles size={16} className="animate-pulse" />
            <span>Nova Coleção 2026</span>
          </motion.div>

          {/* Main title with gradient text */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black leading-none mb-6 tracking-tight"
          >
            <span className="block text-white drop-shadow-2xl">DRIPS</span>
            <span className="block bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] bg-clip-text text-transparent">STORY</span>
          </motion.h1>

          {/* Subtitle with glassmorphism */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-4 mb-8 max-w-md"
          >
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
              A sua melhor loja de estilo! 🏆 
              <span className="text-[#3b82f6] font-semibold"> Streetwear</span> de qualidade com os melhores preços.
            </p>
          </motion.div>

          {/* CTA Buttons with hover effects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/catalog">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#1e3a5f] to-[#3b82f6] text-white font-bold rounded-xl shadow-lg shadow-[#3b82f6]/25 transition-all duration-300"
              >
                Ver Catálogo
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <Link to="/catalog?category=promocoes">
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 border-2 border-white/30 text-white font-bold rounded-xl backdrop-blur-sm hover:border-white/60 transition-all duration-300"
              >
                🏷️ Promoções
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Decorative side element */}
        <motion.div 
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="hidden lg:block absolute right-10 top-1/2 -translate-y-1/2"
        >
          <div className="relative">
            <div className="w-72 h-72 border-2 border-white/10 rounded-full" />
            <div className="absolute inset-4 border-2 border-[#3b82f6]/30 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
            <div className="absolute inset-8 border-2 border-white/5 rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl">🔥</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
      
      {/* Decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#3b82f6]/50 to-transparent" />
    </section>
  );
}
