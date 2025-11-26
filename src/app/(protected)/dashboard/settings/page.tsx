import React from "react";
import { Settings } from "lucide-react";
import EmptyState from "@/components/shared/emptyState";

export default function SettingsPage() {
  return (
    <EmptyState 
      title="Settings" 
      icon={Settings}
      description="Customize your account preferences and application settings."
    />
  );
}