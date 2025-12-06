"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  LogOut,
  Loader2,
  Calendar,
  AlertCircle,
  Download,
  FileText,
  TrendingUp,
  Moon,
  Sun,
  X,
} from "lucide-react";
import TaskCard from "@/components/TaskCard";
import TaskModal from "@/components/TaskModal";
import { ITask } from "@/models/Task";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useTheme } from "@/contexts/ThemeContext";

type TaskStatus = "all" | "todo" | "in-progress" | "done";
type TaskCategory = "all" | "work" | "personal" | "shopping" | "health" | "finance" | "other";

export default function DashboardPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<ITask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus>("all");
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ITask | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [bulkActionMode, setBulkActionMode] = useState(false);
  const [dateRangeStart, setDateRangeStart] = useState('');
  const [dateRangeEnd, setDateRangeEnd] = useState('');

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      fetchTasks();
    }
  }, [status, router]);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchQuery, statusFilter, categoryFilter, dateRangeStart, dateRangeEnd]);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/tasks");
      if (response.ok) {
        const result = await response.json();
        // Handle new API response format
        const tasksData = result.data?.tasks || result.tasks || [];
        setTasks(tasksData);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterTasks = () => {
    let filtered = [...tasks];

    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((task) => (task as any).category === categoryFilter);
    }

    if (dateRangeStart && dateRangeEnd) {
      const startDate = new Date(dateRangeStart);
      const endDate = new Date(dateRangeEnd);
      filtered = filtered.filter((task) => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        return taskDate >= startDate && taskDate <= endDate;
      });
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query) ||
          ((task as any).tags && (task as any).tags.some((tag: string) => tag.toLowerCase().includes(query)))
      );
    }

    setFilteredTasks(filtered);
  };

  const clearDateRange = () => {
    setDateRangeStart('');
    setDateRangeEnd('');
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: ITask) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTasks(tasks.filter((task) => task._id.toString() !== taskId));
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleTaskSaved = () => {
    fetchTasks();
    setIsModalOpen(false);
  };

  const toggleTaskSelection = (taskId: string) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
  };

  const selectAllTasks = () => {
    if (selectedTasks.size === filteredTasks.length) {
      setSelectedTasks(new Set());
    } else {
      setSelectedTasks(new Set(filteredTasks.map(task => task._id.toString())));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTasks.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedTasks.size} task(s)?`)) return;

    try {
      const deletePromises = Array.from(selectedTasks).map(taskId =>
        fetch(`/api/tasks/${taskId}`, { method: "DELETE" })
      );
      await Promise.all(deletePromises);
      fetchTasks();
      setSelectedTasks(new Set());
    } catch (error) {
      console.error("Failed to delete tasks:", error);
    }
  };

  const handleBulkStatusChange = async (newStatus: "todo" | "in-progress" | "done") => {
    if (selectedTasks.size === 0) return;

    try {
      const updatePromises = Array.from(selectedTasks).map(taskId => {
        const task = tasks.find(t => t._id.toString() === taskId);
        if (!task) return Promise.resolve();
        return fetch(`/api/tasks/${taskId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...task, status: newStatus }),
        });
      });
      await Promise.all(updatePromises);
      fetchTasks();
      setSelectedTasks(new Set());
    } catch (error) {
      console.error("Failed to update tasks:", error);
    }
  };

  const getTaskStats = () => {
    // Safety check to prevent errors if tasks is undefined
    const safeTasks = tasks || [];
    return {
      total: safeTasks.length,
      todo: safeTasks.filter((t) => t.status === "todo").length,
      inProgress: safeTasks.filter((t) => t.status === "in-progress").length,
      done: safeTasks.filter((t) => t.status === "done").length,
    };
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(59, 130, 246);
    doc.text("Task Tracker Report", 14, 20);
    
    // Add user info
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated for: ${session?.user?.name || "User"}`, 14, 28);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 33);
    
    // Add stats
    const stats = getTaskStats();
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Summary Statistics", 14, 43);
    doc.setFontSize(10);
    doc.text(`Total Tasks: ${stats.total}`, 14, 50);
    doc.text(`To Do: ${stats.todo}`, 14, 56);
    doc.text(`In Progress: ${stats.inProgress}`, 14, 62);
    doc.text(`Completed: ${stats.done}`, 14, 68);
    
    // Add tasks table
    const tableData = filteredTasks.map((task) => [
      task.title,
      task.status.replace("-", " ").toUpperCase(),
      task.priority.toUpperCase(),
      task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date",
      task.description?.substring(0, 50) || "No description",
    ]);
    
    autoTable(doc, {
      startY: 75,
      head: [["Title", "Status", "Priority", "Due Date", "Description"]],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
      margin: { top: 75 },
    });
    
    // Save the PDF
    doc.save(`tasks-report-${new Date().toISOString().split("T")[0]}.pdf`);
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const stats = getTaskStats();
  const completionRate = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg pulse-glow">
                <CheckSquare className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">
                  Task Tracker
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome back, <span className="font-semibold text-blue-600">{session.user.name}</span>! 👋
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </button>
              <Link
                href="/profile"
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md font-medium"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {session.user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="hidden sm:inline">Profile</span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md font-medium"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 card-hover animate-fadeIn">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-xl">
                <CheckSquare className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" style={{width: '100%'}}></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-6 border-2 border-blue-200 card-hover animate-fadeIn" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-blue-700 mb-1">To Do</p>
                <p className="text-3xl font-bold text-blue-900">{stats.todo}</p>
              </div>
              <div className="bg-blue-200 p-3 rounded-xl">
                <Calendar className="h-8 w-8 text-blue-700" />
              </div>
            </div>
            <div className="mt-4 h-2 bg-blue-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{width: stats.total > 0 ? `${(stats.todo / stats.total) * 100}%` : '0%'}}></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl shadow-lg p-6 border-2 border-yellow-200 card-hover animate-fadeIn" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-yellow-700 mb-1">In Progress</p>
                <p className="text-3xl font-bold text-yellow-900">{stats.inProgress}</p>
              </div>
              <div className="bg-yellow-200 p-3 rounded-xl">
                <Loader2 className="h-8 w-8 text-yellow-700" />
              </div>
            </div>
            <div className="mt-4 h-2 bg-yellow-200 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-600 rounded-full transition-all duration-500" style={{width: stats.total > 0 ? `${(stats.inProgress / stats.total) * 100}%` : '0%'}}></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg p-6 border-2 border-green-200 card-hover animate-fadeIn" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-green-700 mb-1">Completed</p>
                <p className="text-3xl font-bold text-green-900">{stats.done}</p>
              </div>
              <div className="bg-green-200 p-3 rounded-xl">
                <CheckSquare className="h-8 w-8 text-green-700" />
              </div>
            </div>
            <div className="mt-4 h-2 bg-green-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-600 rounded-full transition-all duration-500" style={{width: stats.total > 0 ? `${(stats.done / stats.total) * 100}%` : '0%'}}></div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {stats.total > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-2 border-gray-100 animate-fadeIn" style={{animationDelay: '0.4s'}}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
              </div>
              <span className="text-2xl font-bold gradient-text">{completionRate}%</span>
            </div>
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full transition-all duration-1000 ease-out"
                style={{width: `${completionRate}%`}}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {stats.done} of {stats.total} tasks completed
            </p>
          </div>
        )}

        {/* Actions Bar */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 border-2 border-gray-100 dark:border-gray-700 animate-fadeIn" style={{animationDelay: '0.5s'}}>
          <div className="flex flex-col space-y-4">
            {/* Search and Date Range */}
            <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search tasks by title, description, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              {/* Date Range Filter */}
              <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 px-4 py-2 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <input
                  type="date"
                  value={dateRangeStart}
                  onChange={(e) => setDateRangeStart(e.target.value)}
                  placeholder="Start Date"
                  className="px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm font-medium"
                />
                <span className="text-gray-500 dark:text-gray-400 font-bold">to</span>
                <input
                  type="date"
                  value={dateRangeEnd}
                  onChange={(e) => setDateRangeEnd(e.target.value)}
                  placeholder="End Date"
                  className="px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm font-medium"
                />
                {(dateRangeStart || dateRangeEnd) && (
                  <button
                    onClick={clearDateRange}
                    className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-all duration-300"
                    title="Clear date range"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter and Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as TaskStatus)}
                  className="px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white dark:bg-gray-700 font-medium text-gray-900 dark:text-gray-100"
                >
                  <option value="all">All Status</option>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as TaskCategory)}
                className="px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white dark:bg-gray-700 font-medium text-gray-900 dark:text-gray-100"
              >
                <option value="all">All Categories</option>
                <option value="work">💼 Work</option>
                <option value="personal">👤 Personal</option>
                <option value="shopping">🛒 Shopping</option>
                <option value="health">💪 Health</option>
                <option value="finance">💰 Finance</option>
                <option value="other">📌 Other</option>
              </select>

              <button
                onClick={() => setBulkActionMode(!bulkActionMode)}
                className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold ${
                  bulkActionMode
                    ? "bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700"
                    : "bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800"
                }`}
              >
                <CheckSquare className="h-5 w-5" />
                <span>{bulkActionMode ? "Cancel Bulk" : "Bulk Actions"}</span>
              </button>

              <button
                onClick={exportToPDF}
                disabled={filteredTasks.length === 0}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Download className="h-5 w-5" />
                <span>Export PDF</span>
              </button>

              <button
                onClick={handleCreateTask}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold btn-ripple"
              >
                <Plus className="h-5 w-5" />
                <span>New Task</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {bulkActionMode && (
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg p-6 mb-8 animate-slideIn">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={selectedTasks.size === filteredTasks.length && filteredTasks.length > 0}
                  onChange={selectAllTasks}
                  className="w-5 h-5 rounded border-white/30 text-purple-600 focus:ring-2 focus:ring-white"
                />
                <span className="text-white font-semibold">
                  {selectedTasks.size} task(s) selected
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleBulkStatusChange("todo")}
                  disabled={selectedTasks.size === 0}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Mark as To Do
                </button>
                <button
                  onClick={() => handleBulkStatusChange("in-progress")}
                  disabled={selectedTasks.size === 0}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Mark as In Progress
                </button>
                <button
                  onClick={() => handleBulkStatusChange("done")}
                  disabled={selectedTasks.size === 0}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Mark as Done
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={selectedTasks.size === 0}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete Selected
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tasks Display */}
        {filteredTasks.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center border-2 border-gray-100 dark:border-gray-700 animate-fadeIn">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 p-8 rounded-full">
                {searchQuery || statusFilter !== "all" ? (
                  <AlertCircle className="h-20 w-20 text-gray-400 dark:text-gray-500" />
                ) : (
                  <FileText className="h-20 w-20 text-gray-400 dark:text-gray-500" />
                )}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {searchQuery || statusFilter !== "all"
                ? "No tasks found"
                : "No tasks yet"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-md mx-auto">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filter to find what you're looking for"
                : "Get started by creating your first task and boost your productivity!"}
            </p>
            {!searchQuery && statusFilter === "all" && (
              <button
                onClick={handleCreateTask}
                className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold btn-ripple"
              >
                <Plus className="h-6 w-6" />
                <span>Create Your First Task</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task, index) => (
              <div key={task._id.toString()} className="animate-fadeIn" style={{animationDelay: `${index * 0.05}s`}}>
                <TaskCard
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  selectionMode={bulkActionMode}
                  isSelected={selectedTasks.has(task._id.toString())}
                  onToggleSelect={toggleTaskSelection}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Task Modal */}
      {isModalOpen && (
        <TaskModal
          task={editingTask}
          onClose={() => setIsModalOpen(false)}
          onSave={handleTaskSaved}
        />
      )}
    </div>
  );
}
