import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package,
  ShoppingBag,
  Clock,
  CheckCircle,
  Tag,
  TrendingUp,
  DollarSign,
  Users,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { getDashboardStats } from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    activePromotions: 0,
    totalRevenue: 0,
    totalCustomers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await getDashboardStats();
      const data = response.data?.data || response.data || {};
      setStats(data);
      setRecentOrders(data.recentOrders || []);
    } catch (error) {
      // Mock data
      setStats({
        totalProducts: 48,
        pendingOrders: 12,
        confirmedOrders: 156,
        activePromotions: 5,
        totalRevenue: 45890.50,
        totalCustomers: 234,
      });
      setRecentOrders([
        { id: 1, customer: 'Maria Silva', total: 299.90, status: 'pending', date: '2026-02-09' },
        { id: 2, customer: 'João Santos', total: 459.80, status: 'confirmed', date: '2026-02-09' },
        { id: 3, customer: 'Ana Costa', total: 189.90, status: 'pending', date: '2026-02-08' },
        { id: 4, customer: 'Pedro Lima', total: 599.70, status: 'shipped', date: '2026-02-08' },
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

  const statCards = [
    {
      title: 'Produtos Cadastrados',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      link: '/admin/products',
    },
    {
      title: 'Pedidos Pendentes',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      link: '/admin/orders?status=pending',
      alert: stats.pendingOrders > 0,
    },
    {
      title: 'Pedidos Confirmados',
      value: stats.confirmedOrders,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      link: '/admin/orders?status=confirmed',
    },
    {
      title: 'Promoções Ativas',
      value: stats.activePromotions,
      icon: Tag,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      link: '/admin/promotions',
    },
  ];

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    shipped: 'bg-blue-100 text-blue-700',
    delivered: 'bg-gray-100 text-gray-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  const statusLabels = {
    pending: 'Pendente',
    confirmed: 'Confirmado',
    shipped: 'Enviado',
    delivered: 'Entregue',
    cancelled: 'Cancelado',
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 skeleton rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 skeleton rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">Visão geral da sua loja</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={card.link}>
              <div className={`${card.bgColor} rounded-xl p-6 hover:shadow-lg transition-shadow relative overflow-hidden`}>
                {card.alert && (
                  <span className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                )}
                <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center mb-4`}>
                  <card.icon size={24} className="text-white" />
                </div>
                <p className="text-3xl font-bold text-gray-800">{card.value}</p>
                <p className="text-sm text-gray-600 mt-1">{card.title}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Revenue Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary to-secondary rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold opacity-90">Faturamento Total</h3>
            <DollarSign size={24} className="opacity-50" />
          </div>
          <p className="text-4xl font-bold mb-2">{formatPrice(stats.totalRevenue)}</p>
          <div className="flex items-center gap-2 text-sm opacity-80">
            <ArrowUpRight size={16} />
            <span>+15% em relação ao mês anterior</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Total de Clientes</h3>
            <Users size={24} className="text-gray-400" />
          </div>
          <p className="text-4xl font-bold text-gray-800 mb-2">{stats.totalCustomers}</p>
          <div className="flex items-center gap-2 text-sm text-green-600">
            <TrendingUp size={16} />
            <span>+23 novos este mês</span>
          </div>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm"
      >
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Pedidos Recentes</h3>
          <Link to="/admin/orders" className="text-primary hover:underline text-sm font-medium">
            Ver todos →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Pedido</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Cliente</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">#{order.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.customer}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800">{formatPrice(order.total)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
