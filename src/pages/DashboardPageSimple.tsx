import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Plus, QrCode, Eye, Edit, Trash2, Settings, Sparkles, Building2 } from 'lucide-react';
import { micrositeApi } from '../lib/api';
import { TemplateSelectionDialog } from '../components/editor/TemplateSelectionDialog';

interface Microsite {
  id: string;
  qrId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [microsites, setMicrosites] = useState<Microsite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);

  useEffect(() => {
    console.log('🏠 Dashboard mounted, auth status:', {
      user,
      hasAccessToken: !!localStorage.getItem('accessToken'),
      hasRefreshToken: !!localStorage.getItem('refreshToken')
    });
    loadMicrosites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMicrosites = async () => {
    setIsLoading(true);
    try {
      console.log('📋 Loading microsites...');
      const data = await micrositeApi.list();
      console.log('✅ Microsites loaded:', data);
      setMicrosites(data as Microsite[]);
    } catch (error) {
      console.error('❌ Failed to load microsites:', error);
      if (!error || (error instanceof Error && !error.message.includes('Session expired'))) {
        alert('Failed to load microsites: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    } finally {
      setIsLoading(false);
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl shadow-lg">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  QR Microsite
                </h1>
                <p className="text-xs text-slate-500">Dashboard</p>
              </div>
            </div>
            
            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/agency')}
                className="flex items-center gap-2 px-4 py-2 text-sm text-violet-600 hover:text-violet-700 hover:bg-violet-50 rounded-lg transition-all font-medium border border-violet-200"
              >
                <Building2 className="w-4 h-4" />
                <span className="hidden sm:inline">Agency</span>
              </button>
              <button
                onClick={() => navigate('/analytics')}
                className="flex items-center gap-2 px-4 py-2 text-sm text-violet-600 hover:text-violet-700 hover:bg-violet-50 rounded-lg transition-all font-medium border border-violet-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="hidden sm:inline">Analytics</span>
              </button>
              <button
                onClick={() => navigate('/settings')}
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all font-medium border border-slate-200"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </button>
              <span className="hidden md:inline text-sm text-slate-600 font-medium">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header with Stats */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">My Microsites</h2>
              <p className="mt-2 text-slate-600">Create and manage your QR code landing pages</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowTemplateDialog(true)}
                className="inline-flex items-center justify-center gap-2 bg-white text-violet-600 px-6 py-3 rounded-xl font-semibold hover:bg-violet-50 transition-all shadow-md hover:shadow-lg border-2 border-violet-200"
              >
                <Sparkles className="w-5 h-5" />
                <span className="hidden sm:inline">Use Template</span>
                <span className="sm:hidden">Template</span>
              </button>
              <button
                onClick={handleCreateMicrosite}
                disabled={isCreating}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span className="hidden sm:inline">Creating...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">Create Microsite</span>
                    <span className="sm:hidden">Create</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Microsites</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{microsites.length}</p>
                </div>
                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                  <QrCode className="w-6 h-6 text-violet-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Views</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">0</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">This Month</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">0</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Microsites Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-slate-200">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mb-4"></div>
            <p className="text-slate-600">Loading your microsites...</p>
          </div>
        ) : microsites.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-300">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center">
                <QrCode className="w-10 h-10 text-violet-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No microsites yet</h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              Get started by creating your first QR microsite. It only takes a few seconds!
            </p>
            <button
              onClick={handleCreateMicrosite}
              disabled={isCreating}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 transform hover:scale-105"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Create Your First Microsite
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {microsites.map((microsite) => (
              <div
                key={microsite.id}
                className="group bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-violet-200 transition-all duration-300 overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-slate-900 mb-1 truncate group-hover:text-violet-600 transition-colors">
                        {microsite.title}
                      </h3>
                      <p className="text-sm text-slate-500 font-mono truncate">/{microsite.qrId}</p>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0 ml-4 group-hover:scale-110 transition-transform">
                      <QrCode className="w-7 h-7 text-violet-600" />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Updated {new Date(microsite.updatedAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 flex items-center gap-2">
                  <button
                    onClick={() => window.open(`/public/${microsite.qrId}`, '_blank')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  
                  <button
                    onClick={() => navigate(`/editor/${microsite.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all font-medium shadow-sm hover:shadow-md"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  
                  <button
                    onClick={() => handleDeleteMicrosite(microsite.id, microsite.title)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      {/* Template Selection Dialog */}
      <TemplateSelectionDialog
        open={showTemplateDialog}
        onClose={() => setShowTemplateDialog(false)}
        onSelect={async () => {
          setIsCreating(true);
          setShowTemplateDialog(false);
          try {
            const newMicrosite = await micrositeApi.create({
              title: `New Microsite from Template`,
              description: '',
              layout: [], // TODO: Fetch template layout and apply
            });
            navigate(`/editor/${newMicrosite.id}`);
          } catch (error) {
            console.error('Failed to create microsite from template:', error);
            alert('Failed to create microsite: ' + (error instanceof Error ? error.message : 'Unknown error'));
            setIsCreating(false);
          }
        }}
      />
    </div>
  );
}
