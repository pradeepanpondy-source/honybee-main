import React from 'react';

const SellerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="7" width="18" height="13" rx="2" ry="2" />
    <path d="M3 7L12 2L21 7" />
    <path d="M12 11V16" />
    <path d="M8 16H16" />
  </svg>
);

export default SellerIcon;
