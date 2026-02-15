import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Eye,
  Check,
  Truck,
  Package,
  X as XIcon,
  Clock,
  ChevronDown
} from 'lucide-react';
import { getOrders, updateOrderStatus } from '../../services/api';
import { Button, Modal, Badge } from '../../components/ui';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const loadOrders = async () => {
    try {
      const response = await getOrders({ status: statusFilter || undefined });
      const data = response.data;
      const orderList = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
      setOrders(orderList);
    } catch (error) {
      // Mock data
      setOrders([
        {
          id: 1,
          customer: { name: 'Maria Silva', phone: '11999999999', address: 'Rua das Flores, 123' },
          items: [
            { name: 'Vestido Floral', quantity: 1, price: 149.90, size: 'M', color: '#EC4899' },
            { name: 'Bolsa de Couro', quantity: 1, price: 299.90 },
          ],
          total: 449.80,
          status: 'pending',
          paymentMethod: 'pix',
          createdAt: '2026-02-09T14:30:00',
        },
        {
          id: 2,
          customer: { name: 'João Santos', phone: '11888888888', address: 'Av. Brasil, 456' },
          items: [
            { name: 'Camisa Social', quantity: 2, price: 159.90, size: 'G', color: '#FFFFFF' },
          ],
          total: 319.80,
          status: 'confirmed',
          paymentMethod: 'cartao',
          createdAt: '2026-02-09T10:15:00',
        },
        {
          id: 3,
          customer: { name: 'Ana Costa', phone: '11777777777' },
          items: [
            { name: 'Tênis Esportivo', quantity: 1, price: 299.90, size: '38', color: '#EF4444' },
          ],
          total: 299.90,
          status: 'shipped',
          paymentMethod: 'pix',
          createdAt: '2026-02-08T16:45:00',
        },
        {
          id: 4,
          customer: { name: 'Pedro Lima', phone: '11666666666', address: 'Rua Central, 789' },
          items: [
            { name: 'Jaqueta Jeans', quantity: 1, price: 179.90, size: 'M', color: '#3B82F6' },
            { name: 'Calça Jogger', quantity: 1, price: 129.90, size: 'M', color: '#000000' },
          ],
          total: 309.80,
          status: 'delivered',
          paymentMethod: 'dinheiro',
          createdAt: '2026-02-07T09:00:00',
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
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statusConfig = {
    pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    confirmed: { label: 'Confirmado', color: 'bg-green-100 text-green-700', icon: Check },
    shipped: { label: 'Enviado', color: 'bg-blue-100 text-blue-700', icon: Truck },
    delivered: { label: 'Entregue', color: 'bg-gray-100 text-gray-700', icon: Package },
    cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-700', icon: XIcon },
  };

  const paymentLabels = {
    pix: 'PIX',
    cartao: 'Cartão',
    dinheiro: 'Dinheiro',
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success('Status atualizado!');
      loadOrders();
    } catch (error) {
      setOrders(prev => prev.map(o => 
        o.id === orderId ? { ...o, status: newStatus } : o
      ));
      toast.success('Status atualizado!');
    }

    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => ({ ...prev, status: newStatus }));
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toString().includes(searchQuery);
    return matchesSearch;
  });

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Pedidos</h1>
        <p className="text-gray-500">{orders.length} pedidos no total</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter('')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${statusFilter === '' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Todos ({statusCounts.all})
          </button>
          {Object.entries(statusConfig).slice(0, 4).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${statusFilter === key ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {config.label} ({statusCounts[key] || 0})
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Buscar por nome ou nº do pedido..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg"
          />
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Carregando...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-8 text-center">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Nenhum pedido encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Pedido</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Cliente</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Itens</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Pagamento</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Data</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredOrders.map((order) => {
                  const StatusIcon = statusConfig[order.status]?.icon || Clock;
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-800">#{order.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-800">{order.customer.name}</p>
                        <p className="text-xs text-gray-500">{order.customer.phone}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-800">{formatPrice(order.total)}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {paymentLabels[order.paymentMethod]}
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative inline-block">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={`appearance-none pl-3 pr-8 py-1.5 rounded-full text-xs font-semibold cursor-pointer ${statusConfig[order.status]?.color}`}
                          >
                            {Object.entries(statusConfig).map(([key, config]) => (
                              <option key={key} value={key}>{config.label}</option>
                            ))}
                          </select>
                          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver detalhes"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Pedido #${selectedOrder?.id}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Dados do Cliente</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Nome</p>
                  <p className="font-medium">{selectedOrder.customer.name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Telefone</p>
                  <p className="font-medium">{selectedOrder.customer.phone}</p>
                </div>
                {selectedOrder.customer.address && (
                  <div className="col-span-2">
                    <p className="text-gray-500">Endereço</p>
                    <p className="font-medium">{selectedOrder.customer.address}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Items */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Itens do Pedido</h3>
              <div className="space-y-3">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          {item.size && `Tam: ${item.size}`}
                          {item.color && (
                            <span className="inline-flex items-center ml-2">
                              Cor: <span className="w-3 h-3 rounded-full ml-1" style={{ backgroundColor: item.color }} />
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(item.price)}</p>
                      <p className="text-xs text-gray-500">Qtd: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Forma de Pagamento</span>
                <span className="font-medium">{paymentLabels[selectedOrder.paymentMethod]}</span>
              </div>
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-primary">{formatPrice(selectedOrder.total)}</span>
              </div>
            </div>

            {/* Status Actions */}
            <div className="flex gap-3 pt-4 border-t">
              {selectedOrder.status === 'pending' && (
                <Button 
                  fullWidth 
                  variant="success"
                  onClick={() => handleStatusChange(selectedOrder.id, 'confirmed')}
                >
                  Confirmar Pedido
                </Button>
              )}
              {selectedOrder.status === 'confirmed' && (
                <Button 
                  fullWidth
                  onClick={() => handleStatusChange(selectedOrder.id, 'shipped')}
                >
                  Marcar como Enviado
                </Button>
              )}
              {selectedOrder.status === 'shipped' && (
                <Button 
                  fullWidth
                  onClick={() => handleStatusChange(selectedOrder.id, 'delivered')}
                >
                  Marcar como Entregue
                </Button>
              )}
              {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'delivered' && (
                <Button 
                  fullWidth 
                  variant="danger"
                  onClick={() => handleStatusChange(selectedOrder.id, 'cancelled')}
                >
                  Cancelar Pedido
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
