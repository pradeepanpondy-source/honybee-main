import React from 'react';
import Button from './Button';

const Contact: React.FC = () => {
  return (
    <div className="bg-honeybee-background text-honeybee-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-honeybee-primary">Contact Us</h1>
          <p className="mt-4 text-base md:text-lg max-w-2xl mx-auto">
            We'd love to hear from you! Whether you have a question about our products, our practices, or anything else, our team is ready to answer all your questions.
          </p>
        </div>

        <div className="mt-12 md:mt-20 grid md:grid-cols-2 gap-8 md:gap-16">
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
            <h2 className="text-xl md:text-2xl font-serif font-bold mb-6">Send us a message</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                <input type="text" id="name" className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-honeybee-primary focus:border-honeybee-primary bg-white text-base" />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                <input type="email" id="email" className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-honeybee-primary focus:border-honeybee-primary bg-white text-base" />
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                <textarea id="message" rows={4} className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-honeybee-primary focus:border-honeybee-primary bg-white text-base"></textarea>
              </div>
              <Button type="submit" variant="primary" className="w-full py-3 text-base">
                Send Message
              </Button>
            </form>
          </div>

          <div className="space-y-6 md:space-y-8">
            <div>
              <h3 className="text-lg md:text-xl font-serif font-bold mb-2">Email Us</h3>
              <p className="text-sm md:text-base">beebridgeshop@gmail.com</p>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-serif font-bold mb-2">Call Us</h3>
              <p className="text-sm md:text-base">(123) 456-7890</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
