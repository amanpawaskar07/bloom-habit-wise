
import React from 'react';
import { Trophy, Star, Award, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { Habit } from '@/pages/Index';

interface RewardSystemProps {
  habits: Habit[];
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  unlocked: boolean;
  progress?: number;
  target?: number;
}

const RewardSystem: React.FC<RewardSystemProps> = ({ habits }) => {
  const calculateTotalCompletions = () => {
    return habits.reduce((total, habit) => {
      return total + habit.completions.reduce((sum, completion) => sum + completion.value, 0);
    }, 0);
  };

  const calculateLongestStreak = () => {
    let maxStreak = 0;
    habits.forEach(habit => {
      const streak = getHabitStreak(habit);
      if (streak > maxStreak) maxStreak = streak;
    });
    return maxStreak;
  };

  const getHabitStreak = (habit: Habit) => {
    if (habit.completions.length === 0) return 0;
    
    const sortedCompletions = habit.completions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
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
    
    return streak;
  };

  const totalCompletions = calculateTotalCompletions();
  const longestStreak = calculateLongestStreak();
  const activeHabits = habits.length;

  const achievements: Achievement[] = [
    {
      id: 'first-habit',
      name: 'Getting Started',
      description: 'Create your first habit',
      icon: Star,
      color: 'text-yellow-500',
      unlocked: activeHabits >= 1
    },
    {
      id: 'habit-collector',
      name: 'Habit Collector',
      description: 'Create 5 different habits',
      icon: Trophy,
      color: 'text-blue-500',
      unlocked: activeHabits >= 5,
      progress: activeHabits,
      target: 5
    },
    {
      id: 'week-warrior',
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: Award,
      color: 'text-green-500',
      unlocked: longestStreak >= 7,
      progress: Math.min(longestStreak, 7),
      target: 7
    },
    {
      id: 'consistency-king',
      name: 'Consistency King',
      description: 'Maintain a 30-day streak',
      icon: Crown,
      color: 'text-purple-500',
      unlocked: longestStreak >= 30,
      progress: Math.min(longestStreak, 30),
      target: 30
    },
    {
      id: 'centurion',
      name: 'Centurion',
      description: 'Complete 100 habit actions',
      icon: Trophy,
      color: 'text-orange-500',
      unlocked: totalCompletions >= 100,
      progress: Math.min(totalCompletions, 100),
      target: 100
    }
  ];

  const unlockedAchievements = achievements.filter(achievement => achievement.unlocked);
  const nextAchievements = achievements.filter(achievement => !achievement.unlocked).slice(0, 3);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Your Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {unlockedAchievements.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Start completing habits to unlock achievements!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {unlockedAchievements.map((achievement) => {
                const IconComponent = achievement.icon;
                return (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200"
                  >
                    <IconComponent className={`w-8 h-8 ${achievement.color}`} />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{achievement.name}</h3>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Unlocked
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {nextAchievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-gray-500" />
              Next Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {nextAchievements.map((achievement) => {
                const IconComponent = achievement.icon;
                const progressPercentage = achievement.target 
                  ? Math.min((achievement.progress || 0) / achievement.target * 100, 100)
                  : 0;

                return (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200"
                  >
                    <IconComponent className={`w-8 h-8 text-gray-400`} />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{achievement.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                      {achievement.target && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{achievement.progress || 0} / {achievement.target}</span>
                            <span>{Math.round(progressPercentage)}%</span>
                          </div>
                          <Progress value={progressPercentage} className="h-2" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RewardSystem;
