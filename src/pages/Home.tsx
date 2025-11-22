import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import DashboardPreview from '../components/DashboardPreview';
import SmartManagement from '../components/SmartManagement';
import CoreFeatures from '../components/CoreFeatures';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Hero />
      <DashboardPreview />
      <SmartManagement />
      <CoreFeatures />
      <FAQ />
      <Footer />
    </div>
  );
}
