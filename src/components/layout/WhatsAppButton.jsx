import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export default function WhatsAppButton() {
  const { storeConfig } = useStore();

  const handleClick = () => {
    const message = encodeURIComponent('Olá! 👋 Vi a loja no site e gostaria de mais informações.');
    const url = `https://wa.me/${storeConfig.whatsappNumber}?text=${message}`;
    window.open(url, '_blank');
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring" }}
      className="fixed bottom-6 right-6 z-40"
    >
      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2 }}
        className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap"
      >
        <div className="bg-white text-gray-800 text-sm font-medium px-4 py-2 rounded-xl shadow-xl">
          Fale conosco! 💬
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 w-2 h-2 bg-white" />
        </div>
      </motion.div>
      
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-2xl shadow-lg shadow-green-500/30 flex items-center justify-center transition-all duration-300 hover:shadow-green-500/50"
        aria-label="WhatsApp"
      >
        <MessageCircle size={28} fill="white" />
        
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-2xl bg-green-500 animate-ping opacity-20" />
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-400/0 to-green-600/0 hover:from-green-400/20 hover:to-green-600/20 transition-all duration-300" />
      </motion.button>
    </motion.div>
  );
}
