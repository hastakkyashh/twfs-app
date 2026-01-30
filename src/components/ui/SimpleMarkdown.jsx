import React from 'react';

const SimpleMarkdown = ({ content }) => {
  if (!content) return null;

  const parseInline = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const blocks = content.split(/\n\n+/);

  return (
    <div className="space-y-4 text-slate-700 leading-relaxed text-sm">
      {blocks.map((block, index) => {
        const trimmed = block.trim();
        
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={index} className="text-lg font-bold text-blue-900 mt-6 border-b border-blue-100 pb-2">
              {trimmed.replace(/^##\s+/, '')}
            </h3>
          );
        }
        
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={index} className="text-md font-bold text-slate-800 mt-4">
              {trimmed.replace(/^###\s+/, '')}
            </h4>
          );
        }

        if (trimmed.split('\n').every(line => line.trim().match(/^[*-]\s/))) {
          const items = trimmed.split('\n');
          return (
            <ul key={index} className="list-disc pl-5 space-y-1 bg-slate-50 p-4 rounded-lg border border-slate-100">
              {items.map((item, i) => (
                <li key={i} className="pl-1">
                  {parseInline(item.replace(/^[*-]\s+/, ''))}
                </li>
              ))}
            </ul>
          );
        }

        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
             return (
                <ul key={index} className="list-disc pl-5">
                   <li>{parseInline(trimmed.replace(/^[*-]\s+/, ''))}</li>
                </ul>
             )
        }

        return <p key={index}>{parseInline(trimmed)}</p>;
      })}
    </div>
  );
};

export default SimpleMarkdown;
