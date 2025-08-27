import React from 'react';

interface LoadingSkeletonProps {
  type?: 'card' | 'list' | 'text';
  count?: number;
  className?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  type = 'card', 
  count = 1, 
  className = '' 
}) => {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className={`animate-pulse ${className} ${
        type === 'card' 
          ? 'bg-gray-200 rounded-xl p-6 space-y-4' 
          : type === 'list'
          ? 'bg-gray-200 rounded-lg p-4 space-y-3'
          : 'bg-gray-200 rounded h-4'
      }`}
    >
      {type === 'card' && (
        <>
          <div className="h-6 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          <div className="h-10 bg-gray-300 rounded"></div>
        </>
      )}
      {type === 'list' && (
        <>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </>
      )}
      {type === 'text' && (
        <div className="h-4 bg-gray-300 rounded"></div>
      )}
    </div>
  ));

  return <>{skeletons}</>;
};

export default LoadingSkeleton;
