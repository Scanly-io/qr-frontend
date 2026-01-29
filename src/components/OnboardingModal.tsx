import { useState } from 'react';
import { X, MousePointerClick, Palette, QrCode, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function OnboardingModal({ isOpen, onClose, onComplete }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to Your Microsite Builder! 🎉',
      description: 'Create stunning, mobile-optimized landing pages in minutes. Let\'s get you started!',
      icon: MousePointerClick,
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl p-6 text-white">
            <h4 className="text-lg font-bold mb-2">What You'll Learn:</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 flex-shrink-0" />
                <span>How to add and arrange content blocks</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 flex-shrink-0" />
                <span>Customize your page design and branding</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 flex-shrink-0" />
                <span>Generate and download your QR code</span>
              </li>
            </ul>
          </div>
          <p className="text-sm text-gray-600 text-center">
            This quick tour will only take 60 seconds!
          </p>
        </div>
      ),
    },
    {
      title: 'Step 1: Add Content Blocks',
      description: 'Drag blocks from the palette on the left to build your page',
      icon: MousePointerClick,
      content: (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-violet-300 rounded-lg p-6 bg-violet-50">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-violet-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">From the Block Palette</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Click or drag any block type (Profile, Links, Images, etc.) from the left sidebar
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium">
                    Profile
                  </span>
                  <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium">
                    Social Links
                  </span>
                  <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium">
                    Gallery
                  </span>
                  <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium">
                    Text
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 bg-blue-50">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">Arrange & Edit</h4>
                <p className="text-sm text-gray-600">
                  Drag blocks to reorder them, click to edit content, or use the trash icon to delete
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Step 2: Customize Your Design',
      description: 'Make it yours with themes, colors, and branding',
      icon: Palette,
      content: (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 bg-purple-50">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-600" />
              Right Sidebar Settings
            </h4>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                  <span className="text-sm font-semibold">Quick Theme</span>
                </div>
                <p className="text-xs text-gray-600">Choose from 10+ pre-made themes</p>
              </div>
              
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-semibold">Design Tab</span>
                </div>
                <p className="text-xs text-gray-600">Background, typography, button styles</p>
              </div>
              
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span className="text-sm font-semibold">Branding Tab</span>
                </div>
                <p className="text-xs text-gray-600">Logo, favicon, brand colors, site info</p>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-gray-600 text-center">
            💡 Tip: Start with a theme, then customize to match your brand!
          </p>
        </div>
      ),
    },
    {
      title: 'Step 3: Generate Your QR Code',
      description: 'Create and download a QR code for your microsite',
      icon: QrCode,
      content: (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-green-300 rounded-lg p-6 bg-green-50">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">Ready to Share!</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Click the "Generate QR Code" button in the toolbar to create your custom QR code
                </p>
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <p className="text-xs font-medium text-gray-700 mb-2">You can:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Customize QR code colors and style</li>
                    <li>• Download in multiple formats (PNG, SVG)</li>
                    <li>• Print on business cards, flyers, or merchandise</li>
                    <li>• Share directly on social media</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg p-4 text-white text-center">
            <p className="font-semibold mb-1">You're all set! 🎊</p>
            <p className="text-sm opacity-90">Start creating your amazing microsite now</p>
          </div>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete();
    onClose();
  };

  const handleSkip = () => {
    setCurrentStep(0);
    onClose();
  };

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleSkip}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-violet-600 to-purple-600 text-white p-6">
              <button
                onClick={handleSkip}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Icon className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">{currentStepData.title}</h2>
                  <p className="text-violet-100 text-sm">{currentStepData.description}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 flex gap-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                      index <= currentStep ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentStepData.content}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSkip}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  Skip Tutorial
                </button>
              </div>

              <div className="flex items-center gap-3">
                {currentStep > 0 && (
                  <button
                    onClick={handleBack}
                    className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                )}
                
                <button
                  onClick={handleNext}
                  className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-lg transition-all shadow-lg shadow-violet-500/30 flex items-center gap-2"
                >
                  {currentStep === steps.length - 1 ? (
                    <>
                      Get Started
                      <Check className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
