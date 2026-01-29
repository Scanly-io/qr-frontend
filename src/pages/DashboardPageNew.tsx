import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  Plus,
  QrCode,
  Eye,
  Edit,
  Trash2,
  Copy,
  MoreVertical,
  Grid,
  List,
  Search,
  Filter,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import { micrositeApi } from '../lib/api';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
} from '@/components/ui';
import { CreateMicrositeModal } from '@/components/CreateMicrositeModal';
import type { PageTheme } from '@/types/theme';
import type { BlockType } from '@/types';

interface Microsite {
  id: string;
  qrId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

type ViewMode = 'grid' | 'list';
type FilterMode = 'all' | 'recent' | 'search';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [microsites, setMicrosites] = useState<Microsite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    console.log('🏠 Dashboard mounted, auth status:', {
      user,
      hasAccessToken: !!localStorage.getItem('accessToken'),
      hasRefreshToken: !!localStorage.getItem('refreshToken'),
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
      if (
        !error ||
        (error instanceof Error && !error.message.includes('Session expired'))
      ) {
        alert(
          'Failed to load microsites: ' +
            (error instanceof Error ? error.message : 'Unknown error')
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Open the create modal instead of creating directly
  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
  };

  // Create microsite with template
  const handleCreateWithTemplate = async (template: { blocks: BlockType[]; theme: PageTheme; name: string }) => {
    setIsCreating(true);
    try {
      const newMicrosite = await micrositeApi.create({
        title: template.name || 'New Microsite',
        description: '',
        layout: [], // We'll add blocks in the editor
        theme: template.theme as unknown as Record<string, unknown>,
      });
      
      // Navigate to editor with template info in state
      navigate(`/editor/${newMicrosite.id}`, { 
        state: { 
          templateBlocks: template.blocks,
          templateTheme: template.theme,
        } 
      });
    } catch (error) {
      console.error('Failed to create microsite:', error);
      alert(
        'Failed to create microsite: ' +
          (error instanceof Error ? error.message : 'Unknown error')
      );
    } finally {
      setIsCreating(false);
      setShowCreateModal(false);
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
      alert(
        'Failed to delete microsite: ' +
          (error instanceof Error ? error.message : 'Unknown error')
      );
    }
  };

  const handleDuplicateMicrosite = async (id: string) => {
    try {
      const duplicated = await micrositeApi.duplicate(id);
      // Refresh the list
      await loadMicrosites();
      toast.success(`Microsite duplicated: ${duplicated.title}`);
    } catch (error) {
      console.error('Failed to duplicate microsite:', error);
      toast.error('Failed to duplicate microsite');
    }
  };

  const filteredMicrosites = microsites.filter((microsite) => {
    const matchesSearch = microsite.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    
    // Filter by mode
    if (filterMode === 'recent') {
      const isRecent = new Date(microsite.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return matchesSearch && isRecent;
    }
    
    if (filterMode === 'search') {
      return matchesSearch && searchQuery.length > 0;
    }
    
    return matchesSearch;
  });

  return (
    <AppLayout>
      <div className="h-full bg-slate-50 dark:bg-slate-950">
        {/* Page Header */}
        <div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  My Microsites
                </h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                  Create and manage your QR code landing pages
                </p>
              </div>
              <Button
                onClick={handleOpenCreateModal}
                disabled={isCreating}
                size="lg"
                className="w-full md:w-auto"
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5 mr-2" />
                    Create Microsite
                  </>
                )}
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Total Microsites</CardDescription>
                  <CardTitle className="text-3xl">{microsites.length}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Total Views</CardDescription>
                  <CardTitle className="text-3xl flex items-center gap-2">
                    0
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>This Month</CardDescription>
                  <CardTitle className="text-3xl flex items-center gap-2">
                    0
                    <Calendar className="h-5 w-5 text-violet-600" />
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters & View Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            {/* Search & Filter */}
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search microsites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100"
                />
              </div>
              <Button variant="outline" size="default">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-700 shadow-sm'
                    : 'hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                aria-label="Grid view"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-700 shadow-sm'
                    : 'hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Microsites Grid/List */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
            </div>
          ) : filteredMicrosites.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/20 dark:to-purple-900/20 rounded-2xl flex items-center justify-center">
                    <QrCode className="w-8 h-8 text-violet-600 dark:text-violet-400" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {searchQuery
                    ? 'No microsites found'
                    : 'No microsites yet'}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {searchQuery
                    ? 'Try adjusting your search query'
                    : 'Get started by creating your first QR microsite'}
                </p>
                {!searchQuery && (
                  <Button
                    onClick={handleOpenCreateModal}
                    disabled={isCreating}
                    size="lg"
                  >
                    {isCreating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="h-5 w-5 mr-2" />
                        Create Your First Microsite
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
            >
              {filteredMicrosites.map((microsite) => (
                <Card
                  key={microsite.id}
                  className="group hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">
                          {microsite.title}
                        </CardTitle>
                        <CardDescription className="font-mono text-xs">
                          /{microsite.qrId}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/20 dark:to-purple-900/20 rounded-lg flex items-center justify-center">
                          <QrCode className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      Updated {new Date(microsite.updatedAt).toLocaleDateString()}
                    </p>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(`/public/${microsite.qrId}`, '_blank')
                        }
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-1.5" />
                        Preview
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => navigate(`/editor/${microsite.id}`)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-1.5" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleDuplicateMicrosite(microsite.id)
                        }
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleDeleteMicrosite(microsite.id, microsite.title)
                        }
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Microsite Modal */}
      <CreateMicrositeModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateWithTemplate}
        isCreating={isCreating}
      />
    </AppLayout>
  );
}
