"use client";
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Edit2, Trash2, Plus, Filter, RefreshCw, Clock, Activity, TrendingUp } from 'lucide-react';
import { useRouter } from "next/navigation";
import CreateAutomationModal from "@/components/dashboard/AutomationModal";
import { 
  useAutomations, 
  useStats, 
  useActiveIntegrations,
  useToggleAutomation,
  useDeleteAutomation 
} from '@/lib/queries';
import type { Automation } from '@/types/api';

const AutomationsPage: React.FC = () => {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // React Query hooks
  const { 
    data: automations = [], 
    isLoading: automationsLoading, 
    error: automationsError,
    refetch: refetchAutomations 
  } = useAutomations();

  const { 
    data: stats, 
    refetch: refetchStats 
  } = useStats();

  const { 
    data: integrations = [] 
  } = useActiveIntegrations();

  const toggleMutation = useToggleAutomation();
  const deleteMutation = useDeleteAutomation();

  // Filter automations based on selected filters
  const filteredAutomations = useMemo(() => {
    let filtered = [...automations];
    
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(a => a.status === statusFilter);
    }
    
    if (typeFilter !== 'ALL') {
      filtered = filtered.filter(a => a.type === typeFilter);
    }
    
    return filtered;
  }, [automations, statusFilter, typeFilter]);

  const handleCreateSuccess = (automationId: string): void => {
    setShowCreateModal(false);
    router.push(`/dashboard/automations/${automationId}`);
  };

  const handleEditAutomation = (automationId: string): void => {
    router.push(`/dashboard/automations/${automationId}`);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'ACTIVE': return 'text-green-500';
      case 'PAUSED': return 'text-yellow-500';
      case 'FAILED': return 'text-red-500';
      case 'COMPLETED': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getTypeLabel = (type: string): string => {
    return type.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Never';
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
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const calculateSuccessRate = (automation: Automation): number => {
    if (automation.totalExecutions === 0) return 0;
    return Math.round((automation.successfulExecutions / automation.totalExecutions) * 100);
  };

  const handleToggleStatus = async (id: string, currentStatus: string): Promise<void> => {
    const newStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    
    try {
      await toggleMutation.mutateAsync({ id, status: newStatus });
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Failed to toggle automation status. Please try again.');
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this automation? This action cannot be undone.')) {
      return;
    }
    
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting automation:', error);
      alert('Failed to delete automation. Please try again.');
    }
  };

  const handleRefresh = () => {
    refetchAutomations();
    refetchStats();
  };

  const automationTypes = [
    'AUTO_LIKE', 
    'AUTO_FOLLOW', 
    'AUTO_COMMENT', 
    'AUTO_UNFOLLOW', 
    'SCHEDULED_POST', 
    'STORY_VIEW', 
    'DM_AUTOMATION'
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      }
    }
  };

 const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1] as const 
    }
  }
};

  const isLoading = automationsLoading;
  const error = automationsError;

  return (
    <div className="bg-[#0a0a0a] text-white p-6">
      {/* Create Modal */}
      <CreateAutomationModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
        integrations={integrations}
      />

      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Automations</h1>
            <p className="text-gray-400">Create and manage automated workflows</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded transition-colors"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4 h-4" />
            Create Automation
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Overview Cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
      >
        <motion.div variants={itemVariants} className="bg-zinc-900 overflow-hidden">
          <div className="flex">
            <div className="w-1 bg-blue-500"></div>
            <div className="flex-1 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm font-medium">Total Automations</p>
                <Zap className="w-4 h-4 text-gray-500" />
              </div>
              <div className="flex items-end gap-2">
                <p className="text-2xl font-bold">{stats?.totalAutomations || 0}</p>
                <p className="text-gray-500 text-sm mb-1">workflows</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-zinc-900 overflow-hidden">
          <div className="flex">
            <div className="w-1 bg-green-500"></div>
            <div className="flex-1 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm font-medium">Active</p>
                <Activity className="w-4 h-4 text-gray-500" />
              </div>
              <div className="flex items-end gap-2">
                <p className="text-2xl font-bold text-green-500">{stats?.activeAutomations || 0}</p>
                <p className="text-gray-500 text-sm mb-1">running</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-zinc-900 overflow-hidden">
          <div className="flex">
            <div className="w-1 bg-yellow-500"></div>
            <div className="flex-1 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm font-medium">Paused</p>
                <Clock className="w-4 h-4 text-gray-500" />
              </div>
              <div className="flex items-end gap-2">
                <p className="text-2xl font-bold text-yellow-500">{stats?.pausedAutomations || 0}</p>
                <p className="text-gray-500 text-sm mb-1">idle</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-zinc-900 overflow-hidden">
          <div className="flex">
            <div className="w-1 bg-purple-500"></div>
            <div className="flex-1 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm font-medium">Total Executions</p>
                <TrendingUp className="w-4 h-4 text-gray-500" />
              </div>
              <div className="flex items-end gap-2">
                <p className="text-2xl font-bold text-purple-500">{(stats?.totalExecutions || 0).toLocaleString()}</p>
                <p className="text-gray-500 text-sm mb-1">actions</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Filters Section */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="bg-zinc-900 p-4 mb-6"
      >
        <div className="flex items-center gap-4">
          <Filter className="w-4 h-4 text-gray-400" />
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0a0a0a] border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="PAUSED">Paused</option>
            <option value="FAILED">Failed</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-[#0a0a0a] border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Types</option>
            {automationTypes.map(type => (
              <option key={type} value={type}>{getTypeLabel(type)}</option>
            ))}
          </select>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="ml-auto flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </motion.button>
        </div>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-500/10 border border-red-500 text-red-500 p-4 mb-4"
          >
            {error instanceof Error ? error.message : 'Failed to load automations'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-zinc-900 overflow-hidden"
      >
        {isLoading ? (
          <div className="text-center py-12">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
            />
            <p className="text-gray-400 mt-4">Loading automations...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-800 bg-zinc-900">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Name</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Type</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Executions</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Success Rate</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Last Run</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredAutomations.map((automation) => {
                    const isActive = automation.status === 'ACTIVE';
                    const isToggling = toggleMutation.isPending;
                    const successRate = calculateSuccessRate(automation);
                    
                    return (
                      <motion.tr 
                        key={automation.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
                        transition={{ duration: 0.2 }}
                        className="border-b border-gray-800/50 cursor-pointer"
                        onClick={() => handleEditAutomation(automation.id)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="font-medium text-white">{automation.name}</p>
                              {automation.description && (
                                <p className="text-xs text-gray-500 mt-0.5">{automation.description}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-300 bg-gray-800 px-2 py-1 rounded">
                            {getTypeLabel(automation.type)}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <span className="text-white font-medium">{automation.totalExecutions.toLocaleString()}</span>
                            <span className="text-gray-500 text-xs ml-1">total</span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${successRate}%` }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className={`h-full ${
                                  successRate >= 80 ? 'bg-green-500' : 
                                  successRate >= 50 ? 'bg-yellow-500' : 
                                  'bg-red-500'
                                }`}
                              />
                            </div>
                            <span className="text-xs text-gray-400">{successRate}%</span>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-400">
                            {formatDate(automation.lastExecutedAt)}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-3">
                            {/* Toggle Switch */}
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleStatus(automation.id, automation.status);
                              }}
                              disabled={isToggling || automation.status === 'FAILED' || automation.status === 'COMPLETED'}
                              className={`relative w-11 h-6 rounded-full transition-colors ${
                                isActive ? 'bg-green-500' : 'bg-gray-600'
                              } ${(isToggling || automation.status === 'FAILED' || automation.status === 'COMPLETED') ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                              <motion.div 
                                animate={{ x: isActive ? 20 : 2 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-md"
                              >
                                {isToggling && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                  </div>
                                )}
                              </motion.div>
                            </motion.button>
                            
                            <span className={`font-medium text-xs ${getStatusColor(automation.status)}`}>
                              {automation.status}
                            </span>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 rounded hover:bg-blue-500/10 text-blue-500 transition-colors"
                              title="Edit"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditAutomation(automation.id);
                              }}
                            >
                              <Edit2 className="w-4 h-4" />
                            </motion.button>
                            
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(automation.id);
                              }}
                              className="p-2 rounded hover:bg-red-500/10 text-red-500 transition-colors"
                              title="Delete"
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && filteredAutomations.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Zap className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No automations found</p>
            <p className="text-sm text-gray-500 mt-2">
              {statusFilter !== 'ALL' || typeFilter !== 'ALL' 
                ? 'Try adjusting your filters' 
                : 'Create your first automation to get started'}
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Bottom Action Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-4 flex justify-end"
      >
        <div className="text-sm text-gray-500">
          Showing {filteredAutomations.length} of {automations.length} automations
        </div>
      </motion.div>
    </div>
  );
};

export default AutomationsPage;