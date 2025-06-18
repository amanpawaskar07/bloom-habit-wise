
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Lightbulb, Target, TrendingUp, Calendar, Star } from 'lucide-react';
import type { Habit } from '@/pages/Index';

interface AIInsightsProps {
  habits: Habit[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ habits }) => {
  const generateInsights = () => {
    if (habits.length === 0) {
      return {
        insights: [],
        recommendations: [],
        patterns: [],
      };
    }

    const insights = [];
    const recommendations = [];
    const patterns = [];

    // Analyze completion patterns
    const today = new Date().toISOString().split('T')[0];
    const completedToday = habits.filter(habit => {
      const completion = habit.completions.find(c => c.date === today);
      return completion && completion.value >= habit.target;
    }).length;

    const completionRate = Math.round((completedToday / habits.length) * 100);

    // Performance insights
    if (completionRate >= 80) {
      insights.push({
        type: 'success',
        icon: Star,
        title: 'Excellent Performance!',
        description: `You've completed ${completionRate}% of your habits today. You're building strong momentum!`,
      });
    } else if (completionRate >= 50) {
      insights.push({
        type: 'warning',
        icon: TrendingUp,
        title: 'Good Progress',
        description: `${completionRate}% completion rate today. You're on the right track, but there's room for improvement.`,
      });
    } else {
      insights.push({
        type: 'info',
        icon: Target,
        title: 'Need More Focus',
        description: `Only ${completionRate}% completed today. Consider reviewing your habit priorities and schedules.`,
      });
    }

    // Category analysis
    const categoryStats: { [key: string]: { total: number; completed: number } } = {};
    habits.forEach(habit => {
      if (!categoryStats[habit.category]) {
        categoryStats[habit.category] = { total: 0, completed: 0 };
      }
      categoryStats[habit.category].total++;
      
      const completion = habit.completions.find(c => c.date === today);
      if (completion && completion.value >= habit.target) {
        categoryStats[habit.category].completed++;
      }
    });

    const bestCategory = Object.entries(categoryStats)
      .map(([category, stats]) => ({
        category,
        rate: stats.total > 0 ? stats.completed / stats.total : 0,
      }))
      .sort((a, b) => b.rate - a.rate)[0];

    const worstCategory = Object.entries(categoryStats)
      .map(([category, stats]) => ({
        category,
        rate: stats.total > 0 ? stats.completed / stats.total : 0,
      }))
      .sort((a, b) => a.rate - b.rate)[0];

    if (bestCategory && bestCategory.rate > 0.7) {
      patterns.push({
        type: 'success',
        title: `${bestCategory.category} Success`,
        description: `You're excelling at ${bestCategory.category} habits! Consider applying similar strategies to other areas.`,
      });
    }

    if (worstCategory && worstCategory.rate < 0.3) {
      patterns.push({
        type: 'challenge',
        title: `${worstCategory.category} Challenge`,
        description: `${worstCategory.category} habits need attention. Consider breaking them into smaller steps.`,
      });
    }

    // Streak analysis
    const habitStreaks = habits.map(habit => {
      let streak = 0;
      const sortedCompletions = habit.completions
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      for (let i = 0; i < 30; i++) {
        const checkDate = new Date();
        checkDate.setDate(checkDate.getDate() - i);
        const dateString = checkDate.toISOString().split('T')[0];
        
        const completion = sortedCompletions.find(c => c.date === dateString);
        if (completion && completion.value >= habit.target) {
          streak++;
        } else if (i === 0) {
          continue;
        } else {
          break;
        }
      }
      
      return { habit, streak };
    });

    const bestStreak = habitStreaks.sort((a, b) => b.streak - a.streak)[0];
    if (bestStreak && bestStreak.streak >= 7) {
      insights.push({
        type: 'success',
        icon: Calendar,
        title: 'Streak Champion!',
        description: `${bestStreak.habit.name} has a ${bestStreak.streak}-day streak. Keep it going!`,
      });
    }

    // AI Recommendations
    recommendations.push({
      priority: 'high',
      title: 'Optimize Your Schedule',
      description: 'Track the times you complete habits to identify your most productive periods.',
      action: 'Add time tracking to your habit completions',
    });

    if (habits.length < 5) {
      recommendations.push({
        priority: 'medium',
        title: 'Gradual Expansion',
        description: 'You have room to add more habits. Start with one new habit that complements your existing ones.',
        action: 'Add 1-2 more habits in different categories',
      });
    } else if (habits.length > 8) {
      recommendations.push({
        priority: 'medium',
        title: 'Focus Strategy',
        description: 'You have many habits. Consider focusing on 3-5 core habits for better consistency.',
        action: 'Prioritize your most important habits',
      });
    }

    if (completionRate < 60) {
      recommendations.push({
        priority: 'high',
        title: 'Habit Stacking',
        description: 'Link new habits to existing routines to improve completion rates.',
        action: 'Pair habits with established daily activities',
      });
    }

    recommendations.push({
      priority: 'low',
      title: 'Weekly Review',
      description: 'Schedule a weekly review to analyze patterns and adjust your approach.',
      action: 'Set a recurring weekly habit review',
    });

    return { insights, recommendations, patterns };
  };

  const { insights, recommendations, patterns } = generateInsights();

  if (habits.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <div className="text-gray-500">
            <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Insights Yet</h3>
            <p>Start tracking habits to get personalized AI insights and recommendations!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-green-200 bg-green-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'info': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-600" />
          AI-Powered Insights
        </h2>
        <p className="text-gray-600">
          Personalized analysis and recommendations based on your habit patterns
        </p>
      </div>

      {/* Key Insights */}
      {insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${getInsightColor(insight.type)}`}
                >
                  <div className="flex items-start gap-3">
                    <insight.icon className="w-5 h-5 mt-0.5 text-gray-600" />
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">{insight.title}</h4>
                      <p className="text-sm text-gray-600">{insight.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Patterns */}
      {patterns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Behavioral Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {patterns.map((pattern, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      pattern.type === 'success' ? 'bg-green-500' : 'bg-orange-500'
                    }`} />
                    <div>
                      <h4 className="font-medium text-gray-800">{pattern.title}</h4>
                      <p className="text-sm text-gray-600">{pattern.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h4 className="font-semibold text-gray-800">{rec.title}</h4>
                  <Badge className={getPriorityColor(rec.priority)}>
                    {rec.priority} priority
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                <p className="text-xs text-blue-600 font-medium">
                  💡 Action: {rec.action}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Smart Tips */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Brain className="w-6 h-6 text-purple-600 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Smart Tip</h3>
              <p className="text-gray-600 mb-3">
                The most successful habit builders focus on consistency over perfection. 
                Completing 80% of your habits consistently is better than 100% completion with frequent breaks.
              </p>
              <div className="text-sm text-purple-700 font-medium">
                💜 Keep building momentum, one day at a time!
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIInsights;
