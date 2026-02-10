import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { Save, Eye, Loader2, Layers, Layout, Sliders, Palette, ArrowLeft, PanelRightClose, PanelRightOpen, Sparkles, LayoutTemplate } from 'lucide-react';
import { Tooltip } from '@/components/ui/tooltip';
import { DeviceSelector } from './DeviceSelector';
import BlockPalette from './BlockPalette';
import Canvas from './Canvas';
import DeviceFrame from './DeviceFrame';
import BlockInspector from './BlockInspector';
import TemplatesSidebar from './TemplatesSidebar';
import { ThemeGallery } from './ThemeGallery';
import { PreviewModal } from './PreviewModal';
// import EditorToolbar from './EditorToolbar'; // TODO: Refactor to use this component
import QRGenerationModal from './QRGenerationModal';
import { OnboardingModal } from '@/components/OnboardingModal';
import { HelpPanel } from '@/components/HelpPanel';
import { ToastContainer, type ToastProps } from '@/components/ui/Toast';
import { ComingSoonBadge } from '@/components/ui/ComingSoonBadge';
import { KeyboardShortcutsPanel } from '@/components/accessibility/KeyboardShortcutsPanel';
import type { Block, BlockType } from '@/types';
import { PRESET_THEMES, type PageTheme } from '@/types/theme';
import { useTheme } from '@/contexts';
import { nanoid } from 'nanoid';
import { micrositeApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useLocation } from 'react-router-dom';

interface EditorLayoutProps {
  micrositeId: string; // ID of the microsite being edited
}

// DEVICE PRESETS
// Common device sizes for responsive preview testing
// Organized by category: Phones, Tablets, Desktops
const DEVICE_SIZES = [
  // === SMALL PHONES ===
  { name: 'iPhone SE (2020)', width: 375, category: 'Phone' },
  { name: 'Samsung Galaxy S8', width: 360, category: 'Phone' },
  
  // === STANDARD PHONES ===
  { name: 'iPhone 12/13/14', width: 390, category: 'Phone' },
  { name: 'iPhone 12/13/14 Pro', width: 390, category: 'Phone' },
  { name: 'Samsung Galaxy S20/S21', width: 360, category: 'Phone' },
  { name: 'Samsung Galaxy S22/S23', width: 360, category: 'Phone' },
  { name: 'Google Pixel 5/6/7', width: 393, category: 'Phone' },
  { name: 'OnePlus 9/10', width: 412, category: 'Phone' },
  
  // === LARGE PHONES ===
  { name: 'iPhone 14 Pro Max', width: 428, category: 'Phone' },
  { name: 'iPhone 15 Pro Max', width: 430, category: 'Phone' },
  { name: 'Samsung Galaxy S21 Ultra', width: 412, category: 'Phone' },
  { name: 'Samsung Galaxy S22 Ultra', width: 384, category: 'Phone' },
  { name: 'Samsung Galaxy Note 20', width: 412, category: 'Phone' },
  { name: 'Google Pixel 7 Pro', width: 412, category: 'Phone' },
  { name: 'Xiaomi Mi 11', width: 392, category: 'Phone' },
  
  // === TABLETS ===
  { name: 'iPad Mini', width: 768, category: 'Tablet' },
  { name: 'iPad Air', width: 820, category: 'Tablet' },
  { name: 'iPad Pro 11"', width: 834, category: 'Tablet' },
  { name: 'iPad Pro 12.9"', width: 1024, category: 'Tablet' },
  { name: 'Samsung Galaxy Tab S7', width: 753, category: 'Tablet' },
  { name: 'Samsung Galaxy Tab S8', width: 800, category: 'Tablet' },
  { name: 'Microsoft Surface Pro', width: 912, category: 'Tablet' },
  
  // === DESKTOPS & LAPTOPS ===
  { name: 'Laptop (13")', width: 1280, category: 'Desktop' },
  { name: 'Laptop (15")', width: 1440, category: 'Desktop' },
  { name: 'Desktop (1080p)', width: 1920, category: 'Desktop' },
  { name: 'Desktop (1440p)', width: 2560, category: 'Desktop' },
] as const;

export default function EditorLayout({ micrositeId }: EditorLayoutProps) {
  // ROUTING
  const location = useLocation();
  const locationState = location.state as { templateBlocks?: BlockType[]; templateTheme?: PageTheme } | null;
  
  // STATE MANAGEMENT
  // blocks: Array of all content blocks in the microsite
  const [blocks, setBlocks] = useState<Block[]>([]);
  // selectedBlockId: ID of currently selected block for editing
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  // activeId: ID of block being dragged (for drag & drop)
  const [activeId, setActiveId] = useState<string | null>(null);
  // selectedDeviceIndex: Index of currently selected device size from DEVICE_SIZES array
  const [selectedDeviceIndex, setSelectedDeviceIndex] = useState<number>(0); // Default to iPhone SE (375px)
  // micrositeName: Editable name for the microsite
  const [micrositeName, setMicrositeName] = useState<string>('My Microsite');
  // qrId: QR code identifier for preview and publish
  const [qrId, setQrId] = useState<string>('');
  // isEditingName: Whether user is currently editing the microsite name
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  // mobileView: Which panel to show on mobile ('palette' | 'canvas' | 'inspector')
  const [mobileView, setMobileView] = useState<'palette' | 'canvas' | 'inspector'>('canvas');
  // Loading states
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // QR Generation Modal
  const [showQRModal, setShowQRModal] = useState<boolean>(false);
  
  // Templates Sidebar
  const [showTemplates, setShowTemplates] = useState<boolean>(false);
  
  // Theme Settings Modal
  const [showThemeSettings, setShowThemeSettings] = useState<boolean>(false);
  
  // Preview Modal
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  
  // Use global theme context instead of local state
  const { pageTheme, setPageTheme } = useTheme();
  
  // Onboarding & Help
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  
  // Keyboard Shortcuts Panel
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState<boolean>(false);
  
  // Collapsible panels - now only one panel
  const [isDesignPanelCollapsed, setIsDesignPanelCollapsed] = useState<boolean>(false);
  
  // Combined sidebar tab: 'blocks' | 'design' | 'ai'
  const [sidebarTab, setSidebarTab] = useState<'blocks' | 'design' | 'ai'>('blocks');
  
  // Theme filter state
  const [selectedThemeFilter, setSelectedThemeFilter] = useState<string>('All');
  
  // Toast notifications
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  // Get auth state
  const { accessToken } = useAuthStore();

  // Toast helpers - memoized to prevent recreation
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = nanoid();
    setToasts((prev) => [...prev, { id, message, type, onClose: removeToast }]);
  }, [removeToast]);

  // Memoized block update handler
  const handleBlockUpdate = useCallback((updatedBlock: Block) => {
    setBlocks((prev) => prev.map((b) => (b.id === updatedBlock.id ? updatedBlock : b)));
  }, []);

  // Handle block selection - also switches to design tab to show inspector
  const handleBlockSelect = useCallback((blockId: string | null) => {
    setSelectedBlockId(blockId);
    if (blockId) {
      // When selecting a block, switch to design tab to show its inspector
      setSidebarTab('design');
    }
  }, []);

  // Find the currently selected block object
  const selectedBlock = blocks.find((block) => block.id === selectedBlockId);
  
  // Get current device configuration
  const currentDevice = DEVICE_SIZES[selectedDeviceIndex];

  // Load microsite from backend
  const loadMicrosite = async () => {
    if (!accessToken) {
      setIsLoading(false);
      alert('Please login first to edit microsites');
      return;
    }

    // Handle new microsite case
    if (micrositeId === 'new') {
      setIsLoading(false);
      setBlocks([]);
      setMicrositeName('New Microsite');
      setQrId('');
      return;
    }

    setIsLoading(true);
    try {
      const data = await micrositeApi.get(micrositeId);
      setBlocks(data.layout || []);
      setMicrositeName(data.title || 'My Microsite');
      setQrId(data.qrId || '');
      
      // Load theme - check both 'theme' field (new) and 'description' (legacy)
      if (data.theme && typeof data.theme === 'object' && 'id' in data.theme && 'name' in data.theme) {
        setPageTheme(data.theme as PageTheme);
      } else {
        // Legacy: try loading from description JSON
        try {
          if (data.description) {
            const parsed = JSON.parse(data.description);
            if (parsed.fullTheme) {
              setPageTheme(parsed.fullTheme);
            }
          }
        } catch {
          // No saved theme found, using default
        }
      }
    } catch (error) {
      alert('Failed to load microsite: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  // Load microsite data on mount
  useEffect(() => {
    loadMicrosite();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [micrositeId]);

  // Apply template blocks from navigation state (when creating from template)
  useEffect(() => {
    if (locationState?.templateBlocks && locationState.templateBlocks.length > 0 && blocks.length === 0) {
      // Create blocks from template
      const newBlocks: Block[] = locationState.templateBlocks.map((type, index) => ({
        id: nanoid(),
        type,
        content: getDefaultContent(type),
        order: index,
      }));
      setBlocks(newBlocks);
    }
    
    if (locationState?.templateTheme) {
      setPageTheme(locationState.templateTheme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationState]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow typing in inputs/textareas
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      // Delete selected block (Delete or Backspace)
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedBlockId) {
        e.preventDefault();
        const blockToDelete = blocks.find(b => b.id === selectedBlockId);
        setBlocks(blocks.filter(b => b.id !== selectedBlockId));
        setSelectedBlockId(null);
        if (blockToDelete) {
          showToast(`Deleted ${blockToDelete.type} block`, 'info');
        }
      }
      
      // Duplicate block (Cmd/Ctrl + D)
      if ((e.metaKey || e.ctrlKey) && e.key === 'd' && selectedBlockId) {
        e.preventDefault();
        const blockToDuplicate = blocks.find(b => b.id === selectedBlockId);
        if (blockToDuplicate) {
          const newBlock = {
            ...blockToDuplicate,
            id: nanoid(),
            order: blocks.length,
          };
          setBlocks([...blocks, newBlock]);
          setSelectedBlockId(newBlock.id);
          showToast(`Duplicated ${blockToDuplicate.type} block`, 'success');
        }
      }
      
      // Escape to deselect
      if (e.key === 'Escape' && selectedBlockId) {
        setSelectedBlockId(null);
      }
      
      // Arrow keys to navigate blocks
      if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && selectedBlockId) {
        e.preventDefault();
        const currentIndex = blocks.findIndex(b => b.id === selectedBlockId);
        if (e.key === 'ArrowUp' && currentIndex > 0) {
          setSelectedBlockId(blocks[currentIndex - 1].id);
        } else if (e.key === 'ArrowDown' && currentIndex < blocks.length - 1) {
          setSelectedBlockId(blocks[currentIndex + 1].id);
        }
      }
      
      // Show keyboard shortcuts with ?
      if (e.key === '?' && e.shiftKey) {
        e.preventDefault();
        setShowKeyboardShortcuts(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBlockId, blocks]);

  // Check for first-time users and show onboarding
  useEffect(() => {
    const hasSeenOnboardingBefore = localStorage.getItem('hasSeenOnboarding') === 'true';
    
    // Show onboarding after a short delay if it's their first time
    if (!hasSeenOnboardingBefore && !isLoading) {
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 1000); // Wait 1 second after page loads
      
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Save handler - Save to backend
  const handleSave = async () => {
    if (!accessToken) {
      showToast('Please login to save', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await micrositeApi.update(micrositeId, {
        title: micrositeName,
        layout: blocks,
        theme: pageTheme,
        description: '',
      });

      setLastSaved(new Date());
      showToast(`✅ Saved ${blocks.length} blocks successfully!`, 'success');
    } catch (error) {
      showToast('Failed to save: ' + (error instanceof Error ? error.message : 'Unknown error'), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Publish handler
  const handlePublish = async () => {
    if (!accessToken) {
      showToast('Please login to publish', 'error');
      return;
    }

    const publishId = qrId || micrositeId;

    setIsPublishing(true);
    try {
      await handleSave();
      await micrositeApi.publish(publishId);
      showToast('🚀 Published successfully! Your microsite is live.', 'success');
    } catch (error) {
      showToast('Failed to publish: ' + (error instanceof Error ? error.message : 'Unknown error'), 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  // Preview handler
  const handlePreview = async () => {
    try {
      await handleSave();
    } catch {
      showToast('Failed to save before preview', 'error');
      return;
    }

    setShowPreviewModal(true);
    showToast('🔍 Opening preview...', 'info');
  };

  // Template Application handler - REPLACES existing blocks
  const applyTemplate = useCallback((blockTypes: BlockType[]) => {
    const newBlocks: Block[] = blockTypes.map((type, idx) => ({
      id: nanoid(),
      type,
      content: getDefaultContent(type),
      order: idx,
    }));
    
    // Replace all blocks with the new template
    setBlocks(newBlocks);
    setSelectedBlockId(null);
    // Don't close templates sidebar - let user try multiple templates
    showToast(`✨ Applied template with ${newBlocks.length} blocks - try another or close when done`, 'success');
  }, [showToast]);

  // Rich Template Application handler (with pre-populated content and optional theme)
  // REPLACES existing blocks instead of appending
  const applyRichTemplate = useCallback((templateBlocks: Block[], templateTheme?: Partial<PageTheme>) => {
    // Generate new IDs for each block - avoid excessive cloning
    const newBlocks: Block[] = templateBlocks.map((block, idx) => {
      // Only deep clone content, not the entire block
      const clonedContent = block.content ? JSON.parse(JSON.stringify(block.content)) : {};
      
      return {
        id: nanoid(),
        type: block.type,
        order: idx,
        content: clonedContent,
        style: block.style ? { ...block.style } : {},
        styles: block.styles ? { ...block.styles } : undefined,
      };
    });
    
    // Replace all blocks with the new template
    setBlocks(newBlocks);
    setSelectedBlockId(null);
    
    // Apply the template theme if provided
    if (templateTheme) {
      setPageTheme(prevTheme => ({
        ...prevTheme,
        ...templateTheme,
      }));
    }
    
    // Don't close templates sidebar - let user try multiple templates
    showToast(`✨ Applied template with ${newBlocks.length} blocks - try another or close when done`, 'success');
  }, [showToast, setPageTheme]);

  // DRAG & DROP SENSOR CONFIGURATION
  // PointerSensor: Detects mouse/touch drag events
  // distance: 8 - Prevents accidental drags (must move 8px to start dragging)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // DRAG START HANDLER
  // Called when user starts dragging a block
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  // DRAG END HANDLER
  // Called when user drops a block
  // Handles two scenarios: 1) Adding new block from palette, 2) Reordering existing blocks
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // If dropped outside a valid drop zone, cancel the drag
    if (!over) {
      setActiveId(null);
      return;
    }

    // SCENARIO 1: Adding a NEW block from the palette
    // Check if the dragged item is from the palette (not an existing block)
    if (active.data.current?.type === 'palette-item') {
      const blockType = active.id as BlockType;
      // Create a new block with unique ID and default content
      const newBlock: Block = {
        id: nanoid(), // Generate unique ID
        type: blockType,
        content: getDefaultContent(blockType), // Set default content based on type
        order: blocks.length,
      };
      // Add to blocks array
      setBlocks([...blocks, newBlock]);
      // Auto-select the newly added block so user can edit it immediately
      handleBlockSelect(newBlock.id);
      // Show success toast
      showToast(`Added ${blockType} block`, 'success');
    } 
    // SCENARIO 2: Reordering existing blocks (dragging within canvas)
    else if (active.id !== over.id && over.id !== 'canvas-droppable') {
      setBlocks((items) => {
        // Find the current position and target position of the dragged block
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        // Reorder the array using DnD Kit's arrayMove helper
        return arrayMove(items, oldIndex, newIndex);
      });
    }

    // Clear the active drag state
    setActiveId(null);
  };

  // Handler for quick-add button on blocks
  const handleAddBlock = (blockType: BlockType) => {
    const newBlock: Block = {
      id: nanoid(),
      type: blockType,
      content: getDefaultContent(blockType),
      order: blocks.length,
    };
    setBlocks([...blocks, newBlock]);
    handleBlockSelect(newBlock.id);
    showToast(`✨ Added ${blockType} block`, 'success');
  };

  // QR Generation handler
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleQRGenerated = (newQrId: string, _qrUrl: string) => {
    setQrId(newQrId);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Skip Links for Accessibility */}
      <a 
        href="#main-canvas" 
        className="sr-only-focusable fixed top-4 left-4 z-[200] px-4 py-2 bg-violet-600 text-white font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-violet-300"
      >
        Skip to canvas
      </a>
      <a 
        href="#block-palette" 
        className="sr-only-focusable fixed top-4 left-32 z-[200] px-4 py-2 bg-violet-600 text-white font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-violet-300"
      >
        Skip to blocks
      </a>

      {/* Live Region for Screen Reader Announcements */}
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {blocks.length === 0 
          ? "Canvas is empty. Add blocks to start building your microsite." 
          : `${blocks.length} ${blocks.length === 1 ? 'block' : 'blocks'} on your page.`}
        {selectedBlockId && ` Currently editing ${blocks.find(b => b.id === selectedBlockId)?.type || 'block'}.`}
      </div>

      {/* Loading Screen */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
          {/* Animated background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-700" />
          </div>
          
          {/* Loading content */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="relative mb-8">
              <div className="w-16 h-16 border-4 border-primary/20 rounded-full" />
              <Loader2 className="absolute inset-0 w-16 h-16 text-primary animate-spin" style={{ animationDuration: '1s' }} />
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Loading Your Microsite
              </p>
              <p className="text-sm text-muted-foreground">
                ID: <span className="font-mono font-semibold">{micrositeId.slice(0, 8)}...</span>
              </p>
            </div>
            
            {/* Loading dots */}
            <div className="flex items-center gap-2 mt-6">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}

      {/* Editor UI (shown when not loading) */}
      {!isLoading && (
      <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-violet-50/30 to-purple-50/20">
        {/* MODERN TOP NAVIGATION - Glass Morphism */}
        <nav 
          role="navigation" 
          aria-label="Main navigation"
          className="h-16 bg-white/80 backdrop-blur-xl border-b border-black/5 flex items-center justify-between px-6 shrink-0 relative z-50 shadow-sm"
        >
          {/* LEFT: Back + Name */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Back Button */}
            <Tooltip content="Back to Dashboard" side="bottom">
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white/60 rounded-xl transition-all duration-200"
                aria-label="Return to dashboard"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Tooltip>

            {/* Microsite Name */}
            {isEditingName ? (
              <input
                type="text"
                value={micrositeName}
                onChange={(e) => setMicrositeName(e.target.value)}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setIsEditingName(false);
                  if (e.key === 'Escape') setIsEditingName(false);
                }}
                autoFocus
                className="px-3 py-1.5 text-sm font-semibold border-2 border-violet-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 max-w-[200px] bg-white"
                placeholder="Enter name"
                aria-label="Edit microsite name"
              />
            ) : (
              <button
                onClick={() => setIsEditingName(true)}
                className="px-3 py-1.5 text-sm font-semibold text-slate-900 hover:bg-white/60 rounded-xl transition-all duration-200 truncate max-w-[200px]"
                title="Click to edit"
              >
                {micrositeName}
              </button>
            )}
            
            {/* Save Status */}
            {lastSaved && (
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50/80 backdrop-blur-sm rounded-xl text-xs text-emerald-700 font-medium">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span>Saved</span>
              </div>
            )}
          </div>

          {/* CENTER: Device Selector */}
          <div className="flex items-center justify-center flex-1">
            <DeviceSelector
              devices={DEVICE_SIZES}
              selectedIndex={selectedDeviceIndex}
              onSelectDevice={setSelectedDeviceIndex}
            />
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            {/* QR Code */}
            <Tooltip content="QR Code" side="bottom">
              <button
                onClick={() => setShowQRModal(true)}
                className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-white/60 rounded-xl transition-all duration-200"
                aria-label="Generate QR code"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </button>
            </Tooltip>

            {/* Preview */}
            <Tooltip content="Preview (⌘P)" side="bottom">
              <button
                onClick={handlePreview}
                className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-white/60 rounded-xl transition-all duration-200"
                aria-label="Preview microsite"
              >
                <Eye className="w-5 h-5" />
              </button>
            </Tooltip>

            {/* Keyboard Shortcuts */}
            <Tooltip content="Shortcuts (?)" side="bottom">
              <button
                onClick={() => setShowKeyboardShortcuts(true)}
                className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-white/60 rounded-xl transition-all duration-200"
                aria-label="Show keyboard shortcuts"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </button>
            </Tooltip>

            {/* Help / Re-trigger Onboarding */}
            <Tooltip content="Help & Tour" side="bottom">
              <button
                onClick={() => setShowOnboarding(true)}
                className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-white/60 rounded-xl transition-all duration-200"
                aria-label="Show help and tutorial"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </Tooltip>

            <div className="w-px h-6 bg-slate-200" aria-hidden="true" />

            {/* Save */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-white/80 border border-slate-200 rounded-xl transition-all duration-200 disabled:opacity-50 shadow-sm"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isSaving ? 'Saving...' : 'Save'}</span>
            </button>

            {/* Publish */}
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-xl transition-all duration-200 disabled:opacity-50 shadow-lg shadow-violet-500/30"
            >
              {isPublishing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              )}
              <span>{isPublishing ? 'Publishing...' : 'Publish'}</span>
            </button>
          </div>
        </nav>
        
        {/* MAIN EDITOR AREA - Modern gradient background matching template gallery */}
        <div className="flex flex-1 overflow-hidden pb-16 md:pb-0 relative bg-gradient-to-br from-slate-50 via-violet-50/30 to-purple-50/20">
          
          {/* MIDDLE PANEL - Canvas Preview with iPhone-style frame */}
          <div 
            id="main-canvas"
            className={`${mobileView === 'canvas' ? 'flex' : 'hidden'} md:flex flex-1 overflow-hidden flex-col relative z-[1]`}
          >
            {/* Beautiful canvas area */}
            <div className="flex-1 overflow-y-auto flex justify-center p-8">
              <DeviceFrame
                deviceWidth={currentDevice.width}
                deviceName={currentDevice.name}
                deviceCategory={currentDevice.category}
              >
                <div
                  className="transition-all duration-300"
                  style={{ 
                    width: '100%',
                    minHeight: '100%',
                  }}
                >
                  <SortableContext
                    items={blocks.map((b) => b.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <Canvas
                      blocks={blocks}
                      setBlocks={setBlocks}
                      selectedBlockId={selectedBlockId}
                      onSelectBlock={handleBlockSelect}
                      theme={pageTheme}
                      onThemeClick={() => setShowThemeSettings(true)}
                    />
                  </SortableContext>
                </div>
              </DeviceFrame>
            </div>
          </div>

          {/* RIGHT PANEL - Modern Glass Inspector */}
          <div 
            className={`${mobileView === 'inspector' ? 'flex' : 'hidden'} md:flex flex-col relative z-[1] transition-all duration-300 ${
              isDesignPanelCollapsed ? 'w-12' : 'w-full md:w-80 lg:w-96'
            } bg-white/80 backdrop-blur-xl border-l border-black/5 shadow-2xl`}
        >
          {isDesignPanelCollapsed ? (
            // Collapsed state - entire panel clickable to expand
            <button
              onClick={() => setIsDesignPanelCollapsed(false)}
              aria-label="Expand sidebar to add blocks and customize design"
              aria-expanded="false"
              className="h-full w-full flex flex-col items-center bg-gradient-to-b from-violet-50/80 via-purple-50/80 to-pink-50/80 backdrop-blur-md p-2 border-l border-purple-200/30 relative group focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:ring-inset hover:from-violet-100/90 hover:via-purple-100/90 hover:to-pink-100/90 transition-all shadow-lg"
            >
              {/* Expand icon with visual feedback */}
              <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex items-center justify-center transition-all group-hover:scale-110 shadow-md hover:shadow-lg mb-3">
                <PanelRightOpen className="w-4 h-4 text-white" aria-hidden="true" />
                {/* Animated pulse indicator */}
                <span className="absolute -top-1 -left-1 flex h-3 w-3" aria-hidden="true">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                </span>
              </div>
              
              {/* Visual icon hints */}
              <div className="flex flex-col items-center gap-3 opacity-70 group-hover:opacity-100 transition-opacity" aria-hidden="true">
                <Layers className="w-4 h-4 text-purple-600" />
                <Palette className="w-4 h-4 text-purple-600" />
              </div>
              
              {/* Vertical text with styling */}
              <div className="flex-1 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-100/30 to-transparent" aria-hidden="true" />
                <div className="transform -rotate-90 whitespace-nowrap text-[10px] font-bold text-purple-600 tracking-[0.2em] uppercase relative z-10" aria-hidden="true">
                  Panel
                </div>
              </div>
            </button>
          ) : (
            // Expanded state - full panel with tabs
            <>
          {/* Tab Header - Modern Glass Design */}
          <div className="flex-shrink-0 bg-white/60 backdrop-blur-md border-b border-black/5">
            {/* Collapse button and title */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-black/5">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsDesignPanelCollapsed(true)}
                  aria-label="Collapse panel"
                  aria-expanded="true"
                  className="w-7 h-7 rounded-md hover:bg-purple-100 flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 group"
                >
                  <PanelRightClose className="w-4 h-4 text-purple-600 group-hover:text-purple-700" aria-hidden="true" />
                </button>
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" aria-hidden="true" />
                <span className="text-sm font-bold" style={{ color: '#2d3748' }}>Editor</span>
              </div>
              {selectedBlock && (
                <div className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: '#ede9fe', color: '#7c3aed' }}>
                  {blocks.findIndex(b => b.id === selectedBlockId) + 1} / {blocks.length}
                </div>
              )}
            </div>
            
            {/* Tab Buttons - Modern Glass Style */}
            <div className="flex p-1.5 gap-1">
              <button
                onClick={() => setSidebarTab('blocks')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  sidebarTab === 'blocks'
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30 scale-105'
                    : 'text-slate-600 hover:bg-white/60 backdrop-blur-sm'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span className="hidden sm:inline">Blocks</span>
              </button>
              <button
                onClick={() => { setSidebarTab('design'); setSelectedBlockId(null); }}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  sidebarTab === 'design'
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30 scale-105'
                    : 'text-slate-600 hover:bg-white/60 backdrop-blur-sm'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span className="hidden sm:inline">Design</span>
              </button>
              <button
                onClick={() => { setSidebarTab('ai'); setSelectedBlockId(null); }}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 relative ${
                  sidebarTab === 'ai'
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30 scale-105'
                    : 'text-slate-600 hover:bg-white/60 backdrop-blur-sm'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">AI</span>
                <span className="absolute -top-1.5 -right-1 px-1 py-0.5 text-[8px] font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full leading-none shadow-sm">
                  Soon
                </span>
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto min-h-0">
            {sidebarTab === 'blocks' ? (
              <div className="p-4">
                <BlockPalette 
                  onAddBlock={handleAddBlock}
                  isCollapsed={false}
                  onToggleCollapse={() => {}}
                />
              </div>
            ) : sidebarTab === 'ai' ? (
              <div className="h-full flex items-center justify-center p-6">
                <div className="text-center space-y-4 max-w-xs">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">AI Assistant</h3>
                    <ComingSoonBadge />
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    AI-powered content suggestions, smart layouts, and automatic optimization are coming in the next release.
                  </p>
                  <div className="space-y-2 text-left">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      Smart content generation
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      Auto layout optimization
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      Performance recommendations
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4">{/* Design Tab Content */}
                {/* Quick Actions Grid - 3 columns */}
                <div className="mb-4">
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Quick Actions</p>
                  <div className="grid grid-cols-3 gap-2">
                    {/* Page Settings */}
                    <button
                      onClick={() => {
                        setSelectedBlockId(null);
                        setSidebarTab('design'); // Ensure we're on design tab
                      }}
                      className={`group flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                        !selectedBlock
                          ? 'bg-violet-50 border-violet-200 shadow-sm'
                          : 'bg-white border-slate-200 hover:border-violet-200 hover:bg-violet-50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        !selectedBlock ? 'bg-violet-600' : 'bg-violet-100'
                      }`}>
                        <Palette className={`w-5 h-5 ${!selectedBlock ? 'text-white' : 'text-violet-600'}`} />
                      </div>
                      <div className="text-center">
                        <span className={`text-xs font-semibold ${!selectedBlock ? 'text-violet-700' : 'text-slate-700'}`}>Page</span>
                      </div>
                    </button>
                    
                    {/* Themes Gallery */}
                    <button
                      onClick={() => setShowThemeSettings(true)}
                      className="group flex flex-col items-center gap-2 p-3 rounded-xl bg-white border border-slate-200 hover:border-pink-200 hover:bg-pink-50 transition-all"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <span className="text-xs font-semibold text-slate-700">Themes</span>
                      </div>
                    </button>
                    
                    {/* Industry Templates - NEW */}
                    <button
                      onClick={() => setShowTemplates(true)}
                      className="group flex flex-col items-center gap-2 p-3 rounded-xl bg-white border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50 transition-all"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                        <LayoutTemplate className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-center">
                        <span className="text-xs font-semibold text-slate-700">Templates</span>
                      </div>
                    </button>
                  </div>
                </div>
                
                {/* Divider */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {selectedBlock ? selectedBlock.type : 'Page Design'}
                  </span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>
                
                {/* Block Inspector */}
                <BlockInspector
                  block={selectedBlock}
                  onUpdate={handleBlockUpdate}
                  pageTheme={pageTheme}
                  onThemeUpdate={setPageTheme}
                />
              </div>
            )}
          </div>
            </>
          )}
        </div>

        {/* MOBILE BOTTOM NAVIGATION - Only visible on mobile */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex items-center justify-around h-16 z-50">
          <button
            onClick={() => { setMobileView('inspector'); setSidebarTab('blocks'); }}
            className={`flex flex-col items-center justify-center flex-1 h-full ${
              mobileView === 'inspector' && sidebarTab === 'blocks' ? 'text-primary bg-secondary/50' : 'text-muted-foreground'
            }`}
          >
            <Layers className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Blocks</span>
          </button>
          <button
            onClick={() => setMobileView('canvas')}
            className={`flex flex-col items-center justify-center flex-1 h-full ${
              mobileView === 'canvas' ? 'text-primary bg-secondary/50' : 'text-muted-foreground'
            }`}
          >
            <Layout className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Canvas</span>
          </button>
          <button
            onClick={() => { setMobileView('inspector'); setSidebarTab('design'); }}
            className={`flex flex-col items-center justify-center flex-1 h-full ${
              mobileView === 'inspector' && sidebarTab === 'design' ? 'text-primary bg-secondary/50' : 'text-muted-foreground'
            }`}
          >
            <Sliders className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Design</span>
          </button>
        </div>
      </div>
      </div>
      )}

      {/* DRAG OVERLAY
          Shows visual feedback while dragging a block */}
      <DragOverlay>
        {activeId ? <div className="p-4 bg-card border rounded shadow-lg">Dragging...</div> : null}
      </DragOverlay>

      {/* QR Generation Modal */}
      <QRGenerationModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        micrositeId={micrositeId}
        micrositeName={micrositeName}
        existingQrId={qrId} // Pass existing QR ID to prevent duplicates
        onQRGenerated={handleQRGenerated}
      />

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={() => {
          localStorage.setItem('hasSeenOnboarding', 'true');
        }}
      />

      {/* Preview Modal - Device frame preview */}
      <PreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        blocks={blocks}
        theme={pageTheme}
        micrositeName={micrositeName}
      />

      {/* Help Panel */}
      <HelpPanel
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
      />

      {/* Keyboard Shortcuts Panel */}
      <KeyboardShortcutsPanel
        isOpen={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
      />

      {/* Theme Gallery Modal - Enhanced with better UI/UX */}
      {showThemeSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden animate-in fade-in duration-200">
          {/* Backdrop with gradient */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-violet-900/95 via-purple-900/95 to-pink-900/95 backdrop-blur-xl"
            onClick={() => setShowThemeSettings(false)}
            aria-hidden="true"
          />
          
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          {/* Modal Container */}
          <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden border border-violet-200/20 animate-in zoom-in-95 duration-300">
            {/* Modal Header - Enhanced with gradient */}
            <div className="flex-shrink-0 relative overflow-hidden">
              {/* Header gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600" aria-hidden="true" />
              
              <div className="relative flex items-center justify-between p-6 text-white">
                <div className="flex items-center gap-4">
                  {/* Animated icon */}
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Palette className="w-6 h-6 text-white animate-pulse" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      Theme Gallery
                      <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-sm" aria-hidden="true">
                        {PRESET_THEMES.length} Themes
                      </span>
                    </h2>
                    <p className="text-sm text-violet-100 mt-1">
                      Choose a stunning preset or customize your own design
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowThemeSettings(false)}
                  aria-label="Close theme gallery"
                  className="group p-2.5 hover:bg-white/20 rounded-xl transition-all backdrop-blur-sm"
                >
                  <svg className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Decorative wave */}
              <svg className="absolute -bottom-1 left-0 w-full h-4 text-white dark:text-zinc-900" viewBox="0 0 1200 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" aria-hidden="true">
                <path d="M0 12C150 12 150 0 300 0C450 0 450 12 600 12C750 12 750 0 900 0C1050 0 1050 12 1200 12V0H0V12Z"/>
              </svg>
            </div>

            {/* Quick Filters / Categories - Improved with icons */}
            <div className="flex-shrink-0 px-6 py-4 bg-gray-50 dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pb-2">
                {[
                  { name: 'All', icon: '⚡' },
                  { name: 'Popular', icon: '🔥' },
                  { name: 'Minimal', icon: '◻' },
                  { name: 'Bold', icon: '●' },
                  { name: 'Gradient', icon: '⬤' },
                  { name: 'Dark', icon: '◐' },
                  { name: 'Light', icon: '◯' },
                  { name: 'Colorful', icon: '◆' },
                ].map((filter) => (
                  <button
                    key={filter.name}
                    onClick={() => setSelectedThemeFilter(filter.name)}
                    aria-label={`Filter themes by ${filter.name}`}
                    aria-pressed={selectedThemeFilter === filter.name}
                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                      selectedThemeFilter === filter.name 
                        ? 'bg-violet-600 text-white shadow-md scale-105' 
                        : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-zinc-700 hover:scale-105 border border-gray-200 dark:border-zinc-700'
                    }`}
                  >
                    <span className="text-sm">{filter.icon}</span>
                    {filter.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Body - Scrollable Theme Gallery */}
            <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 via-violet-50/30 to-purple-50/30 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-950 scrollbar-thin scrollbar-thumb-violet-300 scrollbar-track-transparent">
              <ThemeGallery
                currentTheme={pageTheme}
                selectedFilter={selectedThemeFilter}
                onSelectTheme={(theme) => {
                  setPageTheme(theme);
                  setShowThemeSettings(false);
                  showToast('🎨 Theme applied! Customize colors in the Design Panel', 'success');
                }}
              />
            </div>

            {/* Modal Footer - Streamlined action bar */}
            <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-gray-900 dark:text-white">{PRESET_THEMES.length}</span> professional themes • 
                  <span className="ml-1">Fully customizable</span>
                </div>
                
                <button
                  onClick={() => {
                    setShowThemeSettings(false);
                    setSelectedBlockId(null);
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white text-sm font-semibold rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Open Design Panel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Templates Sidebar */}
      <AnimatePresence mode="wait">
        {showTemplates && (
          <TemplatesSidebar
            key="templates-sidebar"
            onApplyTemplate={applyTemplate}
            onApplyRichTemplate={applyRichTemplate}
            onClose={() => setShowTemplates(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </DndContext>
  );
}

// HELPER FUNCTION: Get default content for new blocks
// Returns initial content object based on block type
// Each block type has different content properties (defined in types/index.ts)
function getDefaultContent(type: BlockType): Record<string, unknown> {
  switch (type) {
    // === LINKTREE BLOCKS ===
    case 'profile':
      // ProfileContent: Avatar, name, bio section
      return {
        displayName: 'Alex Morgan',
        bio: 'Digital creator & entrepreneur helping businesses grow online. Follow for tips on marketing, productivity, and building your brand.',
        avatarUrl: '',
        location: 'San Francisco, CA',
        website: '',
      };
    
    case 'linkButton':
      // LinkButtonContent: Action button (Linktree-style)
      return {
        label: 'Visit My Website',
        url: 'https://example.com',
        description: 'Check out my latest work and portfolio',
        icon: 'arrow',
        thumbnail: '',
      };
    
    case 'header':
      // HeaderContent: Page header with title, subtitle, logo
      return {
        title: 'Welcome to Our Platform',
        subtitle: 'Discover what makes us different',
        showLogo: true,
        logoUrl: '',
        backgroundColor: '#ffffff',
        textColor: '#000000',
        alignment: 'center',
      };
    
    case 'footer':
      // FooterContent: Page footer with copyright text
      return {
        text: `© ${new Date().getFullYear()} All rights reserved`,
        showBranding: true,
        backgroundColor: '#f3f4f6',
        textColor: '#6b7280',
        alignment: 'center',
        borderTop: true,
      };
    
    case 'heading':
      // HeadingContent: text (string) and level (1, 2, or 3 for h1/h2/h3)
      return { text: 'Heading', level: 1 };
    case 'text':
      // TextContent: html (string) - contains rich text HTML from Tiptap editor
      return { html: '<p>Your text here...</p>' };
    case 'button':
      // ButtonContent: label (text shown on button) and url (link destination)
      return { label: 'Click me', url: '' };
    case 'image':
      // ImageContent: url (image source) and alt (accessibility text)
      return { url: '', alt: '' };
    case 'form':
      // FormContent: title, submitLabel (button text), successMessage (shown after submit)
      return { 
        title: '', 
        submitLabel: 'Submit',
        successMessage: "Thank you! We'll be in touch soon.",
      };
    case 'spacer':
      // SpacerContent: height (CSS value like '20px' or '2rem')
      return { height: '20px' };
    
    // === NEW BLOCK TYPES ===
    
    case 'video':
      // VideoContent: YouTube/Vimeo URL with playback options
      return { 
        url: '', 
        autoplay: false, 
        loop: false, 
        muted: false 
      };
    
    case 'divider':
      // DividerContent: Horizontal line separator with styling
      return { 
        style: 'solid', 
        thickness: 2, 
        width: '100%', 
        color: '#e5e7eb' 
      };
    
    case 'social':
      // SocialLinksContent: Grid of social media icons
      // Using socialLinks array format for the new SocialLinksBlock component
      return { 
        socialLinks: [],
      };
    
    case 'countdown':
      // CountdownContent: Event countdown timer
      return { 
        targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
        title: 'Grand Opening Sale',
        expiredMessage: '🎉 The wait is over! Shop now!',
        showDays: true,
        showHours: true,
        showMinutes: true,
        showSeconds: true,
      };
    
    case 'calendar':
      // CalendarContent: Events calendar with multiple layouts
      return {
        title: 'Upcoming Events',
        events: [
          {
            title: 'Product Launch Webinar',
            date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
            time: '2:00 PM EST',
            location: 'Zoom Webinar',
            description: 'Join us for the exclusive reveal of our newest features and special launch offers.',
            link: '#'
          },
          {
            title: 'Community Meetup',
            date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
            time: '6:00 PM EST',
            location: 'Downtown Conference Center',
            description: 'Network with fellow members, share ideas, and enjoy refreshments.',
            link: '#'
          }
        ],
        layout: 'cards',
        eventSpacing: 'md',
        showTime: true,
        showLocation: true,
        showDescription: true,
        showPastEvents: false,
        cardBg: 'white',
        borderRadius: 'xl',
        accentColor: 'primary',
      };
    
    case 'testimonial':
      // TestimonialContent: Customer review/quote
      return { 
        quote: 'This platform completely transformed how we work. Our productivity increased by 40% in just three months. The support team is incredible!',
        author: 'Sarah Johnson',
        role: 'CEO, TechStart Inc.',
        avatar: '',
        rating: 5,
      };
    
    case 'faq':
      // FAQContent: Collapsible FAQ items
      return { 
        items: [
          { question: 'How do I get started?', answer: 'Simply sign up for a free account, choose a template, and start customizing. No credit card required to begin.', isOpen: false },
          { question: 'Can I cancel my subscription anytime?', answer: 'Yes! You can cancel your subscription at any time with no questions asked. Your data remains accessible until the end of your billing period.', isOpen: false },
          { question: 'Do you offer customer support?', answer: 'Absolutely! We offer 24/7 email support for all plans, and priority phone support for Professional and Enterprise customers.', isOpen: false },
          { question: 'Is my data secure?', answer: 'Yes, we use bank-level 256-bit encryption, regular security audits, and comply with GDPR and SOC 2 standards to keep your data safe.', isOpen: false },
        ]
      };
    
    // === INTERACTIVE BLOCK TYPES ===
    
    case 'gallery':
      // GalleryContent: Image carousel/slider
      return {
        images: [
          { url: '', alt: 'Image 1', caption: '' },
          { url: '', alt: 'Image 2', caption: '' },
          { url: '', alt: 'Image 3', caption: '' },
        ],
        autoplay: false,
        interval: 3000,
        showDots: true,
        showArrows: true,
        aspectRatio: '16:9',
      };
    
    case 'pricing':
      // PricingContent: Pricing table comparison
      return {
        tiers: [
          {
            name: 'Starter',
            price: '$29',
            description: 'Perfect for individuals and small projects',
            features: ['Up to 5 projects', 'Basic analytics', 'Email support', '1GB storage'],
            buttonText: 'Start Free Trial',
            buttonUrl: '#',
            highlighted: false,
          },
          {
            name: 'Professional',
            price: '$79',
            description: 'Best for growing teams and businesses',
            features: ['Unlimited projects', 'Advanced analytics', 'Priority support', '50GB storage', 'Custom branding', 'API access'],
            buttonText: 'Get Started',
            buttonUrl: '#',
            highlighted: true,
          },
          {
            name: 'Enterprise',
            price: '$199',
            description: 'For large organizations with custom needs',
            features: ['Everything in Pro', 'Unlimited storage', 'Dedicated manager', 'Custom integrations', 'SLA guarantee', 'On-premise option'],
            buttonText: 'Contact Sales',
            buttonUrl: '#',
            highlighted: false,
          },
        ],
        billingPeriod: 'monthly',
      };
    
    case 'features':
      // FeaturesContent: Features grid with icons
      return {
        features: [
          { icon: '⚡', title: 'Lightning Fast', description: 'Experience blazing fast performance with optimized load times under 2 seconds' },
          { icon: '🔒', title: 'Bank-Level Security', description: 'Your data is protected with 256-bit encryption and secure authentication' },
          { icon: '📱', title: 'Works Everywhere', description: 'Seamless experience across desktop, tablet, and mobile devices' },
          { icon: '�', title: 'Easy to Customize', description: 'Drag-and-drop interface makes it simple to build exactly what you need' },
        ],
        columns: 2,
        layout: 'grid',
      };
    
    case 'stats':
      // StatsContent: Animated statistics/counters with advanced customization
      return {
        stats: [
          { value: '500', label: 'Happy Clients', suffix: '+', prefix: '', icon: '👥', iconType: 'emoji', iconUrl: '', color: '#8b5cf6' },
          { value: '98', label: 'Success Rate', suffix: '%', prefix: '', icon: '📈', iconType: 'emoji', iconUrl: '', color: '#3b82f6' },
          { value: '15', label: 'Years Experience', suffix: '+', prefix: '', icon: '🏆', iconType: 'emoji', iconUrl: '', color: '#f59e0b' },
          { value: '24', label: 'Hour Support', suffix: '/7', prefix: '', icon: '💬', iconType: 'emoji', iconUrl: '', color: '#10b981' },
        ],
        columns: 4,
        layout: 'cards',
        animated: true,
        showIcons: true,
        bgStyle: 'gradient',
        numberSize: 'large',
        labelSize: 'medium',
        iconPosition: 'top',
      };
    
    case 'map':
      // MapContent: Google Maps embed
      return {
        address: 'San Francisco, CA',
        latitude: 37.7749,
        longitude: -122.4194,
        zoom: 12,
        mapType: 'roadmap',
        showMarker: true,
      };
    
    case 'hero':
      // HeroContent: Hero section with background
      return {
        headline: 'Transform Your Business Today',
        subheadline: 'Join thousands of companies using our platform to grow faster, work smarter, and achieve more',
        backgroundImage: '',
        backgroundVideo: '',
        overlay: true,
        overlayOpacity: 0.5,
        buttonText: 'Get Started Free',
        buttonUrl: '#',
        alignment: 'center',
        height: 'large',
      };
    
    case 'payment':
      // PaymentContent: Stripe payment/tip jar
      return {
        title: 'Support My Work',
        description: 'Your contribution helps me create more free content and keep this project running. Every bit helps! 💖',
        thankYouMessage: 'Thank you so much for your generous support! You\'re amazing! 🎉',
        currency: 'USD',
        customAmounts: [5, 10, 25, 50],
        allowCustomAmount: true,
        minAmount: 1,
        maxAmount: 500,
        buttonText: 'Send Support',
        paymentMode: 'tips',
        stripePaymentLink: '',
        checkoutExperience: 'redirect',
      };
    
    case 'product':
      // ProductContent: E-commerce product card
      return {
        name: 'Premium Wireless Headphones',
        description: 'Experience crystal-clear audio with active noise cancellation, 30-hour battery life, and ultra-comfortable memory foam cushions.',
        price: 149.99,
        originalPrice: 199.99,
        currency: 'USD',
        imageUrl: '',
        imageUrls: [],
        buttonText: 'Add to Cart',
        buttonUrl: '#',
        useStripeCheckout: false,
        badge: 'Best Seller',
        rating: 4.8,
        reviewCount: 2847,
        features: ['Active Noise Cancellation', '30-Hour Battery', 'Premium Sound'],
        inventory: {
          available: true,
          quantity: 50,
          showQuantity: false,
        },
      };
    
    default:
      return {};
  }
}

