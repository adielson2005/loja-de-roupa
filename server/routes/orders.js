const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth, authorize } = require('../middleware/auth');

// GET /api/orders - Lista pedidos (admin)
router.get('/', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      startDate,
      endDate,
      search
    } = req.query;

    const filter = {};

    if (status) filter.status = status;

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Order.countDocuments(filter);

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('items.product', 'name images');

    res.json({
      success: true,
      data: orders,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar pedidos'
    });
  }
});

// GET /api/orders/stats - Estatísticas de pedidos (admin)
router.get('/stats', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    // Total de pedidos
    const totalOrders = await Order.countDocuments();

    // Pedidos de hoje
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today }
    });

    // Pedidos pendentes
    const pendingOrders = await Order.countDocuments({
      status: 'pendente'
    });

    // Receita do mês
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

    res.json({
      success: true,
      data: {
        totalOrders,
        todayOrders,
        pendingOrders,
        monthRevenue: monthRevenue[0]?.total || 0,
        lastMonthRevenue: lastMonthRevenue[0]?.total || 0,
        ordersByStatus: ordersByStatus.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        salesLastWeek
      }
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar estatísticas'
    });
  }
});

// GET /api/orders/:id - Detalhes de um pedido
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      $or: [
        { _id: req.params.id },
        { orderNumber: req.params.id }
      ]
    }).populate('items.product', 'name images slug');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar pedido'
    });
  }
});

// POST /api/orders - Cria novo pedido (público)
router.post('/', async (req, res) => {
  try {
    const { customer, shipping, items, paymentMethod, notes } = req.body;

    // Valida e busca produtos
    const productIds = items.map(item => item.product);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== items.length) {
      return res.status(400).json({
        success: false,
        message: 'Um ou mais produtos não foram encontrados'
      });
    }

    // Monta os items do pedido com preços atuais
    const orderItems = items.map(item => {
      const product = products.find(p => p._id.toString() === item.product);
      return {
        product: product._id,
        name: product.name,
        image: product.images[0],
        price: product.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color
      };
    });

    // Calcula totais
    const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = subtotal >= 299 ? 0 : 15.90; // Frete grátis acima de R$ 299
    const total = subtotal + shippingCost;

    // Cria o pedido
    const order = new Order({
      customer,
      shipping,
      items: orderItems,
      subtotal,
      shippingCost,
      total,
      paymentMethod: paymentMethod || 'whatsapp',
      notes,
      source: 'site'
    });

    await order.save();

    // Atualiza estoque e vendidos
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          stock: -item.quantity,
          sold: item.quantity
        }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Pedido criado com sucesso',
      data: {
        orderNumber: order.orderNumber,
        total: order.total,
        _id: order._id
      }
    });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro ao criar pedido'
    });
  }
});

// PUT /api/orders/:id/status - Atualiza status (admin)
router.put('/:id/status', auth, authorize('admin', 'manager', 'staff'), async (req, res) => {
  try {
    const { status, note, trackingCode } = req.body;

    const validStatuses = ['pendente', 'confirmado', 'preparando', 'enviado', 'entregue', 'cancelado'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status inválido'
      });
    }

    const update = { status };
    if (trackingCode) update.trackingCode = trackingCode;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    // Adiciona nota ao histórico se fornecida
    if (note) {
      order.statusHistory[order.statusHistory.length - 1].note = note;
      await order.save();
    }

    res.json({
      success: true,
      message: 'Status atualizado com sucesso',
      data: order
    });
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar status'
    });
  }
});

module.exports = router;
