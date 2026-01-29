/**
 * Scheduling Settings Component
 * Time-based link routing and availability
 */

import { useState, useEffect } from 'react';
import { 
  Clock, 
  Plus, 
  Trash2, 
  Loader2,
  Calendar,
  Check
} from 'lucide-react';
import { routingApi } from '../../lib/api';
import type { LinkSchedule, ScheduleType } from '../../lib/api';

export function SchedulingSettings() {
  const [schedules, setSchedules] = useState<LinkSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    name: '',
    qrId: '',
    scheduleType: 'once' as ScheduleType,
    targetUrl: '',
    startDate: '',
    endDate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      setLoading(true);
      const res = await routingApi.listAllSchedules();
      setSchedules(res.schedules);
    } catch (error) {
      console.error('Failed to load schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchedule = async () => {
    if (!newSchedule.name || !newSchedule.targetUrl || !newSchedule.qrId) return;
    
    try {
      setIsSubmitting(true);
      const schedule = await routingApi.createSchedule({
        name: newSchedule.name,
        qrId: newSchedule.qrId,
        scheduleType: newSchedule.scheduleType,
        targetUrl: newSchedule.targetUrl,
        startTime: newSchedule.startDate ? new Date(newSchedule.startDate).toISOString() : undefined,
        endTime: newSchedule.endDate ? new Date(newSchedule.endDate).toISOString() : undefined,
      });
      setSchedules(prev => [...prev, schedule]);
      setNewSchedule({ name: '', qrId: '', scheduleType: 'once', targetUrl: '', startDate: '', endDate: '' });
      setShowCreate(false);
    } catch (error) {
      console.error('Failed to create schedule:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (!confirm('Are you sure you want to delete this schedule?')) return;
    
    try {
      await routingApi.deleteSchedule(scheduleId);
      setSchedules(prev => prev.filter(s => s.id !== scheduleId));
    } catch (error) {
      console.error('Failed to delete schedule:', error);
    }
  };

  const handleToggleSchedule = async (schedule: LinkSchedule) => {
    try {
      const updated = await routingApi.toggleSchedule(schedule.id, !schedule.isActive);
      setSchedules(prev => prev.map(s => s.id === updated.id ? updated : s));
    } catch (error) {
      console.error('Failed to toggle schedule:', error);
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
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-white/20 rounded-lg">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Link Scheduling</h2>
            <p className="text-blue-100 mt-1">
              Set up time-based redirects for your QR codes. Schedule promotions, limited-time offers, or different destinations based on date and time.
            </p>
          </div>
        </div>
      </div>

      {/* Schedules List */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Link Schedules</h2>
            <p className="text-sm text-gray-500 mt-1">
              {schedules.filter(s => s.isActive).length} active, {schedules.length} total
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Schedule
          </button>
        </div>

        {/* Create Form */}
        {showCreate && (
          <div className="p-6 border-b bg-gray-50">
            <h4 className="font-medium text-gray-900 mb-4">Create New Schedule</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newSchedule.name}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Black Friday Promo"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Type</label>
                <select
                  value={newSchedule.scheduleType}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, scheduleType: e.target.value as ScheduleType }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="once">One Time</option>
                  <option value="recurring">Recurring</option>
                  <option value="date_range">Date Range</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Target URL</label>
                <input
                  type="url"
                  value={newSchedule.targetUrl}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, targetUrl: e.target.value }))}
                  placeholder="https://example.com/promo"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date/Time</label>
                <input
                  type="datetime-local"
                  value={newSchedule.startDate}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date/Time</label>
                <input
                  type="datetime-local"
                  value={newSchedule.endDate}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">QR Code ID <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={newSchedule.qrId}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, qrId: e.target.value }))}
                  placeholder="Enter the QR code ID"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleCreateSchedule}
                disabled={!newSchedule.name || !newSchedule.targetUrl || !newSchedule.qrId || isSubmitting}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Schedule'}
              </button>
              <button
                onClick={() => {
                  setShowCreate(false);
                  setNewSchedule({ name: '', qrId: '', scheduleType: 'once', targetUrl: '', startDate: '', endDate: '' });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Schedules Grid */}
        <div className="p-6">
          {schedules.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No schedules yet</h3>
              <p className="text-gray-500 mb-4">Create time-based rules for your QR destinations</p>
              <button
                onClick={() => setShowCreate(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Your First Schedule
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {schedules.map((schedule) => (
                <div key={schedule.id} className={`p-4 border rounded-lg ${schedule.isActive ? 'border-green-200 bg-green-50/50' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        schedule.isActive ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <Clock className={`w-5 h-5 ${
                          schedule.isActive ? 'text-green-600' : 'text-gray-400'
                        }`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">{schedule.name}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            schedule.isActive 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {schedule.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-xs capitalize">
                            {schedule.scheduleType.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 font-mono mt-1 truncate max-w-md">{schedule.targetUrl}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          {schedule.startTime && (
                            <span>From: {new Date(schedule.startTime).toLocaleString()}</span>
                          )}
                          {schedule.endTime && (
                            <span>To: {new Date(schedule.endTime).toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleSchedule(schedule)}
                        className={`p-2 rounded-lg transition-colors ${
                          schedule.isActive 
                            ? 'text-yellow-600 hover:bg-yellow-50' 
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={schedule.isActive ? 'Disable' : 'Enable'}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSchedule(schedule.id)}
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
