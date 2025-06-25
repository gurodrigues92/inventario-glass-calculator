
import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/home/HeroSection';
import PatrimonioForm from '../components/home/PatrimonioForm';
import ValueGuideSection from '../components/home/ValueGuideSection';
import InfoSection from '../components/home/InfoSection';

const Home = () => {
  return (
    <div className="min-h-screen bg-animated">
      <Header />
      
      <main className="pt-36 pb-12 px-6">
        <div className="max-w-3xl mx-auto">
          <HeroSection />
          <PatrimonioForm />
          <ValueGuideSection />
          <InfoSection />
        </div>
      </main>
    </div>
  );
};

export default Home;
