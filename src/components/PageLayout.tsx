import React from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import Footer from './Footer';

interface PageLayoutProps {
  children: React.ReactNode;
  backgroundImage?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, backgroundImage }) => {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col" style={backgroundImage ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' } : {}}>
      <Navigation />
      <main className="pt-16 pb-80">{children}</main>
      {location.pathname === '/seller' && <div className="h-screen"></div>}
      {location.pathname !== '/seller' && (
        <div className="mt-96">
          <Footer />
        </div>
      )}
    </div>
  );
};

export default PageLayout;
