import React from 'react';

interface PageLayoutProps {
  navigation: React.ReactNode;
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ navigation, children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-honeybee-primary to-honeybee-accent text-black font-extrabold">
      {navigation}
      {/* Modern header line separator positioned after navigation */}
      <div className="relative mb-4 h-2">
        <div className="h-0.5 bg-gradient-to-r from-transparent via-white/70 to-transparent"></div>
        <div className="h-0.5 bg-gradient-to-r from-transparent via-honeybee-accent/80 to-transparent blur-sm -mt-0.5"></div>
        <div className="h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent -mt-0.5"></div>
      </div>
      {children}
    </div>
  );
};

export default PageLayout;
