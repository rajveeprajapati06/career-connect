import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Toaster } from 'react-hot-toast';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-300">
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'dark:bg-gray-900 dark:text-gray-100 dark:border dark:border-gray-800',
          duration: 4000,
          success: {
            iconTheme: {
              primary: '#4f46e5',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* Main Navigation */}
      <Navbar />

      {/* Page Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer Details */}
      <Footer />
    </div>
  );
};

export default Layout;
