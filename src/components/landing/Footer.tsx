
import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center">
          <h3 className="text-2xl font-bold font-playfair bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Bloom Habit Wise
          </h3>
          <p className="text-gray-600 mb-6">
            Transforming lives, one habit at a time.
          </p>
          
          <div className="flex items-center justify-center text-gray-500 text-sm">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 mx-1" />
            <span>for personal growth</span>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
            <p>&copy; 2024 Bloom Habit Wise. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
