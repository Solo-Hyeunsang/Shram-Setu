// Shram Setu — Main Landing Page
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { HeroSection } from './components/HeroSection';
import { HowItWorks } from './components/HowItWorks';
import { TradeGrid } from './components/TradeGrid';
import { FeaturedWorkers } from './components/FeaturedWorkers';
import { WhyShramSetu } from './components/WhyShramSetu';
import { RecentJobs } from './components/RecentJobs';
import { CTABanner } from './components/CTABanner';

export function Landing() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1 }}>
        <HeroSection />
        <TradeGrid />
        <HowItWorks />
        <FeaturedWorkers />
        <WhyShramSetu />
        <RecentJobs />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
