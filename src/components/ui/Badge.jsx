import { motion } from 'framer-motion';

export default function Badge({ 
  children, 
  variant = 'primary',
  size = 'md',
  pulse = false,
  className = '' 
}) {
  const variants = {
    primary: 'bg-gradient-to-r from-[#1e3a5f] to-[#3b82f6] text-white',
    secondary: 'bg-white/10 text-white border border-white/20',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white',
    danger: 'bg-gradient-to-r from-red-500 to-pink-500 text-white',
    info: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
    outline: 'border border-[#3b82f6]/50 text-[#3b82f6] bg-[#3b82f6]/10',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`
        inline-flex items-center font-bold rounded-full
        ${variants[variant]}
        ${sizes[size]}
        ${pulse ? 'animate-pulse' : ''}
        ${className}
      `}
    >
      {children}
    </motion.span>
  );
}
