import React from "react";
import { Users } from "lucide-react";
import EmptyState from "@/components/shared/emptyState";

export default function ContactsPage() {
  return (
    <EmptyState 
      title="Contacts" 
      icon={Users}
      description="Manage all your Instagram contacts and leads from one place."
    />
  );
}