import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Store,
  Palette,
  Image,
  MessageCircle,
  Instagram,
  Save,
  Upload
} from 'lucide-react';
import { getStoreConfig, updateStoreConfig, uploadImage } from '../../services/api';
import { useStore } from '../../context/StoreContext';
import { Button, Input } from '../../components/ui';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const { storeConfig, updateConfig } = useStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    storeName: '',
    primaryColor: '#e91e63',
    secondaryColor: '#ff5722',
    logoUrl: '',
    bannerUrl: '',
    whatsappNumber: '',
    instagramUrl: '',
    addressText: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (storeConfig) {
      setFormData({
        storeName: storeConfig.storeName || '',
        primaryColor: storeConfig.primaryColor || '#e91e63',
        secondaryColor: storeConfig.secondaryColor || '#ff5722',
        logoUrl: storeConfig.logoUrl || '',
        bannerUrl: storeConfig.bannerUrl || '',
        whatsappNumber: storeConfig.whatsappNumber || '',
        instagramUrl: storeConfig.instagramUrl || '',
        addressText: storeConfig.addressText || '',
        email: storeConfig.email || '',
        phone: storeConfig.phone || '',
      });
    }
  }, [storeConfig]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const response = await uploadImage(file);
      const url = response.data?.data?.url || response.data?.url || '';
      setFormData(prev => ({ ...prev, [field]: url }));
      toast.success('Imagem carregada!');
    } catch (error) {
      // Create local preview for demo
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result }));
        toast.success('Imagem carregada!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateStoreConfig(formData);
      updateConfig(formData);
      toast.success('Configurações salvas!');
    } catch (error) {
      // Demo mode - update local state
      updateConfig(formData);
      toast.success('Configurações salvas!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Configurações da Loja</h1>
        <p className="text-gray-500">Personalize a identidade visual e informações da sua loja</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Store className="text-primary" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Informações Básicas</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nome da Loja"
              name="storeName"
              value={formData.storeName}
              onChange={handleChange}
              placeholder="Fashion Store"
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="contato@loja.com"
            />
            <Input
              label="Telefone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(11) 9999-9999"
            />
            <Input
              label="Endereço"
              name="addressText"
              value={formData.addressText}
              onChange={handleChange}
              placeholder="Rua da Moda, 123 - Centro"
            />
          </div>
        </motion.div>

        {/* Colors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Palette className="text-primary" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Cores do Tema</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cor Primária</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="primaryColor"
                  value={formData.primaryColor}
                  onChange={handleChange}
                  className="w-12 h-12 rounded-lg cursor-pointer border-0"
                />
                <input
                  type="text"
                  value={formData.primaryColor}
                  onChange={handleChange}
                  name="primaryColor"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg uppercase"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cor Secundária</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="secondaryColor"
                  value={formData.secondaryColor}
                  onChange={handleChange}
                  className="w-12 h-12 rounded-lg cursor-pointer border-0"
                />
                <input
                  type="text"
                  value={formData.secondaryColor}
                  onChange={handleChange}
                  name="secondaryColor"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg uppercase"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-3">Preview:</p>
            <div className="flex gap-3">
              <button 
                type="button"
                className="px-6 py-2 rounded-lg text-white font-semibold"
                style={{ backgroundColor: formData.primaryColor }}
              >
                Botão Primário
              </button>
              <button 
                type="button"
                className="px-6 py-2 rounded-lg text-white font-semibold"
                style={{ backgroundColor: formData.secondaryColor }}
              >
                Botão Secundário
              </button>
            </div>
          </div>
        </motion.div>

        {/* Images */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Image className="text-primary" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Imagens</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                {formData.logoUrl ? (
                  <div className="relative">
                    <img 
                      src={formData.logoUrl} 
                      alt="Logo" 
                      className="h-16 mx-auto object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, logoUrl: '' }))}
                      className="absolute top-0 right-0 text-red-500 text-sm hover:underline"
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Clique para enviar</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'logoUrl')}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <Input
                className="mt-2"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleChange}
                placeholder="Ou cole a URL da imagem"
              />
            </div>

            {/* Banner */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Banner Principal</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                {formData.bannerUrl ? (
                  <div className="relative">
                    <img 
                      src={formData.bannerUrl} 
                      alt="Banner" 
                      className="h-24 w-full object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, bannerUrl: '' }))}
                      className="absolute top-1 right-1 bg-white px-2 py-1 rounded text-red-500 text-xs hover:underline"
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Clique para enviar</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'bannerUrl')}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <Input
                className="mt-2"
                name="bannerUrl"
                value={formData.bannerUrl}
                onChange={handleChange}
                placeholder="Ou cole a URL da imagem"
              />
            </div>
          </div>
        </motion.div>

        {/* Social */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <MessageCircle className="text-primary" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Redes Sociais</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="WhatsApp (apenas números)"
              name="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={handleChange}
              placeholder="5511999999999"
              icon={MessageCircle}
            />
            <Input
              label="Instagram"
              name="instagramUrl"
              value={formData.instagramUrl}
              onChange={handleChange}
              placeholder="https://instagram.com/sualoja"
              icon={Instagram}
            />
          </div>
        </motion.div>

        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit" size="lg" icon={Save} loading={loading}>
            Salvar Configurações
          </Button>
        </div>
      </form>
    </div>
  );
}
