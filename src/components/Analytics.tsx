
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Target, TrendingUp, Award } from 'lucide-react';
import type { Habit } from '@/pages/Index';

interface AnalyticsProps {
  habits: Habit[];
}

const Analytics: React.FC<AnalyticsProps> = ({ habits }) => {
  const getLast7DaysData = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      let totalCompletions = 0;
      let totalTargets = 0;
      
      habits.forEach(habit => {
        const completion = habit.completions.find(c => c.date === dateString);
        totalCompletions += completion ? Math.min(completion.value, habit.target) : 0;
        totalTargets += habit.target;
      });
      
      last7Days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completion: totalTargets > 0 ? Math.round((totalCompletions / totalTargets) * 100) : 0,
      });
    }
    return last7Days;
  };

  const getCategoryData = () => {
    const categoryStats: { [key: string]: { total: number; completed: number } } = {};
    
    habits.forEach(habit => {
      if (!categoryStats[habit.category]) {
        categoryStats[habit.category] = { total: 0, completed: 0 };
      }
      
      categoryStats[habit.category].total += habit.target;
      
      const today = new Date().toISOString().split('T')[0];
      const todayCompletion = habit.completions.find(c => c.date === today);
      if (todayCompletion) {
        categoryStats[habit.category].completed += Math.min(todayCompletion.value, habit.target);
      }
    });
    
    return Object.entries(categoryStats).map(([category, stats]) => ({
      category,
      percentage: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
      completed: stats.completed,
      total: stats.total,
    }));
  };

  const getOverallStats = () => {
    const totalHabits = habits.length;
    const today = new Date().toISOString().split('T')[0];
    
    let completedToday = 0;
    let totalStreaks = 0;
    let longestStreak = 0;
    
    habits.forEach(habit => {
      const todayCompletion = habit.completions.find(c => c.date === today);
      if (todayCompletion && todayCompletion.value >= habit.target) {
        completedToday++;
      }
      
      // Calculate streak for this habit
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
      
      totalStreaks += streak;
      longestStreak = Math.max(longestStreak, streak);
    });
    
    return {
      totalHabits,
      completedToday,
      completionRate: totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0,
      averageStreak: totalHabits > 0 ? Math.round(totalStreaks / totalHabits) : 0,
      longestStreak,
    };
  };

  const last7DaysData = getLast7DaysData();
  const categoryData = getCategoryData();
  const stats = getOverallStats();

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  if (habits.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <div className="text-gray-500">
            <BarChart className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Analytics Yet</h3>
            <p>Start tracking habits to see your progress analytics!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Habits</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalHabits}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.completedToday}/{stats.totalHabits}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-800">{stats.completionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Award className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Longest Streak</p>
                <p className="text-2xl font-bold text-gray-800">{stats.longestStreak} days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>7-Day Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={last7DaysData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Completion Rate']} />
                <Bar dataKey="completion" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <div className="space-y-4">
                {categoryData.map((category, index) => (
                  <div key={category.category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{category.category}</span>
                      <Badge variant="outline">{category.percentage}%</Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${category.percentage}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>No category data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
