import { motion } from 'framer-motion';
import { 
  HeroBanner, 
  CategoryCarousel, 
  FeaturedProducts, 
  PromotionSection,
  ProductShowcase 
} from '../components/home';

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <HeroBanner />
      <CategoryCarousel />
      <FeaturedProducts />
      <PromotionSection />
      <ProductShowcase />
    </motion.div>
  );
}
