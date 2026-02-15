const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'Fashion Store'
  },
  slogan: {
    type: String,
    default: 'Vista-se com estilo'
  },
  logo: {
    type: String,
    default: '/logo.png'
  },
  favicon: {
    type: String,
    default: '/favicon.ico'
  },
  primaryColor: {
    type: String,
    default: '#ec4899'
  },
  secondaryColor: {
    type: String,
    default: '#8b5cf6'
  },
  whatsapp: {
    type: String,
    default: '5511999999999'
  },
  email: {
    type: String,
    default: 'contato@fashionstore.com'
  },
  address: {
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    zipCode: { type: String, default: '' }
  },
  socialMedia: {
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },
    tiktok: { type: String, default: '' },
    youtube: { type: String, default: '' }
  },
  shipping: {
    freeShippingMinValue: { type: Number, default: 299 },
    defaultShippingCost: { type: Number, default: 15.90 }
  },
  banners: [{
    image: String,
    title: String,
    subtitle: String,
    buttonText: String,
    buttonLink: String,
    active: { type: Boolean, default: true }
  }],
  seo: {
    title: { type: String, default: 'Fashion Store - Moda Feminina' },
    description: { type: String, default: 'As melhores roupas femininas com os melhores preços' },
    keywords: { type: String, default: 'moda, roupas, feminino, vestidos, blusas' }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Garante que só existe uma configuração de loja
storeSchema.statics.getConfig = async function() {
  let config = await this.findOne();
  if (!config) {
    config = await this.create({});
  }
  return config;
};

module.exports = mongoose.model('Store', storeSchema);
