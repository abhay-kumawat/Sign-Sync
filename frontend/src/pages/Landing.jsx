import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import FeaturesSection from '../components/FeaturesSection'
import HowItWorks from '../components/HowItWorks'
import StatsSection from '../components/StatsSection'
import CTASection from '../components/CTASection'
import DeafAccessSection from '../components/DeafAccessSection'
import Footer from '../components/Footer'

export default function Landing() {
  return (
    <div className="animated-bg min-h-screen grid-bg">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <DeafAccessSection />
      <StatsSection />
      <CTASection />
      <Footer />
    </div>
  )
}
