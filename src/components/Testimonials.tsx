
import React from 'react';

const testimonials = [
  {
    quote: "The honey from Bee Bridge is the best I've ever tasted! It's so fresh and pure, and I love that it's sourced from local beekeepers.",
    author: "John Doe",
  },
  {
    quote: "I love the convenience of being able to buy fresh, organic produce directly from farmers. The quality is amazing, and the prices are great.",
    author: "Jane Smith",
  },
  {
    quote: "Bee Bridge is a great platform for farmers and consumers to connect. I'm so glad I found it!",
    author: "Peter Jones",
  },
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-honeybee-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-honeybee-dark mb-6 text-center">What Our Customers Are Saying</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">"{testimonial.quote}"</p>
              <p className="text-right text-gray-500 font-bold">- {testimonial.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
