
import React, { useState, useRef, useEffect } from 'react';
import { Brain, BarChart3, Calendar, Award, Bell, Palette } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Insights',
    description: 'Get personalized recommendations and insights based on your habits and progress patterns.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Track your progress with beautiful charts and detailed analytics that show your growth.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'Optimize your routine with intelligent scheduling that adapts to your lifestyle.',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Award,
    title: 'Reward System',
    description: 'Stay motivated with achievements, streaks, and personalized rewards for your progress.',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    icon: Bell,
    title: 'Smart Reminders',
    description: 'Never miss a habit with intelligent reminders that learn your preferences.',
    color: 'from-red-500 to-pink-500'
  },
  {
    icon: Palette,
    title: 'Beautiful Design',
    description: 'Enjoy a clean, intuitive interface that makes habit tracking a pleasure.',
    color: 'from-indigo-500 to-purple-500'
  }
];

const FeaturesSection = () => {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleItems(prev => [...prev, index]);
          }
        });
      },
      { threshold: 0.3 }
    );

    const cards = sectionRef.current?.querySelectorAll('[data-index]');
    cards?.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-playfair text-gray-800 mb-6">
            Powerful Features for
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Lasting Change</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to build, track, and maintain habits that stick, powered by cutting-edge AI technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isVisible = visibleItems.includes(index);
            
            return (
              <Card 
                key={index}
                data-index={index}
                className={`group hover:shadow-xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white transform hover:scale-105 ${
                  isVisible ? 'animate-scale-in' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-8 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-purple-700 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
