import { useState } from 'react'
import {
  X,
  MousePointerClick,
  Palette,
  QrCode,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Rocket,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

interface Step {
  title: string
  description: string
  icon: React.ElementType
  content: React.ReactNode
}

export function OnboardingModal({
  isOpen,
  onClose,
  onComplete,
}: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const steps: Step[] = [
    {
      title: 'Welcome to Scanly 🚀',
      description: 'Build beautiful microsites with QR codes in minutes.',
      icon: Sparkles,
      content: (
        <div className="space-y-4 text-gray-700">
          <p>
            This quick tour will show you how to:
          </p>
          <ul className="space-y-2">
            {[
              'Add and arrange content blocks',
              'Customize design and branding',
              'Generate and share your QR code',
            ].map(item => (
              <li key={item} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-violet-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      title: 'Add Content Blocks',
      description: 'Build your page using blocks from the sidebar.',
      icon: MousePointerClick,
      content: (
        <div className="space-y-3 text-gray-700">
          <p>
            Click or drag blocks from the left sidebar to add them to your page.
          </p>
          <p className="text-sm text-gray-500">
            Examples: Profile, Links, Gallery, Text, Video
          </p>
        </div>
      ),
    },
    {
      title: 'Customize Your Design',
      description: 'Make it yours with themes, colors, and fonts.',
      icon: Palette,
      content: (
        <div className="space-y-3 text-gray-700">
          <p>
            Use the Design tab to customize backgrounds, typography, and buttons.
          </p>
          <p className="text-sm text-gray-500">
            Start with a theme, then fine-tune it to match your brand.
          </p>
        </div>
      ),
    },
    {
      title: 'Generate Your QR Code',
      description: 'Share your microsite anywhere.',
      icon: QrCode,
      content: (
        <div className="space-y-3 text-gray-700">
          <p>
            Generate a QR code for your microsite and download it as PNG or SVG.
          </p>
          <p className="text-sm text-gray-500">
            Perfect for business cards, menus, flyers, and social media.
          </p>
        </div>
      ),
    },
    {
      title: 'You’re All Set 🎉',
      description: 'Start building your microsite now.',
      icon: Rocket,
      content: (
        <div className="text-center space-y-3">
          <p className="text-gray-700">
            You’re ready to create and publish your first Scanly microsite.
          </p>
          <p className="text-sm text-gray-500">
            You can revisit this tutorial anytime from settings.
          </p>
        </div>
      ),
    },
  ]

  const isLastStep = currentStep === steps.length - 1
  const CurrentIcon = steps[currentStep].icon

  const handleNext = () => {
    if (isLastStep) {
      onComplete()
      onClose()
    } else {
      setCurrentStep(s => s + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep(s => Math.max(0, s - 1))
  }

  const handleSkip = () => {
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleSkip}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-6 text-white relative">
              <button
                onClick={handleSkip}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <CurrentIcon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">
                    {steps[currentStep].title}
                  </h2>
                  <p className="text-sm text-violet-100">
                    {steps[currentStep].description}
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="mt-4 flex gap-2">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full ${
                      i <= currentStep ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 min-h-[160px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  {steps[currentStep].content}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
              <button
                onClick={handleSkip}
                className="text-sm text-gray-500 hover:text-gray-800"
              >
                Skip
              </button>

              <div className="flex gap-2">
                {currentStep > 0 && (
                  <button
                    onClick={handleBack}
                    className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-100 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                )}

                <button
                  onClick={handleNext}
                  className="px-5 py-2 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 flex items-center gap-1"
                >
                  {isLastStep ? 'Start Building' : 'Next'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
