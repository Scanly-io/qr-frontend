import { Save, Eye, Share2, HelpCircle, Palette, QrCode } from 'lucide-react';
import { Button } from '@/components/ui';

interface SimpleToolbarProps {
  onSave: () => void;
  onPreview: () => void;
  onWhatsAppShare: () => void;
  onQRCode: () => void;
  onHelp: () => void;
  onTheme: () => void;
  isSaving?: boolean;
  lastSaved?: Date | null;
}

export function SimpleToolbar({
  onSave,
  onPreview,
  onWhatsAppShare,
  onQRCode,
  onHelp,
  onTheme,
  isSaving = false,
  lastSaved,
}: SimpleToolbarProps) {
  const formatLastSaved = (date: Date | null): string => {
    if (!date) return '';
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 10) return 'Saved just now';
    if (seconds < 60) return `Saved ${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Saved ${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `Saved ${hours}h ago`;
  };

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      {/* Primary Actions */}
      <div className="flex items-center gap-2">
        <Button
          onClick={onSave}
          variant="primary"
          size="sm"
          isLoading={isSaving}
          icon={<Save className="w-4 h-4" />}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </Button>

        {lastSaved && (
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
            {formatLastSaved(lastSaved)}
          </span>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-2">
        <Button
          onClick={onPreview}
          variant="outline"
          size="sm"
          icon={<Eye className="w-4 h-4" />}
        >
          <span className="hidden sm:inline">Preview</span>
        </Button>

        <Button
          onClick={onTheme}
          variant="ghost"
          size="sm"
          icon={<Palette className="w-4 h-4" />}
          title="Change Theme"
        />

        <div className="w-px h-6 bg-slate-300 dark:bg-slate-600" />

        <Button
          onClick={onWhatsAppShare}
          size="sm"
          icon={<Share2 className="w-4 h-4" />}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <span className="hidden sm:inline">Share</span>
        </Button>

        <Button
          onClick={onQRCode}
          variant="outline"
          size="sm"
          icon={<QrCode className="w-4 h-4" />}
        >
          <span className="hidden sm:inline">QR Code</span>
        </Button>

        <Button
          onClick={onHelp}
          variant="ghost"
          size="sm"
          icon={<HelpCircle className="w-4 h-4" />}
          title="Help"
        />
      </div>
    </div>
  );
}
