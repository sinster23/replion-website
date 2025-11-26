import React from "react";

// This layout wraps all protected routes
// You can add authentication checks here later
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Add authentication logic here
  // Example: Check if user is logged in, redirect if not
  
  return <>{children}</>;
}