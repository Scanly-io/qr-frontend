import { useState, useEffect } from 'react';
import { agenciesApi, type Agency, type AgencyMember } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Building2, Users, CreditCard, Settings, Plus, Trash2, Loader2 } from 'lucide-react';

export default function AgencyManagement() {
  const [agency, setAgency] = useState<Agency | null>(null);
  const [members, setMembers] = useState<AgencyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<AgencyMember['role']>('member');
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAgencyName, setNewAgencyName] = useState('');

  useEffect(() => {
    loadAgencyData();
  }, []);

  const loadAgencyData = async () => {
    try {
      const agencyData = await agenciesApi.getMyAgency();

      setAgency(agencyData);

      if (agencyData) {
        const membersData = await agenciesApi.listMembers(agencyData.id);
        setMembers(membersData);
      }
    } catch (error) {
      console.error('Failed to load agency data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteMember = async () => {
    if (!agency || !inviteEmail) return;

    try {
      await agenciesApi.inviteMember(agency.id, {
        email: inviteEmail,
        role: inviteRole,
      });

      setInviteEmail('');
      loadAgencyData();
      alert('Invitation sent!');
    } catch (error) {
      console.error('Failed to invite member:', error);
      alert('Failed to send invitation');
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!agency || !confirm('Remove this team member?')) return;

    try {
      await agenciesApi.removeMember(agency.id, memberId);
      loadAgencyData();
    } catch (error) {
      console.error('Failed to remove member:', error);
    }
  };

  const handleCreateAgency = async () => {
    if (!newAgencyName.trim()) {
      alert('Please enter an agency name');
      return;
    }
    
    setIsCreating(true);
    try {
      const newAgency = await agenciesApi.create({ 
        name: newAgencyName.trim(),
        subscriptionPlan: 'starter'
      });
      setAgency(newAgency);
      setShowCreateForm(false);
      setNewAgencyName('');
      alert('Agency created successfully! You can now invite team members and configure your white-label settings.');
      // Reload the page to refresh all agency data
      window.location.reload();
    } catch (error) {
      console.error('Failed to create agency:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to create agency: ${errorMsg}. Please make sure the auth service is running and try again.`);
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!agency) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <Card className="p-8 text-center">
          <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-2">No Agency Account</h2>
          <p className="text-gray-600 mb-6">
            Create an agency to manage your team and white-label settings
          </p>
          
          {showCreateForm ? (
            <div className="max-w-md mx-auto space-y-4">
              <input
                type="text"
                value={newAgencyName}
                onChange={(e) => setNewAgencyName(e.target.value)}
                placeholder="Enter agency name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewAgencyName('');
                  }}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateAgency}
                  disabled={isCreating || !newAgencyName.trim()}
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Agency'
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <Button size="lg" onClick={() => setShowCreateForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Agency Account
            </Button>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{agency.name}</h1>
        <p className="text-gray-600">
          Manage your agency settings, team members, and subscription
        </p>
      </div>

      {/* Subscription Card */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Subscription</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Current plan: <span className="font-semibold capitalize">{agency.subscriptionPlan}</span>
            </p>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Microsites</p>
                <p className="text-lg font-semibold">
                  {agency.limits.maxMicrosites === -1 ? '∞' : agency.limits.maxMicrosites}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Team Members</p>
                <p className="text-lg font-semibold">
                  {members.length} / {agency.limits.maxTeamMembers}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Custom Domains</p>
                <p className="text-lg font-semibold">
                  {agency.limits.maxCustomDomains}
                </p>
              </div>
            </div>
            {agency.status === 'trial' && agency.trialEndsAt && (
              <p className="text-sm text-orange-600">
                Trial ends: {new Date(agency.trialEndsAt).toLocaleDateString()}
              </p>
            )}
          </div>
          <Button variant="outline">
            Upgrade Plan
          </Button>
        </div>
      </Card>

      {/* White-Label Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold">White-Label Settings</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Logo URL</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="https://..."
              value={agency.whiteLabelConfig.logoUrl || ''}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Custom Domain</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="app.yourdomain.com"
              value={agency.whiteLabelConfig.customDomain || ''}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Primary Color</label>
            <input
              type="color"
              className="w-full h-10 rounded-lg"
              value={agency.whiteLabelConfig.primaryColor || '#3b82f6'}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Accent Color</label>
            <input
              type="color"
              className="w-full h-10 rounded-lg"
              value={agency.whiteLabelConfig.accentColor || '#10b981'}
              readOnly
            />
          </div>
        </div>
        <Button className="mt-4" variant="outline">
          Edit Branding
        </Button>
      </Card>

      {/* Team Members */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Team Members</h2>
          </div>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Invite Member
          </Button>
        </div>

        {/* Invite Form */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-medium mb-3">Invite New Member</h3>
          <div className="flex gap-3">
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 px-3 py-2 border rounded-lg"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
            <select
              className="px-3 py-2 border rounded-lg"
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as AgencyMember['role'])}
            >
              <option value="admin">Admin</option>
              <option value="member">Member</option>
              <option value="viewer">Viewer</option>
            </select>
            <Button onClick={handleInviteMember}>
              Send Invite
            </Button>
          </div>
        </div>

        {/* Members List */}
        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div>
                <p className="font-medium">{member.email}</p>
                <p className="text-sm text-gray-600 capitalize">{member.role}</p>
              </div>
              <div className="flex items-center gap-2">
                {member.role !== 'owner' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
