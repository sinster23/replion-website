'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchStats,
  fetchActivity,
  fetchAutomations,
  fetchAutomationById,
  fetchIntegrations,
  fetchActiveIntegrations,
  fetchIntegrationById,
  toggleAutomationStatus,
  deleteAutomation,
  fetchIntegrationPosts,
  syncIntegrationPosts,
  connectInstagram,
  deleteIntegrationById,
  createKeyword,
  createResponse,
  updateAutomation,
  triggerAutomation,
} from './api';

// Query Keys
export const QUERY_KEYS = {
  stats: ['stats'],
  activity: (limit: number) => ['activity', limit],
  automations: ['automations'],
  automation: (id: string) => ['automation', id],
  integrations: ['integrations'],
  activeIntegrations: ['integrations', 'active'],
  integration: (id: string) => ['integrations', id],
  integrationPosts: (id: string) => ['integrations', id, 'posts'],
};

// Stats Query
export function useStats() {
  return useQuery({
    queryKey: QUERY_KEYS.stats,
    queryFn: fetchStats,
  });
}

// Activity Query
export function useActivity(limit: number = 100) {
  return useQuery({
    queryKey: QUERY_KEYS.activity(limit),
    queryFn: () => fetchActivity(limit),
  });
}

// Automations Queries
export function useAutomations() {
  return useQuery({
    queryKey: QUERY_KEYS.automations,
    queryFn: fetchAutomations,
  });
}

export function useAutomation(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.automation(id),
    queryFn: () => fetchAutomationById(id),
    enabled: !!id && id !== 'undefined' && id !== 'automations',
    retry: 1,
  });
}

// Integrations Queries
export function useIntegrations() {
  return useQuery({
    queryKey: QUERY_KEYS.integrations,
    queryFn: fetchIntegrations,
  });
}

export function useActiveIntegrations() {
  return useQuery({
    queryKey: QUERY_KEYS.activeIntegrations,
    queryFn: fetchActiveIntegrations,
  });
}

export function useIntegration(id: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.integration(id || ''),
    queryFn: () => fetchIntegrationById(id!),
    enabled: !!id,
  });
}

export function useIntegrationPosts(integrationId: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.integrationPosts(integrationId || ''),
    queryFn: () => fetchIntegrationPosts(integrationId!),
    enabled: !!integrationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Integration Mutations
export function useConnectInstagram() {
  return useMutation({
    mutationFn: connectInstagram,
    onSuccess: (data) => {
      // Redirect to Instagram OAuth
      window.location.href = data.authUrl;
    },
  });
}

export function useSyncIntegrationPosts() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: syncIntegrationPosts,
    onSuccess: (_, integrationId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.integrations });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.integration(integrationId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.integrationPosts(integrationId) });
    },
  });
}

export function useDeleteIntegration() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteIntegrationById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.integrations });
    },
  });
}

// Toggle Automation Mutation
export function useToggleAutomation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'ACTIVE' | 'PAUSED' }) =>
      toggleAutomationStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.automations });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.automation(variables.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
    },
  });
}

// Delete Automation Mutation
export function useDeleteAutomation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteAutomation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.automations });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
    },
  });
}

// Save Automation Mutation
export function useSaveAutomation(automationId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (config: {
      automationName: string;
      triggerType: string;
      keywords: string;
      commentReply: string;
      actionType: string;
      customMessage: string;
      aiPrompt: string;
      selectedPost: string | null;
    }) => {
      // Create keyword
      const keywordData = await createKeyword(config.keywords);
      const keywordId = keywordData.id;

      // Create response
      const responseData = await createResponse({
        name: `${config.automationName} Response`,
        responseType: config.actionType === 'custom' ? 'CUSTOM' : 'AI_GENERATED',
        customMessage: config.actionType === 'custom' ? config.customMessage : null,
        aiPrompt: config.actionType === 'ai' ? config.aiPrompt : null,
      });
      const responseId = responseData.id;

      // Update automation
      return updateAutomation(automationId, {
        name: config.automationName,
        description: `Auto-respond to ${config.triggerType === 'comment' ? 'comments' : 'DMs'} with keywords: ${config.keywords}`,
        config: {
          triggerType: config.triggerType,
          keywords: config.keywords,
          commentReply: config.commentReply,
          actionType: config.actionType,
          customMessage: config.actionType === 'custom' ? config.customMessage : null,
          aiPrompt: config.actionType === 'ai' ? config.aiPrompt : null,
        },
        triggers: [{
          triggerType: config.triggerType === 'comment' ? 'POST_COMMENT' : 'POST_DM',
          keywordId,
          responseId,
          postId: config.selectedPost,
          config: {
            commentReply: config.commentReply || null,
          },
        }],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.automation(automationId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.automations });
    },
  });
}

// Run Automation Mutation
export function useRunAutomation(automationId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (postId: string) => {
      // First activate the automation
      await toggleAutomationStatus(automationId, 'ACTIVE');
      
      // Then trigger it
      return triggerAutomation(automationId, postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.automation(automationId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.automations });
    },
  });
}