"use client";
import React, { useState, useEffect } from 'react';
import { Plus, MessageSquare, AtSign, Sparkles, X, Save, Play, Pause, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useParams } from "next/navigation";
import { 
  useAutomation, 
  useIntegrationPosts, 
  useSaveAutomation,
  useToggleAutomation 
} from '@/lib/queries';

// Types
interface Integration {
  id: string;
  username: string;
}

interface Post {
  id: string;
  caption?: string;
  commentsCount: number;
}

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'warning';
}

// Alert Component
const Alert: React.FC<{ children: React.ReactNode; variant?: 'default' | 'success' | 'error' | 'warning'; className?: string }> = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-gray-800 border-gray-700',
    success: 'bg-green-900/50 border-green-700',
    error: 'bg-red-900/50 border-red-700',
    warning: 'bg-yellow-900/50 border-yellow-700'
  };
  
  return (
    <div className={`border rounded-lg p-4 ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

const AlertDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-sm">{children}</p>
);

// Toast Notification Component
const Toast: React.FC<{ message: string; type: 'success' | 'error' | 'warning'; onClose: () => void }> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-green-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-400" />
  };

  const backgrounds = {
    success: 'bg-green-900/90 border-green-700',
    error: 'bg-red-900/90 border-red-700',
    warning: 'bg-yellow-900/90 border-yellow-700'
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 border rounded-lg p-4 shadow-2xl backdrop-blur-sm ${backgrounds[type]} animate-slideIn`}>
      <div className="flex items-start gap-3 max-w-md">
        {icons[type]}
        <div className="flex-1">
          <p className="text-sm text-white">{message}</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default function AutomationConfigPage() {
  const router = useRouter();
  const params = useParams();
  const automationId = params?.automationId as string;

  const [automationName, setAutomationName] = useState<string>('Untitled Automation');
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [showTriggerModal, setShowTriggerModal] = useState<boolean>(false);
  const [showActionModal, setShowActionModal] = useState<boolean>(false);
  
  const [triggerType, setTriggerType] = useState<string | null>(null);
  const [keywords, setKeywords] = useState<string>('');
  const [commentReply, setCommentReply] = useState<string>('');
  
  const [actionType, setActionType] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState<string>('');
  const [aiPrompt, setAiPrompt] = useState<string>('');

  // Temporary states for modals
  const [tempTriggerType, setTempTriggerType] = useState<string | null>(null);
  const [tempKeywords, setTempKeywords] = useState<string>('');
  const [tempCommentReply, setTempCommentReply] = useState<string>('');
  
  const [tempActionType, setTempActionType] = useState<string | null>(null);
  const [tempCustomMessage, setTempCustomMessage] = useState<string>('');
  const [tempAiPrompt, setTempAiPrompt] = useState<string>('');

  const [integration, setIntegration] = useState<Integration | null>(null);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  // Toast state
  const [toast, setToast] = useState<ToastState | null>(null);

  // React Query hooks
  const {
    data: automation,
    isLoading: automationLoading,
    error: automationError,
  } = useAutomation(automationId);

  const { data: posts = [], isLoading: postsLoading } = useIntegrationPosts(
    automation?.integrationId
  );

  const saveMutation = useSaveAutomation(automationId);
  const toggleMutation = useToggleAutomation();

  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  // Load automation data when it changes
  useEffect(() => {
    if (automation) {
      setAutomationName(automation.name);
      setIntegration(automation.integration);

      // Load existing configuration from triggers OR config field
      if (automation.triggers && automation.triggers.length > 0) {
        const trigger = automation.triggers[0];
        setTriggerType(trigger.triggerType === 'POST_COMMENT' ? 'comment' : 'dm');
        
        if (trigger.keyword) {
          setKeywords(trigger.keyword.keyword);
        }
        
        if (trigger.config?.commentReply) {
          setCommentReply(trigger.config.commentReply);
        }

        if (trigger.response) {
          setActionType(trigger.response.responseType === 'CUSTOM' ? 'custom' : 'ai');
          if (trigger.response.responseType === 'CUSTOM') {
            setCustomMessage(trigger.response.customMessage || '');
          } else {
            setAiPrompt(trigger.response.aiPrompt || '');
          }
        }

        if (trigger.postId) {
          setSelectedPost(trigger.postId);
        }
      } else if (automation.config) {
        // Fallback: Load from config field if triggers array is empty
        if (automation.config.triggerType) {
          setTriggerType(automation.config.triggerType);
        }
        
        if (automation.config.keywords) {
          setKeywords(automation.config.keywords);
        }
        
        if (automation.config.commentReply) {
          setCommentReply(automation.config.commentReply);
        }
        
        if (automation.config.actionType) {
          setActionType(automation.config.actionType);
        }
        
        if (automation.config.customMessage) {
          setCustomMessage(automation.config.customMessage);
        }
        
        if (automation.config.aiPrompt) {
          setAiPrompt(automation.config.aiPrompt);
        }
      }
    }
  }, [automation]);

  const handleSaveTrigger = () => {
    if (!tempTriggerType || !tempKeywords) {
      showToast('Please select trigger type and add keywords', 'warning');
      return;
    }
    setTriggerType(tempTriggerType);
    setKeywords(tempKeywords);
    setCommentReply(tempCommentReply);
    
    setShowTriggerModal(false);
    showToast('Trigger configured successfully', 'success');
  };

  const handleSaveAction = () => {
    if (!tempActionType) {
      showToast('Please select an action type', 'warning');
      return;
    }
    if (tempActionType === 'custom' && !tempCustomMessage) {
      showToast('Please enter a custom message', 'warning');
      return;
    }
    if (tempActionType === 'ai' && !tempAiPrompt) {
      showToast('Please enter AI instructions', 'warning');
      return;
    }
    setActionType(tempActionType);
    setCustomMessage(tempCustomMessage);
    setAiPrompt(tempAiPrompt);
    
    setShowActionModal(false);
    showToast('Action configured successfully', 'success');
  };

  const openTriggerModal = () => {
    setTempTriggerType(triggerType);
    setTempKeywords(keywords);
    setTempCommentReply(commentReply);
    setShowTriggerModal(true);
  };

  const openActionModal = () => {
    setTempActionType(actionType);
    setTempCustomMessage(customMessage);
    setTempAiPrompt(aiPrompt);
    setShowActionModal(true);
  };

  const handleSaveAutomation = async () => {
    if (!triggerType || !keywords || !actionType) {
      showToast('Please complete all configuration steps', 'warning');
      return;
    }

    if (actionType === 'custom' && !customMessage) {
      showToast('Please enter a custom message', 'warning');
      return;
    }

    if (actionType === 'ai' && !aiPrompt) {
      showToast('Please enter AI instructions', 'warning');
      return;
    }

    try {
      await saveMutation.mutateAsync({
        automationName,
        triggerType,
        keywords,
        commentReply,
        actionType,
        customMessage,
        aiPrompt,
        selectedPost,
      });

      showToast('Automation saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving automation:', error);
      showToast((error as Error).message || 'Failed to save automation', 'error');
    }
  };

  const handleToggleStatus = async () => {
    if (!automation) return;

    // Check if automation is properly configured before activating
    if (automation.status !== 'ACTIVE') {
      if (!triggerType || !keywords || !actionType) {
        showToast('Please complete all configuration before activating', 'warning');
        return;
      }
      if (!selectedPost) {
        showToast('Please select a post to monitor', 'warning');
        return;
      }
    }

    const newStatus = automation.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    
    try {
      await toggleMutation.mutateAsync({ 
        id: automationId, 
        status: newStatus 
      });

      const statusMessage = newStatus === 'ACTIVE' 
        ? 'Automation activated successfully!' 
        : 'Automation paused successfully!';
      
      showToast(statusMessage, 'success');
    } catch (error) {
      console.error('Error toggling automation:', error);
      showToast((error as Error).message || 'Failed to toggle automation status', 'error');
    }
  };

  const isLoading = automationLoading || postsLoading;
  const isActive = automation?.status === 'ACTIVE';
  const isToggling = toggleMutation.isPending;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-400">Loading automation...</p>
        </div>
      </div>
    );
  }

  if (automationError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-400">Failed to load automation</p>
          <button 
            onClick={() => router.push('/dashboard/automations')}
            className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            Back to Automations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}

      {/* Header */}
      <div className="border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard/automations')}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              
              {isEditingName ? (
                <input
                  type="text"
                  value={automationName}
                  onChange={(e) => setAutomationName(e.target.value)}
                  onBlur={() => setIsEditingName(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                  className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-1.5 text-lg font-semibold focus:outline-none focus:border-blue-500"
                  autoFocus
                />
              ) : (
                <h1
                  onClick={() => setIsEditingName(true)}
                  className="text-lg font-semibold cursor-pointer hover:text-blue-400 transition-colors"
                >
                  {automationName}
                </h1>
              )}

              {integration && (
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs border border-blue-500/30">
                  @{integration.username}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Toggle Status Button */}
              {triggerType && actionType && (
                <button
                  onClick={handleToggleStatus}
                  disabled={isToggling}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed ${
                    isActive
                      ? 'bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-700'
                      : 'bg-green-600 hover:bg-green-700 disabled:bg-gray-700'
                  }`}
                >
                  {isToggling ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      {isActive ? 'Pausing...' : 'Activating...'}
                    </>
                  ) : (
                    <>
                      {isActive ? (
                        <>
                          <Pause size={16} />
                          Stop Running
                        </>
                      ) : (
                        <>
                          <Play size={16} />
                          Start Running
                        </>
                      )}
                    </>
                  )}
                </button>
              )}

              <button
                onClick={handleSaveAutomation}
                disabled={saveMutation.isPending || !triggerType || !actionType}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
              >
                {saveMutation.isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Automation
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-full max-w-4xl mx-auto px-8 py-8">
          {/* Status Badge */}
          {automation && (
            <div className="mb-6 flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                isActive 
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                  : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
              }`}>
                {isActive ? ' Active' : ' Paused'}
              </span>
              {isActive && (
                <span className="text-xs text-gray-400">
                  Automation is currently running
                </span>
              )}
            </div>
          )}

          {/* Post Selection */}
          {posts.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Post to Monitor
              </label>
              <select
                value={selectedPost || ''}
                onChange={(e) => setSelectedPost(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Choose a post...</option>
                {posts.map((post: Post) => (
                  <option key={post.id} value={post.id}>
                    {post.caption?.substring(0, 50) || 'Untitled Post'} - {post.commentsCount} comments
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* When Block */}
          <div className="relative">
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center text-sm font-bold shadow-lg shadow-blue-500/30">
                    1
                  </div>
                  <span className="text-base font-semibold">When...</span>
                </div>
              </div>

              {!triggerType ? (
                <button
                  onClick={openTriggerModal}
                  className="w-full border-2 border-dashed border-blue-500/50 rounded-lg py-6 flex items-center justify-center gap-2 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400 transition-all duration-200 group"
                >
                  <Plus size={20} className="group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-sm font-medium">Add Trigger</span>
                </button>
              ) : (
                <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-lg p-4 border border-gray-600/50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {triggerType === 'comment' ? (
                        <AtSign size={18} className="text-blue-400" />
                      ) : (
                        <MessageSquare size={18} className="text-blue-400" />
                      )}
                      <div>
                        <span className="font-medium text-sm">
                          {triggerType === 'comment' 
                            ? 'User comments on my post' 
                            : 'User sends me a direct message'}
                        </span>
                        {keywords && (
                          <div className="mt-1.5 flex flex-wrap gap-1.5">
                            {keywords.split(',').map((kw, i) => (
                              <span key={i} className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full text-xs border border-blue-500/30">
                                {kw.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={openTriggerModal}
                      className="text-xs text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 ml-6">
                    {triggerType === 'comment'
                      ? 'When a user comments with specified keywords, this automation will trigger'
                      : 'When a user sends a message with specified keywords, this automation will trigger'}
                  </p>
                  {commentReply && (
                    <div className="mt-3 ml-6 p-2.5 bg-gray-900/50 rounded-lg border border-gray-700/50">
                      <p className="text-xs text-gray-400 mb-0.5">Auto-reply to comment:</p>
                      <p className="text-xs text-gray-300">{commentReply}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {triggerType && (
              <div className="flex justify-center py-4">
                <div className="w-0.5 h-12 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full shadow-lg shadow-blue-500/30"></div>
              </div>
            )}
          </div>

          {/* Then Block */}
          {triggerType && (
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-500 rounded-lg flex items-center justify-center text-sm font-bold shadow-lg shadow-purple-500/30">
                    2
                  </div>
                  <span className="text-base font-semibold">Then...</span>
                </div>

                {!actionType ? (
                  <button
                    onClick={openActionModal}
                    className="w-full border-2 border-dashed border-purple-500/50 rounded-lg py-6 flex items-center justify-center gap-2 text-purple-400 hover:bg-purple-500/10 hover:border-purple-400 transition-all duration-200 group"
                  >
                    <Plus size={20} className="group-hover:scale-110 transition-transform duration-200" />
                    <span className="text-sm font-medium">Add Action</span>
                  </button>
                ) : (
                  <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-lg p-4 border border-gray-600/50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {actionType === 'custom' ? (
                          <MessageSquare size={18} className="text-purple-400" />
                        ) : (
                          <Sparkles size={18} className="text-purple-400" />
                        )}
                        <div>
                          <span className="font-medium text-sm">
                            {actionType === 'custom' 
                              ? 'Send custom message' 
                              : 'Let Smart AI take over'}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={openActionModal}
                        className="text-xs text-gray-400 hover:text-white transition-colors duration-200"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="ml-6 mt-2 p-3 bg-gray-900/50 rounded-lg border border-gray-700/50">
                      <p className="text-xs text-gray-300">
                        {actionType === 'custom' ? customMessage : aiPrompt}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Trigger Modal */}
      {showTriggerModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setShowTriggerModal(false)}
          />
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-950 border-l border-gray-700 shadow-2xl z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Configure Trigger</h2>
                <button 
                  onClick={() => setShowTriggerModal(false)}
                  className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <button
                  onClick={() => setTempTriggerType('comment')}
                  className={`w-full text-left p-4 rounded-lg transition-all duration-200 border-2 ${
                    tempTriggerType === 'comment'
                      ? 'bg-blue-500/20 border-blue-500 scale-[1.02]'
                      : 'bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <AtSign size={18} className="text-blue-400" />
                    <span className="font-semibold text-sm">User comments on my post</span>
                  </div>
                  <p className="text-xs text-gray-400 ml-6">
                    Trigger automation when users comment with specific keywords
                  </p>
                </button>

                <button
                  onClick={() => setTempTriggerType('dm')}
                  className={`w-full text-left p-4 rounded-lg transition-all duration-200 border-2 ${
                    tempTriggerType === 'dm'
                      ? 'bg-blue-500/20 border-blue-500 scale-[1.02]'
                      : 'bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <MessageSquare size={18} className="text-blue-400" />
                    <span className="font-semibold text-sm">User sends me a DM</span>
                  </div>
                  <p className="text-xs text-gray-400 ml-6">
                    Trigger automation when users send DMs with specific keywords
                  </p>
                </button>
              </div>

              {tempTriggerType && (
                <>
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Keywords (comma-separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., help, pricing, demo"
                      value={tempKeywords}
                      onChange={(e) => setTempKeywords(e.target.value)}
                      className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Auto-reply to comment <span className="text-gray-500">(Optional)</span>
                    </label>
                    <textarea
                      placeholder="Add an automatic reply to the comment..."
                      value={tempCommentReply}
                      onChange={(e) => setTempCommentReply(e.target.value)}
                      className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 min-h-20 resize-none"
                    />
                  </div>
                </>
              )}

              <button
                onClick={handleSaveTrigger}
                disabled={!tempTriggerType || !tempKeywords}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed py-2.5 rounded-lg text-sm font-semibold shadow-lg shadow-blue-500/30 transition-all duration-200 hover:scale-[1.02] disabled:hover:scale-100"
              >
                Create Trigger
              </button>
            </div>
          </div>
        </>
      )}

      {/* Action Modal */}
      {showActionModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setShowActionModal(false)}
          />
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-950 border-l border-gray-700 shadow-2xl z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Configure Action</h2>
                <button 
                  onClick={() => setShowActionModal(false)}
                  className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <button
                  onClick={() => setTempActionType('custom')}
                  className={`w-full text-left p-4 rounded-lg transition-all duration-200 border-2 ${
                    tempActionType === 'custom'
                      ? 'bg-purple-500/20 border-purple-500 scale-[1.02]'
                      : 'bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <MessageSquare size={18} className="text-purple-400" />
                    <span className="font-semibold text-sm">Send custom message</span>
                  </div>
                  <p className="text-xs text-gray-400 ml-6">
                    Send a pre-written message to the user
                  </p>
                </button>

                <button
                  onClick={() => setTempActionType('ai')}
                  className={`w-full text-left p-4 rounded-lg transition-all duration-200 border-2 ${
                    tempActionType === 'ai'
                      ? 'bg-purple-500/20 border-purple-500 scale-[1.02]'
                      : 'bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Sparkles size={18} className="text-purple-400" />
                    <span className="font-semibold text-sm">Let Smart AI take over</span>
                  </div>
                  <p className="text-xs text-gray-400 ml-6">
                    Use AI to generate personalized responses
                  </p>
                  <div className="ml-6 mt-1.5">
                    <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 rounded-full text-xs border border-amber-500/30">
                      Premium Feature
                    </span>
                  </div>
                </button>
              </div>

              {tempActionType === 'custom' && (
                <div className="mb-6">
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Custom Message
                  </label>
                  <textarea
                    placeholder="Enter the message you want to send..."
                    value={tempCustomMessage}
                    onChange={(e) => setTempCustomMessage(e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 min-h-24 resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1.5">
                    This message will be sent to users when the trigger fires
                  </p>
                </div>
              )}

              {tempActionType === 'ai' && (
                <div className="mb-6">
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    AI Instructions
                  </label>
                  <textarea
                    placeholder="Tell AI about your business and how to respond..."
                    value={tempAiPrompt}
                    onChange={(e) => setTempAiPrompt(e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 min-h-24 resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1.5">
                    Provide context and guidelines for AI to generate responses
                  </p>
                </div>
              )}

              <button
                onClick={handleSaveAction}
                disabled={!tempActionType || (tempActionType === 'custom' && !tempCustomMessage) || (tempActionType === 'ai' && !tempAiPrompt)}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed py-2.5 rounded-lg text-sm font-semibold shadow-lg shadow-purple-500/30 transition-all duration-200 hover:scale-[1.02] disabled:hover:scale-100"
              >
                Add Action
              </button>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}