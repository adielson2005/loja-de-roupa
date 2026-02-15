const express = require('express');
const router = express.Router();
const Store = require('../models/Store');
const { auth, adminOnly } = require('../middleware/auth');

// GET /api/store - Retorna configurações da loja (público)
router.get('/', async (req, res) => {
  try {
    const store = await Store.getConfig();
    
    // Formata a resposta para o frontend
    const config = {
      name: store.name,
      slogan: store.slogan,
      logo: store.logo,
      favicon: store.favicon,
      primaryColor: store.primaryColor,
      secondaryColor: store.secondaryColor,
      whatsapp: store.whatsapp,
      email: store.email,
      address: store.address,
      socialMedia: store.socialMedia,
      shipping: store.shipping,
      banners: store.banners.filter(b => b.active),
      seo: store.seo
    };

    res.json({
      success: true,
      data: config
    });
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar configurações da loja'
    });
  }
});

// PUT /api/store - Atualiza configurações (admin)
router.put('/', auth, adminOnly, async (req, res) => {
  try {
    const store = await Store.getConfig();
    
    // Campos permitidos para atualização
    const allowedFields = [
      'name', 'slogan', 'logo', 'favicon',
      'primaryColor', 'secondaryColor',
      'whatsapp', 'email', 'address',
      'socialMedia', 'shipping', 'banners', 'seo'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        store[field] = req.body[field];
      }
    });

    await store.save();

    res.json({
      success: true,
      message: 'Configurações atualizadas com sucesso',
      data: store
    });
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar configurações'
    });
  }
});

// POST /api/store/banners - Adiciona um banner
router.post('/banners', auth, adminOnly, async (req, res) => {
  try {
    const store = await Store.getConfig();
    store.banners.push(req.body);
    await store.save();

    res.status(201).json({
      success: true,
      message: 'Banner adicionado com sucesso',
      data: store.banners
    });
  } catch (error) {
    console.error('Erro ao adicionar banner:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao adicionar banner'
    });
  }
});

// DELETE /api/store/banners/:index - Remove um banner
router.delete('/banners/:index', auth, adminOnly, async (req, res) => {
  try {
    const store = await Store.getConfig();
    const index = parseInt(req.params.index);

    if (index < 0 || index >= store.banners.length) {
      return res.status(404).json({
        success: false,
        message: 'Banner não encontrado'
      });
    }

    store.banners.splice(index, 1);
    await store.save();

    res.json({
      success: true,
      message: 'Banner removido com sucesso'
    });
  } catch (error) {
    console.error('Erro ao remover banner:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao remover banner'
    });
  }
});

module.exports = router;
