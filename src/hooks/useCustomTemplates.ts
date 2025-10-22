
import { useState, useEffect } from 'react';
import { CustomTemplate } from '@/types/invoice';

export const useCustomTemplates = (userId?: string) => {
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([]);

  useEffect(() => {
    if (userId) {
      loadCustomTemplates();
    }
  }, [userId]);

  const loadCustomTemplates = () => {
    if (!userId) return;
    
    const stored = localStorage.getItem(`customTemplates_${userId}`);
    if (stored) {
      try {
        setCustomTemplates(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading custom templates:', error);
      }
    }
  };

  const saveCustomTemplate = (template: Omit<CustomTemplate, 'id' | 'createdAt' | 'userId'>) => {
    if (!userId) return;

    const newTemplate: CustomTemplate = {
      ...template,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      userId
    };

    const updated = [...customTemplates, newTemplate];
    setCustomTemplates(updated);
    localStorage.setItem(`customTemplates_${userId}`, JSON.stringify(updated));
    return newTemplate;
  };

  const deleteCustomTemplate = (templateId: string) => {
    const updated = customTemplates.filter(t => t.id !== templateId);
    setCustomTemplates(updated);
    localStorage.setItem(`customTemplates_${userId}`, JSON.stringify(updated));
  };

  const updateCustomTemplate = (templateId: string, updates: Partial<CustomTemplate>) => {
    const updated = customTemplates.map(t => 
      t.id === templateId ? { ...t, ...updates } : t
    );
    setCustomTemplates(updated);
    localStorage.setItem(`customTemplates_${userId}`, JSON.stringify(updated));
  };

  return {
    customTemplates,
    saveCustomTemplate,
    deleteCustomTemplate,
    updateCustomTemplate,
    loadCustomTemplates
  };
};
