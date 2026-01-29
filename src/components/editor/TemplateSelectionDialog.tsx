import { useState, useEffect } from 'react';
import { templatesApi, type SalesRoomTemplate, type EcommerceTemplate } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Briefcase, ShoppingCart, Sparkles } from 'lucide-react';

interface TemplateSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (micrositeId: string) => void;
}

export function TemplateSelectionDialog({ open, onClose, onSelect }: TemplateSelectionDialogProps) {
  const [salesRoomTemplates, setSalesRoomTemplates] = useState<SalesRoomTemplate[]>([]);
  const [ecommerceTemplates, setEcommerceTemplates] = useState<EcommerceTemplate[]>([]);
  const [activeTab, setActiveTab] = useState<'sales-rooms' | 'ecommerce'>('sales-rooms');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      loadTemplates();
    }
  }, [open]);

  const loadTemplates = async () => {
    try {
      const [salesRooms, ecommerce] = await Promise.all([
        templatesApi.listSalesRoomTemplates(),
        templatesApi.listEcommerceTemplates(),
      ]);

      setSalesRoomTemplates(salesRooms);
      setEcommerceTemplates(ecommerce);
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSalesRoom = async (template: SalesRoomTemplate) => {
    try {
      const result = await templatesApi.createFromSalesRoom({
        templateId: template.id,
        title: template.name,
        variables: {
          prospect_name: 'Client Name',
          deal_value: '$50,000',
        },
      });

      onSelect(result.id);
      onClose();
    } catch (error) {
      console.error('Failed to create from template:', error);
      alert('Failed to create microsite from template');
    }
  };

  const handleSelectEcommerce = async (template: EcommerceTemplate) => {
    try {
      const result = await templatesApi.createFromEcommerce({
        templateId: template.id,
        title: template.name,
        productName: 'Product Name',
        price: 999,
        checkoutUrl: 'https://checkout.example.com',
      });

      onSelect(result.id);
      onClose();
    } catch (error) {
      console.error('Failed to create from template:', error);
      alert('Failed to create microsite from template');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            Choose a Template
          </DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          <button
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'sales-rooms'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('sales-rooms')}
          >
            <Briefcase className="w-4 h-4 inline mr-2" />
            Digital Sales Rooms
          </button>
          <button
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'ecommerce'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('ecommerce')}
          >
            <ShoppingCart className="w-4 h-4 inline mr-2" />
            E-commerce Funnels
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {activeTab === 'sales-rooms' && (
              <>
                {salesRoomTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleSelectSalesRoom(template)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
                        <p className="text-gray-600 mb-4">{template.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {template.variables.map((variable) => (
                            <span
                              key={variable}
                              className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm"
                            >
                              {variable}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Button size="sm">Use Template</Button>
                    </div>
                  </div>
                ))}
              </>
            )}

            {activeTab === 'ecommerce' && (
              <>
                {ecommerceTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleSelectEcommerce(template)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
                        <p className="text-gray-600 mb-4">{template.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                            AEO Optimized
                          </span>
                          <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm capitalize">
                            {template.nicheCategory.replace(/-/g, ' ')}
                          </span>
                        </div>
                      </div>
                      <Button size="sm">Use Template</Button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
