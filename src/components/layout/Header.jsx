import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ShoppingCart, 
  Menu, 
  X, 
  User,
  Heart,
  ChevronDown
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { categories } from '../../config/storeDefaults';

export default function Header() {
  const { storeConfig } = useStore();
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5 z-50">
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-[#1e3a5f] via-[#2d4a6f] to-[#1e3a5f] text-white text-xs py-2 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
          <p className="relative font-medium tracking-wide">✨ Frete grátis para compras acima de R$ 199 | Parcele em até 12x sem juros</p>
        </div>

        {/* Main Header */}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-white hover:text-[#3b82f6] transition-all hover:scale-110"
              aria-label="Menu"
            >
              <Menu size={24} />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              {storeConfig.logoUrl ? (
                <img 
                  src={storeConfig.logoUrl} 
                  alt={storeConfig.storeName}
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <span className="text-2xl font-black text-white tracking-tight transition-all group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-400" style={{fontFamily: "'Impact', 'Arial Black', sans-serif"}}>
                  {storeConfig.storeName}
                </span>
              )}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {categories.slice(0, 5).map((category) => (
                <Link
                  key={category.id}
                  to={`/catalog?category=${category.id}`}
                  className="relative px-4 py-2 text-gray-300 hover:text-white font-medium transition-all text-sm group"
                >
                  {category.name}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] group-hover:w-3/4 transition-all duration-300" />
                </Link>
              ))}
              <div className="relative group">
                <button className="flex items-center gap-1 px-4 py-2 text-gray-300 hover:text-white font-medium transition-all text-sm">
                  Mais <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-300" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-[#111111]/95 backdrop-blur-md border border-white/10 shadow-xl shadow-black/50 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
                  {categories.slice(5).map((category) => (
                    <Link
                      key={category.id}
                      to={`/catalog?category=${category.id}`}
                      className="block px-4 py-3 text-gray-300 hover:bg-gradient-to-r hover:from-[#1e3a5f]/50 hover:to-transparent hover:text-white transition-all"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-6">
              <div className="relative w-full group">
                <input
                  type="text"
                  placeholder="O que você procura?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-5 pr-12 py-2.5 bg-white/5 border border-white/10 rounded-full text-sm text-white placeholder-gray-500 focus:border-[#3b82f6]/50 focus:ring-2 focus:ring-[#3b82f6]/20 focus:bg-white/10 transition-all duration-300"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-white bg-[#1e3a5f]/50 hover:bg-[#1e3a5f] rounded-full transition-all duration-300"
                >
                  <Search size={16} />
                </button>
              </div>
            </form>

            {/* Right Icons */}
            <div className="flex items-center gap-1">
              {/* Mobile Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="md:hidden p-2.5 text-white hover:text-[#3b82f6] hover:bg-white/5 rounded-xl transition-all"
                aria-label="Buscar"
              >
                <Search size={22} />
              </button>

              {/* Favorites */}
              <Link
                to="/wishlist"
                className="relative hidden sm:flex p-2.5 text-white hover:text-[#3b82f6] hover:bg-white/5 rounded-xl transition-all"
                aria-label="Favoritos"
              >
                <Heart size={22} />
                {wishlistCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg shadow-red-500/30"
                  >
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </motion.span>
                )}
              </Link>

              {/* Admin (hidden) */}
              <Link
                to="/admin"
                className="p-2.5 text-gray-600 hover:text-gray-400 hover:bg-white/5 rounded-xl transition-all"
                aria-label="Admin"
              >
                <User size={22} />
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2.5 text-white hover:text-[#3b82f6] hover:bg-white/5 rounded-xl transition-all"
                aria-label="Carrinho"
              >
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-[#1e3a5f] to-[#3b82f6] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg shadow-blue-500/30"
                  >
                    {cartCount > 99 ? '99+' : cartCount}
                  </motion.span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 md:hidden"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              exit={{ y: -100 }}
              className="bg-[#0a0a0a] p-4 border-b border-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="flex-1 px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="p-3 text-gray-400"
                >
                  <X size={24} />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-[#0a0a0a]/95 backdrop-blur-md border-r border-white/10 z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-[#1e3a5f]/20 to-transparent">
                <span className="font-black text-lg text-white" style={{fontFamily: "'Impact', 'Arial Black', sans-serif"}}>{storeConfig.storeName}</span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <nav className="p-4">
                <p className="text-xs font-semibold text-[#3b82f6] uppercase mb-4 tracking-wider">Categorias</p>
                {categories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={`/catalog?category=${category.id}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 py-3 px-2 -mx-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <span className="text-xl">{category.icon}</span>
                      <span className="font-medium">{category.name}</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="p-4 border-t border-white/10 mt-4 bg-gradient-to-t from-[#1e3a5f]/10 to-transparent">
                <Link
                  to="/cart"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 py-3 px-2 -mx-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                >
                  <ShoppingCart size={20} />
                  <span>Carrinho</span>
                  {cartCount > 0 && (
                    <span className="ml-auto bg-[#1e3a5f] text-white text-xs px-2 py-0.5 rounded-full">{cartCount}</span>
                  )}
                </Link>
                <Link
                  to="/wishlist"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 py-3 px-2 -mx-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                >
                  <Heart size={20} />
                  <span>Favoritos</span>
                  {wishlistCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{wishlistCount}</span>
                  )}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="h-[88px]" />
    </>
  );
}
