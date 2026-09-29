import React, { useState } from 'react';
import { Copy, Check } from './icons/CyberIcons';

interface CodePillProps {
  path?: string;
}

export const CodePill: React.FC<CodePillProps> = ({
  path = 'components/ui/animated-hero-section.tsx'
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(path);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      type="button" 
      className="code-pill" 
      onClick={handleCopy}
      title="Click to copy import path"
    >
      <span>{path}</span>
      {copied ? (
        <Check className="copy-icon" style={{ color: '#10B981' }} />
      ) : (
        <Copy className="copy-icon" />
      )}
    </button>
  );
};
