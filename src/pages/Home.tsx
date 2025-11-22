import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import DashboardPreview from '../components/DashboardPreview';
import Workflow from '../components/Workflow';
import BentoGrid from '../components/BentoGrid';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <DashboardPreview />
      <Workflow />
      <BentoGrid />
      <Footer />
    </div>
  );
}
