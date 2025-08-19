import React, { useState } from 'react';
import { User, ArrowRight } from 'lucide-react';
import AnimatedBackground from './AnimatedBackground';
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4 relative">
      <AnimatedBackground />
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500 rounded-2xl mb-4 shadow-lg animate-honey-drip">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-amber-900 mb-2 animate-welcome-bounce">Welcome!</h1>
          <p className="text-amber-700 animate-fade-in-up animate-delay-300">
            Let's personalize your experience
          </p>
        </div>

        {/* Name Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-amber-100 animate-fade-in-up animate-delay-500 relative z-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center animate-fade-in-up animate-delay-700">
            What's your name?
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up animate-delay-1000">
            <div className="animate-fade-in-up animate-delay-1000">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* FIXED: Wrap ClickEffect inside button */}
            <button
              type="submit"
              disabled={!name.trim() || isSubmitting}
              className="w-full"
            >
              <ClickEffect
                className="w-full flex items-center justify-center px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium transition-all duration-200 group relative"
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
            </button>
          </form>

          <div className="mt-6 text-center animate-fade-in-up animate-delay-1000">
            <p className="text-sm text-gray-500">
              We'll use this to personalize your experience
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
