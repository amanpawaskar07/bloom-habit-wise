
import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleGetStarted = () => {
    navigate('/app');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-float" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-green-200 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-10 w-12 h-12 bg-yellow-200 rounded-full opacity-20 animate-float" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-full px-4 py-2 text-sm font-medium text-purple-700 transition-all duration-700 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
            <Sparkles className="w-4 h-4" />
            AI-Powered Habit Tracking
          </div>

          {/* Main heading */}
          <h1 className={`text-5xl md:text-7xl font-bold font-playfair bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent leading-tight transition-all duration-700 delay-200 ${isVisible ? 'animate-slide-in-left' : 'opacity-0'}`}>
            Transform Your Life
            <br />
            <span className="text-4xl md:text-6xl">One Habit at a Time</span>
          </h1>

          {/* Subtitle */}
          <p className={`text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-400 ${isVisible ? 'animate-slide-in-right' : 'opacity-0'}`}>
            Build lasting habits with AI-powered insights, personalized recommendations, and beautiful tracking that makes progress feel effortless.
          </p>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-700 delay-600 ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}>
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300"
            >
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 transition-all duration-700 delay-800 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
            <div className="flex flex-col items-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-blue-100 hover:bg-white/80 transition-all duration-300 transform hover:scale-105">
              <Target className="w-8 h-8 text-blue-600 mb-3" />
              <div className="text-2xl font-bold text-gray-800">92%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
            <div className="flex flex-col items-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-purple-100 hover:bg-white/80 transition-all duration-300 transform hover:scale-105">
              <TrendingUp className="w-8 h-8 text-purple-600 mb-3" />
              <div className="text-2xl font-bold text-gray-800">10k+</div>
              <div className="text-gray-600">Users Growing</div>
            </div>
            <div className="flex flex-col items-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-green-100 hover:bg-white/80 transition-all duration-300 transform hover:scale-105">
              <Sparkles className="w-8 h-8 text-green-600 mb-3" />
              <div className="text-2xl font-bold text-gray-800">4.9★</div>
              <div className="text-gray-600">User Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
