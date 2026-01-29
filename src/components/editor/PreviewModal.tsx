import { DeviceFrame } from '@/components/ui/DeviceFrame';
import { Modal } from '@/components/ui/Modal';
import Canvas from './Canvas';
import type { Block } from '@/types';
import type { PageTheme } from '@/types/theme';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  blocks: Block[];
  theme: PageTheme;
  micrositeName?: string;
}

export function PreviewModal({ isOpen, onClose, blocks, theme, micrositeName }: PreviewModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Preview"
      description={micrositeName}
      size="xl"
    >
      <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 p-4">
        <DeviceFrame zoom={0.75}>
          <div className="w-full h-full overflow-y-auto">
            <Canvas
              blocks={blocks}
              setBlocks={() => {}} // Read-only in preview
              selectedBlockId={null}
              onSelectBlock={() => {}} // No selection in preview
              theme={theme}
              isPreview={true}
            />
          </div>
        </DeviceFrame>
        
        {/* Footer with helpful info */}
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-4">
          This is how your microsite will appear on mobile devices
        </p>
      </div>
    </Modal>
  );
}
