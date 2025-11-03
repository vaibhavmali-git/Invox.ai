import Header from "../../components/Landing/Header";
import Hero from "../../components/Landing/Hero";
import Features from "../../components/Landing/Features";
import Testimonials from "../../components/Landing/Testimonials";
import Faqs from "../../components/Landing/Faqs";
import Footer from "../../components/Landing/Footer";

const LandingPage = () => {
  return (
    <div>
      <Header />

      <main >
        <Hero />
        <Features />
        <Testimonials />
        <Faqs />
        <Footer />
      </main>
    </div>
  );
};

export default LandingPage;
