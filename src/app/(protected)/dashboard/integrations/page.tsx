"use client";
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Instagram, Loader2, CheckCircle2, AlertCircle, RefreshCw, Trash2, ExternalLink } from 'lucide-react';

// Import your hooks from queries.ts
import { 
  useIntegrations, 
  useConnectInstagram, 
  useSyncIntegrationPosts, 
  useDeleteIntegration 
} from '@/lib/queries';

interface Integration {
  id: string;
  platform: string;
  username: string;
  isActive: boolean;
  createdAt: string;
  metadata?: {
    accountType?: string;
    followersCount?: number;
  };
  _count?: {
    automations?: number;
    posts?: number;
  };
}

export default function IntegrationsPage() {
  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  // Use React Query hooks
  const { data: integrationsData, isLoading, error: queryError } = useIntegrations();
  const integrations: Integration[] = integrationsData || [];

  // Mutations
  const connectMutation = useConnectInstagram();
  const syncMutation = useSyncIntegrationPosts();
  const deleteMutation = useDeleteIntegration();

  useEffect(() => {
    // Check for OAuth callback success/error
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const errorParam = urlParams.get('error');

    if (success === 'true') {
      setSuccessMessage('Instagram account connected successfully! 🎉');
      window.history.replaceState({}, '', window.location.pathname);
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
    } else if (errorParam) {
      setError(`Connection failed: ${errorParam}`);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [queryClient]);

  // Set error from query if exists
  useEffect(() => {
    if (queryError) {
      setError((queryError as Error).message || 'Failed to load integrations');
    }
  }, [queryError]);

  // Handle mutation success/error states
  useEffect(() => {
    if (connectMutation.isSuccess) {
      // This won't trigger because we redirect immediately
    }
    if (connectMutation.isError) {
      setError((connectMutation.error as Error).message || 'Failed to connect Instagram');
    }
  }, [connectMutation.isSuccess, connectMutation.isError, connectMutation.error]);

  useEffect(() => {
    if (syncMutation.isSuccess && syncMutation.data) {
      setSuccessMessage(`Synced ${syncMutation.data.count || 0} posts successfully!`);
    }
    if (syncMutation.isError) {
      setError((syncMutation.error as Error).message || 'Failed to sync posts');
    }
  }, [syncMutation.isSuccess, syncMutation.isError, syncMutation.error, syncMutation.data]);

  useEffect(() => {
    if (deleteMutation.isSuccess) {
      setSuccessMessage('Integration disconnected successfully');
    }
    if (deleteMutation.isError) {
      setError((deleteMutation.error as Error).message || 'Failed to disconnect integration');
    }
  }, [deleteMutation.isSuccess, deleteMutation.isError, deleteMutation.error]);

  const handleConnectInstagram = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in first');
      return;
    }
    setError('');
    connectMutation.mutate();
  };

  const handleSyncPosts = (integrationId: string) => {
    syncMutation.mutate(integrationId);
  };

  const handleDeleteIntegration = (integrationId: string) => {
    if (!confirm('Are you sure you want to disconnect this account? This will also delete all associated automations.')) {
      return;
    }
    deleteMutation.mutate(integrationId);
  };

  return (
    <div className="bg-[#0a0a0a] text-white p-6 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Integrations</h1>
            <p className="text-gray-400">Connect and manage your social media accounts</p>
          </div>
        </div>
      </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-green-400 font-medium">{successMessage}</p>
            </div>
            <button
              onClick={() => setSuccessMessage('')}
              className="text-green-400 hover:text-green-300 text-xl leading-none"
            >
              ×
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-400 font-medium">{error}</p>
            </div>
            <button
              onClick={() => setError('')}
              className="text-red-400 hover:text-red-300 text-xl leading-none"
            >
              ×
            </button>
          </div>
        )}

      {/* Connected Integrations */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
        </div>
      ) : integrations.length > 0 ? (
        <div className="grid gap-6 mb-8">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className="bg-zinc-900 p-6 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Instagram className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      @{integration.username}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {integration.metadata?.accountType || 'Business'} Account
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Connected {new Date(integration.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {integration.isActive ? (
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      Active
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-gray-500/20 text-gray-400 text-sm rounded-full">
                      Inactive
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleSyncPosts(integration.id)}
                  disabled={syncMutation.isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
                  {syncMutation.isPending ? 'Syncing...' : 'Sync Posts'}
                </button>
                <a
                  href={`https://instagram.com/${integration.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Profile
                </a>
                <button
                  onClick={() => handleDeleteIntegration(integration.id)}
                  disabled={deleteMutation.isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg transition-colors ml-auto text-sm font-medium disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  {deleteMutation.isPending ? 'Disconnecting...' : 'Disconnect'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* Connect New Integration */}
      <div className="space-y-4 mb-8">
        <button
          onClick={handleConnectInstagram}
          disabled={connectMutation.isPending}
          className="w-full bg-zinc-900 hover:bg-zinc-800 border-2 border-blue-500/30 hover:border-blue-500/50 rounded-xl p-6 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
              {connectMutation.isPending ? (
                <Loader2 className="w-7 h-7 text-white animate-spin" />
              ) : (
                <Instagram className="w-7 h-7 text-white" />
              )}
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-lg font-semibold text-white mb-1">
                {connectMutation.isPending ? 'Connecting Instagram...' : 'Connect Instagram'}
              </h3>
              <p className="text-sm text-gray-400">
                Link your Instagram Business account to start automating
              </p>
            </div>
            {!connectMutation.isPending && (
              <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            )}
          </div>
        </button>
      </div>

      {/* Requirements Info Box */}
      <div className="mb-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
        <p className="text-sm font-medium text-blue-300 mb-3">
          Before connecting Instagram, ensure:
        </p>
        <ul className="space-y-2 text-sm text-blue-200">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
            <span>Your account is a Business or Creator account</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
            <span>You're logged into Instagram in this browser</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
            <span>You have admin access to your Instagram account</span>
          </li>
        </ul>
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-zinc-900 p-6">
          <h3 className="text-lg font-semibold text-white mb-3">What you can do</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Automatically reply to comments with keywords</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Send automatic DMs when users comment</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Monitor multiple posts simultaneously</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Use AI-powered responses (Pro plan)</span>
            </li>
          </ul>
        </div>

        <div className="bg-zinc-900 p-6">
          <h3 className="text-lg font-semibold text-white mb-3">Data & Privacy</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <span>Your data is encrypted and secure</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <span>We only request necessary permissions</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <span>Disconnect anytime from this page</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <span>Compliant with Instagram's policies</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}