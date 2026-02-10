import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Plus, QrCode, Eye, Edit, Trash2, TrendingUp, Copy, ExternalLink, BarChart3 } from 'lucide-react';
import { micrositeApi, analyticsApi } from '../lib/api';
import { AppLayout } from '../components/layout/AppLayout';
import { Tooltip } from '../components/ui/tooltip';

interface Microsite {
  id: string;
  qrId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface OverviewStats {
  totalScans: number;
  totalScansToday: number;
  totalScansLast7Days: number;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [microsites, setMicrosites] = useState<Microsite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [stats, setStats] = useState<OverviewStats>({ totalScans: 0, totalScansToday: 0, totalScansLast7Days: 0 });

  useEffect(() => {
    loadMicrosites();
    loadStats();
  }, []);

  const loadMicrosites = async () => {
    setIsLoading(true);
    try {
      const data = await micrositeApi.list();
      setMicrosites(data as Microsite[]);
    } catch (error) {
      if (!error || (error instanceof Error && !error.message.includes('Session expired'))) {
        alert('Failed to load microsites: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const overview = await analyticsApi.getOverview();
      setStats({
        totalScans: overview.totalScans || 0,
        totalScansToday: overview.totalScansToday || 0,
        totalScansLast7Days: overview.totalScansLast7Days || 0,
      });
    } catch {
      // Analytics may not be available yet — keep defaults
    }
  };

  const handleCreateMicrosite = async () => {
    setIsCreating(true);
    try {
      const newMicrosite = await micrositeApi.create({
        title: 'New Microsite',
        description: '',
        layout: [],
      });
      navigate(`/editor/${newMicrosite.id}`);
    } catch (error) {
      console.error('Failed to create microsite:', error);
      alert('Failed to create microsite: ' + (error instanceof Error ? error.message : 'Unknown error'));
      setIsCreating(false);
    }
  };

  const handleDeleteMicrosite = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await micrositeApi.delete(id);
      await loadMicrosites();
    } catch (error) {
      console.error('Failed to delete microsite:', error);
      alert('Failed to delete microsite: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleDuplicate = async (microsite: Microsite) => {
    try {
      const original = await micrositeApi.get(microsite.id);
      const newMicrosite = await micrositeApi.create({
        title: `${microsite.title} (Copy)`,
        description: '',
        layout: (original as { layout?: unknown[] }).layout || [],
      });
      navigate(`/editor/${newMicrosite.id}`);
    } catch (error) {
      console.error('Failed to duplicate microsite:', error);
      alert('Failed to duplicate: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}
                </h2>
                <p className="mt-1 text-slate-500 text-sm">Manage your QR microsites and track performance</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCreateMicrosite}
                  disabled={isCreating}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isCreating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      <span className="hidden sm:inline">Creating...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span className="hidden sm:inline">New Microsite</span>
                      <span className="sm:hidden">New</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Microsites</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{microsites.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                    <QrCode className="w-5 h-5 text-violet-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Views</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalScans.toLocaleString()}</p>
                  </div>
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Today</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalScansToday.toLocaleString()}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Last 7 Days</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalScansLast7Days.toLocaleString()}</p>
                  </div>
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-amber-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Microsites Grid */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-slate-200">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-600 mb-4" />
              <p className="text-slate-500 text-sm">Loading your microsites...</p>
            </div>
          ) : microsites.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-200">
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center">
                  <QrCode className="w-8 h-8 text-violet-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No microsites yet</h3>
              <p className="text-slate-500 mb-6 max-w-sm mx-auto text-sm">
                Create your first QR microsite — it only takes a few seconds!
              </p>
              <div className="flex justify-center">
                <button
                  onClick={handleCreateMicrosite}
                  disabled={isCreating}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  Blank Microsite
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {microsites.map((microsite) => (
                <div
                  key={microsite.id}
                  className="group bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-violet-200 transition-all duration-300 overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-slate-900 mb-0.5 truncate group-hover:text-violet-600 transition-colors">
                          {microsite.title}
                        </h3>
                        <p className="text-xs text-slate-400 font-mono truncate">/{microsite.qrId}</p>
                      </div>
                      <div className="w-11 h-11 bg-gradient-to-br from-violet-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-3 group-hover:scale-110 transition-transform">
                        <QrCode className="w-5 h-5 text-violet-600" />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Updated {new Date(microsite.updatedAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-3 flex items-center gap-2">
                    <Tooltip content="Open live microsite in new tab" side="bottom">
                      <button
                        onClick={() => window.open(`/public/${microsite.qrId}`, '_blank')}
                        className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all font-medium"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Preview
                      </button>
                    </Tooltip>
                    
                    <button
                      onClick={() => navigate(`/editor/${microsite.id}`)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all font-semibold shadow-sm hover:shadow-md"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit
                    </button>

                    <Tooltip content="Duplicate microsite" side="bottom">
                      <button
                        onClick={() => handleDuplicate(microsite)}
                        className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-all"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </Tooltip>

                    <Tooltip content="Delete microsite" side="bottom">
                      <button
                        onClick={() => handleDeleteMicrosite(microsite.id, microsite.title)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
    </AppLayout>
  );
}