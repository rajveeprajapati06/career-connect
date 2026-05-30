import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const reviews = [
    {
      name: 'Sarah Jenkins',
      role: 'Frontend Engineer at TechGlobal',
      avatar: '',
      stars: 5,
      quote:
        'CareerConnect changed my job search completely. Within two weeks of updating my profile and uploading my resume, I was contacted by TechGlobal. The application tracking tool is fantastic.',
    },
    {
      name: 'David Carter',
      role: 'Director of HR at ApexFinance',
      avatar: '',
      stars: 5,
      quote:
        'As an employer, finding qualified candidates used to be time-consuming. With CareerConnect, we can post jobs, manage applications, and contact applicants seamlessly. The candidate filters are extremely powerful.',
    },
    {
      name: 'Marcus Thorne',
      role: 'Full Stack Developer',
      avatar: '',
      stars: 5,
      quote:
        'I love the clean UI and the dark mode! The global search let me filter exactly by remote Node.js opportunities, and the email notification saved me when ApexFinance accepted my application.',
    },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            What Our Users Say
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Over 50,000 users worldwide trust CareerConnect to fuel their job hunt or hiring cycle.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 relative shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Quote icon overlay */}
              <Quote className="w-10 h-10 text-indigo-500/10 dark:text-indigo-400/5 absolute top-6 right-6" />

              {/* Star Rating */}
              <div className="flex space-x-1 mb-5 text-amber-400">
                {Array.from({ length: review.stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>

              {/* Quote Text */}
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 italic mb-6">
                "{review.quote}"
              </p>

              {/* User Block */}
              <div className="flex items-center space-x-3.5 border-t border-gray-100 dark:border-gray-800 pt-5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold flex items-center justify-center shrink-0 shadow-md">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    {review.name}
                  </h4>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                    {review.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
