import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LINKTREE_TEMPLATES } from '@/data/linktree-templates';
import { Sparkles, ArrowRight, Eye } from 'lucide-react';

export default function TemplateGalleryPage() {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(LINKTREE_TEMPLATES[0]);
  const [showPreview, setShowPreview] = useState(false);

  const handleUseTemplate = (templateId: string) => {
    const template = LINKTREE_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      // Navigate to editor with template
      navigate('/editor', { 
        state: { 
          templateBlocks: template.blocks,
          templateTheme: template.theme,
          templateName: template.name
        } 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Template Gallery</h1>
                <p className="text-sm text-gray-600">Choose a stunning template and go live in 30 seconds</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Template List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
                Available Templates
              </h2>
              <div className="space-y-3">
                {LINKTREE_TEMPLATES.map((template) => (
                  <motion.button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      selectedTemplate?.id === template.id
                        ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 ${
                        selectedTemplate?.id === template.id ? 'ring-2 ring-white' : 'bg-white'
                      }`}>
                        {template.thumbnail ? (
                          <img src={template.thumbnail} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm mb-1">{template.name}</h3>
                        <p className={`text-xs line-clamp-2 ${
                          selectedTemplate?.id === template.id ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {template.description}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Template Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              {/* Preview Header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedTemplate?.name}</h2>
                    <p className="text-sm text-gray-600 mt-1">{selectedTemplate?.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <motion.button
                      onClick={() => setShowPreview(!showPreview)}
                      className="px-4 py-2 bg-white rounded-lg border border-gray-300 text-gray-700 text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Eye className="w-4 h-4" />
                      {showPreview ? 'Hide' : 'Show'} Preview
                    </motion.button>
                    <motion.button
                      onClick={() => handleUseTemplate(selectedTemplate.id)}
                      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Use This Template
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Mobile Preview Frame */}
              <div className="p-8 bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-100">
                <div className="max-w-sm mx-auto">
                  {/* Phone Frame */}
                  <div className="relative">
                    {/* Phone Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-black rounded-b-3xl z-10" />
                    
                    {/* Phone Screen */}
                    <div 
                      className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-black"
                      style={{ aspectRatio: '9/19.5' }}
                    >
                      {/* Template Preview Content */}
                      <div 
                        className="h-full overflow-y-auto"
                        style={{
                          background: selectedTemplate?.theme?.backgroundImage || selectedTemplate?.theme?.backgroundColor || '#ffffff',
                        }}
                      >
                        <div className="p-8 space-y-6">
                          {/* Profile Block Preview */}
                          {selectedTemplate?.blocks.find(b => b.type === 'profile') && (() => {
                            const profile = selectedTemplate.blocks.find(b => b.type === 'profile');
                            return (
                              <div className="text-center space-y-4">
                                <div 
                                  className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm border-4 border-white/50 overflow-hidden"
                                >
                                  {profile?.content?.avatarUrl ? (
                                    <img src={profile.content.avatarUrl as string} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600" />
                                  )}
                                </div>
                                <div>
                                  <h1 className="text-2xl font-bold text-white mb-2">
                                    {(profile?.content?.displayName as string) || 'Your Name'}
                                  </h1>
                                  <p className="text-white/90 text-sm whitespace-pre-line">
                                    {(profile?.content?.bio as string) || 'Your bio goes here'}
                                  </p>
                                  {(profile?.content?.location && typeof profile.content.location === 'string') ? (
                                    <p className="text-white/80 text-xs mt-2">
                                      {profile.content.location}
                                    </p>
                                  ) : null}
                                </div>
                              </div>
                            );
                          })()}

                          {/* Link Buttons Preview */}
                          <div className="space-y-3">
                            {selectedTemplate?.blocks
                              .filter(b => b.type === 'linkButton')
                              .map((button, idx) => (
                                <motion.div
                                  key={idx}
                                  className="relative rounded-2xl overflow-hidden"
                                  style={{
                                    background: (button.style?.variant === 'gradient'
                                      ? `linear-gradient(135deg, ${button.style?.gradientFrom}, ${button.style?.gradientTo})`
                                      : button.style?.variant === 'glass'
                                        ? 'rgba(255, 255, 255, 0.15)'
                                        : button.style?.backgroundColor || '#000') as string,
                                    backdropFilter: button.style?.variant === 'glass' ? 'blur(16px)' : 'none',
                                    border: button.style?.variant === 'outline' 
                                      ? `2px solid ${button.style?.borderColor || 'rgba(255, 255, 255, 0.3)'}`
                                      : button.style?.variant === 'glass'
                                        ? '1px solid rgba(255, 255, 255, 0.25)'
                                        : 'none',
                                    color: (button.style?.textColor || '#fff') as string,
                                  }}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <div className="p-4">
                                    <div className="flex items-center justify-between">
                                      <div className="flex-1">
                                        <div className="font-semibold text-sm mb-1">
                                          {(button.content?.label as string) || 'Link Button'}
                                        </div>
                                        {(button.content?.description && typeof button.content.description === 'string') ? (
                                          <div className="text-xs opacity-80">
                                            {button.content.description}
                                          </div>
                                        ) : null}
                                      </div>
                                      <ArrowRight className="w-5 h-5 opacity-70" />
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                          </div>

                          {/* Social Icons Preview */}
                          {selectedTemplate?.blocks.find(b => b.type === 'social') && (
                            <div className="flex items-center justify-center gap-3 pt-4">
                              {[1, 2, 3, 4, 5].map((i) => (
                                <div
                                  key={i}
                                  className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center"
                                >
                                  <div className="w-6 h-6 bg-white/60 rounded-full" />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Phone Home Indicator */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-black rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
