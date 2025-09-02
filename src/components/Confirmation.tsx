import React from 'react';

const Confirmation: React.FC = () => {
  return (
    <div className="bg-yellow-50 min-h-screen p-8 flex flex-col justify-center items-center">
      {/* Honey drip effect */}
      <div className="absolute top-0 left-0 w-full h-40 bg-yellow-300 rounded-b-full z-0"></div>
      <div className="absolute top-32 left-0 w-full h-20 bg-yellow-300 rounded-b-full z-0"></div>

      <div className="relative z-10 text-center max-w-2xl">
        <h1 className="text-4xl font-bold text-amber-900 mb-6">Order Placed !!</h1>
        <div className="flex justify-center space-x-4">
          <span className="text-6xl animate-bounce">🐝</span>
          <span className="text-6xl animate-bounce delay-150">🐝</span>
          <span className="text-6xl animate-bounce delay-300">🐝</span>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
