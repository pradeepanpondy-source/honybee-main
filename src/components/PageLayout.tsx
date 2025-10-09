import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16 pb-40">{children}</main>
      <Footer />
    </div>
  );
};

export default PageLayout;
