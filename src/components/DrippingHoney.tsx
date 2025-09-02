import React from 'react';

const DrippingHoney: React.FC = () => {
  return (
    <div className="absolute top-0 left-0 w-full overflow-hidden z-10">
      <div className="honey-container">
        <div className="honey-wave"></div>
        <div className="honey-drip honey-drip-1"></div>
        <div className="honey-drip honey-drip-2"></div>
        <div className="honey-drip honey-drip-3"></div>
      </div>
      
      <style>{`
        .honey-container {
          position: relative;
          width: 100%;
          height: 120px;
        }
        
        .honey-wave {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 70px;
          background: linear-gradient(to bottom, #E9B824, #F0A04B);
          border-radius: 0 0 30% 70%;
          box-shadow: 0 5px 15px rgba(233, 184, 36, 0.3);
          animation: wave 10s ease-in-out infinite alternate;
        }
        
        @keyframes wave {
          0%, 100% {
            border-radius: 0 0 30% 70%;
          }
          50% {
            border-radius: 0 0 70% 30%;
          }
        }
        
        .honey-drip {
          position: absolute;
          background: linear-gradient(to bottom, #E9B824, #F0A04B);
          border-radius: 40% 40% 50% 50% / 40% 40% 60% 60%;
          box-shadow: 0 5px 10px rgba(233, 184, 36, 0.3);
        }
        
        .honey-drip-1 {
          top: 60px;
          left: 30%;
          width: 24px;
          height: 50px;
          animation: drip 6s infinite 0.5s;
        }
        
        .honey-drip-2 {
          top: 60px;
          left: 50%;
          width: 28px;
          height: 60px;
          animation: drip 7s infinite;
        }
        
        .honey-drip-3 {
          top: 60px;
          left: 70%;
          width: 24px;
          height: 50px;
          animation: drip 5.5s infinite 1s;
        }
        
        @keyframes drip {
          0%, 100% {
            height: 50px;
            opacity: 0.9;
          }
          50% {
            height: 70px;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default DrippingHoney;
