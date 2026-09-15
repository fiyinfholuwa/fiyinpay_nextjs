import BenefitsSection from "@/components/education/landing/BenefitsSection";
import FAQSection from "@/components/education/landing/FAQSection";
import HeroSection from "@/components/education/landing/HeroSection";
import HowItWorks from "@/components/education/landing/HowItWorks";
import LandingCta from "@/components/education/landing/LandingCta";
import LandingFooter from "@/components/education/landing/LandingFooter";
import LandingHeader from "@/components/education/landing/LandingHeader";
import StatsSection from "@/components/education/landing/StatsSection";
import TestimonialsSection from "@/components/education/landing/TestimonialsSection";
import TutorShowcase from "@/components/education/landing/TutorShowcase";

export default function LandingPage() {
  return (
    <main className="overflow-x-clip bg-white">
      <LandingHeader />
      <HeroSection />
      <StatsSection />
      <HowItWorks />
      <TutorShowcase />
      <BenefitsSection />
      <TestimonialsSection />
      <FAQSection />
      <LandingCta />
      <LandingFooter />
    </main>
  );
}
