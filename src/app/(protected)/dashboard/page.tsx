"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  TrendingUp, 
  Activity, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  Calendar,
  ArrowUp,
  ArrowDown,
  RefreshCw
} from 'lucide-react';
import { useStats, useActivity } from '@/lib/queries';
import type { RecentActivity } from '@/types/api';

// Utility Functions
const generateChartData = (activities: RecentActivity[], days: number) => {
  const logsByDate: { [key: string]: { executions: number; successful: number; failed: number } } = {};
  
  activities.forEach((log) => {
    const date = new Date(log.timestamp).toISOString().split('T')[0];
    if (!logsByDate[date]) {
      logsByDate[date] = { executions: 0, successful: 0, failed: 0 };
    }
    logsByDate[date].executions++;
    if (log.status === 'SUCCESS') {
      logsByDate[date].successful++;
    } else if (log.status === 'FAILED') {
      logsByDate[date].failed++;
    }
  });
  
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    data.push({
      date: dateStr,
      executions: logsByDate[dateStr]?.executions || 0,
      successful: logsByDate[dateStr]?.successful || 0,
      failed: logsByDate[dateStr]?.failed || 0
    });
  }
  
  return data;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Main Dashboard Component
export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  
  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;

  // Use custom React Query hooks
  const { 
    data: stats, 
    isLoading: statsLoading, 
    error: statsError,
    refetch: refetchStats
  } = useStats();

  const { 
    data: activities, 
    isLoading: activityLoading, 
    error: activityError,
    refetch: refetchActivity
  } = useActivity(100);

  // Derived data
  const chartData = activities ? generateChartData(activities, days) : [];
  const recentActivity = activities?.slice(0, 8) || [];
  
  const calculateSuccessRate = () => {
    if (!stats?.totalExecutions || stats.totalExecutions === 0) return 0;
    const successful = stats.successfulExecutions || 0;
    return Math.round((successful / stats.totalExecutions) * 100);
  };

  const calculateTodayExecutions = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayData = chartData.find(d => d.date === today);
    return todayData?.executions || 0;
  };

  const calculateWeekExecutions = () => {
    const lastSevenDays = chartData.slice(-7);
    return lastSevenDays.reduce((sum, day) => sum + day.executions, 0);
  };

  const calculateGrowth = () => {
    if (chartData.length < 7) return 0;
    
    const thisWeek = chartData.slice(-7).reduce((sum, day) => sum + day.executions, 0);
    const lastWeek = chartData.slice(-14, -7).reduce((sum, day) => sum + day.executions, 0);
    
    if (lastWeek === 0) return thisWeek > 0 ? 100 : 0;
    return Math.round(((thisWeek - lastWeek) / lastWeek) * 100);
  };

  const handleRefresh = () => {
    refetchStats();
    refetchActivity();
  };

  const isLoading = statsLoading || activityLoading;
  const error = statsError || activityError;

  const maxExecutions = Math.max(...chartData.map(d => d.executions), 1);
  const growth = calculateGrowth();
  const todayExecutions = calculateTodayExecutions();
  const weekExecutions = calculateWeekExecutions();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#0a0a0a] text-white p-6 min-h-screen flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#0a0a0a] text-white p-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-400 mb-4">{error instanceof Error ? error.message : 'Unknown error'}</p>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] text-white p-6 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-400">Overview of your automation performance</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </motion.button>
        </div>
      </motion.div>

      {/* Main Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {/* Total Automations */}
        <motion.div variants={itemVariants} className="bg-zinc-900 overflow-hidden">
          <div className="flex">
            <div className="w-1 bg-blue-500"></div>
            <div className="flex-1 p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-400 text-sm font-medium">Total Automations</p>
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Zap className="w-5 h-5 text-blue-500" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold mb-1">{stats?.totalAutomations || 0}</p>
                  <p className="text-gray-500 text-xs">All workflows</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Active Automations */}
        <motion.div variants={itemVariants} className="bg-zinc-900 overflow-hidden">
          <div className="flex">
            <div className="w-1 bg-green-500"></div>
            <div className="flex-1 p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-400 text-sm font-medium">Active Now</p>
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Activity className="w-4 h-4 text-green-500" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold mb-1 text-green-500">{stats?.activeAutomations || 0}</p>
                  <p className="text-gray-500 text-xs">Running workflows</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Total Executions */}
        <motion.div variants={itemVariants} className="bg-zinc-900 overflow-hidden">
          <div className="flex">
            <div className="w-1 bg-purple-500"></div>
            <div className="flex-1 p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-400 text-sm font-medium">Total Executions</p>
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold mb-1 text-purple-500">
                    {(stats?.totalExecutions || 0).toLocaleString()}
                  </p>
                  <div className={`flex items-center gap-1 text-xs ${growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {growth >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    <span>{Math.abs(growth)}% this week</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Success Rate */}
        <motion.div variants={itemVariants} className="bg-zinc-900 overflow-hidden">
          <div className="flex">
            <div className="w-1 bg-yellow-500"></div>
            <div className="flex-1 p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-400 text-sm font-medium">Success Rate</p>
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-yellow-500" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold mb-1 text-yellow-500">{calculateSuccessRate()}%</p>
                  <p className="text-gray-500 text-xs">Average performance</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Execution Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="lg:col-span-2 bg-zinc-900 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold mb-1">Execution Analytics</h2>
              <p className="text-sm text-gray-400">Track your automation performance over time</p>
            </div>
            <div className="flex gap-2">
              {(['7d', '30d', '90d'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 text-xs rounded transition-colors ${
                    timeRange === range
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#0a0a0a] text-gray-400 hover:text-white'
                  }`}
                >
                  {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
                </button>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="h-64 flex items-end gap-2">
            {chartData.map((data, index) => (
              <motion.div
                key={data.date}
                initial={{ height: 0 }}
                animate={{ height: `${(data.executions / maxExecutions) * 100}%` }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className="flex-1 bg-gradient-to-t from-blue-500/20 to-blue-500/40 rounded-t relative group cursor-pointer hover:from-blue-500/30 hover:to-blue-500/50 transition-colors min-h-[2px]"
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-xs whitespace-nowrap shadow-xl">
                    <p className="text-gray-400 mb-1">{new Date(data.date).toLocaleDateString()}</p>
                    <p className="text-white font-medium">Total: {data.executions}</p>
                    <p className="text-green-500">Success: {data.successful}</p>
                    <p className="text-red-500">Failed: {data.failed}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* X-axis labels */}
          <div className="flex items-center gap-2 mt-4">
            {chartData.map((data, index) => {
              const showLabel = chartData.length <= 7 || index % Math.ceil(chartData.length / 7) === 0;
              return (
                <div key={data.date} className="flex-1 text-center">
                  {showLabel && (
                    <span className="text-xs text-gray-500">
                      {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs text-gray-400">Total Executions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-400">Successful</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-xs text-gray-400">Failed</span>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-zinc-900 p-6"
        >
          <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
          
          <div className="space-y-4">
            {/* Today's Executions */}
            <div className="p-4 bg-[#0a0a0a] rounded-lg border border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Today</span>
                <Calendar className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-2xl font-bold">{todayExecutions}</p>
              <p className="text-xs text-gray-500 mt-1">Executions today</p>
            </div>

            {/* This Week */}
            <div className="p-4 bg-[#0a0a0a] rounded-lg border border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">This Week</span>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-green-500">{weekExecutions}</p>
              <p className="text-xs text-gray-500 mt-1">Executions this week</p>
            </div>

            {/* Failed Executions */}
            <div className="p-4 bg-[#0a0a0a] rounded-lg border border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Failed</span>
                <AlertCircle className="w-4 h-4 text-red-500" />
              </div>
              <p className="text-2xl font-bold text-red-500">{stats?.failedExecutions || 0}</p>
              <p className="text-xs text-gray-500 mt-1">Need attention</p>
            </div>

            {/* Paused */}
            <div className="p-4 bg-[#0a0a0a] rounded-lg border border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Paused</span>
                <Clock className="w-4 h-4 text-yellow-500" />
              </div>
              <p className="text-2xl font-bold text-yellow-500">{stats?.pausedAutomations || 0}</p>
              <p className="text-xs text-gray-500 mt-1">Inactive workflows</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="bg-zinc-900 p-6"
      >
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        
        <div className="space-y-3">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity:RecentActivity, index:any) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3 p-3 bg-[#0a0a0a] rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
              >
                <div className={`p-2 rounded-lg ${
                  activity.status === 'SUCCESS' 
                    ? 'bg-green-500/10 text-green-500' 
                    : activity.status === 'FAILED'
                    ? 'bg-red-500/10 text-red-500'
                    : 'bg-yellow-500/10 text-yellow-500'
                }`}>
                  {activity.status === 'SUCCESS' ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : activity.status === 'FAILED' ? (
                    <AlertCircle className="w-4 h-4" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {activity.automationName}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{activity.details}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      activity.status === 'SUCCESS'
                        ? 'bg-green-500/10 text-green-500'
                        : activity.status === 'FAILED'
                        ? 'bg-red-500/10 text-red-500'
                        : 'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {activity.status}
                    </span>
                    <span className="text-xs text-gray-500">{formatDate(activity.timestamp)}</span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No recent activity</p>
              <p className="text-gray-500 text-xs mt-1">Your automations will appear here once they start running</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}