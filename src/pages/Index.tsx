import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import InfoCards from "@/components/InfoCards";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import OffersSection from "@/components/OffersSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main>
      <HeroCarousel />
      <InfoCards />
      <CategoriesSection />
      <FeaturedProducts />
      <OffersSection />
    </main>
    <Footer />
    <WhatsAppButton />
  </div>
);

export default Index;
