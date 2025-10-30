import { Link } from "react-router-dom";
import HERO_IMG from "../../assets/hero-img.png";

const Hero = () => {
  const isAuthenticated = false;

  return (
    <section className="relative bg-[#fbfbfb] overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-blue-950 leading-tight mb-6">AI-Powered Invoicing, Made Effortless</h1>
          <p className="text-xl sm:text-xl text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto">
            Let our AI create invoices from simple text, generate payment
            reminders, and provide smart insights to help you manage your
            finances.
          </p>

          <div className="">
            {isAuthenticated ? (
              <Link to="/dashboard" className="">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/signup" className="">
                  Get Started for Free
                </Link>
                <p>
                  Let our AI create invoices from simple text, generate payment
                  reminders, and process payments automatically.
                </p>
              </>
            )}

            <a href="#features" className="">
              Learn More
            </a>
          </div>

          <div className="">
            <img src={HERO_IMG} alt="Invoice App Screenshot" className="" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
