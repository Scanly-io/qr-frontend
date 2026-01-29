import type { Block } from '@/types';
import type { PageTheme } from '@/types/theme';
import { motion } from 'framer-motion';
import { 
  Send, 
  Mail, 
  User, 
  Phone, 
  MessageSquare, 
  Calendar, 
  Clock,
  Star,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Bell,
  Users,
  CheckCircle2,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { useState } from 'react';
import { FONT_FAMILY_MAP } from '@/lib/fonts';
import { spacing, shadows, animations } from '@/utils/designSystem';

interface FormBlockProps {
  block: Block;
  theme?: PageTheme;
}

interface FormField {
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string;
  rows?: number;
}

type FormType = 'contact' | 'newsletter' | 'waitlist' | 'survey' | 'feedback' | 'rsvp' | 'booking' | 'custom';

export default function FormBlock({ block, theme }: FormBlockProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Form type determines preset fields and styling
  const formType = (block.content.formType as FormType) || 'contact';
  const title = (block.content.title as string) || getDefaultTitle(formType);
  const subtitle = (block.content.subtitle as string) || getDefaultSubtitle(formType);
  const submitLabel = (block.content.submitLabel as string) || getDefaultSubmitLabel(formType);
  const successMessage = (block.content.successMessage as string) || getDefaultSuccessMessage(formType);
  
  // Styling options
  const style = (block.content.style as 'default' | 'minimal' | 'card' | 'gradient' | 'glass') || 'default';
  const backgroundColor = (block.content.backgroundColor as string) || '#ffffff';
  const accentColor = (block.content.accentColor as string) || theme?.button?.backgroundColor || '#8b5cf6';
  const inputStyle = (block.content.inputStyle as 'rounded' | 'pill' | 'square') || 'rounded';
  const layout = (block.content.layout as 'vertical' | 'horizontal' | 'inline') || 'vertical';
  const showIcon = (block.content.showIcon as boolean) ?? true;
  
  // Typography
  const titleFont = theme?.typography?.titleFont || 'inter';
  const bodyFont = theme?.typography?.bodyFont || 'inter';
  const titleFontFamily = FONT_FAMILY_MAP[titleFont] || "'Inter', sans-serif";
  const bodyFontFamily = FONT_FAMILY_MAP[bodyFont] || "'Inter', sans-serif";
  
  // Get fields based on form type or custom fields
  const fields = (block.content.fields as FormField[]) || getDefaultFields(formType);

  // Input border radius
  const inputBorderRadius = inputStyle === 'rounded' ? '0.75rem' : 
                           inputStyle === 'pill' ? '9999px' : 
                           '0.375rem';

  // Style configurations
  const styleConfigs = {
    default: {
      container: 'bg-white border-2 border-slate-200 shadow-sm hover:shadow-md',
      title: 'text-slate-900',
      subtitle: 'text-slate-500',
      input: 'bg-white border-2 border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20',
    },
    minimal: {
      container: 'bg-transparent',
      title: 'text-slate-900',
      subtitle: 'text-slate-500',
      input: 'bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary/20',
    },
    card: {
      container: 'bg-white border border-slate-200 shadow-xl shadow-slate-200/50',
      title: 'text-slate-900',
      subtitle: 'text-slate-500',
      input: 'bg-slate-50 border border-slate-200 focus:border-primary',
    },
    gradient: {
      container: 'bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 border-0',
      title: 'text-white',
      subtitle: 'text-white/80',
      input: 'bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/60 focus:border-white/50',
    },
    glass: {
      container: 'bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl',
      title: 'text-slate-900',
      subtitle: 'text-slate-600',
      input: 'bg-white/50 backdrop-blur-sm border border-slate-200/50 focus:border-primary',
    },
  };

  const currentStyle = styleConfigs[style] || styleConfigs.default;

  // Render form icon based on type
  const renderFormIcon = (size: string = 'w-6 h-6') => {
    const iconProps = { className: size, style: { color: style === 'gradient' ? '#fff' : accentColor } };
    switch (formType) {
      case 'contact': return <MessageSquare {...iconProps} />;
      case 'newsletter': return <Mail {...iconProps} />;
      case 'waitlist': return <Bell {...iconProps} />;
      case 'survey': return <Sparkles {...iconProps} />;
      case 'feedback': return <ThumbsUp {...iconProps} />;
      case 'rsvp': return <Users {...iconProps} />;
      case 'booking': return <Calendar {...iconProps} />;
      default: return <MessageSquare {...iconProps} />;
    }
  };

  // Handle mock submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  // Success state
  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`p-8 rounded-2xl ${currentStyle.container} text-center`}
        style={{ backgroundColor: style === 'gradient' ? undefined : backgroundColor }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${accentColor}20` }}
        >
          <CheckCircle2 className="w-8 h-8" style={{ color: accentColor }} />
        </motion.div>
        <h3 
          className={`text-xl font-bold mb-2 ${currentStyle.title}`}
          style={{ fontFamily: titleFontFamily }}
        >
          {successMessage}
        </h3>
        <p className={`text-sm ${currentStyle.subtitle}`} style={{ fontFamily: bodyFontFamily }}>
          We'll be in touch soon.
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="mt-4 text-sm font-medium hover:opacity-80 transition-opacity"
          style={{ color: style === 'gradient' ? '#fff' : accentColor }}
        >
          Submit another response
        </button>
      </motion.div>
    );
  }

  // Inline layout (for newsletter/waitlist)
  if (layout === 'inline' && (formType === 'newsletter' || formType === 'waitlist')) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-2xl ${currentStyle.container}`}
        style={{ backgroundColor: style === 'gradient' ? undefined : backgroundColor }}
      >
        <div className="text-center mb-4">
          {showIcon && (
            <div 
              className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: style === 'gradient' ? 'rgba(255,255,255,0.2)' : `${accentColor}15` }}
            >
              {renderFormIcon('w-6 h-6')}
            </div>
          )}
          <h3 
            className={`text-lg font-bold ${currentStyle.title}`}
            style={{ fontFamily: titleFontFamily }}
          >
            {title}
          </h3>
          {subtitle && (
            <p className={`text-sm mt-1 ${currentStyle.subtitle}`} style={{ fontFamily: bodyFontFamily }}>
              {subtitle}
            </p>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            className={`flex-1 px-4 py-3 text-sm ${currentStyle.input} transition-all outline-none`}
            style={{ borderRadius: inputBorderRadius, fontFamily: bodyFontFamily }}
            required
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 font-semibold text-white flex items-center gap-2 transition-all disabled:opacity-70"
            style={{ 
              backgroundColor: style === 'gradient' ? 'rgba(255,255,255,0.2)' : accentColor, 
              borderRadius: inputBorderRadius,
              fontFamily: bodyFontFamily,
            }}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                {submitLabel}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    );
  }

  // Full form layout
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-8 rounded-2xl ${currentStyle.container}`}
      style={{ backgroundColor: style === 'gradient' ? undefined : backgroundColor }}
    >
      {/* Header */}
      <div className={`mb-6 ${layout === 'horizontal' ? 'text-left' : 'text-center'}`}>
        {showIcon && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
            className={`w-14 h-14 mb-4 rounded-xl flex items-center justify-center ${layout === 'horizontal' ? '' : 'mx-auto'}`}
            style={{ backgroundColor: style === 'gradient' ? 'rgba(255,255,255,0.2)' : `${accentColor}15` }}
          >
            {renderFormIcon('w-7 h-7')}
          </motion.div>
        )}
        <h3 
          className={`text-2xl font-bold ${currentStyle.title}`}
          style={{ fontFamily: titleFontFamily }}
        >
          {title}
        </h3>
        {subtitle && (
          <p className={`text-sm mt-2 ${currentStyle.subtitle}`} style={{ fontFamily: bodyFontFamily }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className={layout === 'horizontal' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
          {fields.map((field, idx) => (
            <div key={idx} className="space-y-1.5">
              <label 
                className={`block text-sm font-semibold ${style === 'gradient' ? 'text-white/90' : 'text-slate-700'}`}
                style={{ fontFamily: bodyFontFamily }}
              >
                {field.label}
                {field.required && <span className="text-red-400 ml-1">*</span>}
              </label>
              
              {field.type === 'textarea' ? (
                <textarea
                  placeholder={field.placeholder}
                  rows={field.rows || 4}
                  className={`w-full px-4 py-3 text-sm ${currentStyle.input} transition-all outline-none resize-none`}
                  style={{ borderRadius: inputBorderRadius, fontFamily: bodyFontFamily }}
                  required={field.required}
                />
              ) : field.type === 'select' ? (
                <select
                  className={`w-full px-4 py-3 text-sm ${currentStyle.input} transition-all outline-none appearance-none cursor-pointer`}
                  style={{ 
                    borderRadius: inputBorderRadius, 
                    fontFamily: bodyFontFamily,
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.75rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.25em 1.25em',
                    paddingRight: '2.5rem'
                  }}
                  required={field.required}
                >
                  <option value="">Select an option...</option>
                  {(field.options || '').split('\n').filter(opt => opt.trim()).map((opt, i) => (
                    <option key={i} value={opt.trim()}>{opt.trim()}</option>
                  ))}
                </select>
              ) : field.type === 'rating' ? (
                <div className="flex gap-2 py-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      className="group"
                    >
                      <Star 
                        className={`w-8 h-8 transition-all group-hover:scale-110 ${
                          rating <= 4 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-slate-300 group-hover:text-yellow-400'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              ) : field.type === 'thumbs' ? (
                <div className="flex gap-3 py-2">
                  <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                  >
                    <ThumbsUp className="w-5 h-5" />
                    <span className="text-sm font-medium">Yes</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                  >
                    <ThumbsDown className="w-5 h-5" />
                    <span className="text-sm font-medium">No</span>
                  </button>
                </div>
              ) : field.type === 'date' ? (
                <input
                  type="date"
                  className={`w-full px-4 py-3 text-sm ${currentStyle.input} transition-all outline-none`}
                  style={{ borderRadius: inputBorderRadius, fontFamily: bodyFontFamily }}
                  required={field.required}
                />
              ) : field.type === 'time' ? (
                <input
                  type="time"
                  className={`w-full px-4 py-3 text-sm ${currentStyle.input} transition-all outline-none`}
                  style={{ borderRadius: inputBorderRadius, fontFamily: bodyFontFamily }}
                  required={field.required}
                />
              ) : field.type === 'radio' ? (
                <div className="space-y-2 pt-1">
                  {(field.options || 'Option 1\nOption 2').split('\n').filter(opt => opt.trim()).map((opt, i) => (
                    <label key={i} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="radio"
                          name={`radio-${idx}`}
                          className="sr-only peer"
                          defaultChecked={i === 0}
                        />
                        <div 
                          className="w-5 h-5 rounded-full border-2 border-slate-300 peer-checked:border-primary peer-checked:bg-primary/10 transition-all group-hover:border-primary/50"
                          style={{ borderColor: i === 0 ? accentColor : undefined }}
                        />
                        <div 
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full scale-0 peer-checked:scale-100 transition-transform"
                          style={{ backgroundColor: accentColor }}
                        />
                      </div>
                      <span className={`text-sm ${style === 'gradient' ? 'text-white/90' : 'text-slate-700'}`}>
                        {opt.trim()}
                      </span>
                    </label>
                  ))}
                </div>
              ) : field.type === 'checkbox' ? (
                <div className="space-y-2 pt-1">
                  {(field.options || 'Option 1\nOption 2').split('\n').filter(opt => opt.trim()).map((opt, i) => (
                    <label key={i} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked={i === 0}
                        />
                        <div 
                          className="w-5 h-5 rounded-md border-2 border-slate-300 peer-checked:border-primary peer-checked:bg-primary transition-all group-hover:border-primary/50 flex items-center justify-center"
                          style={{ borderColor: i === 0 ? accentColor : undefined, backgroundColor: i === 0 ? accentColor : undefined }}
                        >
                          <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <span className={`text-sm ${style === 'gradient' ? 'text-white/90' : 'text-slate-700'}`}>
                        {opt.trim()}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="relative">
                  <input
                    type={field.type || 'text'}
                    placeholder={field.placeholder}
                    className={`w-full px-4 py-3 text-sm ${currentStyle.input} transition-all outline-none`}
                    style={{ borderRadius: inputBorderRadius, fontFamily: bodyFontFamily }}
                    required={field.required}
                  />
                  {getFieldIcon(field.type) && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                      {getFieldIcon(field.type)}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <motion.button
          {...animations.hover.lift}
          {...animations.tap}
          type="submit"
          disabled={isSubmitting}
          className="w-full font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-70"
          style={{ 
            backgroundColor: style === 'gradient' ? 'rgba(255,255,255,0.2)' : accentColor,
            borderRadius: inputBorderRadius,
            fontFamily: bodyFontFamily,
            boxShadow: style === 'gradient' ? 'none' : `${shadows.lg}, ${shadows.colored(accentColor, 5)}`,
            padding: `${spacing[4]} ${spacing[6]}`,
          }}
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              {submitLabel}
              <Send className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}

// Helper functions
function getDefaultTitle(formType: FormType): string {
  const titles: Record<FormType, string> = {
    contact: 'Get in Touch',
    newsletter: 'Subscribe to Our Newsletter',
    waitlist: 'Join the Waitlist',
    survey: 'Quick Survey',
    feedback: 'Share Your Feedback',
    rsvp: 'RSVP to Event',
    booking: 'Book an Appointment',
    custom: 'Contact Form',
  };
  return titles[formType] || 'Contact Form';
}

function getDefaultSubtitle(formType: FormType): string {
  const subtitles: Record<FormType, string> = {
    contact: "We'd love to hear from you. Send us a message!",
    newsletter: 'Get updates, tips, and exclusive content delivered to your inbox.',
    waitlist: 'Be the first to know when we launch. No spam, ever.',
    survey: 'Help us improve by answering a few quick questions.',
    feedback: 'Your opinion matters to us. Let us know what you think!',
    rsvp: 'Let us know if you can make it to the event.',
    booking: 'Schedule a time that works for you.',
    custom: '',
  };
  return subtitles[formType] || '';
}

function getDefaultSubmitLabel(formType: FormType): string {
  const labels: Record<FormType, string> = {
    contact: 'Send Message',
    newsletter: 'Subscribe',
    waitlist: 'Join Waitlist',
    survey: 'Submit Survey',
    feedback: 'Submit Feedback',
    rsvp: 'Confirm RSVP',
    booking: 'Book Now',
    custom: 'Submit',
  };
  return labels[formType] || 'Submit';
}

function getDefaultSuccessMessage(formType: FormType): string {
  const messages: Record<FormType, string> = {
    contact: 'Message sent successfully!',
    newsletter: 'You\'re subscribed!',
    waitlist: 'You\'re on the list!',
    survey: 'Survey submitted!',
    feedback: 'Thanks for your feedback!',
    rsvp: 'RSVP confirmed!',
    booking: 'Booking confirmed!',
    custom: 'Form submitted!',
  };
  return messages[formType] || 'Form submitted!';
}

function getDefaultFields(formType: FormType): FormField[] {
  const fieldSets: Record<FormType, FormField[]> = {
    contact: [
      { type: 'text', label: 'Name', placeholder: 'Your full name', required: true },
      { type: 'email', label: 'Email', placeholder: 'your@email.com', required: true },
      { type: 'text', label: 'Subject', placeholder: 'How can we help?', required: false },
      { type: 'textarea', label: 'Message', placeholder: 'Your message...', required: true, rows: 4 },
    ],
    newsletter: [
      { type: 'email', label: 'Email Address', placeholder: 'your@email.com', required: true },
    ],
    waitlist: [
      { type: 'text', label: 'Name', placeholder: 'Your name', required: true },
      { type: 'email', label: 'Email', placeholder: 'your@email.com', required: true },
    ],
    survey: [
      { type: 'rating', label: 'How would you rate your experience?', required: true },
      { type: 'select', label: 'How did you hear about us?', options: 'Social Media\nSearch Engine\nFriend/Family\nOther', required: true },
      { type: 'textarea', label: 'Any additional comments?', placeholder: 'Tell us more...', rows: 3 },
    ],
    feedback: [
      { type: 'thumbs', label: 'Was this helpful?', required: true },
      { type: 'textarea', label: 'Tell us more', placeholder: 'What can we improve?', rows: 3 },
    ],
    rsvp: [
      { type: 'text', label: 'Name', placeholder: 'Your name', required: true },
      { type: 'email', label: 'Email', placeholder: 'your@email.com', required: true },
      { type: 'radio', label: 'Will you attend?', options: 'Yes, I\'ll be there\nNo, can\'t make it\nMaybe', required: true },
      { type: 'select', label: 'Number of Guests', options: '1\n2\n3\n4+', required: false },
    ],
    booking: [
      { type: 'text', label: 'Name', placeholder: 'Your name', required: true },
      { type: 'email', label: 'Email', placeholder: 'your@email.com', required: true },
      { type: 'phone', label: 'Phone', placeholder: '+1 (555) 000-0000', required: true },
      { type: 'date', label: 'Preferred Date', required: true },
      { type: 'time', label: 'Preferred Time', required: true },
      { type: 'textarea', label: 'Notes', placeholder: 'Any special requests?', rows: 2 },
    ],
    custom: [
      { type: 'text', label: 'Name', placeholder: 'Your name', required: true },
      { type: 'email', label: 'Email', placeholder: 'your@email.com', required: true },
      { type: 'textarea', label: 'Message', placeholder: 'Your message...', required: false, rows: 4 },
    ],
  };
  return fieldSets[formType] || fieldSets.contact;
}

function getFieldIcon(fieldType: string) {
  const icons: Record<string, React.ReactNode> = {
    email: <Mail className="w-4 h-4" />,
    phone: <Phone className="w-4 h-4" />,
    text: <User className="w-4 h-4" />,
    date: <Calendar className="w-4 h-4" />,
    time: <Clock className="w-4 h-4" />,
  };
  return icons[fieldType] || null;
}
