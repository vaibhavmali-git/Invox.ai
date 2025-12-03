import { Link } from "react-router-dom";
import HERO_IMG from "../../assets/heroimg.png";
import { useAuth } from "../../context/AuthContext";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="bg-white border-b border-gray-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-12 pb-20 sm:pt-20 sm:pb-24 border-x border-gray-200">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 leading-[1.15] tracking-tight mb-6">
              Transform Your Invoicing with <br />
              <span className="text-gray-400 italic">AI-Driven Insights</span>
            </h1>

            <p className="text-md text-gray-500 mb-8 leading-relaxed">
              Let AI turn plain text into invoices, send timely reminders, and
              give you insights that make managing finances easier.
            </p>

            <div className="flex flex-row items-center gap-4">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-black transition-all"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-black transition-all shadow-lg shadow-gray-200"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              )}

              <a
                href="#features"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                Features
              </a>
            </div>
          </div>

          <div className="relative mt-10 lg:mt-0">
            <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-2xl shadow-gray-100">
              <img
                src={HERO_IMG}
                alt="App Dashboard"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
            </div>

            <div className="absolute -inset-4 bg-gray-100/50 -z-10 blur-2xl rounded-full opacity-50"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
