import React from 'react';
import Hero from '../components/home/Hero';
import FeaturedJobs from '../components/home/FeaturedJobs';
import Statistics from '../components/home/Statistics';
import TopCompanies from '../components/home/TopCompanies';
import Testimonials from '../components/home/Testimonials';

const Home = () => {
  return (
    <div className="space-y-0">
      {/* Hero Header */}
      <Hero />

      {/* Featured Jobs grid */}
      <FeaturedJobs />

      {/* Corporate hiring list */}
      <TopCompanies />

      {/* Metrics indicators */}
      <Statistics />

      {/* Customer testimonials */}
      <Testimonials />
    </div>
  );
};

export default Home;
