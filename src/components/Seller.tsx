import React, { useState } from 'react';
import Button from './Button';
import { motion } from 'framer-motion';

const Seller: React.FC = () => {
  const [step, setStep] = useState<'options' | 'sellHoney' | 'sellBeeHive'>('options');
  const [formData, setFormData] = useState({
    photo: null as File | null,
    name: '',
    contact: '',
    address: '',
    pincode: '',
    city: '',
    idProof: null as File | null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'photo' | 'idProof') => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData(prev => ({ ...prev, [field]: e.target.files![0] }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const renderOptions = () => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6 text-center"
    >
      <h2 className="text-3xl font-bold text-honeybee-primary mb-8">Choose an option</h2>
      <div className="flex justify-center gap-8">
        <Button
          variant="primary"
          className="px-8 py-6 text-xl rounded-lg shadow-lg hover:shadow-xl transition"
          onClick={() => setStep('sellHoney')}
        >
          Sell Honey
        </Button>
        <Button
          variant="secondary"
          className="px-8 py-6 text-xl rounded-lg shadow-lg hover:shadow-xl transition"
          onClick={() => setStep('sellBeeHive')}
        >
          Sell Bee Hive
        </Button>
      </div>
    </motion.div>
  );

  const renderForm = (title: string) => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg"
    >
      <h2 className="text-3xl font-serif font-bold text-honeybee-dark mb-6">{title} Application</h2>
      <form>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
            <input
              type="file"
              id="photo"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'photo')}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-honeybee-primary file:text-white hover:file:bg-honeybee-accent"
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 focus:ring-honeybee-primary focus:border-honeybee-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact</label>
            <input
              type="text"
              name="contact"
              id="contact"
              value={formData.contact}
              onChange={handleInputChange}
              className="mt-1 focus:ring-honeybee-primary focus:border-honeybee-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div className="col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              id="address"
              value={formData.address}
              onChange={handleInputChange}
              className="mt-1 focus:ring-honeybee-primary focus:border-honeybee-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">Pincode</label>
            <input
              type="text"
              name="pincode"
              id="pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              className="mt-1 focus:ring-honeybee-primary focus:border-honeybee-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              name="city"
              id="city"
              value={formData.city}
              onChange={handleInputChange}
              className="mt-1 focus:ring-honeybee-primary focus:border-honeybee-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div className="col-span-2">
            <label htmlFor="idProof" className="block text-sm font-medium text-gray-700 mb-2">ID Proof</label>
            <input
              type="file"
              id="idProof"
              accept="image/*,application/pdf"
              onChange={(e) => handleFileChange(e, 'idProof')}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-honeybee-primary file:text-white hover:file:bg-honeybee-accent"
            />
          </div>
        </div>
        <div className="mt-6">
          <Button type="submit" className="w-full" variant="primary">
            Submit Application
          </Button>
        </div>
      </form>
      <div className="mt-4 text-center">
        <Button variant="ghost" onClick={() => setStep('options')}>
          Back to Options
        </Button>
      </div>
    </motion.div>
  );

  if (step === 'options') {
    return renderOptions();
  } else if (step === 'sellHoney') {
    return renderForm('Sell Honey');
  } else {
    return renderForm('Sell Bee Hive');
  }
};

export default Seller;
