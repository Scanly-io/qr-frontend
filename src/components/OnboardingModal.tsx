import { useState } from 'react';import { useState } from 'react';

import { import { X, MousePointerClick, Palette, QrCode, ArrowRight, ArrowLeft, Check } from 'lucide-react';

  X, MousePointerClick, Palette, QrCode, ArrowRight, ArrowLeft, Check, import { motion, AnimatePresence } from 'framer-motion';

  Keyboard, Sparkles, GripVertical, Trash2, Copy, Eye, Save, Rocket,

  LayoutGrid, Wand2, Layersinterface OnboardingModalProps {

} from 'lucide-react';  isOpen: boolean;

import { motion, AnimatePresence } from 'framer-motion';  onClose: () => void;

  onComplete: () => void;

interface OnboardingModalProps {}

  isOpen: boolean;

  onClose: () => void;export function OnboardingModal({ isOpen, onClose, onComplete }: OnboardingModalProps) {

  onComplete: () => void;  const [currentStep, setCurrentStep] = useState(0);

}

  const steps = [

export function OnboardingModal({ isOpen, onClose, onComplete }: OnboardingModalProps) {    {

  const [currentStep, setCurrentStep] = useState(0);      title: 'Welcome to Your Microsite Builder! 🎉',

      description: 'Create stunning, mobile-optimized landing pages in minutes. Let\'s get you started!',

  const steps = [      icon: MousePointerClick,

    {      content: (

      title: 'Welcome to Scanly! 🚀',        <div className="space-y-4">

      description: 'Build beautiful, mobile-optimized microsites with QR codes in minutes.',          <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl p-6 text-white">

      icon: Sparkles,            <h4 className="text-lg font-bold mb-2">What You'll Learn:</h4>

      content: (            <ul className="space-y-2 text-sm">

        <div className="space-y-5">              <li className="flex items-center gap-2">

          {/* Hero card */}                <Check className="w-4 h-4 flex-shrink-0" />

          <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-2xl p-6 text-white">                <span>How to add and arrange content blocks</span>

            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />              </li>

            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />              <li className="flex items-center gap-2">

            <div className="relative">                <Check className="w-4 h-4 flex-shrink-0" />

              <div className="flex items-center gap-3 mb-4">                <span>Customize your page design and branding</span>

                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">              </li>

                  <Layers className="w-5 h-5" />              <li className="flex items-center gap-2">

                </div>                <Check className="w-4 h-4 flex-shrink-0" />

                <span className="text-sm font-bold text-white/80 uppercase tracking-wider">Quick Tour — 60 seconds</span>                <span>Generate and download your QR code</span>

              </div>              </li>

              <h4 className="text-lg font-bold mb-3">In this tour you&apos;ll learn:</h4>            </ul>

              <ul className="space-y-2.5 text-sm">          </div>

                <li className="flex items-center gap-3">          <p className="text-sm text-gray-600 text-center">

                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">            This quick tour will only take 60 seconds!

                    <Check className="w-3.5 h-3.5" />          </p>

                  </div>        </div>

                  <span>Add &amp; arrange content blocks</span>      ),

                </li>    },

                <li className="flex items-center gap-3">    {

                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">      title: 'Step 1: Add Content Blocks',

                    <Check className="w-3.5 h-3.5" />      description: 'Drag blocks from the palette on the left to build your page',

                  </div>      icon: MousePointerClick,

                  <span>Customize design &amp; branding</span>      content: (

                </li>        <div className="space-y-4">

                <li className="flex items-center gap-3">          <div className="border-2 border-dashed border-violet-300 rounded-lg p-6 bg-violet-50">

                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">            <div className="flex items-start gap-4">

                    <Check className="w-3.5 h-3.5" />              <div className="flex-shrink-0 w-12 h-12 bg-violet-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">

                  </div>                1

                  <span>Use keyboard shortcuts like a pro</span>              </div>

                </li>              <div className="flex-1">

                <li className="flex items-center gap-3">                <h4 className="font-semibold text-gray-900 mb-2">From the Block Palette</h4>

                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">                <p className="text-sm text-gray-600 mb-3">

                    <Check className="w-3.5 h-3.5" />                  Click or drag any block type (Profile, Links, Images, etc.) from the left sidebar

                  </div>                </p>

                  <span>Generate &amp; share your QR code</span>                <div className="flex flex-wrap gap-2">

                </li>                  <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium">

              </ul>                    Profile

            </div>                  </span>

          </div>                  <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium">

                              Social Links

          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">                  </span>

            <Keyboard className="w-3.5 h-3.5" />                  <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium">

            <span>Pro tip: Press <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-xs font-mono font-semibold">?</kbd> anytime to see keyboard shortcuts</span>                    Gallery

          </div>                  </span>

        </div>                  <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium">

      ),                    Text

    },                  </span>

    {                </div>

      title: 'Add Content Blocks',              </div>

      description: 'Build your page by adding blocks from the sidebar',            </div>

      icon: MousePointerClick,          </div>

      content: (          

        <div className="space-y-4">          <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 bg-blue-50">

          <div className="border-2 border-violet-200 rounded-xl p-5 bg-gradient-to-br from-violet-50/50 to-purple-50/50">            <div className="flex items-start gap-4">

            <div className="flex items-start gap-4">              <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">

              <div className="flex-shrink-0 w-11 h-11 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-violet-500/30">                2

                <LayoutGrid className="w-5 h-5" />              </div>

              </div>              <div className="flex-1">

              <div className="flex-1">                <h4 className="font-semibold text-gray-900 mb-2">Arrange & Edit</h4>

                <h4 className="font-bold text-gray-900 mb-1.5">Block Palette (Left Sidebar)</h4>                <p className="text-sm text-gray-600">

                <p className="text-sm text-gray-600 mb-3">                  Drag blocks to reorder them, click to edit content, or use the trash icon to delete

                  Click any block to add it to your page. Choose from 25+ block types:                </p>

                </p>              </div>

                <div className="flex flex-wrap gap-1.5">            </div>

                  {['Profile', 'Social Links', 'Gallery', 'Text', 'Video', 'Payment', 'Menu', 'FAQ'].map(name => (          </div>

                    <span key={name} className="px-2.5 py-1 bg-white border border-violet-200 rounded-full text-xs font-medium text-violet-700 shadow-sm">        </div>

                      {name}      ),

                    </span>    },

                  ))}    {

                  <span className="px-2.5 py-1 bg-violet-100 border border-violet-200 rounded-full text-xs font-semibold text-violet-700">      title: 'Step 2: Customize Your Design',

                    +17 more      description: 'Make it yours with themes, colors, and branding',

                  </span>      icon: Palette,

                </div>      content: (

              </div>        <div className="space-y-4">

            </div>          <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 bg-purple-50">

          </div>            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">

                        <Palette className="w-5 h-5 text-purple-600" />

          <div className="border-2 border-purple-200 rounded-xl p-5 bg-gradient-to-br from-purple-50/50 to-fuchsia-50/50">              Right Sidebar Settings

            <div className="flex items-start gap-4">            </h4>

              <div className="flex-shrink-0 w-11 h-11 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-500/30">            <div className="space-y-3">

                <GripVertical className="w-5 h-5" />              <div className="bg-white rounded-lg p-3 border border-gray-200">

              </div>                <div className="flex items-center gap-2 mb-1">

              <div className="flex-1">                  <div className="w-2 h-2 bg-violet-500 rounded-full"></div>

                <h4 className="font-bold text-gray-900 mb-1.5">Arrange &amp; Edit</h4>                  <span className="text-sm font-semibold">Quick Theme</span>

                <p className="text-sm text-gray-600 mb-2">                </div>

                  Once added, you can:                <p className="text-xs text-gray-600">Choose from 10+ pre-made themes</p>

                </p>              </div>

                <div className="grid grid-cols-2 gap-2">              

                  <div className="flex items-center gap-2 text-xs text-gray-700 bg-white rounded-lg px-3 py-2 border border-gray-100">              <div className="bg-white rounded-lg p-3 border border-gray-200">

                    <GripVertical className="w-3.5 h-3.5 text-gray-400" />                <div className="flex items-center gap-2 mb-1">

                    <span>Drag to reorder</span>                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>

                  </div>                  <span className="text-sm font-semibold">Design Tab</span>

                  <div className="flex items-center gap-2 text-xs text-gray-700 bg-white rounded-lg px-3 py-2 border border-gray-100">                </div>

                    <MousePointerClick className="w-3.5 h-3.5 text-violet-500" />                <p className="text-xs text-gray-600">Background, typography, button styles</p>

                    <span>Click to edit</span>              </div>

                  </div>              

                  <div className="flex items-center gap-2 text-xs text-gray-700 bg-white rounded-lg px-3 py-2 border border-gray-100">              <div className="bg-white rounded-lg p-3 border border-gray-200">

                    <Copy className="w-3.5 h-3.5 text-blue-500" />                <div className="flex items-center gap-2 mb-1">

                    <span>Duplicate block</span>                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>

                  </div>                  <span className="text-sm font-semibold">Branding Tab</span>

                  <div className="flex items-center gap-2 text-xs text-gray-700 bg-white rounded-lg px-3 py-2 border border-gray-100">                </div>

                    <Trash2 className="w-3.5 h-3.5 text-red-500" />                <p className="text-xs text-gray-600">Logo, favicon, brand colors, site info</p>

                    <span>Delete block</span>              </div>

                  </div>            </div>

                </div>          </div>

              </div>          

            </div>          <p className="text-xs text-gray-600 text-center">

          </div>            💡 Tip: Start with a theme, then customize to match your brand!

        </div>          </p>

      ),        </div>

    },      ),

    {    },

      title: 'Customize Your Design',    {

      description: 'Make it uniquely yours with themes, colors, and fonts',      title: 'Step 3: Generate Your QR Code',

      icon: Palette,      description: 'Create and download a QR code for your microsite',

      content: (      icon: QrCode,

        <div className="space-y-4">      content: (

          <div className="border-2 border-purple-200 rounded-xl p-5 bg-gradient-to-br from-purple-50/50 to-violet-50/50">        <div className="space-y-4">

            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">          <div className="border-2 border-dashed border-green-300 rounded-lg p-6 bg-green-50">

              <Palette className="w-5 h-5 text-purple-600" />            <div className="flex items-start gap-4">

              Right Sidebar — 3 Tabs              <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">

            </h4>                <QrCode className="w-6 h-6 text-white" />

            <div className="space-y-2.5">              </div>

              <div className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">              <div className="flex-1">

                <div className="flex items-center gap-3">                <h4 className="font-semibold text-gray-900 mb-2">Ready to Share!</h4>

                  <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center">                <p className="text-sm text-gray-600 mb-3">

                    <LayoutGrid className="w-4 h-4 text-violet-600" />                  Click the "Generate QR Code" button in the toolbar to create your custom QR code

                  </div>                </p>

                  <div>                <div className="bg-white rounded-lg p-3 border border-gray-200">

                    <span className="text-sm font-bold text-gray-900">Blocks Tab</span>                  <p className="text-xs font-medium text-gray-700 mb-2">You can:</p>

                    <p className="text-xs text-gray-500">Add blocks from 8 categories</p>                  <ul className="text-xs text-gray-600 space-y-1">

                  </div>                    <li>• Customize QR code colors and style</li>

                </div>                    <li>• Download in multiple formats (PNG, SVG)</li>

              </div>                    <li>• Print on business cards, flyers, or merchandise</li>

                                  <li>• Share directly on social media</li>

              <div className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">                  </ul>

                <div className="flex items-center gap-3">                </div>

                  <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center">              </div>

                    <Palette className="w-4 h-4 text-purple-600" />            </div>

                  </div>          </div>

                  <div>          

                    <span className="text-sm font-bold text-gray-900">Design Tab</span>          <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg p-4 text-white text-center">

                    <p className="text-xs text-gray-500">Themes, backgrounds, fonts, buttons</p>            <p className="font-semibold mb-1">You're all set! 🎊</p>

                  </div>            <p className="text-sm opacity-90">Start creating your amazing microsite now</p>

                </div>          </div>

              </div>        </div>

                    ),

              <div className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">    },

                <div className="flex items-center gap-3">  ];

                  <div className="w-9 h-9 rounded-lg bg-fuchsia-100 flex items-center justify-center">

                    <Wand2 className="w-4 h-4 text-fuchsia-600" />  const handleNext = () => {

                  </div>    if (currentStep < steps.length - 1) {

                  <div>      setCurrentStep(currentStep + 1);

                    <span className="text-sm font-bold text-gray-900">AI Tab</span>    } else {

                    <p className="text-xs text-gray-500">AI-powered content suggestions</p>      handleComplete();

                  </div>    }

                </div>  };

              </div>

            </div>  const handleBack = () => {

          </div>    if (currentStep > 0) {

                setCurrentStep(currentStep - 1);

          <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl">    }

            <span className="text-amber-500 text-base">💡</span>  };

            <p className="text-xs text-amber-800 font-medium">

              Start with a theme, then fine-tune colors and fonts to match your brand!  const handleComplete = () => {

            </p>    onComplete();

          </div>    onClose();

        </div>  };

      ),

    },  const handleSkip = () => {

    {    setCurrentStep(0);

      title: 'Keyboard Shortcuts',    onClose();

      description: 'Work faster with these handy shortcuts',  };

      icon: Keyboard,

      content: (  const currentStepData = steps[currentStep];

        <div className="space-y-4">  const Icon = currentStepData.icon;

          <div className="grid grid-cols-2 gap-2.5">

            {[  return (

              { keys: ['⌘', 'S'], label: 'Save changes', icon: Save, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },    <AnimatePresence>

              { keys: ['⌘', 'P'], label: 'Preview page', icon: Eye, color: 'text-blue-600 bg-blue-50 border-blue-200' },      {isOpen && (

              { keys: ['⌘', 'D'], label: 'Duplicate block', icon: Copy, color: 'text-violet-600 bg-violet-50 border-violet-200' },        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

              { keys: ['Delete'], label: 'Remove block', icon: Trash2, color: 'text-red-600 bg-red-50 border-red-200' },          {/* Backdrop */}

              { keys: ['↑', '↓'], label: 'Navigate blocks', icon: GripVertical, color: 'text-gray-600 bg-gray-50 border-gray-200' },          <motion.div

              { keys: ['Esc'], label: 'Deselect block', icon: X, color: 'text-orange-600 bg-orange-50 border-orange-200' },            initial={{ opacity: 0 }}

            ].map((shortcut) => {            animate={{ opacity: 1 }}

              const ShortcutIcon = shortcut.icon;            exit={{ opacity: 0 }}

              return (            onClick={handleSkip}

                <div key={shortcut.label} className={`p-3.5 rounded-xl border-2 ${shortcut.color}`}>            className="absolute inset-0 bg-black/60 backdrop-blur-sm"

                  <div className="flex items-center gap-2.5 mb-2">          />

                    <ShortcutIcon className="w-4 h-4" />

                    <span className="text-xs font-bold">{shortcut.label}</span>          {/* Modal */}

                  </div>          <motion.div

                  <div className="flex items-center gap-1">            initial={{ opacity: 0, scale: 0.95, y: 20 }}

                    {shortcut.keys.map((key, i) => (            animate={{ opacity: 1, scale: 1, y: 0 }}

                      <span key={i}>            exit={{ opacity: 0, scale: 0.95, y: 20 }}

                        <kbd className="px-2 py-1 bg-white border border-gray-200 rounded-md text-xs font-mono font-bold text-gray-700 shadow-sm">            transition={{ type: 'spring', duration: 0.5 }}

                          {key}            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"

                        </kbd>          >

                        {i < shortcut.keys.length - 1 && <span className="text-gray-400 mx-0.5">+</span>}            {/* Header */}

                      </span>            <div className="relative bg-gradient-to-r from-violet-600 to-purple-600 text-white p-6">

                    ))}              <button

                  </div>                onClick={handleSkip}

                </div>                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"

              );              >

            })}                <X className="w-5 h-5" />

          </div>              </button>

                        

          <div className="flex items-center gap-2 px-4 py-2.5 bg-violet-50 border border-violet-200 rounded-xl">              <div className="flex items-center gap-4">

            <Keyboard className="w-4 h-4 text-violet-500 flex-shrink-0" />                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">

            <p className="text-xs text-violet-700 font-medium">                  <Icon className="w-7 h-7" />

              Press <kbd className="px-1.5 py-0.5 bg-white border border-violet-200 rounded text-xs font-mono font-bold">?</kbd> anytime in the editor to see all shortcuts                </div>

            </p>                <div>

          </div>                  <h2 className="text-2xl font-bold mb-1">{currentStepData.title}</h2>

        </div>                  <p className="text-violet-100 text-sm">{currentStepData.description}</p>

      ),                </div>

    },              </div>

    {

      title: 'Publish & Share with QR Code',              {/* Progress Bar */}

      description: 'Go live and share your microsite with the world',              <div className="mt-4 flex gap-2">

      icon: QrCode,                {steps.map((_, index) => (

      content: (                  <div

        <div className="space-y-4">                    key={index}

          <div className="grid grid-cols-2 gap-3">                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${

            {/* Save & Publish */}                      index <= currentStep ? 'bg-white' : 'bg-white/30'

            <div className="border-2 border-emerald-200 rounded-xl p-4 bg-gradient-to-br from-emerald-50/50 to-green-50/50">                    }`}

              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center text-white mb-3 shadow-lg shadow-emerald-500/30">                  />

                <Rocket className="w-5 h-5" />                ))}

              </div>              </div>

              <h4 className="font-bold text-gray-900 text-sm mb-1">Publish</h4>            </div>

              <p className="text-xs text-gray-600">

                Click <span className="font-semibold text-violet-600">Publish</span> in the toolbar to make your page live            {/* Content */}

              </p>            <div className="p-6">

            </div>              <AnimatePresence mode="wait">

                <motion.div

            {/* QR Code */}                  key={currentStep}

            <div className="border-2 border-violet-200 rounded-xl p-4 bg-gradient-to-br from-violet-50/50 to-purple-50/50">                  initial={{ opacity: 0, x: 20 }}

              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center text-white mb-3 shadow-lg shadow-violet-500/30">                  animate={{ opacity: 1, x: 0 }}

                <QrCode className="w-5 h-5" />                  exit={{ opacity: 0, x: -20 }}

              </div>                  transition={{ duration: 0.3 }}

              <h4 className="font-bold text-gray-900 text-sm mb-1">QR Code</h4>                >

              <p className="text-xs text-gray-600">                  {currentStepData.content}

                Generate a custom QR code to download and share                </motion.div>

              </p>              </AnimatePresence>

            </div>            </div>

          </div>

            {/* Footer */}

          <div className="border-2 border-gray-100 rounded-xl p-4 bg-white">            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">

            <p className="text-xs font-bold text-gray-700 mb-2.5 uppercase tracking-wide">Share your QR code on:</p>              <div className="flex items-center gap-2">

            <div className="flex flex-wrap gap-1.5">                <button

              {['Business Cards', 'Flyers', 'Social Media', 'Merchandise', 'Menus', 'Storefronts'].map(item => (                  onClick={handleSkip}

                <span key={item} className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-full text-xs font-medium text-gray-600">                  className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"

                  {item}                >

                </span>                  Skip Tutorial

              ))}                </button>

            </div>              </div>

          </div>

                        <div className="flex items-center gap-3">

          <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-xl p-5 text-white text-center">                {currentStep > 0 && (

            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />                  <button

            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />                    onClick={handleBack}

            <div className="relative">                    className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"

              <p className="font-bold text-lg mb-1">You&apos;re all set! 🎊</p>                  >

              <p className="text-sm text-white/80">Start building your Scanly microsite now</p>                    <ArrowLeft className="w-4 h-4" />

            </div>                    Back

          </div>                  </button>

        </div>                )}

      ),                

    },                <button

  ];                  onClick={handleNext}

                  className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-lg transition-all shadow-lg shadow-violet-500/30 flex items-center gap-2"

  const handleNext = () => {                >

    if (currentStep < steps.length - 1) {                  {currentStep === steps.length - 1 ? (

      setCurrentStep(currentStep + 1);                    <>

    } else {                      Get Started

      handleComplete();                      <Check className="w-4 h-4" />

    }                    </>

  };                  ) : (

                    <>

  const handleBack = () => {                      Next

    if (currentStep > 0) {                      <ArrowRight className="w-4 h-4" />

      setCurrentStep(currentStep - 1);                    </>

    }                  )}

  };                </button>

              </div>

  const handleComplete = () => {            </div>

    onComplete();          </motion.div>

    onClose();        </div>

  };      )}

    </AnimatePresence>

  const handleSkip = () => {  );

    setCurrentStep(0);}

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
            <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white p-6">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              
              <button
                onClick={handleSkip}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close tutorial"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="relative flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                  <Icon className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-0.5">{currentStepData.title}</h2>
                  <p className="text-violet-100 text-sm">{currentStepData.description}</p>
                </div>
              </div>

              {/* Step indicator — clickable */}
              <div className="relative mt-5 flex gap-2">
                {steps.map((step, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 cursor-pointer hover:opacity-80 ${
                      index <= currentStep ? 'bg-white' : 'bg-white/25'
                    }`}
                    aria-label={`Go to step ${index + 1}: ${step.title}`}
                  />
                ))}
              </div>
              <div className="relative mt-2 text-xs text-white/60 font-medium">
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[50vh] overflow-y-auto">
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
            <div className="flex items-center justify-between p-5 border-t border-gray-100 bg-gray-50/80">
              <button
                onClick={handleSkip}
                className="text-sm text-gray-500 hover:text-gray-800 font-medium transition-colors px-3 py-1.5 hover:bg-gray-100 rounded-lg"
              >
                Skip Tutorial
              </button>

              <div className="flex items-center gap-2.5">
                {currentStep > 0 && (
                  <button
                    onClick={handleBack}
                    className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 rounded-xl transition-colors flex items-center gap-2 border border-gray-200"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                )}
                
                <button
                  onClick={handleNext}
                  className="px-6 py-2 text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-xl transition-all shadow-lg shadow-violet-500/30 flex items-center gap-2"
                >
                  {currentStep === steps.length - 1 ? (
                    <>
                      Start Building
                      <Rocket className="w-4 h-4" />
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
