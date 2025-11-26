const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

// Helper function for API calls
async function apiCall(endpoint: string, options?: RequestInit): Promise<any> {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    ...options,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }
  
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'API request failed');
  }
  
  return data.data;
}

// Stats API
export const fetchStats = (): Promise<any> => {
  return apiCall('/api/automations/stats');
};

// Activity API
export const fetchActivity = (limit: number = 100): Promise<any> => {
  return apiCall(`/api/automations/activity?limit=${limit}`);
};

// Automations API
export const fetchAutomations = (): Promise<any> => {
  return apiCall('/api/automations');
};

export const fetchAutomationById = (id: string): Promise<any> => {
  return apiCall(`/api/automations/${id}`);
};

export const toggleAutomationStatus = (id: string, status: 'ACTIVE' | 'PAUSED'): Promise<any> => {
  return apiCall(`/api/automations/${id}/toggle`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
};

export const deleteAutomation = (id: string): Promise<any> => {
  return apiCall(`/api/automations/${id}`, {
    method: 'DELETE'
  });
};

// Integrations API
export const fetchIntegrations = (): Promise<any> => {
  return apiCall('/api/integrations');
};

export const fetchActiveIntegrations = async (): Promise<any> => {
  const integrations = await fetchIntegrations();
  return integrations.filter((int: any) => int.isActive);
};

export const fetchIntegrationById = (integrationId: string): Promise<any> => {
  return apiCall(`/api/integrations/${integrationId}`);
};

// NEW: Integration Posts API
export const fetchIntegrationPosts = async (integrationId: string): Promise<any> => {
  const integration = await apiCall(`/api/integrations/${integrationId}`);
  return integration.posts || [];
};

export const syncIntegrationPosts = async (integrationId: string): Promise<any> => {
  const data = await fetch(`${BACKEND_URL}/api/integrations/${integrationId}/sync`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  
  if (!data.ok) {
    const errorData = await data.json().catch(() => ({ message: 'Sync failed' }));
    throw new Error(errorData.message || 'Failed to sync posts');
  }
  
  const result = await data.json();
  return result.data;
};

export const connectInstagram = async (): Promise<{ authUrl: string }> => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${BACKEND_URL}/api/integrations/instagram/auth`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Connection failed' }));
    throw new Error(errorData.message || 'Failed to initiate connection');
  }

  const data = await response.json();
  
  if (!data.success || !data.authUrl) {
    throw new Error('Invalid response from server');
  }

  return { authUrl: data.authUrl };
};

export const deleteIntegrationById = async (integrationId: string): Promise<any> => {
  return apiCall(`/api/integrations/${integrationId}`, {
    method: 'DELETE'
  });
};

// Keyword API
export const createKeyword = (keyword: string): Promise<any> => {
  return apiCall('/api/keywords', {
    method: 'POST',
    body: JSON.stringify({
      keyword,
      matchType: 'CONTAINS',
      caseSensitive: false
    })
  });
};

// Response API
export const createResponse = (data: {
  name: string;
  responseType: 'CUSTOM' | 'AI_GENERATED';
  customMessage?: string | null;
  aiPrompt?: string | null;
}): Promise<any> => {
  return apiCall('/api/responses', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

// Update Automation
export const updateAutomation = (id: string, data: any): Promise<any> => {
  return apiCall(`/api/automations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
};

// Trigger Automation
export const triggerAutomation = (id: string, postId: string): Promise<any> => {
  return apiCall(`/api/automations/${id}/trigger`, {
    method: 'POST',
    body: JSON.stringify({ postId })
  });
};