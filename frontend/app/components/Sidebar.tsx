"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  Newspaper,
  Wallet,
  Bot,
  Settings,
  Zap,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Markets", href: "/markets", icon: TrendingUp },
  { label: "News & Sentiment", href: "/news", icon: Newspaper },
  { label: "Portfolio", href: "/portfolio", icon: Wallet },
  { label: "Agents", href: "/agents", icon: Bot },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside className="sidebar">
      <Link href="/" className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Zap size={18} color="white" />
        </div>
        <div>
          <div className="sidebar-logo-text">StockPulse AI</div>
          <div className="sidebar-logo-badge">Premium Analysis</div>
        </div>
      </Link>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-nav-item ${isActive(item.href) ? "active" : ""}`}
            >
              <Icon size={18} className="nav-icon" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-user">
        <div className="sidebar-user-avatar">AC</div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">Alex Chen</div>
          <div className="sidebar-user-tier">Pro Member</div>
        </div>
      </div>
    </aside>
  );
}
