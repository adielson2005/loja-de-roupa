const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: String,
  image: String,
  price: Number,
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  size: String,
  color: String
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true
  },
  customer: {
    name: {
      type: String,
      required: [true, 'Nome do cliente é obrigatório']
    },
    email: {
      type: String,
      required: [true, 'Email é obrigatório']
    },
    phone: {
      type: String,
      required: [true, 'Telefone é obrigatório']
    },
    cpf: String
  },
  shipping: {
    address: {
      type: String,
      required: true
    },
    number: String,
    complement: String,
    neighborhood: String,
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    }
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true
  },
  shippingCost: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['pix', 'cartao', 'boleto', 'whatsapp'],
    default: 'whatsapp'
  },
  status: {
    type: String,
    enum: ['pendente', 'confirmado', 'preparando', 'enviado', 'entregue', 'cancelado'],
    default: 'pendente'
  },
  statusHistory: [{
    status: String,
    date: { type: Date, default: Date.now },
    note: String
  }],
  trackingCode: String,
  notes: String,
  source: {
    type: String,
    enum: ['site', 'whatsapp', 'instagram'],
    default: 'site'
  }
}, {
  timestamps: true
});

// Gera número do pedido automaticamente
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const count = await mongoose.model('Order').countDocuments() + 1;
    this.orderNumber = `PED${year}${month}${count.toString().padStart(5, '0')}`;
  }
  next();
});

// Adiciona status ao histórico quando muda
orderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      date: new Date()
    });
  }
  next();
});

// Índices
orderSchema.index({ status: 1 });
orderSchema.index({ 'customer.email': 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
