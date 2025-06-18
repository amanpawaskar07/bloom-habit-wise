import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HabitCard from '@/components/HabitCard';
import HabitForm from '@/components/HabitForm';
import Analytics from '@/components/Analytics';
import AIInsights from '@/components/AIInsights';
import MotivationalQuotes from '@/components/MotivationalQuotes';
import RewardSystem from '@/components/RewardSystem';
import Reminders from '@/components/Reminders';
import { useToast } from '@/hooks/use-toast';

export interface Habit {
  id: string;
  name: string;
  description: string;
  category: string;
  target: number;
  frequency: 'daily' | 'weekly';
  createdAt: Date;
  completions: { date: string; value: number }[];
  color: string;
}

const Index = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const { toast } = useToast();

  // Load habits from localStorage on component mount
  useEffect(() => {
    const savedHabits = localStorage.getItem('habits');
    if (savedHabits) {
      const parsedHabits = JSON.parse(savedHabits).map((habit: any) => ({
        ...habit,
        createdAt: new Date(habit.createdAt),
      }));
      setHabits(parsedHabits);
    }
  }, []);

  // Save habits to localStorage whenever habits change
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = (habitData: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      completions: [],
    };
    setHabits([...habits, newHabit]);
    setShowForm(false);
    toast({
      title: "Habit Created",
      description: `${habitData.name} has been added to your tracker!`,
    });
  };

  const updateHabit = (habitData: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => {
    if (!editingHabit) return;
    
    setHabits(habits.map(habit => 
      habit.id === editingHabit.id 
        ? { ...habit, ...habitData }
        : habit
    ));
    setEditingHabit(null);
    setShowForm(false);
    toast({
      title: "Habit Updated",
      description: `${habitData.name} has been updated!`,
    });
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(habit => habit.id !== id));
    toast({
      title: "Habit Deleted",
      description: "Habit has been removed from your tracker.",
    });
  };

  const markHabitComplete = (id: string, value: number = 1) => {
    const today = new Date().toISOString().split('T')[0];
    
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const existingCompletion = habit.completions.find(c => c.date === today);
        if (existingCompletion) {
          return {
            ...habit,
            completions: habit.completions.map(c =>
              c.date === today ? { ...c, value: c.value + value } : c
            ),
          };
        } else {
          return {
            ...habit,
            completions: [...habit.completions, { date: today, value }],
          };
        }
      }
      return habit;
    }));
  };

  const getTodayProgress = (habit: Habit) => {
    const today = new Date().toISOString().split('T')[0];
    const todayCompletion = habit.completions.find(c => c.date === today);
    return todayCompletion ? todayCompletion.value : 0;
  };

  const getStreak = (habit: Habit) => {
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
        // If today is not complete, check yesterday
        continue;
      } else {
        break;
      }
    }
    
    return streak;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Smart Habit Tracker
          </h1>
          <p className="text-gray-600 text-lg">
            Build better habits with AI-powered insights and personalized recommendations
          </p>
        </div>

        <Tabs defaultValue="habits" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-[600px]">
            <TabsTrigger value="habits">My Habits</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="reminders">Reminders</TabsTrigger>
          </TabsList>

          <TabsContent value="habits" className="space-y-6">
            <MotivationalQuotes />
            
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">Today's Habits</h2>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Habit
              </Button>
            </div>

            {habits.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="text-gray-500 mb-4">
                    <Plus className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">No habits yet</h3>
                    <p>Start building better habits by adding your first one!</p>
                  </div>
                  <Button
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Create Your First Habit
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {habits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    progress={getTodayProgress(habit)}
                    streak={getStreak(habit)}
                    onComplete={(value) => markHabitComplete(habit.id, value)}
                    onEdit={() => {
                      setEditingHabit(habit);
                      setShowForm(true);
                    }}
                    onDelete={() => deleteHabit(habit.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics habits={habits} />
          </TabsContent>

          <TabsContent value="insights">
            <AIInsights habits={habits} />
          </TabsContent>

          <TabsContent value="rewards">
            <RewardSystem habits={habits} />
          </TabsContent>

          <TabsContent value="reminders">
            <Reminders habits={habits} />
          </TabsContent>
        </Tabs>

        {showForm && (
          <HabitForm
            habit={editingHabit}
            onSubmit={editingHabit ? updateHabit : addHabit}
            onClose={() => {
              setShowForm(false);
              setEditingHabit(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
