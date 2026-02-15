const mongoose = require('mongoose');
require('dotenv').config();

const { Store, Product, User, Promotion } = require('./models');

// Função para gerar slug
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Função para gerar SKU
const generateSKU = (category) => {
  const prefix = category.substring(0, 3).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${random}`;
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');

    // Limpa dados existentes
    await Promise.all([
      Store.deleteMany({}),
      Product.deleteMany({}),
      User.deleteMany({}),
      Promotion.deleteMany({})
    ]);
    console.log('🗑️  Dados anteriores removidos');

    // Cria configuração da loja
    const store = await Store.create({
      name: 'Fashion Store',
      slogan: 'Vista-se com estilo e elegância',
      logo: '/logo.png',
      primaryColor: '#ec4899',
      secondaryColor: '#8b5cf6',
      whatsapp: '5511999999999',
      email: 'contato@fashionstore.com',
      address: {
        street: 'Rua das Flores',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567'
      },
      socialMedia: {
        instagram: 'https://instagram.com/fashionstore',
        facebook: 'https://facebook.com/fashionstore',
        tiktok: 'https://tiktok.com/@fashionstore'
      },
      shipping: {
        freeShippingMinValue: 299,
        defaultShippingCost: 15.90
      },
      banners: [
        {
          image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920',
          title: 'Nova Coleção Verão',
          subtitle: 'Até 50% OFF em peças selecionadas',
          buttonText: 'Comprar Agora',
          buttonLink: '/catalogo?tags=verao',
          active: true
        },
        {
          image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920',
          title: 'Frete Grátis',
          subtitle: 'Em compras acima de R$ 299',
          buttonText: 'Aproveitar',
          buttonLink: '/catalogo',
          active: true
        }
      ],
      seo: {
        title: 'Fashion Store - Moda Feminina Online',
        description: 'As melhores roupas femininas com preços incríveis. Vestidos, blusas, calças e muito mais!',
        keywords: 'moda feminina, roupas, vestidos, blusas, calças, fashion'
      }
    });
    console.log('🏪 Configuração da loja criada');

    // Cria usuário admin
    const admin = await User.create({
      name: 'Administrador',
      email: 'admin@loja.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('👤 Usuário admin criado');
    console.log('   📧 Email: admin@loja.com');
    console.log('   🔑 Senha: admin123');

    // Produtos de exemplo
    const products = [
      // Vestidos
      {
        name: 'Vestido Floral Verão',
        description: 'Vestido leve e elegante com estampa floral, perfeito para dias quentes. Tecido leve e confortável.',
        price: 189.90,
        originalPrice: 249.90,
        images: [
          'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
          'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800'
        ],
        category: 'vestidos',
        sizes: ['P', 'M', 'G', 'GG'],
        colors: [
          { name: 'Rosa', hex: '#FFC0CB' },
          { name: 'Azul', hex: '#87CEEB' }
        ],
        stock: 25,
        tags: ['verão', 'floral', 'leve'],
        badges: ['promoção', 'mais-vendido'],
        featured: true,
        rating: { average: 4.8, count: 124 }
      },
      {
        name: 'Vestido Midi Elegante',
        description: 'Vestido midi sofisticado, ideal para ocasiões especiais. Corte ajustado que valoriza a silhueta.',
        price: 259.90,
        images: [
          'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800'
        ],
        category: 'vestidos',
        sizes: ['PP', 'P', 'M', 'G'],
        colors: [
          { name: 'Preto', hex: '#000000' },
          { name: 'Vinho', hex: '#722F37' }
        ],
        stock: 15,
        tags: ['elegante', 'festa', 'midi'],
        badges: ['novo'],
        featured: true,
        rating: { average: 4.9, count: 87 }
      },
      // Blusas
      {
        name: 'Blusa Cropped Básica',
        description: 'Blusa cropped versátil, combina com tudo! Tecido macio e confortável para o dia a dia.',
        price: 79.90,
        images: [
          'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800'
        ],
        category: 'blusas',
        sizes: ['PP', 'P', 'M', 'G', 'GG'],
        colors: [
          { name: 'Branco', hex: '#FFFFFF' },
          { name: 'Preto', hex: '#000000' },
          { name: 'Rosa', hex: '#FFC0CB' }
        ],
        stock: 50,
        tags: ['básico', 'casual', 'cropped'],
        badges: ['mais-vendido'],
        featured: true,
        rating: { average: 4.6, count: 256 }
      },
      {
        name: 'Camisa Social Feminina',
        description: 'Camisa social clássica com tecido premium. Perfeita para looks de trabalho ou eventos.',
        price: 149.90,
        originalPrice: 179.90,
        images: [
          'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800'
        ],
        category: 'blusas',
        sizes: ['P', 'M', 'G'],
        colors: [
          { name: 'Branco', hex: '#FFFFFF' },
          { name: 'Azul Claro', hex: '#ADD8E6' }
        ],
        stock: 30,
        tags: ['social', 'trabalho', 'elegante'],
        badges: ['promoção'],
        featured: false,
        rating: { average: 4.7, count: 98 }
      },
      // Calças
      {
        name: 'Calça Jeans Skinny',
        description: 'Calça jeans skinny com elastano para maior conforto. Modelagem que valoriza o corpo.',
        price: 199.90,
        images: [
          'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800'
        ],
        category: 'calças',
        sizes: ['36', '38', '40', '42', '44'],
        colors: [
          { name: 'Azul Escuro', hex: '#00008B' },
          { name: 'Azul Claro', hex: '#ADD8E6' }
        ],
        stock: 40,
        tags: ['jeans', 'skinny', 'casual'],
        badges: ['mais-vendido'],
        featured: true,
        rating: { average: 4.5, count: 312 }
      },
      {
        name: 'Calça Pantalona',
        description: 'Calça pantalona elegante e confortável. Perfeita para looks sofisticados.',
        price: 179.90,
        images: [
          'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800'
        ],
        category: 'calças',
        sizes: ['P', 'M', 'G', 'GG'],
        colors: [
          { name: 'Preto', hex: '#000000' },
          { name: 'Bege', hex: '#F5F5DC' }
        ],
        stock: 25,
        tags: ['pantalona', 'elegante', 'confortável'],
        badges: ['novo'],
        featured: false,
        rating: { average: 4.8, count: 67 }
      },
      // Saias
      {
        name: 'Saia Midi Plissada',
        description: 'Saia midi plissada com caimento perfeito. Elegante e versátil.',
        price: 159.90,
        originalPrice: 189.90,
        images: [
          'https://images.unsplash.com/photo-1583496661160-fb5886a0aeae?w=800'
        ],
        category: 'saias',
        sizes: ['P', 'M', 'G'],
        colors: [
          { name: 'Rosa', hex: '#FFC0CB' },
          { name: 'Verde', hex: '#90EE90' }
        ],
        stock: 20,
        tags: ['plissada', 'midi', 'elegante'],
        badges: ['promoção'],
        featured: true,
        rating: { average: 4.7, count: 89 }
      },
      // Conjuntos
      {
        name: 'Conjunto Alfaiataria',
        description: 'Conjunto de blazer e calça em alfaiataria premium. Elegância e sofisticação.',
        price: 399.90,
        images: [
          'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800'
        ],
        category: 'conjuntos',
        sizes: ['P', 'M', 'G'],
        colors: [
          { name: 'Preto', hex: '#000000' },
          { name: 'Branco', hex: '#FFFFFF' }
        ],
        stock: 12,
        tags: ['alfaiataria', 'elegante', 'trabalho'],
        badges: ['exclusivo'],
        featured: true,
        rating: { average: 4.9, count: 45 }
      },
      // Acessórios
      {
        name: 'Colar Dourado Delicado',
        description: 'Colar dourado com pingente delicado. Banhado a ouro 18k.',
        price: 89.90,
        images: [
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800'
        ],
        category: 'acessórios',
        sizes: [],
        colors: [
          { name: 'Dourado', hex: '#FFD700' }
        ],
        stock: 35,
        tags: ['colar', 'dourado', 'delicado'],
        badges: ['novo'],
        featured: false,
        rating: { average: 4.6, count: 78 }
      },
      // Calçados
      {
        name: 'Sandália Salto Bloco',
        description: 'Sandália com salto bloco confortável. Perfeita para o verão.',
        price: 169.90,
        originalPrice: 199.90,
        images: [
          'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800'
        ],
        category: 'calçados',
        sizes: ['34', '35', '36', '37', '38', '39'],
        colors: [
          { name: 'Nude', hex: '#E3BC9A' },
          { name: 'Preto', hex: '#000000' }
        ],
        stock: 28,
        tags: ['sandália', 'salto', 'confortável'],
        badges: ['promoção'],
        featured: true,
        rating: { average: 4.4, count: 156 }
      },
      // Bolsas
      {
        name: 'Bolsa Estruturada',
        description: 'Bolsa estruturada em couro sintético de alta qualidade. Espaçosa e elegante.',
        price: 249.90,
        images: [
          'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800'
        ],
        category: 'bolsas',
        sizes: [],
        colors: [
          { name: 'Preto', hex: '#000000' },
          { name: 'Caramelo', hex: '#C68E17' }
        ],
        stock: 18,
        tags: ['bolsa', 'elegante', 'trabalho'],
        badges: ['novo', 'exclusivo'],
        featured: true,
        rating: { average: 4.8, count: 92 }
      },
      {
        name: 'Clutch Festa',
        description: 'Clutch elegante para festas e eventos especiais. Com alça removível.',
        price: 129.90,
        images: [
          'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800'
        ],
        category: 'bolsas',
        sizes: [],
        colors: [
          { name: 'Dourado', hex: '#FFD700' },
          { name: 'Prata', hex: '#C0C0C0' }
        ],
        stock: 22,
        tags: ['clutch', 'festa', 'elegante'],
        badges: [],
        featured: false,
        rating: { average: 4.5, count: 54 }
      }
    ];

    // Adiciona slug e sku aos produtos
    const productsWithSlug = products.map(p => ({
      ...p,
      slug: generateSlug(p.name),
      sku: generateSKU(p.category)
    }));

    await Product.insertMany(productsWithSlug);
    console.log(`👗 ${products.length} produtos criados`);

    // Promoções de exemplo
    const now = new Date();
    const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const promotions = [
      {
        title: 'Cupom de Boas-Vindas',
        description: '10% de desconto na primeira compra',
        type: 'percentage',
        value: 10,
        code: 'BEMVINDO10',
        minPurchase: 100,
        startDate: now,
        endDate: nextMonth,
        showOnHomepage: false,
        isActive: true
      },
      {
        title: 'Queima de Verão',
        description: 'Até 30% OFF em vestidos',
        type: 'percentage',
        value: 30,
        code: 'VERAO30',
        minPurchase: 150,
        maxDiscount: 100,
        applicableCategories: ['vestidos'],
        startDate: now,
        endDate: nextWeek,
        banner: {
          image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920',
          backgroundColor: '#ec4899',
          textColor: '#ffffff'
        },
        showOnHomepage: true,
        showCountdown: true,
        isActive: true
      },
      {
        title: 'Frete Grátis Especial',
        description: 'Frete grátis em compras acima de R$ 199',
        type: 'freeShipping',
        value: 0,
        code: 'FRETEGRATIS',
        minPurchase: 199,
        startDate: now,
        endDate: nextMonth,
        showOnHomepage: false,
        isActive: true
      }
    ];

    await Promotion.insertMany(promotions);
    console.log(`🎉 ${promotions.length} promoções criadas`);

    console.log('\n✨ Seed concluído com sucesso!');
    console.log('================================');
    console.log('📧 Admin: admin@loja.com');
    console.log('🔑 Senha: admin123');
    console.log('🎫 Cupons: BEMVINDO10, VERAO30, FRETEGRATIS');
    console.log('================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro no seed:', error);
    process.exit(1);
  }
};

seedDatabase();
