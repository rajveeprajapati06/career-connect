import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Mail, Phone, MapPin, Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 dark:bg-gray-950 dark:text-gray-400 border-t border-gray-800 transition-colors duration-300">
      {/* Upper footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo & Company Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/10">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold font-sans text-white">
                CareerConnect
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 max-w-sm">
              Discover your next career milestone. CareerConnect bridges the gap between ambitious professionals and industry leading organizations globally.
            </p>
            {/* Social media icons */}
            <div className="flex space-x-4 pt-2">
              <a href="#" className="hover:text-white transition-colors duration-200"><Linkedin className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors duration-200"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors duration-200"><Github className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Candidates links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              For Job Seekers
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/jobs" className="hover:text-indigo-400 transition-colors duration-200">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/dashboard/candidate" className="hover:text-indigo-400 transition-colors duration-200">
                  Candidate Dashboard
                </Link>
              </li>
              <li>
                <Link to="/applications" className="hover:text-indigo-400 transition-colors duration-200">
                  Application Tracking
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-indigo-400 transition-colors duration-200">
                  Profile Details
                </Link>
              </li>
            </ul>
          </div>

          {/* Employers links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              For Employers
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/dashboard/employer" className="hover:text-indigo-400 transition-colors duration-200">
                  Employer Dashboard
                </Link>
              </li>
              <li>
                <Link to="/dashboard/employer" className="hover:text-indigo-400 transition-colors duration-200">
                  Post a Job Listing
                </Link>
              </li>
              <li>
                <Link to="/dashboard/employer" className="hover:text-indigo-400 transition-colors duration-200">
                  Review Applications
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-indigo-400 transition-colors duration-200">
                  Employer Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-indigo-500 shrink-0" />
                <span>123 Tech Avenue, Suite 500, San Francisco, CA 94107</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-indigo-500 shrink-0" />
                <span>+1 (555) 019-2834</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-indigo-500 shrink-0" />
                <a href="mailto:support@careerconnect.com" className="hover:text-indigo-400 transition-colors duration-200">
                  support@careerconnect.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-gray-950/80 py-6 border-t border-gray-800/80 text-xs text-center text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} CareerConnect. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-gray-300">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300">Terms of Service</a>
            <a href="#" className="hover:text-gray-300">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
