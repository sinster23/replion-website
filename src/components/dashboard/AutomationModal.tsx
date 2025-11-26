"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader } from 'lucide-react';

interface CreateAutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (automationId: string) => void;
  integrations: Array<{
    id: string;
    platform: string;
    username: string;
  }>;
}

const CreateAutomationModal: React.FC<CreateAutomationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  integrations,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    integrationId: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Please enter a name');
      return;
    }

    if (!formData.integrationId) {
      setError('Please select an integration');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/automations`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          // Temporary values that will be updated in the config page
          type: 'AUTO_LIKE', // Default type
          config: {}, // Empty config to be filled later
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create automation');
      }

      const data = await response.json();
      
      if (data.success) {
        // Reset form
        setFormData({ name: '', description: '', integrationId: '' });
        // Call success callback with the new automation ID
        onSuccess(data.data.id);
      } else {
        throw new Error(data.message || 'Failed to create automation');
      }
    } catch (err) {
      console.error('Error creating automation:', err);
      setError(err instanceof Error ? err.message : 'Failed to create automation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({ name: '', description: '', integrationId: '' });
      setError(null);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-[#1a1a1a] rounded-lg shadow-2xl w-full max-w-md border border-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white">Create New Automation</h2>
                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Automation Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Daily Instagram Likes"
                    disabled={isLoading}
                    className="w-full bg-[#0a0a0a] border border-gray-700 rounded px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                  />
                </div>

                {/* Description Field */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="What does this automation do?"
                    rows={3}
                    disabled={isLoading}
                    className="w-full bg-[#0a0a0a] border border-gray-700 rounded px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 disabled:opacity-50 resize-none"
                  />
                </div>

                {/* Integration Selection */}
                <div>
                  <label htmlFor="integration" className="block text-sm font-medium text-gray-300 mb-2">
                    Select Integration <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="integration"
                    value={formData.integrationId}
                    onChange={(e) => setFormData({ ...formData, integrationId: e.target.value })}
                    disabled={isLoading}
                    className="w-full bg-[#0a0a0a] border border-gray-700 rounded px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
                  >
                    <option value="">Choose an integration...</option>
                    {integrations.map((integration) => (
                      <option key={integration.id} value={integration.id}>
                        {integration.platform} - @{integration.username}
                      </option>
                    ))}
                  </select>
                  {integrations.length === 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                      No integrations available. Please add an integration first.
                    </p>
                  )}
                </div>

                {/* Info Text */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3">
                  <p className="text-xs text-blue-400">
                    After creating, you'll be able to configure the automation type and settings.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2.5 border border-gray-700 rounded hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !formData.name.trim() || !formData.integrationId}
                    className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create & Configure'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateAutomationModal;