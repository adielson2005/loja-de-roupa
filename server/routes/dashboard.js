const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const Promotion = require('../models/Promotion');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// GET /api/dashboard/stats - Estatísticas do dashboard
router.get('/stats', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    // Contagens básicas
    const [
      totalProducts,
      activeProducts,
      totalOrders,
      pendingOrders,
      todayOrders,
      totalCustomers,
      activePromotions
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Order.countDocuments({ status: 'pendente' }),
      Order.countDocuments({ createdAt: { $gte: today } }),
      Order.distinct('customer.email').then(emails => emails.length),
      Promotion.countDocuments({ 
        isActive: true, 
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() }
      })
    ]);

    // Receita do mês atual
    const monthRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thisMonth },
          status: { $nin: ['cancelado'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ]);

    // Receita do mês anterior
    const lastMonthRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: lastMonth, $lte: lastMonthEnd },
          status: { $nin: ['cancelado'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ]);

    // Pedidos por status
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Vendas dos últimos 7 dias
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const salesLastWeek = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: lastWeek },
          status: { $nin: ['cancelado'] }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          total: { $sum: '$total' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Top produtos mais vendidos
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$items.name' },
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);

    // Pedidos recentes
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber customer.name total status createdAt');

    res.json({
      success: true,
      data: {
        totalProducts,
        activeProducts,
        totalOrders,
        pendingOrders,
        confirmedOrders: ordersByStatus.find(s => s._id === 'confirmado')?.count || 0,
        todayOrders,
        totalCustomers,
        activePromotions,
        totalRevenue: monthRevenue[0]?.total || 0,
        monthRevenue: monthRevenue[0]?.total || 0,
        lastMonthRevenue: lastMonthRevenue[0]?.total || 0,
        revenueGrowth: lastMonthRevenue[0]?.total 
          ? (((monthRevenue[0]?.total || 0) - lastMonthRevenue[0].total) / lastMonthRevenue[0].total * 100).toFixed(1)
          : 0,
        ordersByStatus: ordersByStatus.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        salesLastWeek,
        topProducts,
        recentOrders: recentOrders.map(order => ({
          id: order._id,
          orderNumber: order.orderNumber,
          customer: order.customer?.name || 'N/A',
          total: order.total,
          status: order.status,
          date: order.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar estatísticas do dashboard'
    });
  }
});

module.exports = router;
