"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import LoadingPage from "./LoadingPage";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface DashboardShellProps {
  children: React.ReactNode;
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_URL}/api/users/me`, {
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Auth check response:', data);
          if (data.success && data.data?.user) {
            setUser(data.data.user);
          } else {
            // Not authenticated
            router.push('/register');
          }
        } else {
          // Auth failed, redirect to login
          router.push('/signin');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [API_URL, router]);

  // Return ONLY the loader while loading
  if (loading) {
    return <LoadingPage />;
  }

  // If no user after loading, don't render anything (redirect is happening)
  if (!user) {
    return <LoadingPage />;
  }

  // Once loading finishes and user is authenticated, render the dashboard UI
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <Sidebar user={user} />
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} user={user} />
        <main>{children}</main>
      </div>
    </div>
  );
}