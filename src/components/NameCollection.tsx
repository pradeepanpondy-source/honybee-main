import React, { useState } from 'react';
import { User, ArrowRight } from 'lucide-react';
import ClickEffect from './ClickEffect';

interface NameCollectionProps {
  onNameSubmit: (name: string) => void;
}

export default function NameCollection({ onNameSubmit }: NameCollectionProps) {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onNameSubmit(name.trim());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-4 relative">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-2xl mb-4 shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome!</h1>
          <p className="text-gray-200">
            Let's personalize your experience
          </p>
        </div>

        {/* Name Form */}
        <div className="group">
          <div className="bg-white rounded-2xl shadow-xl animate-card-hover p-8 border border-gray-200 relative z-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              What's your name?
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <ClickEffect
                type="submit"
                disabled={!name.trim() || isSubmitting}
                className="group w-full flex items-center justify-center px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-honeybee-accent bg-honeybee-primary hover:bg-honeybee-dark text-white"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Setting up...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </ClickEffect>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                We'll use this to personalize your experience
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}