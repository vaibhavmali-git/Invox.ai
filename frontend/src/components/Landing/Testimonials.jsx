import React from "react";
import { TESTIMONIALS } from "../../utils/data";
import { Quote } from "lucide-react";

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="">We are trusted by thousands of small businesses.</p>
        </div>

        <div className="">
          {TESTIMONIALS.map((testimonial, index) => (
            <div key={index} className="">
              <div className="">
                <Quote className="" />
              </div>

              <p className="">{testimonial.quote}</p>

              <div className="">
                <img src={testimonial.avatar} alt={testimonial.author} className="" />
                <div className="">
                  <p className="">{testimonial.author}</p>
                  <p className="">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
