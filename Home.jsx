import Hero          from '../components/Hero';
import HowItWorks    from '../components/HowItWorks';
import AssessmentForm from '../components/AssessmentForm';
import Features      from '../components/Features';
import Dashboard     from '../components/Dashboard';
import Testimonials  from '../components/Testimonials';

function SectionDivider() {
  return <div className="section-divider" />;
}

export default function Home({ onOpenAuth }) {
  return (
    <>
      <Hero onOpenAuth={onOpenAuth} />

      <SectionDivider />
      <HowItWorks />

      <SectionDivider />
      <AssessmentForm />

      <SectionDivider />
      <Features />

      <SectionDivider />
      <Dashboard />

      <SectionDivider />
      <Testimonials />

      <SectionDivider />
    </>
  );
}
