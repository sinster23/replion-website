"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  Bell,
  Search,
  Plus,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface NavbarProps {
  onMenuClick?: () => void;
  user: User;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const pathname = usePathname();
  
  // Hide navbar on automation/:id page
  const shouldHideNavbar = () => {
    // Check if pathname matches /dashboard/automations/:id pattern
    const automationIdPattern = /\/dashboard\/automations\/[^/]+$/;
    return automationIdPattern.test(pathname);
  };

  // Get current page name from pathname
  const getCurrentPage = () => {
    const segments = pathname.split("/").filter(Boolean);
    return segments[segments.length - 1] || "dashboard";
  };

  // Don't render navbar if on automation/:id page
  if (shouldHideNavbar()) {
    return null;
  }

  const currentPage = getCurrentPage();

  return (
    <header className="h-16 bg-zinc-900 border-b border-zinc-800 sticky top-0 z-30">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Left side - Breadcrumb */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-zinc-800 rounded-lg transition-colors text-white"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-zinc-500">Dashboard</span>
            <ChevronRight className="w-4 h-4 text-zinc-600" />
            <span className="text-white font-medium capitalize">
              {currentPage}
            </span>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white"
          >
            <Plus className="w-4 h-4" />
            Create Automation
          </Button>

          <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors relative text-white">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
}