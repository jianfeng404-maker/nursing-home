import React from "react";
import { useStore } from "../store";

interface ElderLinkProps {
  id: string;      // The elder's ID
  text?: string;   // The text to display. If not provided, we look up the name in the store by ID.
  className?: string; // Optional custom styling
}

export function ElderLink({ id, text, className = "" }: ElderLinkProps) {
  const { setTargetElderId, setTargetElderTab, elders } = useStore();
  
  // Look up name if not provided
  let displayText = text;
  if (!displayText) {
    const elder = elders.find(e => e.id === id);
    displayText = elder ? elder.name : `Elder (${id})`;
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setTargetElderId(id);
        setTargetElderTab('info');
      }}
      className={`text-blue-600 hover:text-blue-800 hover:underline font-medium focus:outline-none transition-colors ${className}`}
      title="查看详细档案"
    >
      {displayText}
    </button>
  );
}
