/**
 * Geo-Fencing Settings Component
 * Location-based link routing
 */

import { useState, useEffect } from 'react';
import { 
  Globe, 
  MapPin, 
  Plus, 
  Trash2, 
  Loader2,
  Check
} from 'lucide-react';
import { routingApi } from '../../lib/api';
import type { GeoFence, GeoFenceType } from '../../lib/api';

// Common country codes for dropdown
const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'JP', name: 'Japan' },
  { code: 'CN', name: 'China' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'KR', name: 'South Korea' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'SE', name: 'Sweden' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'SG', name: 'Singapore' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'ZA', name: 'South Africa' },
];

export function GeoFencingSettings() {
  const [geoFences, setGeoFences] = useState<GeoFence[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newGeoFence, setNewGeoFence] = useState({
    name: '',
    qrId: '',
    fenceType: 'country' as GeoFenceType,
    targetUrl: '',
    country: '',
    region: '',
    city: '',
    latitude: '',
    longitude: '',
    radiusKm: '10',
    locationName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadGeoFences();
  }, []);

  const loadGeoFences = async () => {
    try {
      setLoading(true);
      const res = await routingApi.listAllGeoFences();
      setGeoFences(res.geoFences);
    } catch (error) {
      console.error('Failed to load geo-fences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGeoFence = async () => {
    if (!newGeoFence.name || !newGeoFence.targetUrl || !newGeoFence.qrId) return;
    
    try {
      setIsSubmitting(true);
      const geoFence = await routingApi.createGeoFence({
        name: newGeoFence.name,
        qrId: newGeoFence.qrId,
        fenceType: newGeoFence.fenceType,
        targetUrl: newGeoFence.targetUrl,
        country: newGeoFence.country || undefined,
        region: newGeoFence.region || undefined,
        city: newGeoFence.city || undefined,
        latitude: newGeoFence.latitude ? parseFloat(newGeoFence.latitude) : undefined,
        longitude: newGeoFence.longitude ? parseFloat(newGeoFence.longitude) : undefined,
        radiusKm: newGeoFence.radiusKm ? parseFloat(newGeoFence.radiusKm) : undefined,
        locationName: newGeoFence.locationName || undefined,
      });
      setGeoFences(prev => [...prev, geoFence]);
      resetForm();
      setShowCreate(false);
    } catch (error) {
      console.error('Failed to create geo-fence:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setNewGeoFence({
      name: '',
      qrId: '',
      fenceType: 'country',
      targetUrl: '',
      country: '',
      region: '',
      city: '',
      latitude: '',
      longitude: '',
      radiusKm: '10',
      locationName: '',
    });
  };

  const handleDeleteGeoFence = async (geoFenceId: string) => {
    if (!confirm('Are you sure you want to delete this geo-fence?')) return;
    
    try {
      await routingApi.deleteGeoFence(geoFenceId);
      setGeoFences(prev => prev.filter(g => g.id !== geoFenceId));
    } catch (error) {
      console.error('Failed to delete geo-fence:', error);
    }
  };

  const handleToggleGeoFence = async (geoFence: GeoFence) => {
    try {
      const updated = await routingApi.toggleGeoFence(geoFence.id, !geoFence.isActive);
      setGeoFences(prev => prev.map(g => g.id === updated.id ? updated : g));
    } catch (error) {
      console.error('Failed to toggle geo-fence:', error);
    }
  };

  const getFenceTypeIcon = (type: GeoFenceType) => {
    switch (type) {
      case 'country':
        return <Globe className="w-5 h-5" />;
      case 'radius':
        return <MapPin className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  const getFenceTypeLabel = (type: GeoFenceType) => {
    switch (type) {
      case 'country':
        return 'Country';
      case 'region':
        return 'Region/State';
      case 'city':
        return 'City';
      case 'radius':
        return 'Radius';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border shadow-sm p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-white/20 rounded-lg">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Geo-Fencing</h2>
            <p className="text-emerald-100 mt-1">
              Route visitors to different destinations based on their location. Show localized content, regional offers, or country-specific landing pages.
            </p>
          </div>
        </div>
      </div>

      {/* Geo-Fences List */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Geo-Fences</h2>
            <p className="text-sm text-gray-500 mt-1">
              {geoFences.filter(g => g.isActive).length} active, {geoFences.length} total
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Geo-Fence
          </button>
        </div>

        {/* Create Form */}
        {showCreate && (
          <div className="p-6 border-b bg-gray-50">
            <h4 className="font-medium text-gray-900 mb-4">Create New Geo-Fence</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={newGeoFence.name}
                  onChange={(e) => setNewGeoFence(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="US Visitors"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fence Type</label>
                <select
                  value={newGeoFence.fenceType}
                  onChange={(e) => setNewGeoFence(prev => ({ ...prev, fenceType: e.target.value as GeoFenceType }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="country">Country</option>
                  <option value="region">Region/State</option>
                  <option value="city">City</option>
                  <option value="radius">Radius (GPS)</option>
                </select>
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">QR Code ID <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={newGeoFence.qrId}
                  onChange={(e) => setNewGeoFence(prev => ({ ...prev, qrId: e.target.value }))}
                  placeholder="Enter the QR code ID"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Target URL <span className="text-red-500">*</span></label>
                <input
                  type="url"
                  value={newGeoFence.targetUrl}
                  onChange={(e) => setNewGeoFence(prev => ({ ...prev, targetUrl: e.target.value }))}
                  placeholder="https://example.com/us"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              {/* Country-based fields */}
              {(newGeoFence.fenceType === 'country' || newGeoFence.fenceType === 'region' || newGeoFence.fenceType === 'city') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <select
                      value={newGeoFence.country}
                      onChange={(e) => setNewGeoFence(prev => ({ ...prev, country: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="">Select a country</option>
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  {(newGeoFence.fenceType === 'region' || newGeoFence.fenceType === 'city') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Region/State</label>
                      <input
                        type="text"
                        value={newGeoFence.region}
                        onChange={(e) => setNewGeoFence(prev => ({ ...prev, region: e.target.value }))}
                        placeholder="California"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  )}
                  
                  {newGeoFence.fenceType === 'city' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        value={newGeoFence.city}
                        onChange={(e) => setNewGeoFence(prev => ({ ...prev, city: e.target.value }))}
                        placeholder="San Francisco"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  )}
                </>
              )}

              {/* Radius-based fields */}
              {newGeoFence.fenceType === 'radius' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location Name</label>
                    <input
                      type="text"
                      value={newGeoFence.locationName}
                      onChange={(e) => setNewGeoFence(prev => ({ ...prev, locationName: e.target.value }))}
                      placeholder="Downtown SF"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Radius (km)</label>
                    <input
                      type="number"
                      value={newGeoFence.radiusKm}
                      onChange={(e) => setNewGeoFence(prev => ({ ...prev, radiusKm: e.target.value }))}
                      placeholder="10"
                      min="1"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                    <input
                      type="number"
                      step="0.000001"
                      value={newGeoFence.latitude}
                      onChange={(e) => setNewGeoFence(prev => ({ ...prev, latitude: e.target.value }))}
                      placeholder="37.7749"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                    <input
                      type="number"
                      step="0.000001"
                      value={newGeoFence.longitude}
                      onChange={(e) => setNewGeoFence(prev => ({ ...prev, longitude: e.target.value }))}
                      placeholder="-122.4194"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleCreateGeoFence}
                disabled={!newGeoFence.name || !newGeoFence.targetUrl || !newGeoFence.qrId || isSubmitting}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Geo-Fence'}
              </button>
              <button
                onClick={() => {
                  setShowCreate(false);
                  resetForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Geo-Fences Grid */}
        <div className="p-6">
          {geoFences.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Globe className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No geo-fences yet</h3>
              <p className="text-gray-500 mb-4">Create location-based rules for your QR destinations</p>
              <button
                onClick={() => setShowCreate(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Your First Geo-Fence
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {geoFences.map((geoFence) => (
                <div key={geoFence.id} className={`p-4 border rounded-lg ${geoFence.isActive ? 'border-emerald-200 bg-emerald-50/50' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        geoFence.isActive ? 'bg-emerald-100' : 'bg-gray-100'
                      }`}>
                        <span className={geoFence.isActive ? 'text-emerald-600' : 'text-gray-400'}>
                          {getFenceTypeIcon(geoFence.fenceType)}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">{geoFence.name}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            geoFence.isActive 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {geoFence.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-700 text-xs">
                            {getFenceTypeLabel(geoFence.fenceType)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 font-mono mt-1 truncate max-w-md">{geoFence.targetUrl}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          {geoFence.countryName && (
                            <span>Country: {geoFence.countryName}</span>
                          )}
                          {geoFence.region && (
                            <span>Region: {geoFence.region}</span>
                          )}
                          {geoFence.city && (
                            <span>City: {geoFence.city}</span>
                          )}
                          {geoFence.fenceType === 'radius' && geoFence.radiusKm && (
                            <span>Radius: {geoFence.radiusKm} km</span>
                          )}
                          <span>Matched: {geoFence.matchCount} times</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleGeoFence(geoFence)}
                        className={`p-2 rounded-lg transition-colors ${
                          geoFence.isActive 
                            ? 'text-yellow-600 hover:bg-yellow-50' 
                            : 'text-emerald-600 hover:bg-emerald-50'
                        }`}
                        title={geoFence.isActive ? 'Disable' : 'Enable'}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteGeoFence(geoFence.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
