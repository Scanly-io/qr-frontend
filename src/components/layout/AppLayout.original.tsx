// Backup of the original AppLayout.tsx as of 2026-02-15
// This file is a direct copy of the original, including any duplication or issues for reference.

import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  QrCode,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
  Bell,
  Search,
  BarChart3,
  UserCircle,
  Users,
  CreditCard,
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui';
import { ComingSoonBadge, ComingSoonTooltip } from '@/components/ui/ComingSoonBadge';

interface AppLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export function AppLayout({ children, showSidebar = true }: AppLayoutProps) {
  // ...existing state and handlers...
  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateMicrosite = async () => {
    setIsCreating(true);
    try {
      const { micrositeApi } = await import('@/lib/api/microsite');
      const newMicrosite = await micrositeApi.create({
        title: 'New Microsite',
        description: '',
        layout: [],
      });
      navigate(`/editor/${newMicrosite.id}`);
    } catch (error) {
      alert('Failed to create microsite: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsCreating(false);
    }
  };

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      current: location.pathname === '/dashboard',
      comingSoon: false,
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      current: location.pathname === '/analytics',
      comingSoon: false,
    },
    {
      name: 'Team',
      href: '#',
      icon: Users,
      current: false,
      comingSoon: true,
    },
    {
      name: 'Billing',
      href: '#',
      icon: CreditCard,
      current: false,
      comingSoon: true,
    },
    {
      name: 'Account',
      href: '/account',
      icon: UserCircle,
      current: location.pathname === '/account',
      comingSoon: false,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      current: location.pathname === '/settings',
      comingSoon: true,
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-slate-800 dark:bg-slate-950/95">
        <div className="flex h-16 items-center px-4 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            {showSidebar && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            )}
            <Link to="/dashboard" className="flex items-center gap-2 font-bold text-lg text-violet-700 dark:text-violet-300">
              <QrCode className="h-6 w-6" />
              <span>QR Platform</span>
            </Link>
          </div>
          {/* ...existing code... */}
          {/* Right Actions */}
          <div className="ml-auto flex items-center gap-2">
            {/* Create New Button */}
            <Button
              variant="default"
              size="sm"
              onClick={handleCreateMicrosite}
              className="hidden sm:flex"
              disabled={isCreating}
            >
              <Plus className="h-4 w-4 mr-1.5" />
              {isCreating ? 'Creating...' : 'Create'}
            </Button>

            {/* Mobile Create Button */}
            <button
              onClick={handleCreateMicrosite}
              className="sm:hidden p-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors"
              aria-label="Create new"
              disabled={isCreating}
            >
              <Plus className="h-5 w-5" />
            </button>
            {/* ...existing code... */}

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-slate-800 dark:bg-slate-950/95">
        <div className="flex h-16 items-center px-4 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            {showSidebar && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            )}
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-9 h-9 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg shadow-lg">
                <QrCode className="w-5 h-5 text-white" />
              </div>
              <span className="hidden sm:inline text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                ScanWyse
              </span>
            </Link>
          </div>

          {/* Search Bar - Center */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <ComingSoonTooltip feature="Search" className="w-full">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search microsites..."
                  readOnly
                  className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none cursor-pointer dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 opacity-60"
                />
              </div>
            </ComingSoonTooltip>
          </div>

          {/* Right Actions */}
          <div className="ml-auto flex items-center gap-2">
// ...truncated for brevity...
