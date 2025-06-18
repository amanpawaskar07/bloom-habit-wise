
import React, { useState, useEffect } from 'react';
import { RefreshCw, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const quotes = [
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain"
  },
  {
    text: "Success is the sum of small efforts repeated day in and day out.",
    author: "Robert Collier"
  },
  {
    text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle"
  },
  {
    text: "The journey of a thousand miles begins with one step.",
    author: "Lao Tzu"
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson"
  },
  {
    text: "Motivation is what gets you started. Habit is what keeps you going.",
    author: "Jim Ryun"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Small progress is still progress.",
    author: "Anonymous"
  }
];

const MotivationalQuotes: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(quotes[randomIndex]);
  };

  useEffect(() => {
    getRandomQuote();
  }, []);

  return (
    <Card className="bg-gradient-to-r from-purple-100 to-blue-100 border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <Quote className="w-8 h-8 text-purple-600 flex-shrink-0" />
          <Button
            variant="ghost"
            size="sm"
            onClick={getRandomQuote}
            className="text-purple-600 hover:text-purple-700"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
        <blockquote className="text-lg font-medium text-gray-800 mb-3 italic">
          "{currentQuote.text}"
        </blockquote>
        <cite className="text-sm text-gray-600 font-semibold">
          — {currentQuote.author}
        </cite>
      </CardContent>
    </Card>
  );
};

export default MotivationalQuotes;
