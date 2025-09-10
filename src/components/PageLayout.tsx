import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen">
      <Navigation />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default PageLayout;
