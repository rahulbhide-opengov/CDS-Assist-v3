/**
 * Templates Page
 * Main page for template management in procurement module
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TemplateManager } from '../../components/procurement/templates/TemplateManager';

export const TemplatesPage: React.FC = () => {
  const navigate = useNavigate();

  const handleEditTemplate = (templateId: string) => {
    // TODO: Navigate to template editor page
    console.log('Edit template:', templateId);
    // navigate(`/procurement/templates/${templateId}/edit`);
  };

  const handleCreateTemplate = () => {
    // TODO: Navigate to template creation page
    console.log('Create new template');
    // navigate('/procurement/templates/new');
  };

  return (
    <TemplateManager
      onEditTemplate={handleEditTemplate}
      onCreateTemplate={handleCreateTemplate}
    />
  );
};

export default TemplatesPage;
