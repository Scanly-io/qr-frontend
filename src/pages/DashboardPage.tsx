import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Plus, QrCode, Eye, Edit, Trash2, Copy, MoreVertical, Grid, List, Search, Filter, Calendar, TrendingUp } from 'lucide-react';
import { micrositeApi } from '../lib/api';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@/components/ui';

interface Microsite {
  id: string;
  qrId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

type ViewMode = 'grid' | 'list';
type FilterMode = 'all' | 'published' | 'draft';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [microsites, setMicrosites] = useState<Microsite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [searchQuery, setSearchQuery] = useState('');

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
      // Don't show alert if user was redirected
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
      // Navigate to editor with the new microsite ID
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
      // Reload the list
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <h1 className="ml-3 text-lg sm:text-xl font-bold text-gray-900">QR Microsite</h1>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="hidden sm:inline text-sm text-gray-600 truncate max-w-[150px]">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">My Microsites</h2>
            <p className="mt-1 text-sm sm:text-base text-gray-600">Create and manage your QR code landing pages</p>
          </div>
          <button
            onClick={handleCreateMicrosite}
            disabled={isCreating}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Create Microsite
              </>
            )}
          </button>
        </div>

        {/* Microsites Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : microsites.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
            <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No microsites yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first QR microsite</p>
            <button
              onClick={handleCreateMicrosite}
              disabled={isCreating}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
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
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {microsite.title}
                      </h3>
                      <p className="text-sm text-gray-500">/{microsite.qrId}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                      <QrCode className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Updated {new Date(microsite.updatedAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 flex items-center justify-between">
                  <button
                    onClick={() => window.open(`/public/${microsite.qrId}`, '_blank')}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  
                  <button
                    onClick={() => navigate(`/editor/${microsite.id}`)}
                    className="flex items-center gap-1 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  
                  <button
                    onClick={() => handleDeleteMicrosite(microsite.id, microsite.title)}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
