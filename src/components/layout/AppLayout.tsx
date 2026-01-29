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
  User,
  Bell,
  Search
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui';

interface AppLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export function AppLayout({ children, showSidebar = true }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      current: location.pathname === '/dashboard'
    },
    {
      name: 'QR Codes',
      href: '/qr-codes',
      icon: QrCode,
      current: location.pathname.startsWith('/qr-codes')
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      current: location.pathname === '/settings'
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
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
                QR Microsite
              </span>
            </Link>
          </div>

          {/* Search Bar - Center */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search microsites..."
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="ml-auto flex items-center gap-2">
            {/* Create New Button */}
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate('/editor/new')}
              className="hidden sm:flex"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Create
            </Button>

            {/* Mobile Create Button */}
            <button
              onClick={() => navigate('/editor/new')}
              className="sm:hidden p-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors"
              aria-label="Create new"
            >
              <Plus className="h-5 w-5" />
            </button>

            {/* Notifications */}
            <button
              className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-56 rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900 z-50">
                    <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {user?.email}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Free Plan
                      </p>
                    </div>
                    <div className="py-2">
                      <button
                        onClick={() => {
                          navigate('/settings');
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                      >
                        <User className="h-4 w-4" />
                        Profile Settings
                      </button>
                      <button
                        onClick={() => {
                          navigate('/settings');
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                        Account Settings
                      </button>
                    </div>
                    <div className="border-t border-slate-200 dark:border-slate-800 py-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar Navigation - Desktop */}
        {showSidebar && (
          <>
            <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
              <nav className="flex-1 space-y-1 p-4">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        item.current
                          ? 'bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400'
                          : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              {/* Sidebar Footer */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <div className="p-3 rounded-lg bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-200 dark:border-violet-800">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    Upgrade to Pro
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                    Unlock unlimited microsites and analytics
                  </p>
                  <Button variant="default" size="sm" className="w-full">
                    Upgrade Now
                  </Button>
                </div>
              </div>
            </aside>

            {/* Mobile Sidebar */}
            {isMobileMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                  onClick={() => setIsMobileMenuOpen(false)}
                ></div>
                <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 lg:hidden">
                  <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-lg font-bold">Menu</span>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <nav className="flex-1 space-y-1 p-4">
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            item.current
                              ? 'bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400'
                              : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                          }`}
                        >
                          <Icon className="h-5 w-5 flex-shrink-0" />
                          {item.name}
                        </Link>
                      );
                    })}
                  </nav>
                </aside>
              </>
            )}
          </>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
