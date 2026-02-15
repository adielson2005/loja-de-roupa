import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Instagram, 
  Facebook, 
  Mail, 
  Phone, 
  MapPin,
  CreditCard,
  Truck,
  Shield,
  Headphones,
  Send,
  Loader2
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { categories } from '../../config/storeDefaults';
import toast from 'react-hot-toast';

export default function Footer() {
  const { storeConfig } = useStore();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNewsletter = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Digite seu email');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Email inválido');
      return;
    }
    
    setLoading(true);
    // Simula envio
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Obrigado por se inscrever! 🎉');
    setEmail('');
    setLoading(false);
  };

  const benefits = [
    { icon: Truck, title: 'Frete Grátis', text: 'Acima de R$ 199' },
    { icon: CreditCard, title: 'Parcelamento', text: 'Até 12x sem juros' },
    { icon: Shield, title: 'Compra Segura', text: '100% protegido' },
    { icon: Headphones, title: 'Atendimento', text: 'Seg-Sex 9h-18h' },
  ];

  return (
    <footer className="bg-[#0a0a0a] text-gray-300 mt-20 border-t border-gray-800/50">
      {/* Benefits Bar - Premium Design */}
      <div className="border-b border-gray-800/50 bg-gradient-to-r from-[#0a0a0a] via-[#0f1419] to-[#0a0a0a]">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-[#111111] border border-gray-800 rounded-xl flex items-center justify-center group-hover:border-[#3b82f6]/50 group-hover:bg-[#1e3a5f]/10 transition-all duration-300">
                  <benefit.icon className="w-6 h-6 text-[#3b82f6]" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{benefit.title}</p>
                  <p className="text-xs text-gray-500">{benefit.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-black text-lg mb-4" style={{fontFamily: "'Impact', 'Arial Black', sans-serif"}}>{storeConfig.storeName}</h3>
            <p className="text-sm text-gray-500 mb-4">
              A sua melhor loja de estilo! 🏆 Encontre as melhores peças streetwear com preços incríveis.
            </p>
            <div className="flex gap-3">
              {storeConfig.instagramUrl && (
                <a
                  href={storeConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#1a1a1a] border border-gray-800 rounded-full flex items-center justify-center hover:bg-[#1e3a5f] hover:border-[#1e3a5f] transition-colors"
                >
                  <Instagram size={18} />
                </a>
              )}
              <a
                href="#"
                className="w-10 h-10 bg-[#1a1a1a] border border-gray-800 rounded-full flex items-center justify-center hover:bg-[#1e3a5f] hover:border-[#1e3a5f] transition-colors"
              >
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Categorias</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/catalog?category=${category.id}`}
                    className="text-sm text-gray-500 hover:text-white transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Ajuda</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-sm text-gray-500 hover:text-white transition-colors">
                  Perguntas Frequentes
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-sm text-gray-500 hover:text-white transition-colors">
                  Política de Frete
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-sm text-gray-500 hover:text-white transition-colors">
                  Trocas e Devoluções
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-gray-500 hover:text-white transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-500 hover:text-white transition-colors">
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contato</h3>
            <ul className="space-y-3">
              {storeConfig.addressText && (
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-[#3b82f6] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-500">{storeConfig.addressText}</span>
                </li>
              )}
              {storeConfig.phone && (
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-[#3b82f6] flex-shrink-0" />
                  <span className="text-sm text-gray-500">{storeConfig.phone}</span>
                </li>
              )}
              {storeConfig.email && (
                <li className="flex items-center gap-3">
                  <Mail size={18} className="text-[#3b82f6] flex-shrink-0" />
                  <span className="text-sm text-gray-500">{storeConfig.email}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-gray-800 bg-[#111111]">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-white font-bold text-xl mb-2">
              Receba ofertas exclusivas! 📧
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              Cadastre-se e receba promoções e novidades em primeira mão.
            </p>
            <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg bg-[#1a1a1a] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#1e3a5f]"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-[#1e3a5f] hover:bg-[#152a45] text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <Send size={18} />
                    <span>Assinar</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} {storeConfig.storeName}. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4">
              <img src="https://cdn-icons-png.flaticon.com/128/349/349221.png" alt="Visa" className="h-6" />
              <img src="https://cdn-icons-png.flaticon.com/128/349/349228.png" alt="Mastercard" className="h-6" />
              <img src="https://cdn-icons-png.flaticon.com/128/14079/14079434.png" alt="PIX" className="h-6" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
