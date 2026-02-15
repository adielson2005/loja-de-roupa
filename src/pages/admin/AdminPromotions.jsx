import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Edit2,
  Trash2,
  Tag,
  Calendar,
  Percent,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { 
  getPromotions, 
  createPromotion, 
  updatePromotion, 
  deletePromotion,
  togglePromotionActive
} from '../../services/api';
import { Button, Input, Modal, Badge } from '../../components/ui';
import toast from 'react-hot-toast';

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discountPercent: '',
    startDate: '',
    endDate: '',
    code: '',
    minPurchase: '',
    active: true,
  });

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      const response = await getPromotions();
      const data = response.data;
      const promoList = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
      setPromotions(promoList);
    } catch (error) {
      // Mock data
      setPromotions([
        {
          id: 1,
          name: 'Black Friday',
          description: 'Descontos especiais de Black Friday',
          discountPercent: 30,
          startDate: '2026-02-01',
          endDate: '2026-02-28',
          code: 'BLACK30',
          minPurchase: 100,
          active: true,
        },
        {
          id: 2,
          name: 'Verão 2026',
          description: 'Promoção de verão em toda loja',
          discountPercent: 20,
          startDate: '2026-01-01',
          endDate: '2026-03-31',
          code: 'VERAO20',
          minPurchase: 150,
          active: true,
        },
        {
          id: 3,
          name: 'Primeira Compra',
          description: 'Desconto para novos clientes',
          discountPercent: 15,
          startDate: '2026-01-01',
          endDate: '2026-12-31',
          code: 'BEMVINDO15',
          minPurchase: 0,
          active: false,
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleOpenModal = (promotion = null) => {
    if (promotion) {
      setEditingPromotion(promotion);
      setFormData({
        name: promotion.name,
        description: promotion.description || '',
        discountPercent: promotion.discountPercent.toString(),
        startDate: promotion.startDate,
        endDate: promotion.endDate,
        code: promotion.code || '',
        minPurchase: promotion.minPurchase?.toString() || '',
        active: promotion.active,
      });
    } else {
      setEditingPromotion(null);
      setFormData({
        name: '',
        description: '',
        discountPercent: '',
        startDate: '',
        endDate: '',
        code: '',
        minPurchase: '',
        active: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPromotion(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const promotionData = {
      ...formData,
      discountPercent: parseFloat(formData.discountPercent),
      minPurchase: formData.minPurchase ? parseFloat(formData.minPurchase) : 0,
    };

    try {
      if (editingPromotion) {
        await updatePromotion(editingPromotion.id, promotionData);
        toast.success('Promoção atualizada!');
      } else {
        await createPromotion(promotionData);
        toast.success('Promoção criada!');
      }
      handleCloseModal();
      loadPromotions();
    } catch (error) {
      // Demo mode
      if (editingPromotion) {
        setPromotions(prev => prev.map(p => 
          p.id === editingPromotion.id ? { ...p, ...promotionData } : p
        ));
        toast.success('Promoção atualizada!');
      } else {
        const newPromotion = {
          id: Date.now(),
          ...promotionData,
        };
        setPromotions(prev => [newPromotion, ...prev]);
        toast.success('Promoção criada!');
      }
      handleCloseModal();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja realmente excluir esta promoção?')) return;

    try {
      await deletePromotion(id);
      toast.success('Promoção excluída!');
      loadPromotions();
    } catch (error) {
      setPromotions(prev => prev.filter(p => p.id !== id));
      toast.success('Promoção excluída!');
    }
  };

  const handleToggleActive = async (promotion) => {
    try {
      await togglePromotionActive(promotion.id);
      loadPromotions();
    } catch (error) {
      setPromotions(prev => prev.map(p => 
        p.id === promotion.id ? { ...p, active: !p.active } : p
      ));
    }
    toast.success(promotion.active ? 'Promoção desativada' : 'Promoção ativada');
  };

  const isPromotionActive = (promotion) => {
    const now = new Date();
    const start = new Date(promotion.startDate);
    const end = new Date(promotion.endDate);
    return promotion.active && now >= start && now <= end;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Promoções</h1>
          <p className="text-gray-500">{promotions.length} promoções cadastradas</p>
        </div>
        <Button icon={Plus} onClick={() => handleOpenModal()}>
          Nova Promoção
        </Button>
      </div>

      {/* Promotions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(3).fill(null).map((_, i) => (
            <div key={i} className="skeleton h-64 rounded-xl" />
          ))
        ) : promotions.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Tag size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Nenhuma promoção cadastrada</p>
          </div>
        ) : (
          promotions.map((promotion) => (
            <motion.div
              key={promotion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-xl shadow-sm overflow-hidden ${!promotion.active ? 'opacity-60' : ''}`}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={isPromotionActive(promotion) ? 'success' : 'secondary'}>
                    {isPromotionActive(promotion) ? 'Ativa' : promotion.active ? 'Agendada' : 'Inativa'}
                  </Badge>
                  <span className="text-3xl font-bold">{promotion.discountPercent}%</span>
                </div>
                <h3 className="text-xl font-bold">{promotion.name}</h3>
              </div>

              {/* Content */}
              <div className="p-6">
                {promotion.description && (
                  <p className="text-gray-600 text-sm mb-4">{promotion.description}</p>
                )}

                <div className="space-y-3">
                  {promotion.code && (
                    <div className="flex items-center gap-3">
                      <Tag size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600">Código: <strong className="text-primary">{promotion.code}</strong></span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}
                    </span>
                  </div>

                  {promotion.minPurchase > 0 && (
                    <div className="flex items-center gap-3">
                      <Percent size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Mínimo: {formatPrice(promotion.minPurchase)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <button
                    onClick={() => handleToggleActive(promotion)}
                    className={`flex items-center gap-2 text-sm font-medium ${promotion.active ? 'text-green-600' : 'text-gray-400'}`}
                  >
                    {promotion.active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                    {promotion.active ? 'Ativa' : 'Inativa'}
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenModal(promotion)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(promotion.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Promotion Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingPromotion ? 'Editar Promoção' : 'Nova Promoção'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome da Promoção *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Descrição</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Desconto (%) *"
              name="discountPercent"
              type="number"
              min="1"
              max="100"
              value={formData.discountPercent}
              onChange={handleChange}
              required
            />
            <Input
              label="Código do Cupom"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="EX: PROMO20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Data Início *"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
            <Input
              label="Data Fim *"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>

          <Input
            label="Valor Mínimo de Compra (R$)"
            name="minPurchase"
            type="number"
            step="0.01"
            value={formData.minPurchase}
            onChange={handleChange}
            placeholder="0.00"
          />

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="w-4 h-4 text-primary rounded"
            />
            <span className="text-sm text-gray-700">Promoção ativa</span>
          </label>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" fullWidth onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="submit" fullWidth>
              {editingPromotion ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
