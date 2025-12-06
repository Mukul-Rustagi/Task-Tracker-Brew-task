"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import {
  User,
  Mail,
  Calendar,
  CheckSquare,
  TrendingUp,
  Award,
  Target,
  Clock,
  ArrowLeft,
  Edit2,
  Save,
  X,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface UserStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  completionRate: number;
  averageCompletionTime: number;
  tasksThisWeek: number;
  tasksThisMonth: number;
  highPriorityCompleted: number;
  streak: number;
}

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      setName(session.user.name || "");
      fetchUserStats();
    }
  }, [status, router, session]);

  const fetchUserStats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/tasks");
      if (response.ok) {
        const result = await response.json();
        // Handle new API response format
        const tasks = result.data?.tasks || result.tasks || [];

        // Calculate statistics
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter((t: any) => t.status === "done").length;
        const inProgressTasks = tasks.filter((t: any) => t.status === "in-progress").length;
        const todoTasks = tasks.filter((t: any) => t.status === "todo").length;
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        // Tasks this week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const tasksThisWeek = tasks.filter(
          (t: any) => new Date(t.createdAt) >= oneWeekAgo
        ).length;

        // Tasks this month
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const tasksThisMonth = tasks.filter(
          (t: any) => new Date(t.createdAt) >= oneMonthAgo
        ).length;

        // High priority completed
        const highPriorityCompleted = tasks.filter(
          (t: any) => t.priority === "high" && t.status === "done"
        ).length;

        // Calculate streak (consecutive days with completed tasks)
        const completedDates = tasks
          .filter((t: any) => t.status === "done")
          .map((t: any) => new Date(t.updatedAt).toDateString())
          .filter((date: string, index: number, self: string[]) => self.indexOf(date) === index)
          .sort((a: string, b: string) => new Date(b).getTime() - new Date(a).getTime());

        let streak = 0;
        const today = new Date().toDateString();
        if (completedDates.includes(today)) {
          streak = 1;
          for (let i = 1; i < completedDates.length; i++) {
            const prevDate = new Date(completedDates[i - 1]);
            const currDate = new Date(completedDates[i]);
            const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
              streak++;
            } else {
              break;
            }
          }
        }

        setStats({
          totalTasks,
          completedTasks,
          inProgressTasks,
          todoTasks,
          completionRate,
          averageCompletionTime: 0,
          tasksThisWeek,
          tasksThisMonth,
          highPriorityCompleted,
          streak,
        });
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveName = async () => {
    if (!name.trim()) {
      alert("Name cannot be empty");
      return;
    }
    
    if (name === session?.user?.name) {
      setIsEditing(false);
      return;
    }
    
    setIsSaving(true);
    
    try {
      const response = await fetch("/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update name");
      }

      // Update the session with new name
      await update({ name: data.user.name });
      
      // Small delay to ensure session is updated
      setTimeout(() => {
        setIsEditing(false);
        setIsSaving(false);
        // Force a refresh of the session
        window.location.reload();
      }, 500);
    } catch (error: any) {
      alert(error.message || "Failed to update name");
      setName(session?.user?.name || "");
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  const getProfileCompletion = () => {
    let completion = 0;
    if (session?.user?.name) completion += 25;
    if (session?.user?.email) completion += 25;
    if (stats && stats.totalTasks > 0) completion += 25;
    if (stats && stats.completedTasks > 0) completion += 25;
    return completion;
  };

  const getAchievements = () => {
    const achievements = [];
    if (stats) {
      if (stats.totalTasks >= 1) achievements.push({ icon: "🎯", title: "First Task", desc: "Created your first task" });
      if (stats.totalTasks >= 10) achievements.push({ icon: "📝", title: "Task Master", desc: "Created 10 tasks" });
      if (stats.completedTasks >= 5) achievements.push({ icon: "✅", title: "Achiever", desc: "Completed 5 tasks" });
      if (stats.completionRate >= 50) achievements.push({ icon: "🏆", title: "Half Way", desc: "50% completion rate" });
      if (stats.completionRate === 100) achievements.push({ icon: "💯", title: "Perfectionist", desc: "100% completion rate" });
      if (stats.streak >= 3) achievements.push({ icon: "🔥", title: "On Fire", desc: `${stats.streak} day streak` });
      if (stats.highPriorityCompleted >= 3) achievements.push({ icon: "⭐", title: "Priority Pro", desc: "Completed 3 high priority tasks" });
    }
    return achievements;
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const profileCompletion = getProfileCompletion();
  const achievements = getAchievements();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Dashboard</span>
            </Link>
            <h1 className="text-2xl font-bold gradient-text">My Profile</h1>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100 animate-fadeIn">
              <div className="text-center">
                {/* Avatar */}
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="absolute bottom-0 right-0 w-10 h-10 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <CheckSquare className="h-5 w-5 text-white" />
                  </div>
                </div>

                {/* Name */}
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center font-semibold"
                      placeholder="Your name"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveName}
                        disabled={isSaving}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold"
                      >
                        {isSaving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setName(session.user.name || "");
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {session.user.name}
                    </h2>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1 mx-auto"
                    >
                      <Edit2 className="h-3 w-3" />
                      <span>Edit name</span>
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-center space-x-2 text-gray-600 mt-3">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{session.user.email}</span>
                </div>

                <div className="flex items-center justify-center space-x-2 text-gray-600 mt-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Member since {new Date().toLocaleDateString()}</span>
                </div>
              </div>

              {/* Profile Completion */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Profile Completion</span>
                  <span className="text-2xl font-bold gradient-text">{profileCompletion}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full transition-all duration-1000"
                    style={{ width: `${profileCompletion}%` }}
                  ></div>
                </div>
                <div className="mt-3 space-y-1 text-xs text-gray-600">
                  <div className="flex items-center space-x-2">
                    <CheckSquare className={`h-3 w-3 ${session.user.name ? 'text-green-500' : 'text-gray-400'}`} />
                    <span>Name added</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckSquare className={`h-3 w-3 ${session.user.email ? 'text-green-500' : 'text-gray-400'}`} />
                    <span>Email verified</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckSquare className={`h-3 w-3 ${stats && stats.totalTasks > 0 ? 'text-green-500' : 'text-gray-400'}`} />
                    <span>First task created</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckSquare className={`h-3 w-3 ${stats && stats.completedTasks > 0 ? 'text-green-500' : 'text-gray-400'}`} />
                    <span>First task completed</span>
                  </div>
                </div>
              </div>

              {/* Sign Out Button */}
              <button
                onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                className="w-full mt-6 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-300 font-semibold"
              >
                Sign Out
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 animate-fadeIn" style={{animationDelay: '0.1s'}}>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span>Quick Stats</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tasks This Week</span>
                  <span className="text-lg font-bold text-blue-600">{stats?.tasksThisWeek || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tasks This Month</span>
                  <span className="text-lg font-bold text-purple-600">{stats?.tasksThisMonth || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Streak</span>
                  <span className="text-lg font-bold text-orange-600 flex items-center space-x-1">
                    <span>{stats?.streak || 0}</span>
                    <span className="text-base">🔥</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Achievements */}
          <div className="lg:col-span-2 space-y-6">
            {/* Statistics Overview */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100 animate-fadeIn" style={{animationDelay: '0.2s'}}>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <Target className="h-6 w-6 text-blue-600" />
                <span>Task Statistics</span>
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-4xl font-bold gradient-text mb-2">{stats?.totalTasks || 0}</div>
                  <div className="text-sm text-gray-600">Total Tasks</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">{stats?.completedTasks || 0}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-600 mb-2">{stats?.inProgressTasks || 0}</div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{stats?.todoTasks || 0}</div>
                  <div className="text-sm text-gray-600">To Do</div>
                </div>
              </div>

              {/* Completion Rate Circle */}
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-48 h-48">
                  <svg className="transform -rotate-90 w-48 h-48">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-gray-200"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="url(#gradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 88}`}
                      strokeDashoffset={`${2 * Math.PI * 88 * (1 - (stats?.completionRate || 0) / 100)}`}
                      className="transition-all duration-1000"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold gradient-text">{stats?.completionRate || 0}%</div>
                    <div className="text-sm text-gray-600 mt-1">Completion Rate</div>
                  </div>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">High Priority Completed</span>
                    <span className="text-sm font-bold text-red-600">{stats?.highPriorityCompleted || 0}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-500"
                      style={{ width: stats?.totalTasks ? `${(stats.highPriorityCompleted / stats.totalTasks) * 100}%` : '0%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100 animate-fadeIn" style={{animationDelay: '0.3s'}}>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <Award className="h-6 w-6 text-yellow-600" />
                <span>Achievements</span>
              </h3>

              {achievements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200 hover:scale-105 transition-transform duration-300"
                    >
                      <div className="text-4xl">{achievement.icon}</div>
                      <div>
                        <div className="font-bold text-gray-900">{achievement.title}</div>
                        <div className="text-sm text-gray-600">{achievement.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Complete tasks to unlock achievements!</p>
                </div>
              )}
            </div>

            {/* Activity Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100 animate-fadeIn" style={{animationDelay: '0.4s'}}>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <Clock className="h-6 w-6 text-purple-600" />
                <span>Activity Summary</span>
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <CheckSquare className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Total Tasks Created</div>
                      <div className="text-sm text-gray-600">All time</div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-blue-600">{stats?.totalTasks || 0}</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Tasks Completed</div>
                      <div className="text-sm text-gray-600">Successfully finished</div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-green-600">{stats?.completedTasks || 0}</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Success Rate</div>
                      <div className="text-sm text-gray-600">Completion percentage</div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-purple-600">{stats?.completionRate || 0}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

