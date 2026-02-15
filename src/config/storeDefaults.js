// Configurações padrão da loja caso a API não retorne dados
export const storeDefaults = {
  storeName: 'DRIPS STORY',
  primaryColor: '#1e3a5f',
  secondaryColor: '#3b82f6',
  logoUrl: '',
  bannerUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=600&fit=crop',
  whatsappNumber: '5594996661440',
  instagramUrl: 'https://instagram.com/drips_story00',
  addressText: 'Rua Rio de Janeiro, 42 - Bairro Rio Verde - Parauapebas/PA',
  email: 'contato@dripsstory.com.br',
  phone: '(94) 99666-1440',
  slogan: 'A sua melhor loja de estilo 🏆',
};

export const categories = [
  { id: 'camisetas', name: 'Camisetas', icon: '👕', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop' },
  { id: 'calcas', name: 'Calças', icon: '👖', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop' },
  { id: 'tenis', name: 'Tênis', icon: '👟', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop' },
  { id: 'bones', name: 'Bonés', icon: '🧢', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=300&h=300&fit=crop' },
  { id: 'acessorios', name: 'Acessórios', icon: '⌚', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=300&h=300&fit=crop' },
  { id: 'promocoes', name: 'Promoções', icon: '🏷️', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&h=300&fit=crop' },
];

export const sizes = ['PP', 'P', 'M', 'G', 'GG', 'XG'];

export const colors = [
  { name: 'Preto', hex: '#000000' },
  { name: 'Branco', hex: '#FFFFFF' },
  { name: 'Vermelho', hex: '#EF4444' },
  { name: 'Azul', hex: '#3B82F6' },
  { name: 'Verde', hex: '#22C55E' },
  { name: 'Rosa', hex: '#EC4899' },
  { name: 'Amarelo', hex: '#EAB308' },
  { name: 'Roxo', hex: '#8B5CF6' },
  { name: 'Laranja', hex: '#F97316' },
  { name: 'Cinza', hex: '#6B7280' },
];

export const paymentMethods = [
  { id: 'pix', name: 'PIX', icon: '📱', description: '10% de desconto' },
  { id: 'cartao', name: 'Cartão', icon: '💳', description: 'Até 12x sem juros' },
  { id: 'dinheiro', name: 'Dinheiro', icon: '💵', description: 'Na entrega' },
];
