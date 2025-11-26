"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Users,
  Settings,
  Zap,
  Link2,
  User,
  HelpCircle,
  Sparkles,
  Key,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UserProps {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface SidebarProps {
  user: UserProps;
}

const mainNavigation = [
  { name: "Home", icon: Home, href: "/dashboard" },
  { name: "Contacts", icon: Users, href: "/dashboard/contacts" },
  { name: "Automations", icon: Zap, href: "/dashboard/automations" },
  { name: "Integrations", icon: Link2, href: "/dashboard/integrations" },
  { name: "Settings", icon: Settings, href: "/dashboard/settings" },
];

const secondaryNavigation = [
  { name: "Profile", icon: User, href: "/dashboard/profile" },
  { name: "Help", icon: HelpCircle, href: "/dashboard/help" },
];

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Get initials from user name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-zinc-900 border-r border-zinc-800 z-50 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-zinc-800">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-9 w-auto" />
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {mainNavigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}

        <div className="pt-4 mt-4 border-t border-zinc-800">
          {secondaryNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 space-y-2 border-t border-zinc-800">
        <Link
          href="/dashboard/upgrade"
          className="w-full flex items-center gap-3 px-3 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all duration-200 text-sm font-medium text-white"
        >
          <Sparkles className="w-5 h-5" />
          Upgrade to Smart AI
        </Link>

              {/* User Profile Section */}
      <div className="px-3">
        <div className="flex items-center gap-3 px-3 py-2">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-semibold">
              {getInitials(user.name)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user.name}
            </p>
            <p className="text-xs text-zinc-400 truncate">
              {user.email}
            </p>
          </div>
        </div>
      </div>
      </div>
    </aside>
  );
}