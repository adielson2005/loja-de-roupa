import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Star,
  Eye,
  EyeOff,
  Upload,
  X,
  Package
} from 'lucide-react';
import { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  toggleProductFeatured,
  toggleProductActive,
  uploadImage 
} from '../../services/api';
import { Button, Input, Modal, Badge } from '../../components/ui';
import { categories, sizes, colors } from '../../config/storeDefaults';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    promoPrice: '',
    category: '',
    stock: '',
    sizes: [],
    colors: [],
    images: [],
    featured: false,
    active: true,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await getProducts({ limit: 100 });
      const data = response.data;
      const productList = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
      setProducts(productList);
    } catch (error) {
      // Mock data
      setProducts([
        {
          id: 1,
          name: 'Vestido Floral Elegante',
          price: 189.90,
          promoPrice: 149.90,
          category: 'feminino',
          stock: 25,
          featured: true,
          active: true,
          images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200'],
        },
        {
          id: 2,
          name: 'Camisa Social Premium',
          price: 159.90,
          category: 'masculino',
          stock: 18,
          featured: false,
          active: true,
          images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=200'],
        },
        {
          id: 3,
          name: 'Conjunto Infantil',
          price: 129.90,
          promoPrice: 99.90,
          category: 'infantil',
          stock: 0,
          featured: true,
          active: false,
          images: ['https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=200'],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        promoPrice: product.promoPrice?.toString() || '',
        category: product.category,
        stock: product.stock.toString(),
        sizes: product.sizes || [],
        colors: product.colors || [],
        images: product.images || [],
        featured: product.featured,
        active: product.active,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        promoPrice: '',
        category: '',
        stock: '',
        sizes: [],
        colors: [],
        images: [],
        featured: false,
        active: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const toggleSize = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const toggleColor = (color) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    for (const file of files) {
      try {
        const response = await uploadImage(file);
        const url = response.data?.data?.url || response.data?.url || '';
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, url]
        }));
      } catch (error) {
        // Create local preview for demo
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, reader.result]
          }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      promoPrice: formData.promoPrice ? parseFloat(formData.promoPrice) : null,
      stock: parseInt(formData.stock),
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        toast.success('Produto atualizado!');
      } else {
        await createProduct(productData);
        toast.success('Produto criado!');
      }
      handleCloseModal();
      loadProducts();
    } catch (error) {
      // Demo mode
      if (editingProduct) {
        setProducts(prev => prev.map(p => 
          p.id === editingProduct.id ? { ...p, ...productData } : p
        ));
        toast.success('Produto atualizado!');
      } else {
        const newProduct = {
          id: Date.now(),
          ...productData,
          images: productData.images.length ? productData.images : ['https://via.placeholder.com/200'],
        };
        setProducts(prev => [newProduct, ...prev]);
        toast.success('Produto criado!');
      }
      handleCloseModal();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja realmente excluir este produto?')) return;

    try {
      await deleteProduct(id);
      toast.success('Produto excluído!');
      loadProducts();
    } catch (error) {
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Produto excluído!');
    }
  };

  const handleToggleFeatured = async (product) => {
    try {
      await toggleProductFeatured(product.id);
      loadProducts();
    } catch (error) {
      setProducts(prev => prev.map(p => 
        p.id === product.id ? { ...p, featured: !p.featured } : p
      ));
    }
    toast.success(product.featured ? 'Removido dos destaques' : 'Adicionado aos destaques');
  };

  const handleToggleActive = async (product) => {
    try {
      await toggleProductActive(product.id);
      loadProducts();
    } catch (error) {
      setProducts(prev => prev.map(p => 
        p.id === product.id ? { ...p, active: !p.active } : p
      ));
    }
    toast.success(product.active ? 'Produto desativado' : 'Produto ativado');
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Produtos</h1>
          <p className="text-gray-500">{products.length} produtos cadastrados</p>
        </div>
        <Button icon={Plus} onClick={() => handleOpenModal()}>
          Novo Produto
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg"
          />
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Carregando...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-8 text-center">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Nenhum produto encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Produto</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Categoria</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Preço</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Estoque</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images?.[0] || 'https://via.placeholder.com/60'}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-medium text-gray-800">{product.name}</p>
                          {product.featured && (
                            <Badge variant="secondary" size="sm">⭐ Destaque</Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">{product.category}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-800">{formatPrice(product.promoPrice || product.price)}</p>
                        {product.promoPrice && (
                          <p className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${product.stock === 0 ? 'text-red-500' : product.stock <= 5 ? 'text-yellow-500' : 'text-gray-800'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${product.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {product.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleFeatured(product)}
                          className={`p-2 rounded-lg transition-colors ${product.featured ? 'text-yellow-500 bg-yellow-50' : 'text-gray-400 hover:bg-gray-100'}`}
                          title={product.featured ? 'Remover destaque' : 'Destacar'}
                        >
                          <Star size={18} fill={product.featured ? 'currentColor' : 'none'} />
                        </button>
                        <button
                          onClick={() => handleToggleActive(product)}
                          className={`p-2 rounded-lg transition-colors ${product.active ? 'text-green-500 bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                          title={product.active ? 'Desativar' : 'Ativar'}
                        >
                          {product.active ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProduct ? 'Editar Produto' : 'Novo Produto'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nome do Produto *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Categoria *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="">Selecione</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Descrição</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Preço *"
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
            />
            <Input
              label="Preço Promocional"
              name="promoPrice"
              type="number"
              step="0.01"
              value={formData.promoPrice}
              onChange={handleChange}
            />
            <Input
              label="Estoque *"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              required
            />
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tamanhos</label>
            <div className="flex flex-wrap gap-2">
              {sizes.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors
                    ${formData.sizes.includes(size)
                      ? 'bg-primary text-white border-primary'
                      : 'border-gray-300 text-gray-700 hover:border-primary'
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cores</label>
            <div className="flex flex-wrap gap-2">
              {colors.map(color => (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => toggleColor(color.hex)}
                  title={color.name}
                  className={`w-8 h-8 rounded-full border-2 transition-transform
                    ${formData.colors.includes(color.hex) ? 'border-primary scale-110' : 'border-gray-200'}
                  `}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Imagens</label>
            <div className="flex flex-wrap gap-3">
              {formData.images.map((img, index) => (
                <div key={index} className="relative w-20 h-20">
                  <img src={img} alt="" className="w-full h-full object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                <Upload size={24} className="text-gray-400" />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Options */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4 text-primary rounded"
              />
              <span className="text-sm text-gray-700">Produto em destaque</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                className="w-4 h-4 text-primary rounded"
              />
              <span className="text-sm text-gray-700">Produto ativo</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" fullWidth onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="submit" fullWidth>
              {editingProduct ? 'Salvar Alterações' : 'Criar Produto'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
