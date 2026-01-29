/**
 * Editor Toolbar Component
 * 
 * Top toolbar with:
 * - Microsite name (editable)
 * - Save button
 * - Publish button
 * - Device selector
 * - Preview toggle
 */

import { useState } from 'react';
import { Save, Loader2, QrCode, Eye, ChevronDown } from 'lucide-react';

interface Device {
  name: string;
  width: number;
  category: string;
}

interface EditorToolbarProps {
  micrositeName: string;
  onNameChange: (name: string) => void;
  onSave: () => void;
  onPublish: () => void;
  onGenerateQR: () => void;
  isSaving: boolean;
  isPublishing: boolean;
  lastSaved: Date | null;
  selectedDevice: Device;
  devices: readonly Device[];
  onDeviceChange: (index: number) => void;
  selectedDeviceIndex: number;
}

function formatRelativeTime(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 10) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function EditorToolbar({
  micrositeName,
  onNameChange,
  onSave,
  onPublish,
  onGenerateQR,
  isSaving,
  isPublishing,
  lastSaved,
  selectedDevice,
  devices,
  onDeviceChange,
  selectedDeviceIndex,
}: EditorToolbarProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [showDeviceMenu, setShowDeviceMenu] = useState(false);

  return (
    <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0">
      {/* Left: Name */}
      <div className="flex items-center gap-4">
        {isEditingName ? (
          <input
            type="text"
            value={micrositeName}
            onChange={(e) => onNameChange(e.target.value)}
            onBlur={() => setIsEditingName(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setIsEditingName(false);
              if (e.key === 'Escape') setIsEditingName(false);
            }}
            autoFocus
            className="text-xl font-bold text-gray-900 border-b-2 border-blue-500 focus:outline-none bg-transparent"
          />
        ) : (
          <h1
            onClick={() => setIsEditingName(true)}
            className="text-xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
            title="Click to edit name"
          >
            {micrositeName}
          </h1>
        )}

        {/* Last Saved */}
        {lastSaved && (
          <span className="text-sm text-gray-500">
            Saved {formatRelativeTime(lastSaved)}
          </span>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Device Selector */}
        <div className="relative">
          <button
            onClick={() => setShowDeviceMenu(!showDeviceMenu)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Eye className="w-4 h-4" />
            {selectedDevice.name}
            <ChevronDown className="w-4 h-4" />
          </button>

          {showDeviceMenu && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowDeviceMenu(false)}
              />

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-20 max-h-96 overflow-y-auto">
                {/* Group by category */}
                {['Phone', 'Tablet', 'Desktop'].map((category) => (
                  <div key={category}>
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-50 sticky top-0">
                      {category}
                    </div>
                    {devices
                      .map((device, index) => ({ device, index }))
                      .filter(({ device }) => device.category === category)
                      .map(({ device, index }) => (
                        <button
                          key={index}
                          onClick={() => {
                            onDeviceChange(index);
                            setShowDeviceMenu(false);
                          }}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${
                            index === selectedDeviceIndex ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                          }`}
                        >
                          <span>{device.name}</span>
                          <span className="text-xs text-gray-500">{device.width}px</span>
                        </button>
                      ))}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Generate QR Button */}
        <button
          onClick={onGenerateQR}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
        >
          <QrCode className="w-4 h-4" />
          Generate QR
        </button>

        {/* Save Button */}
        <button
          onClick={onSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save
            </>
          )}
        </button>

        {/* Publish Button */}
        <button
          onClick={onPublish}
          disabled={isPublishing}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
        >
          {isPublishing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Publishing...
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              Publish
            </>
          )}
        </button>
      </div>
    </div>
  );
}
