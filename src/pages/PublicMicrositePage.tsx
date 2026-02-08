import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DndContext } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Canvas from '@/components/editor/Canvas';
import type { Block } from '@/types';
import type { PageTheme } from '@/types/theme';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost';

interface MicrositePublicData {
  id: string;
  title: string;
  description: string;
  layout: Block[];
  theme: PageTheme;
  links: Record<string, unknown>[];
  qrId: string;
  type: string;
  publishedAt: string | null;
}

export default function PublicMicrositePage() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<MicrositePublicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/public/${slug}/data`);

        if (response.status === 404) {
          setError('not-found');
          return;
        }

        if (!response.ok) {
          setError('server-error');
          return;
        }

        const json: MicrositePublicData = await response.json();
        setData(json);

        // Set page title
        if (json.title) {
          document.title = json.title;
        }
      } catch (err) {
        console.error('Failed to load microsite:', err);
        setError('network-error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Error states
  if (error === 'not-found') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-6">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-gray-500">This microsite doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-6">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
          <p className="text-gray-500 mb-4">We couldn't load this page. Please try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const blocks = data.layout || [];
  const theme = data.theme as PageTheme | undefined;

  return (
    <div className="min-h-screen">
      <DndContext onDragEnd={() => {}}>
        <SortableContext
          items={blocks.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          <Canvas
            blocks={blocks}
            setBlocks={() => {}}
            selectedBlockId={null}
            onSelectBlock={() => {}}
            theme={theme}
            isPreview={true}
          />
        </SortableContext>
      </DndContext>
    </div>
  );
}
