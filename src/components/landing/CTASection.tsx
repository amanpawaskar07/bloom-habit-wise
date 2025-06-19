
import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const benefits = [
  'Start tracking habits in under 2 minutes',
  'AI insights available from day one',
  'No credit card required',
  'Free forever plan available'
];

const CTASection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleGetStarted = () => {
    navigate('/app');
  };

  return (
    <section ref={sectionRef} className="py-20 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
      </div>

      <div className="container mx-auto max-w-4xl relative z-10 text-center">
        <div className={`transition-all duration-700 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
          <h2 className="text-4xl md:text-5xl font-bold font-playfair text-white mb-6">
            Ready to Transform Your Life?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of people who have already started their journey to better habits and a more fulfilling life.
          </p>

          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 max-w-2xl mx-auto transition-all duration-700 delay-300 ${isVisible ? 'animate-slide-in-left' : 'opacity-0'}`}>
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center justify-center md:justify-start text-blue-100">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-700 delay-500 ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}>
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="bg-white text-purple-700 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Start Free Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-blue-200 text-sm">
              No spam, unsubscribe at any time
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
