import React from "react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon: LucideIcon;
}

export default function EmptyState({ 
  title, 
  description = "Development in progress. This feature will be available soon.",
  icon: Icon 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto">
          <Icon className="w-10 h-10 text-zinc-600" />
        </div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className="text-zinc-400 max-w-md">
          {description}
        </p>
        <div className="flex gap-2 justify-center mt-6">
          <div 
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" 
            style={{ animationDelay: '0ms' }}
          ></div>
          <div 
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" 
            style={{ animationDelay: '150ms' }}
          ></div>
          <div 
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" 
            style={{ animationDelay: '300ms' }}
          ></div>
        </div>
      </div>
    </div>
  );
}