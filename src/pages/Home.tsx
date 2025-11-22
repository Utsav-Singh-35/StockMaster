import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import DashboardPreview from '../components/DashboardPreview';
import CoreFeatures from '../components/CoreFeatures';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <Navbar />
      <Hero />
      <Features />
      <DashboardPreview />
      <CoreFeatures />
      <Footer />
    </div>
  );
}
