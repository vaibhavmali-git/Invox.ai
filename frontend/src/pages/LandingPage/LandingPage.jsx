import React from "react";
import Header from "../../components/Landing/Header";
import Hero from "../../components/Landing/Hero";
import Features from "../../components/Landing/Features";
import Testimonials from "../../components/Landing/Testimonials";

const LandingPage = () => {
  return (
    <div>
      <Header />

      <main className="mb-[100vh]">
        <Hero />
        <Features />
        <Testimonials />
      </main>
    </div>
  );
};

export default LandingPage;
