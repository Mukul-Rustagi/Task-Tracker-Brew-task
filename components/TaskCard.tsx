'use client';

import { ITask } from '@/models/Task';
import { Calendar, Edit2, Trash2, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: ITask;
  onEdit: (task: ITask) => void;
  onDelete: (taskId: string) => void;
  selectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (taskId: string) => void;
}

const priorityColors = {
  low: 'bg-green-100 text-green-700 border-green-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  high: 'bg-red-100 text-red-700 border-red-200',
};

const statusColors = {
  todo: 'bg-blue-100 text-blue-700 border-blue-200',
  'in-progress': 'bg-purple-100 text-purple-700 border-purple-200',
  done: 'bg-green-100 text-green-700 border-green-200',
};

const statusLabels = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
};

const categoryIcons = {
  work: '💼',
  personal: '👤',
  shopping: '🛒',
  health: '💪',
  finance: '💰',
  other: '📌',
};

export default function TaskCard({ task, onEdit, onDelete, selectionMode, isSelected, onToggleSelect }: TaskCardProps) {
  const isOverdue =
    task.dueDate &&
    task.status !== 'done' &&
    new Date(task.dueDate) < new Date();

  return (
    <div className={`group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 overflow-hidden card-hover relative ${
      isSelected ? 'border-purple-500 ring-4 ring-purple-300 dark:ring-purple-600 scale-105' : 'border-gray-200 dark:border-gray-700'
    }`}>
      {/* Decorative gradient bar */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${
        task.priority === 'high' ? 'from-red-500 via-red-600 to-orange-500' :
        task.priority === 'medium' ? 'from-yellow-500 via-yellow-600 to-amber-500' :
        'from-green-500 via-green-600 to-emerald-500'
      }`}></div>
      
      {/* Decorative corner accent */}
      <div className={`absolute top-0 right-0 w-20 h-20 opacity-10 rounded-bl-full ${
        task.priority === 'high' ? 'bg-red-500' :
        task.priority === 'medium' ? 'bg-yellow-500' :
        'bg-green-500'
      }`}></div>
      
      <div className="p-6 pt-8 relative z-10">
        {/* Selection Checkbox */}
        {selectionMode && (
          <div className="absolute top-5 left-5 z-20">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect?.(task._id.toString())}
              className="w-6 h-6 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer transition-all duration-300 hover:scale-110"
            />
          </div>
        )}

        {/* Header with Status and Priority */}
        <div className={`flex items-start justify-between mb-4 ${selectionMode ? 'ml-10' : ''}`}>
          <span
            className={`px-4 py-2 rounded-xl text-xs font-bold border-2 shadow-sm ${
              statusColors[task.status]
            } transition-all duration-300 group-hover:scale-105 group-hover:shadow-md`}
          >
            {statusLabels[task.status]}
          </span>
          <span
            className={`px-4 py-2 rounded-xl text-xs font-bold border-2 shadow-sm ${
              priorityColors[task.priority]
            } transition-all duration-300 group-hover:scale-105 group-hover:shadow-md`}
          >
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {task.title}
        </h3>

        {/* Description */}
        {task.description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
            {task.description}
          </p>
        )}

        {/* Due Date */}
        {task.dueDate && (
          <div
            className={`flex items-center space-x-2 text-sm mb-4 px-3 py-2 rounded-lg ${
              isOverdue 
                ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' 
                : 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span className="font-medium">
              {format(new Date(task.dueDate), 'MMM dd, yyyy')}
              {isOverdue && ' (Overdue)'}
            </span>
          </div>
        )}

        {/* Category and Tags */}
        <div className="mb-4 space-y-3">
          {(task as any).category && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Category:</span>
              <span className="px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold shadow-sm border border-gray-200 dark:border-gray-600">
                {categoryIcons[(task as any).category as keyof typeof categoryIcons] || '📌'} {(task as any).category}
              </span>
            </div>
          )}
          {(task as any).tags && (task as any).tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {(task as any).tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-semibold border border-blue-200 dark:border-blue-700 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                >
                  🏷️ {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Subtasks Progress */}
        {(task as any).subtasks && (task as any).subtasks.length > 0 && (
          <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Subtasks</span>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-sm">
                {(task as any).subtasks.filter((st: any) => st.completed).length} / {(task as any).subtasks.length}
              </span>
            </div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 shadow-lg"
                style={{
                  width: `${((task as any).subtasks.filter((st: any) => st.completed).length / (task as any).subtasks.length) * 100}%`
                }}
              ></div>
            </div>
          </div>
        )}

        {/* Created At */}
        <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mb-4 px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <Clock className="h-3.5 w-3.5" />
          <span className="font-medium">Created {format(new Date(task.createdAt), 'MMM dd, yyyy')}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3 pt-5 border-t-2 border-gray-100 dark:border-gray-700">
          <button
            onClick={() => onEdit(task)}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:scale-105 btn-ripple"
          >
            <Edit2 className="h-4 w-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(task._id.toString())}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white rounded-xl hover:from-red-600 hover:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800 transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:scale-105 btn-ripple"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}


