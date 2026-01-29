/**
 * Settings Page
 * Comprehensive settings for domains, integrations, pixels, and advanced features
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Globe, 
  Webhook, 
  Target, 
  FlaskConical, 
  Clock,
  MapPin,
  Settings,
  ChevronRight,
  Brain
} from 'lucide-react';
import { 
  DomainsSettings, 
  IntegrationsSettings, 
  PixelsSettings, 
  ExperimentsSettings, 
  SchedulingSettings, 
  GeoFencingSettings,
  MLSettings 
} from '../components/settings';

type SettingsTab = 'domains' | 'integrations' | 'pixels' | 'experiments' | 'scheduling' | 'geofencing' | 'ml';

const tabs: Array<{
  id: SettingsTab;
  label: string;
  description: string;
  icon: React.ReactNode;
}> = [
  {
    id: 'domains',
    label: 'Custom Domains',
    description: 'Connect your own domain or claim a subdomain',
    icon: <Globe className="w-5 h-5" />,
  },
  {
    id: 'integrations',
    label: 'Integrations',
    description: 'Connect to Zapier, Slack, HubSpot & more',
    icon: <Webhook className="w-5 h-5" />,
  },
  {
    id: 'pixels',
    label: 'Tracking Pixels',
    description: 'Facebook, Google, TikTok retargeting',
    icon: <Target className="w-5 h-5" />,
  },
  {
    id: 'experiments',
    label: 'A/B Testing',
    description: 'Run experiments to optimize conversions',
    icon: <FlaskConical className="w-5 h-5" />,
  },
  {
    id: 'scheduling',
    label: 'Link Scheduling',
    description: 'Time-based redirects and availability',
    icon: <Clock className="w-5 h-5" />,
  },
  {
    id: 'geofencing',
    label: 'Geo-Fencing',
    description: 'Location-based targeting and routing',
    icon: <MapPin className="w-5 h-5" />,
  },
  {
    id: 'ml',
    label: 'ML & AI',
    description: 'Predictive analytics and AI features',
    icon: <Brain className="w-5 h-5" />,
  },
];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('domains');

  const renderContent = () => {
    switch (activeTab) {
      case 'domains':
        return <DomainsSettings />;
      case 'integrations':
        return <IntegrationsSettings />;
      case 'pixels':
        return <PixelsSettings />;
      case 'experiments':
        return <ExperimentsSettings />;
      case 'scheduling':
        return <SchedulingSettings />;
      case 'geofencing':
        return <GeoFencingSettings />;
      case 'ml':
        return <MLSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link 
                to="/dashboard" 
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-gray-200" />
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-400" />
                <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <nav className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="p-4 border-b bg-gray-50">
                <h2 className="font-medium text-gray-900">Settings</h2>
                <p className="text-sm text-gray-500 mt-1">Configure your account</p>
              </div>
              <div className="p-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all
                      ${activeTab === tab.id 
                        ? 'bg-indigo-50 text-indigo-700' 
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className={`
                      flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
                      ${activeTab === tab.id 
                        ? 'bg-indigo-100 text-indigo-600' 
                        : 'bg-gray-100 text-gray-500'
                      }
                    `}>
                      {tab.icon}
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className={`font-medium truncate ${
                        activeTab === tab.id ? 'text-indigo-700' : 'text-gray-900'
                      }`}>
                        {tab.label}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {tab.description}
                      </p>
                    </div>
                    <ChevronRight className={`
                      w-4 h-4 flex-shrink-0 transition-transform
                      ${activeTab === tab.id ? 'text-indigo-500' : 'text-gray-400'}
                    `} />
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* Content Area */}
          <main className="flex-grow min-w-0">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}
