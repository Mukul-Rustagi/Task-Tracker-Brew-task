'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ITask } from '@/models/Task';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths } from 'date-fns';

interface CalendarViewProps {
  tasks: ITask[];
  onTaskClick: (task: ITask) => void;
}

export default function CalendarView({ tasks, onTaskClick }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the day of week for the first day (0 = Sunday, 6 = Saturday)
  const firstDayOfWeek = monthStart.getDay();

  // Create empty cells for days before the month starts
  const emptyCells = Array(firstDayOfWeek).fill(null);

  const getTasksForDay = (day: Date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      return isSameDay(new Date(task.dueDate), day);
    });
  };

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border-2 border-gray-100 dark:border-gray-700 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {tasks.filter(t => t.dueDate).length} tasks scheduled this month
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={goToToday}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl hover:scale-105"
          >
            Today
          </button>
          <button
            onClick={previousMonth}
            className="p-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-3">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-bold text-gray-700 dark:text-gray-300 text-sm py-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg shadow-sm">
            {day}
          </div>
        ))}

        {/* Empty cells before month starts */}
        {emptyCells.map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square"></div>
        ))}

        {/* Days of the month */}
        {daysInMonth.map(day => {
          const dayTasks = getTasksForDay(day);
          const isCurrentDay = isToday(day);

          return (
            <div
              key={day.toString()}
              className={`aspect-square border-2 rounded-xl p-3 transition-all duration-300 shadow-sm hover:shadow-lg ${
                isCurrentDay
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/30 shadow-blue-200 dark:shadow-blue-900/50 ring-2 ring-blue-300 dark:ring-blue-600'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <div className="flex flex-col h-full">
                <div className={`text-sm font-bold mb-2 flex items-center justify-between ${
                  isCurrentDay 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  <span>{format(day, 'd')}</span>
                  {dayTasks.length > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                      isCurrentDay
                        ? 'bg-blue-200 dark:bg-blue-700 text-blue-700 dark:text-blue-200'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {dayTasks.length}
                    </span>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar">
                  {dayTasks.slice(0, 3).map(task => (
                    <button
                      key={task._id.toString()}
                      onClick={() => onTaskClick(task)}
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold truncate transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 ${
                        task.priority === 'high'
                          ? 'bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/60 dark:to-red-800/50 text-red-700 dark:text-red-300 hover:from-red-200 hover:to-red-300 dark:hover:from-red-900/80 dark:hover:to-red-800/70 border border-red-300 dark:border-red-700'
                          : task.priority === 'medium'
                          ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900/60 dark:to-yellow-800/50 text-yellow-700 dark:text-yellow-300 hover:from-yellow-200 hover:to-yellow-300 dark:hover:from-yellow-900/80 dark:hover:to-yellow-800/70 border border-yellow-300 dark:border-yellow-700'
                          : 'bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/60 dark:to-green-800/50 text-green-700 dark:text-green-300 hover:from-green-200 hover:to-green-300 dark:hover:from-green-900/80 dark:hover:to-green-800/70 border border-green-300 dark:border-green-700'
                      }`}
                      title={task.title}
                    >
                      {task.title}
                    </button>
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center font-medium bg-gray-100 dark:bg-gray-700 rounded-lg py-1">
                      +{dayTasks.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-8 pt-6 border-t-2 border-gray-100 dark:border-gray-700">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/20 rounded-lg border border-red-200 dark:border-red-800 shadow-sm">
            <div className="w-3 h-3 bg-gradient-to-br from-red-400 to-red-600 rounded-full shadow-md"></div>
            <span className="font-semibold text-red-700 dark:text-red-300">High Priority</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/20 rounded-lg border border-yellow-200 dark:border-yellow-800 shadow-sm">
            <div className="w-3 h-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-md"></div>
            <span className="font-semibold text-yellow-700 dark:text-yellow-300">Medium Priority</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-800 shadow-sm">
            <div className="w-3 h-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-md"></div>
            <span className="font-semibold text-green-700 dark:text-green-300">Low Priority</span>
          </div>
        </div>
      </div>
    </div>
  );
}

