import { HeroSection } from "@/components/blocks/hero-section-1"
import { FeaturesSection } from "@/components/blocks/featured-section";
import  HowItWorksSection from "@/components/blocks/works-section";
import SmartReplySection from "@/components/blocks/premium-section";
import PricingSection from "@/components/blocks/pricing-section";
import TestimonialsSection from "@/components/blocks/testimonials-section";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <SmartReplySection />
      <PricingSection />
      <TestimonialsSection />
    </main> 
  )
}