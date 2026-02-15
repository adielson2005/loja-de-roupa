import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  ChevronDown,
  Grid3X3,
  LayoutGrid,
  ArrowUpDown
} from 'lucide-react';
import { getProducts } from '../services/api';
import { ProductGrid } from '../components/product';
import { Button, Input, Modal } from '../components/ui';
import { ProductGridSkeleton } from '../components/ui/Skeleton';
import { categories, sizes, colors } from '../config/storeDefaults';

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [gridCols, setGridCols] = useState(4);

  // Filters
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    size: searchParams.get('size') || '',
    color: searchParams.get('color') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || '',
  });

  const sortOptions = [
    { value: '', label: 'Relevância' },
    { value: 'price_asc', label: 'Menor preço' },
    { value: 'price_desc', label: 'Maior preço' },
    { value: 'promo', label: 'Promoções' },
    { value: 'newest', label: 'Lançamentos' },
  ];

  useEffect(() => {
    loadProducts(true);
  }, [filters]);

  const loadProducts = async (reset = false) => {
    if (reset) {
      setPage(1);
      setLoading(true);
    }

    try {
      const params = {
        page: reset ? 1 : page,
        limit: 12,
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== '')),
      };

      const response = await getProducts(params);
      const data = response.data;
      const newProducts = Array.isArray(data) ? data : (Array.isArray(data?.products) ? data.products : []);
      
      if (reset) {
        setProducts(newProducts);
      } else {
        setProducts(prev => [...prev, ...newProducts]);
      }
      
      setTotalProducts(response.data.total || newProducts.length);
      setHasMore(newProducts.length === 12);
    } catch (error) {
      // Mock data for demo
      const mockProducts = generateMockProducts();
      setProducts(mockProducts);
      setTotalProducts(mockProducts.length);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const generateMockProducts = () => {
    const mockProducts = [];
    const categoryFilter = filters.category;
    const baseProducts = [
      { name: 'Vestido Floral', category: 'feminino', price: 189.90 },
      { name: 'Camisa Social', category: 'masculino', price: 159.90 },
      { name: 'Conjunto Infantil', category: 'infantil', price: 129.90 },
      { name: 'Bolsa de Couro', category: 'acessorios', price: 299.90 },
      { name: 'Tênis Esportivo', category: 'calcados', price: 349.90 },
      { name: 'Jaqueta Jeans', category: 'feminino', price: 249.90, promoPrice: 179.90 },
      { name: 'Calça Jogger', category: 'masculino', price: 179.90, promoPrice: 129.90 },
      { name: 'Camiseta Infantil', category: 'infantil', price: 59.90 },
    ];

    for (let i = 0; i < 16; i++) {
      const base = baseProducts[i % baseProducts.length];
      if (!categoryFilter || base.category === categoryFilter) {
        mockProducts.push({
          id: i + 1,
          name: `${base.name} ${i + 1}`,
          price: base.price + (i * 10),
          promoPrice: base.promoPrice ? base.promoPrice + (i * 5) : null,
          category: base.category,
          images: [`https://picsum.photos/400/400?random=${i}`],
          colors: ['#000000', '#FFFFFF', '#EF4444'],
          sizes: ['P', 'M', 'G'],
          stock: Math.floor(Math.random() * 50) + 1,
        });
      }
    }

    return mockProducts.slice(0, 12);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      size: '',
      color: '',
      minPrice: '',
      maxPrice: '',
      sortBy: '',
    });
    setSearchParams({});
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
    loadProducts(false);
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== '').length;

  const FilterSidebar = ({ mobile = false }) => (
    <div className={`space-y-6 ${mobile ? '' : 'sticky top-24'}`}>
      {/* Search */}
      <div>
        <label className="block text-sm font-semibold text-white mb-2">Buscar</label>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#1a1a1a] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/30"
          />
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-semibold text-white mb-2">Categoria</label>
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-gray-700 rounded-lg text-sm text-white focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/30"
        >
          <option value="">Todas</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Size */}
      <div>
        <label className="block text-sm font-semibold text-white mb-2">Tamanho</label>
        <div className="flex flex-wrap gap-2">
          {sizes.map(size => (
            <button
              key={size}
              onClick={() => handleFilterChange('size', filters.size === size ? '' : size)}
              className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors
                ${filters.size === size 
                  ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]' 
                  : 'border-gray-700 text-gray-400 hover:border-[#1e3a5f] hover:text-white'
                }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <label className="block text-sm font-semibold text-white mb-2">Cor</label>
        <div className="flex flex-wrap gap-2">
          {colors.map(color => (
            <button
              key={color.hex}
              onClick={() => handleFilterChange('color', filters.color === color.hex ? '' : color.hex)}
              title={color.name}
              className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110
                ${filters.color === color.hex ? 'border-[#3b82f6] scale-110' : 'border-gray-600'}
                ${color.hex === '#FFFFFF' ? 'border-gray-500' : ''}
              `}
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-semibold text-white mb-2">Faixa de Preço</label>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Mín"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500"
          />
          <span className="text-gray-500">-</span>
          <input
            type="number"
            placeholder="Máx"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500"
          />
        </div>
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button variant="outline" fullWidth onClick={clearFilters}>
          Limpar filtros ({activeFiltersCount})
        </Button>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#0a0a0a]"
    >
      {/* Header */}
      <div className="bg-[#111111] border-b border-gray-800 sticky top-[88px] z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-700 rounded-lg text-sm font-medium text-white"
            >
              <SlidersHorizontal size={18} />
              Filtros
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 bg-[#1e3a5f] text-white text-xs rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Results Count */}
            <p className="text-sm text-gray-400">
              <span className="font-semibold text-white">{totalProducts}</span> produtos encontrados
            </p>

            {/* Sort & View */}
            <div className="flex items-center gap-3">
              {/* Sort */}
              <div className="relative">
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-sm text-white focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/30"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* Grid Toggle - Desktop */}
              <div className="hidden md:flex items-center gap-1 border border-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setGridCols(3)}
                  className={`p-1.5 rounded text-gray-400 ${gridCols === 3 ? 'bg-[#1a1a1a] text-white' : ''}`}
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  onClick={() => setGridCols(4)}
                  className={`p-1.5 rounded text-gray-400 ${gridCols === 4 ? 'bg-[#1a1a1a] text-white' : ''}`}
                >
                  <Grid3X3 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar />
          </aside>

          {/* Products */}
          <div className="flex-1">
            {loading ? (
              <ProductGridSkeleton count={8} />
            ) : products.length > 0 ? (
              <>
                <ProductGrid products={products} columns={gridCols} />
                
                {hasMore && (
                  <div className="text-center mt-8">
                    <Button onClick={loadMore} variant="outline" size="lg">
                      Carregar mais produtos
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">Nenhum produto encontrado com os filtros selecionados.</p>
                <Button onClick={clearFilters} variant="outline">
                  Limpar filtros
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <Modal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filtros"
        size="full"
      >
        <FilterSidebar mobile />
        <div className="mt-6 flex gap-3">
          <Button variant="outline" fullWidth onClick={() => setIsFilterOpen(false)}>
            Cancelar
          </Button>
          <Button fullWidth onClick={() => setIsFilterOpen(false)}>
            Aplicar Filtros
          </Button>
        </div>
      </Modal>
    </motion.div>
  );
}
