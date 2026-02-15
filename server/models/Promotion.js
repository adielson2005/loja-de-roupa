const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Título é obrigatório']
  },
  description: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed', 'freeShipping', 'buyXgetY'],
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  code: {
    type: String,
    unique: true,
    sparse: true,
    uppercase: true
  },
  minPurchase: {
    type: Number,
    default: 0
  },
  maxDiscount: {
    type: Number,
    default: null
  },
  usageLimit: {
    type: Number,
    default: null
  },
  usedCount: {
    type: Number,
    default: 0
  },
  applicableCategories: [{
    type: String
  }],
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  banner: {
    image: String,
    backgroundColor: { type: String, default: '#ec4899' },
    textColor: { type: String, default: '#ffffff' }
  },
  showOnHomepage: {
    type: Boolean,
    default: false
  },
  showCountdown: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Verifica se a promoção está válida
promotionSchema.methods.isValid = function() {
  const now = new Date();
  return (
    this.isActive &&
    now >= this.startDate &&
    now <= this.endDate &&
    (this.usageLimit === null || this.usedCount < this.usageLimit)
  );
};

// Calcula o desconto
promotionSchema.methods.calculateDiscount = function(subtotal) {
  if (!this.isValid()) return 0;
  if (subtotal < this.minPurchase) return 0;

  let discount = 0;

  switch (this.type) {
    case 'percentage':
      discount = (subtotal * this.value) / 100;
      break;
    case 'fixed':
      discount = this.value;
      break;
    case 'freeShipping':
      // Retorna o valor do frete (será tratado no checkout)
      return 'freeShipping';
    default:
      discount = 0;
  }

  // Aplica limite máximo se existir
  if (this.maxDiscount && discount > this.maxDiscount) {
    discount = this.maxDiscount;
  }

  return Math.min(discount, subtotal);
};

// Índices
promotionSchema.index({ isActive: 1 });
promotionSchema.index({ startDate: 1, endDate: 1 });
promotionSchema.index({ showOnHomepage: 1 });

module.exports = mongoose.model('Promotion', promotionSchema);
