import React from "react";
import Header from "../../components/Landing/Header";
import Hero from "../../components/Landing/Hero";
import Features from "../../components/Landing/Features";

const LandingPage = () => {
  return (
    <div>
      <Header />

      <main className="mb-[100vh]">
        <Hero />
        <Features />
      </main>
    </div>
  );
};

export default LandingPage;
