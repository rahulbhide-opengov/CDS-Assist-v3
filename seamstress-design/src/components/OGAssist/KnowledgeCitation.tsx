/**
 * Knowledge Citation Component
 * Renders knowledge document citations with tiptap editor styling
 */

import React from 'react';
import { Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getKnowledgeIdFromSlug } from '../../services/knowledge/KnowledgeSlugMap';

interface KnowledgeCitationProps {
  knowledgeSlug: string;
  children?: React.ReactNode;
}

export const KnowledgeCitation: React.FC<KnowledgeCitationProps> = ({ knowledgeSlug, children }) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Map slug to ID and navigate to knowledge entry page
    const documentId = getKnowledgeIdFromSlug(knowledgeSlug);
    navigate(`/agent-studio/knowledge/${documentId}`);
  };

  return (
    <Link
      component="span"
      onClick={handleClick}
      sx={{
        fontWeight: 500,
        padding: '2px 4px',
        borderRadius: '4px',
        cursor: 'pointer',
        display: 'inline-block',
        backgroundColor: 'rgba(2, 136, 209, 0.1)', // CDS Info for knowledge
        color: 'info.main',
        textDecoration: 'none',
        '&:hover': {
          backgroundColor: 'rgba(2, 136, 209, 0.2)',
        },
      }}
    >
      {children || `@knowledge/${knowledgeSlug}`}
    </Link>
  );
};

/**
 * Parses content and replaces @knowledge/slug mentions with styled citations
 */
export const renderContentWithCitations = (content: string): React.ReactNode => {
  // Match @knowledge/slug-name patterns
  const knowledgePattern = /@knowledge\/([a-z0-9-]+)/gi;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  // Use a unique key counter for each part
  let keyCounter = 0;

  while ((match = knowledgePattern.exec(content)) !== null) {
    const beforeText = content.substring(lastIndex, match.index);
    if (beforeText) {
      parts.push(beforeText);
    }

    const knowledgeSlug = match[1];
    const fullMatch = match[0];

    parts.push(
      <KnowledgeCitation key={`citation-${keyCounter++}`} knowledgeSlug={knowledgeSlug}>
        {fullMatch}
      </KnowledgeCitation>
    );

    lastIndex = knowledgePattern.lastIndex;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex));
  }

  // If no matches found, return original content
  if (parts.length === 0) {
    return content;
  }

  return <>{parts}</>;
};
