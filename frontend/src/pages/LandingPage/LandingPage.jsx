import Header from "../../components/Landing/Header";
import Hero from "../../components/Landing/Hero";
import Features from "../../components/Landing/Features";
import Footer from "../../components/Landing/Footer";

const LandingPage = () => {
  return (
    <div>
      <Header />

      <main >
        <Hero />
        <Features />
        <Footer />
      </main>
    </div>
  );
};

export default LandingPage;
