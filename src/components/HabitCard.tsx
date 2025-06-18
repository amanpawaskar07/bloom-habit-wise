
import React from 'react';
import { Check, Edit, Trash2, Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import type { Habit } from '@/pages/Index';

interface HabitCardProps {
  habit: Habit;
  progress: number;
  streak: number;
  onComplete: (value?: number) => void;
  onEdit: () => void;
  onDelete: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  progress,
  streak,
  onComplete,
  onEdit,
  onDelete,
}) => {
  const completionPercentage = Math.min((progress / habit.target) * 100, 100);
  const isCompleted = progress >= habit.target;

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-purple-600';
    if (streak >= 14) return 'text-blue-600';
    if (streak >= 7) return 'text-green-600';
    if (streak >= 3) return 'text-yellow-600';
    return 'text-gray-500';
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:scale-105">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-800 mb-1">
              {habit.name}
            </CardTitle>
            <p className="text-sm text-gray-600 mb-2">{habit.description}</p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {habit.category}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {habit.frequency}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className="h-8 w-8 p-0"
              >
                <Edit className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
            {streak > 0 && (
              <div className={`flex items-center gap-1 ${getStreakColor(streak)}`}>
                <Flame className="w-4 h-4" />
                <span className="text-sm font-semibold">{streak}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                Progress: {progress} / {habit.target}
              </span>
              <span className="text-sm font-semibold text-gray-800">
                {Math.round(completionPercentage)}%
              </span>
            </div>
            <Progress 
              value={completionPercentage} 
              className="h-2"
              style={{
                background: `linear-gradient(to right, ${habit.color}20, ${habit.color}40)`,
              }}
            />
          </div>

          <Button
            onClick={() => onComplete(1)}
            disabled={isCompleted}
            className={`w-full transition-all duration-300 ${
              isCompleted
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
            }`}
          >
            {isCompleted ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Completed Today!
              </>
            ) : (
              'Mark Complete'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HabitCard;
