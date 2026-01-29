/**
 * UTM Builder Page
 * 
 * Full-page wrapper for the UTM Link Builder tool.
 * Available in dashboard for marketing campaign tracking.
 */

import { UTMBuilder } from '@/components/tools/UTMBuilder';

export default function UTMBuilderPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <UTMBuilder />
      </div>
    </div>
  );
}
