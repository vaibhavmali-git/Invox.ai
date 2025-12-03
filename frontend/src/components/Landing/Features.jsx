import React from "react";
import { FEATURES } from "../../utils/data";

const Features = () => {
  return (
    <section id="features" className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-24 border-x border-gray-200">
        {/* Header */}
        <div className="text-center mb-16">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
            Key Features
          </h4>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Discover the Potential of{" "}
            <span className="text-gray-400 italic">Smart Invoicing</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Explore the features that simplify and enhance your financial
            management.
          </p>
        </div>

        <div className="border border-gray-200 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200">
            {FEATURES.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 hover:bg-gray-50 transition-colors duration-200 group h-full"
              >
                <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center mb-6 text-gray-600 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
