"use client";

import React, { useState, useEffect } from "react";
import DashboardSidebar from "@/app/dashboard/dashboard-sidebar";

interface SidebarLayoutProps {
  userEmail: string;
  children: React.ReactNode;
}

export default function SidebarLayout({ userEmail, children }: SidebarLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Persistence in localStorage
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved === "true") {
      setIsCollapsed(true);
    }
  }, []);

  const handleToggle = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    localStorage.setItem("sidebar-collapsed", String(nextState));
  };

  // Prevent server-side rendering mismatch by holding off classes until mounted
  const layoutClass = isMounted && isCollapsed ? "lg:pl-0" : "lg:pl-64";

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_#dbeafe_0%,_transparent_50%),radial-gradient(ellipse_at_bottom_right,_#e0e7ff_0%,_transparent_50%),linear-gradient(to_bottom_right,_#f8fafc,_#f0f4ff,_#eef2ff)] text-slate-900 font-sans">
      <DashboardSidebar
        userEmail={userEmail}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggle}
      />
      <div
        className={`transition-[padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${layoutClass}`}
      >
        <div className="min-h-screen pt-[7.5rem] lg:pt-0">
          {children}
        </div>
      </div>
    </div>
  );
}
