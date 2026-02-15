const express = require('express');
const router = express.Router();
const Promotion = require('../models/Promotion');
const { auth, authorize } = require('../middleware/auth');

// GET /api/promotions - Lista promoções
router.get('/', async (req, res) => {
  try {
    const { active, homepage } = req.query;

    const filter = {};

    if (active === 'true') {
      const now = new Date();
      filter.isActive = true;
      filter.startDate = { $lte: now };
      filter.endDate = { $gte: now };
    }

    if (homepage === 'true') {
      filter.showOnHomepage = true;
    }

    const promotions = await Promotion.find(filter)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: promotions
    });
  } catch (error) {
    console.error('Erro ao buscar promoções:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar promoções'
    });
  }
});

// GET /api/promotions/validate/:code - Valida cupom
router.get('/validate/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const { subtotal } = req.query;

    const promotion = await Promotion.findOne({
      code: code.toUpperCase()
    });

    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Cupom não encontrado'
      });
    }

    if (!promotion.isValid()) {
      return res.status(400).json({
        success: false,
        message: 'Cupom inválido ou expirado'
      });
    }

    if (subtotal && parseFloat(subtotal) < promotion.minPurchase) {
      return res.status(400).json({
        success: false,
        message: `Valor mínimo de R$ ${promotion.minPurchase.toFixed(2)} para usar este cupom`
      });
    }

    const discount = promotion.calculateDiscount(parseFloat(subtotal) || 0);

    res.json({
      success: true,
      data: {
        code: promotion.code,
        type: promotion.type,
        value: promotion.value,
        discount,
        minPurchase: promotion.minPurchase,
        description: promotion.description
      }
    });
  } catch (error) {
    console.error('Erro ao validar cupom:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao validar cupom'
    });
  }
});

// GET /api/promotions/:id - Detalhes de uma promoção
router.get('/:id', async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);

    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promoção não encontrada'
      });
    }

    res.json({
      success: true,
      data: promotion
    });
  } catch (error) {
    console.error('Erro ao buscar promoção:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar promoção'
    });
  }
});

// POST /api/promotions - Cria promoção (admin)
router.post('/', auth, authorize('admin', 'manager'), async (req, res) => {
  try {
    const promotion = new Promotion(req.body);
    await promotion.save();

    res.status(201).json({
      success: true,
      message: 'Promoção criada com sucesso',
      data: promotion
    });
  } catch (error) {
    console.error('Erro ao criar promoção:', error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Já existe uma promoção com este código'
      });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro ao criar promoção'
    });
  }
});

// PUT /api/promotions/:id - Atualiza promoção (admin)
router.put('/:id', auth, authorize('admin', 'manager'), async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promoção não encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Promoção atualizada com sucesso',
      data: promotion
    });
  } catch (error) {
    console.error('Erro ao atualizar promoção:', error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Já existe uma promoção com este código'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar promoção'
    });
  }
});

// DELETE /api/promotions/:id - Remove promoção (admin)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);

    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promoção não encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Promoção removida com sucesso'
    });
  } catch (error) {
    console.error('Erro ao remover promoção:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao remover promoção'
    });
  }
});

// POST /api/promotions/:id/use - Incrementa uso do cupom
router.post('/:id/use', async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      { $inc: { usedCount: 1 } },
      { new: true }
    );

    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promoção não encontrada'
      });
    }

    res.json({
      success: true,
      data: promotion
    });
  } catch (error) {
    console.error('Erro ao registrar uso:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao registrar uso do cupom'
    });
  }
});

module.exports = router;
