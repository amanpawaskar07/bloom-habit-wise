
import React, { useState, useEffect } from 'react';
import { Bell, Clock, Plus, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import type { Habit } from '@/pages/Index';

interface Reminder {
  id: string;
  habitId: string;
  time: string;
  enabled: boolean;
  days: string[];
}

interface RemindersProps {
  habits: Habit[];
}

const daysOfWeek = [
  { label: 'Monday', value: 'mon' },
  { label: 'Tuesday', value: 'tue' },
  { label: 'Wednesday', value: 'wed' },
  { label: 'Thursday', value: 'thu' },
  { label: 'Friday', value: 'fri' },
  { label: 'Saturday', value: 'sat' },
  { label: 'Sunday', value: 'sun' }
];

const Reminders: React.FC<RemindersProps> = ({ habits }) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReminder, setNewReminder] = useState({
    habitId: '',
    time: '09:00',
    days: ['mon', 'tue', 'wed', 'thu', 'fri']
  });
  const { toast } = useToast();

  // Load reminders from localStorage
  useEffect(() => {
    const savedReminders = localStorage.getItem('habit-reminders');
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    }
  }, []);

  // Save reminders to localStorage
  useEffect(() => {
    localStorage.setItem('habit-reminders', JSON.stringify(reminders));
  }, [reminders]);

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const addReminder = () => {
    if (!newReminder.habitId) {
      toast({
        title: "Error",
        description: "Please select a habit for the reminder.",
        variant: "destructive"
      });
      return;
    }

    const reminder: Reminder = {
      id: crypto.randomUUID(),
      habitId: newReminder.habitId,
      time: newReminder.time,
      enabled: true,
      days: newReminder.days
    };

    setReminders([...reminders, reminder]);
    setNewReminder({
      habitId: '',
      time: '09:00',
      days: ['mon', 'tue', 'wed', 'thu', 'fri']
    });
    setShowAddForm(false);

    toast({
      title: "Reminder Added",
      description: "Your habit reminder has been set up successfully!",
    });
  };

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(reminder =>
      reminder.id === id
        ? { ...reminder, enabled: !reminder.enabled }
        : reminder
    ));
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
    toast({
      title: "Reminder Deleted",
      description: "The reminder has been removed.",
    });
  };

  const getHabitName = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    return habit ? habit.name : 'Unknown Habit';
  };

  const toggleDay = (day: string) => {
    setNewReminder(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-500" />
              Habit Reminders
            </CardTitle>
            <Button
              onClick={() => setShowAddForm(true)}
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Reminder
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {reminders.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No Reminders Set
              </h3>
              <p className="text-gray-500 mb-4">
                Set up reminders to help you stay on track with your habits.
              </p>
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Create Your First Reminder
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-white shadow-sm"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">
                      {getHabitName(reminder.habitId)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {reminder.time} • {reminder.days.map(day => 
                        daysOfWeek.find(d => d.value === day)?.label
                      ).join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={reminder.enabled}
                      onCheckedChange={() => toggleReminder(reminder.id)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteReminder(reminder.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {showAddForm && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Add New Reminder</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddForm(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="habit-select">Select Habit</Label>
              <Select
                value={newReminder.habitId}
                onValueChange={(value) => setNewReminder(prev => ({ ...prev, habitId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a habit" />
                </SelectTrigger>
                <SelectContent>
                  {habits.map((habit) => (
                    <SelectItem key={habit.id} value={habit.id}>
                      {habit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="reminder-time">Reminder Time</Label>
              <Input
                id="reminder-time"
                type="time"
                value={newReminder.time}
                onChange={(e) => setNewReminder(prev => ({ ...prev, time: e.target.value }))}
              />
            </div>

            <div>
              <Label>Days of the Week</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {daysOfWeek.map((day) => (
                  <Button
                    key={day.value}
                    variant={newReminder.days.includes(day.value) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleDay(day.value)}
                    type="button"
                  >
                    {day.label.slice(0, 3)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAddForm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={addReminder}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={!newReminder.habitId}
              >
                Add Reminder
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Reminders;
