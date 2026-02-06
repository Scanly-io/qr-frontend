import type { Block } from '@/types';
import type { PageTheme } from '@/types/theme';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Clock, ChevronLeft, ChevronRight, Check, 
  Video, MapPin, Phone, CalendarDays,
  Loader2, ExternalLink, Timer, CalendarCheck, CreditCard, User
} from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { FONT_FAMILY_MAP } from '@/lib/fonts';
import { usePayment } from '@/contexts/PaymentContext';
import { createAppointment, type AppointmentData } from '@/lib/api/appointments';
import { 
  GoogleCalendarIcon, 
  OutlookIcon, 
  AppleCalendarIcon, 
  CalendlyIcon,
  ZoomIcon,
  TeamsIcon,
  BrandColors 
} from '@/components/icons/BrandIcons';

interface ScheduleBlockProps {
  block: Block;
  theme?: PageTheme;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<Block>) => void;
}

interface TimeSlot {
  time: string;
  available: boolean;
  duration?: number;
}

interface ServiceType {
  id: string;
  name: string;
  duration: number;
  price?: number;
  description?: string;
  icon?: 'video' | 'phone' | 'location' | 'zoom' | 'teams' | 'default';
  requiresPayment?: boolean;
  calendarType?: 'google' | 'outlook' | 'apple' | 'calendly';
}

// Helper to determine if background is dark
function isDarkBackground(theme?: PageTheme): boolean {
  const bgColor = theme?.background?.color || theme?.background?.gradientFrom || '#ffffff';
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16) || 255;
  const g = parseInt(hex.substr(2, 2), 16) || 255;
  const b = parseInt(hex.substr(4, 2), 16) || 255;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}

// Get days in month
function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // Add padding for days before first of month
  const startPadding = firstDay.getDay();
  for (let i = startPadding - 1; i >= 0; i--) {
    const date = new Date(year, month, -i);
    days.push(date);
  }
  
  // Add days of the month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }
  
  // Add padding for remaining days
  const remaining = 42 - days.length; // 6 rows x 7 days
  for (let i = 1; i <= remaining; i++) {
    days.push(new Date(year, month + 1, i));
  }
  
  return days;
}

// Format time to 12h
function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export default function ScheduleBlock({ block, theme }: ScheduleBlockProps) {
  console.log('ScheduleBlock rendering', { block, theme });
  
  // Payment context for pre-authorization
  const payment = usePayment();
  const { quickPurchase, isCheckoutLoading } = payment || { quickPurchase: async () => {}, isCheckoutLoading: false };
  
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCalendarOptions, setShowCalendarOptions] = useState(false);
  
  // Customer info state
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  // Content
  const content = block?.content || {};
  const title = (content.title as string) || 'Book an Appointment';
  const subtitle = (content.subtitle as string) || 'Select a time that works for you';
  const calendlyUrl = content.calendlyUrl as string;
  const style = (content.style as 'calendar' | 'list' | 'minimal' | 'embedded' | 'cards') || 'calendar';
  
  // Services
  const services: ServiceType[] = useMemo(() => (content.services as ServiceType[]) || [
    { id: '1', name: '30-Minute Consultation', duration: 30, price: 0, icon: 'video', description: 'Quick intro call', calendarType: 'google' },
    { id: '2', name: '1-Hour Strategy Session', duration: 60, price: 99, icon: 'zoom', description: 'Deep dive into your needs', requiresPayment: true, calendarType: 'google' },
    { id: '3', name: 'In-Person Meeting', duration: 60, price: 149, icon: 'location', description: 'Face-to-face consultation', requiresPayment: true, calendarType: 'outlook' },
  ], [content.services]);
  
  // Auto-select first service if not in cards style
  useEffect(() => {
    console.log('useEffect running', { selectedService, style, servicesLength: services.length });
    // Only auto-select if we haven't selected anything yet and we have services
    if (selectedService === null && style !== 'cards' && services.length > 0) {
      console.log('Auto-selecting first service:', services[0].id);
      setSelectedService(services[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount
  
  // Available time slots (sample data)
  const availableSlots: TimeSlot[] = (content.timeSlots as TimeSlot[]) || [
    { time: '09:00', available: true },
    { time: '09:30', available: false },
    { time: '10:00', available: true },
    { time: '10:30', available: true },
    { time: '11:00', available: false },
    { time: '11:30', available: true },
    { time: '14:00', available: true },
    { time: '14:30', available: true },
    { time: '15:00', available: false },
    { time: '15:30', available: true },
    { time: '16:00', available: true },
    { time: '16:30', available: true },
  ];

  // Theme integration
  const primaryColor = theme?.branding?.primaryColor || theme?.button?.backgroundColor || '#6366f1';
  const titleFont = theme?.typography?.titleFont || 'inter';
  const bodyFont = theme?.typography?.bodyFont || 'inter';
  const titleFontFamily = FONT_FAMILY_MAP[titleFont] || "'Inter', sans-serif";
  const bodyFontFamily = FONT_FAMILY_MAP[bodyFont] || "'Inter', sans-serif";
  
  const isDark = isDarkBackground(theme);
  const titleColor = theme?.typography?.titleColor || (isDark ? '#ffffff' : '#18181b');
  const bodyColor = theme?.typography?.bodyColor || (isDark ? '#a1a1aa' : '#71717a');
  const cardBg = isDark ? 'rgba(255,255,255,0.06)' : '#ffffff';
  const cardBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';

  // Calendar days
  const days = useMemo(() => getDaysInMonth(currentYear, currentMonth), [currentYear, currentMonth]);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isPast = (date: Date) => {
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return date < todayStart;
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth;
  };

  const isSelected = (date: Date) => {
    return selectedDate?.toDateString() === date.toDateString();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const handleDateSelect = (date: Date) => {
    if (!isPast(date)) {
      setSelectedDate(date);
      setSelectedTime(null);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !selectedService) return;
    
    // Validate customer info
    if (!customerName.trim()) {
      alert('Please enter your name');
      return;
    }
    
    if (!customerEmail.trim()) {
      alert('Please enter your email address');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      alert('Please enter a valid email address');
      return;
    }
    
    const service = services.find(s => s.id === selectedService);
    if (!service) return;
    
    setIsSubmitting(true);
    
    try {
      const appointmentDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':').map(Number);
      appointmentDateTime.setHours(hours, minutes);
      
      // Prepare appointment data
      const appointmentData: AppointmentData = {
        micrositeId: (content.micrositeId as string) || 'demo-microsite',
        creatorId: (content.creatorId as string) || 'demo-creator',
        customerName: customerName || 'Guest',
        customerEmail: customerEmail || 'guest@example.com',
        customerPhone: customerPhone || undefined,
        serviceId: service.id,
        serviceName: service.name,
        serviceType: service.icon || 'default',
        duration: service.duration,
        price: service.price || 0,
        appointmentDate: appointmentDateTime.toISOString(),
        appointmentTime: selectedTime,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        calendarType: service.calendarType,
        notes: customerNotes || undefined,
        metadata: {
          blockId: block.id,
          serviceDescription: service.description,
        }
      };
      
      // If service requires payment, initiate pre-authorization first
      if (service.requiresPayment && service.price && service.price > 0) {
        await quickPurchase({
          id: `appointment-${service.id}-${appointmentDateTime.getTime()}`,
          type: 'appointment',
          name: service.name,
          price: service.price,
          currency: 'USD',
          description: `${service.duration}-minute ${service.name} on ${appointmentDateTime.toLocaleDateString()} at ${formatTime(selectedTime)}`,
          metadata: {
            ...appointmentData,
            paymentPreAuth: true,
          }
        }, {
          creatorId: appointmentData.creatorId,
          micrositeId: appointmentData.micrositeId,
          appointmentDate: appointmentData.appointmentDate,
          appointmentTime: appointmentData.appointmentTime,
        });
        
        // Payment successful, proceed with booking
        const response = await createAppointment(appointmentData);
        console.log('Paid appointment created:', response);
      } else {
        // Free appointment, create directly
        const response = await createAppointment(appointmentData);
        console.log('Free appointment created:', response);
      }
      
      // Show success message and calendar export options
      setShowCalendarOptions(true);
      
    } catch (error) {
      console.error('Error booking appointment:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to book appointment. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addToCalendar = (calendarType: 'google' | 'outlook' | 'apple') => {
    if (!selectedDate || !selectedTime || !selectedService) return;
    
    const service = services.find(s => s.id === selectedService);
    if (!service) return;
    
    const startDateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':').map(Number);
    startDateTime.setHours(hours, minutes);
    
    const endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + service.duration);
    
    const formatDateTime = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    const title = encodeURIComponent(service.name);
    const description = encodeURIComponent(service.description || '');
    const start = formatDateTime(startDateTime);
    const end = formatDateTime(endDateTime);
    
    let calendarUrl = '';
    
    switch (calendarType) {
      case 'google':
        calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${description}&dates=${start}/${end}`;
        break;
      case 'outlook':
        calendarUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&body=${description}&startdt=${start}&enddt=${end}`;
        break;
      case 'apple': {
        // Generate ICS file
        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${start}
DTEND:${end}
SUMMARY:${service.name}
DESCRIPTION:${service.description || ''}
END:VEVENT
END:VCALENDAR`;
        const blob = new Blob([icsContent], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'appointment.ics';
        link.click();
        URL.revokeObjectURL(url);
        return;
      }
    }
    
    if (calendarUrl) {
      window.open(calendarUrl, '_blank');
    }
  };

  const getServiceIcon = (icon?: string) => {
    switch (icon) {
      case 'video': return <Video className="w-5 h-5" />;
      case 'phone': return <Phone className="w-5 h-5" />;
      case 'location': return <MapPin className="w-5 h-5" />;
      case 'zoom': return <ZoomIcon className="w-5 h-5" style={{ color: BrandColors.zoom }} />;
      case 'teams': return <TeamsIcon className="w-5 h-5" style={{ color: BrandColors.teams }} />;
      default: return <Calendar className="w-5 h-5" />;
    }
  };

  const getCalendarIcon = (calendarType?: string) => {
    switch (calendarType) {
      case 'google': return <GoogleCalendarIcon className="w-5 h-5" style={{ color: BrandColors.googleCalendar }} />;
      case 'outlook': return <OutlookIcon className="w-5 h-5" style={{ color: BrandColors.outlook }} />;
      case 'apple': return <AppleCalendarIcon className="w-5 h-5" style={{ color: BrandColors.appleCalendar }} />;
      case 'calendly': return <CalendlyIcon className="w-5 h-5" style={{ color: BrandColors.calendly }} />;
      default: return <CalendarDays className="w-5 h-5" />;
    }
  };

  // Safety check
  if (!block) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Loading booking calendar...</p>
      </div>
    );
  }

  // ===== EMBEDDED STYLE (Calendly-like) =====
  if (style === 'embedded' && calendlyUrl) {
    return (
      <div className="py-6">
        <div className="text-center mb-6">
          <h2 
            className="text-xl font-bold mb-2"
            style={{ fontFamily: titleFontFamily, color: titleColor }}
          >
            {title}
          </h2>
          <p style={{ fontFamily: bodyFontFamily, color: bodyColor }}>{subtitle}</p>
        </div>
        
        <motion.a
          href={calendlyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold text-white"
          style={{ backgroundColor: primaryColor }}
          whileHover={{ scale: 1.02, boxShadow: `0 10px 30px ${primaryColor}40` }}
          whileTap={{ scale: 0.98 }}
        >
          <CalendarCheck className="w-5 h-5" />
          <span>Schedule with Calendly</span>
          <ExternalLink className="w-4 h-4 ml-1" />
        </motion.a>
      </div>
    );
  }

  // ===== MINIMAL STYLE =====
  if (style === 'minimal') {
    return (
      <div className="py-6">
        <div className="text-center mb-6">
          <div 
            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: `${primaryColor}15` }}
          >
            <CalendarDays className="w-8 h-8" style={{ color: primaryColor }} />
          </div>
          <h2 
            className="text-xl font-bold mb-2"
            style={{ fontFamily: titleFontFamily, color: titleColor }}
          >
            {title}
          </h2>
          <p className="text-sm" style={{ fontFamily: bodyFontFamily, color: bodyColor }}>
            {subtitle}
          </p>
        </div>
        
        {/* Quick time slots */}
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: bodyColor }}>
            Next Available
          </p>
          
          {['Today, 2:00 PM', 'Today, 4:30 PM', 'Tomorrow, 10:00 AM', 'Tomorrow, 2:00 PM'].map((slot, idx) => (
            <motion.button
              key={idx}
              className="w-full flex items-center justify-between p-4 rounded-xl transition-all"
              style={{
                backgroundColor: cardBg,
                border: `1px solid ${cardBorder}`,
              }}
              whileHover={{ 
                borderColor: primaryColor,
                backgroundColor: `${primaryColor}08`,
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5" style={{ color: primaryColor }} />
                <span className="font-medium" style={{ color: titleColor }}>{slot}</span>
              </div>
              <ChevronRight className="w-5 h-5" style={{ color: bodyColor }} />
            </motion.button>
          ))}
        </div>
        
        <button 
          className="w-full mt-4 py-3 text-sm font-medium rounded-xl transition-colors"
          style={{ color: primaryColor }}
        >
          View all available times →
        </button>
      </div>
    );
  }

  // ===== CARDS STYLE (Service Selection) =====
  if (style === 'cards') {
    return (
      <div className="py-6">
        <div className="text-center mb-6">
          <h2 
            className="text-xl font-bold mb-2"
            style={{ fontFamily: titleFontFamily, color: titleColor }}
          >
            {title}
          </h2>
          <p style={{ fontFamily: bodyFontFamily, color: bodyColor }}>{subtitle}</p>
        </div>
        
        <div className="space-y-4">
          {services.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="rounded-2xl overflow-hidden cursor-pointer"
              style={{
                backgroundColor: cardBg,
                border: `2px solid ${selectedService === service.id ? primaryColor : cardBorder}`,
              }}
              onClick={() => setSelectedService(service.id)}
              whileHover={{ y: -2 }}
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                  >
                    {getServiceIcon(service.icon)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 
                        className="font-bold"
                        style={{ fontFamily: titleFontFamily, color: titleColor }}
                      >
                        {service.name}
                      </h3>
                      {/* Calendar integration badge */}
                      {service.calendarType && (
                        <div className="flex items-center gap-1">
                          {getCalendarIcon(service.calendarType)}
                        </div>
                      )}
                    </div>
                    
                    {service.description && (
                      <p className="text-sm mb-2" style={{ color: bodyColor }}>
                        {service.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm flex items-center gap-1" style={{ color: bodyColor }}>
                        <Timer className="w-4 h-4" />
                        {service.duration} min
                      </span>
                      {service.price !== undefined && (
                        <span className="font-semibold" style={{ color: primaryColor }}>
                          {service.price === 0 ? 'Free' : `$${service.price}`}
                        </span>
                      )}
                      
                      {/* Payment required indicator */}
                      {service.requiresPayment && service.price && service.price > 0 && (
                        <span 
                          className="text-xs flex items-center gap-1 px-2 py-1 rounded-full"
                          style={{ 
                            backgroundColor: `${primaryColor}10`,
                            color: primaryColor,
                          }}
                        >
                          <CreditCard className="w-3 h-3" />
                          Pre-auth
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div 
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedService === service.id ? 'border-transparent' : ''
                    }`}
                    style={{ 
                      borderColor: selectedService === service.id ? 'transparent' : cardBorder,
                      backgroundColor: selectedService === service.id ? primaryColor : 'transparent',
                    }}
                  >
                    {selectedService === service.id && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {selectedService && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full mt-6 py-4 rounded-xl font-semibold text-white"
            style={{ backgroundColor: primaryColor }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Continue to Select Time
          </motion.button>
        )}
      </div>
    );
  }

  // ===== LIST STYLE =====
  if (style === 'list') {
    const upcomingDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return date;
    });

    return (
      <div className="py-6">
        <div className="mb-6">
          <h2 
            className="text-xl font-bold mb-2"
            style={{ fontFamily: titleFontFamily, color: titleColor }}
          >
            {title}
          </h2>
          <p style={{ fontFamily: bodyFontFamily, color: bodyColor }}>{subtitle}</p>
        </div>
        
        {/* Day selector */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 -mx-2 px-2">
          {upcomingDays.map((date, idx) => {
            const isDateSelected = selectedDate?.toDateString() === date.toDateString();
            const dayName = idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : dayNames[date.getDay()];
            
            return (
              <motion.button
                key={idx}
                onClick={() => {
                  setSelectedDate(date);
                  setSelectedTime(null);
                }}
                className="flex flex-col items-center min-w-[70px] py-3 px-4 rounded-xl transition-all"
                style={{
                  backgroundColor: isDateSelected ? primaryColor : cardBg,
                  border: `1px solid ${isDateSelected ? primaryColor : cardBorder}`,
                  color: isDateSelected ? '#ffffff' : titleColor,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-xs font-medium opacity-70">{dayName}</span>
                <span className="text-lg font-bold">{date.getDate()}</span>
              </motion.button>
            );
          })}
        </div>
        
        {/* Time slots */}
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm font-medium mb-3" style={{ color: bodyColor }}>
              Available times for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
            
            <div className="grid grid-cols-3 gap-2">
              {availableSlots.filter(s => s.available).map((slot, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => handleTimeSelect(slot.time)}
                  className="py-3 rounded-lg font-medium text-sm transition-all"
                  style={{
                    backgroundColor: selectedTime === slot.time ? primaryColor : `${primaryColor}10`,
                    color: selectedTime === slot.time ? '#ffffff' : primaryColor,
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {formatTime(slot.time)}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Confirm button */}
        {selectedDate && selectedTime && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full mt-6 py-4 rounded-xl font-semibold text-white"
            style={{ backgroundColor: primaryColor }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Confirm Booking
          </motion.button>
        )}
      </div>
    );
  }

  // ===== CALENDAR STYLE (Default) =====
  return (
    <div className="py-6">
      <div className="text-center mb-6">
        <h2 
          className="text-xl font-bold mb-2"
          style={{ fontFamily: titleFontFamily, color: titleColor }}
        >
          {title}
        </h2>
        <p style={{ fontFamily: bodyFontFamily, color: bodyColor }}>{subtitle}</p>
      </div>

      <div 
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: cardBg,
          border: `1px solid ${cardBorder}`,
        }}
      >
        {/* Calendar Header */}
        <div 
          className="flex items-center justify-between p-4"
          style={{ borderBottom: `1px solid ${cardBorder}` }}
        >
          <button 
            onClick={() => navigateMonth('prev')}
            className="p-2 rounded-lg hover:bg-black/5 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" style={{ color: titleColor }} />
          </button>
          
          <h3 className="font-bold" style={{ color: titleColor }}>
            {monthNames[currentMonth]} {currentYear}
          </h3>
          
          <button 
            onClick={() => navigateMonth('next')}
            className="p-2 rounded-lg hover:bg-black/5 transition-colors"
          >
            <ChevronRight className="w-5 h-5" style={{ color: titleColor }} />
          </button>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 px-2">
          {dayNames.map(day => (
            <div 
              key={day}
              className="py-3 text-center text-xs font-semibold"
              style={{ color: bodyColor }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1 p-2">
          {days.map((date, idx) => {
            const past = isPast(date);
            const current = isCurrentMonth(date);
            const todayDate = isToday(date);
            const selected = isSelected(date);
            
            return (
              <motion.button
                key={idx}
                onClick={() => handleDateSelect(date)}
                disabled={past}
                className={`
                  relative aspect-square rounded-lg flex items-center justify-center text-sm font-medium
                  transition-all disabled:cursor-not-allowed
                `}
                style={{
                  backgroundColor: selected ? primaryColor : todayDate ? `${primaryColor}15` : 'transparent',
                  color: selected 
                    ? '#ffffff' 
                    : past 
                      ? `${bodyColor}50`
                      : current 
                        ? titleColor 
                        : `${bodyColor}50`,
                }}
                whileHover={!past ? { scale: 1.1, backgroundColor: selected ? primaryColor : `${primaryColor}20` } : {}}
                whileTap={!past ? { scale: 0.95 } : {}}
              >
                {date.getDate()}
                {todayDate && !selected && (
                  <div 
                    className="absolute bottom-1 w-1 h-1 rounded-full"
                    style={{ backgroundColor: primaryColor }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Selected date & time slots */}
        <AnimatePresence>
          {selectedDate && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
              style={{ borderTop: `1px solid ${cardBorder}` }}
            >
              <div className="p-4">
                <p className="text-sm font-medium mb-3" style={{ color: titleColor }}>
                  Available times for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </p>
                
                <div className="grid grid-cols-4 gap-2">
                  {availableSlots.map((slot, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => slot.available && handleTimeSelect(slot.time)}
                      disabled={!slot.available}
                      className={`
                        py-2 rounded-lg text-xs font-medium transition-all
                        disabled:opacity-40 disabled:cursor-not-allowed
                      `}
                      style={{
                        backgroundColor: selectedTime === slot.time 
                          ? primaryColor 
                          : slot.available 
                            ? `${primaryColor}10` 
                            : `${bodyColor}10`,
                        color: selectedTime === slot.time 
                          ? '#ffffff' 
                          : slot.available 
                            ? primaryColor 
                            : bodyColor,
                      }}
                      whileHover={slot.available ? { scale: 1.05 } : {}}
                      whileTap={slot.available ? { scale: 0.95 } : {}}
                    >
                      {formatTime(slot.time)}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Customer Info Form */}
      {selectedDate && selectedTime && selectedService && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-6 rounded-2xl space-y-4"
          style={{
            backgroundColor: cardBg,
            border: `1px solid ${cardBorder}`,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${primaryColor}15` }}
            >
              <User className="w-5 h-5" style={{ color: primaryColor }} />
            </div>
            <div>
              <h3 className="font-bold text-lg" style={{ color: titleColor }}>
                Your Information
              </h3>
              <p className="text-xs" style={{ color: bodyColor }}>
                Required to confirm your appointment
              </p>
            </div>
          </div>
          
          <div className="space-y-4 pt-2">
            {/* Name Input */}
            <div className="group">
              <label className="block text-sm font-semibold mb-2" style={{ color: titleColor }}>
                Full Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-all focus:outline-none"
                  style={{
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                    border: `2px solid ${cardBorder}`,
                    color: titleColor,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = primaryColor;
                    e.target.style.boxShadow = `0 0 0 4px ${primaryColor}15`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = cardBorder;
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="group">
              <label className="block text-sm font-semibold mb-2" style={{ color: titleColor }}>
                Email Address <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  className="w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-all focus:outline-none"
                  style={{
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                    border: `2px solid ${cardBorder}`,
                    color: titleColor,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = primaryColor;
                    e.target.style.boxShadow = `0 0 0 4px ${primaryColor}15`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = cardBorder;
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Phone Input */}
            <div className="group">
              <label className="block text-sm font-semibold mb-2" style={{ color: titleColor }}>
                Phone Number 
                <span className="text-xs font-normal ml-2" style={{ color: bodyColor }}>
                  (optional)
                </span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-all focus:outline-none"
                  style={{
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                    border: `2px solid ${cardBorder}`,
                    color: titleColor,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = primaryColor;
                    e.target.style.boxShadow = `0 0 0 4px ${primaryColor}15`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = cardBorder;
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Notes Input */}
            <div className="group">
              <label className="block text-sm font-semibold mb-2" style={{ color: titleColor }}>
                Additional Notes
                <span className="text-xs font-normal ml-2" style={{ color: bodyColor }}>
                  (optional)
                </span>
              </label>
              <textarea
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="Any special requests or topics you'd like to discuss?"
                rows={3}
                className="w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-all focus:outline-none resize-none"
                style={{
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                  border: `2px solid ${cardBorder}`,
                  color: titleColor,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = primaryColor;
                  e.target.style.boxShadow = `0 0 0 4px ${primaryColor}15`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = cardBorder;
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Timezone display */}
            <div 
              className="flex items-center gap-2 text-xs p-3 rounded-lg"
              style={{ backgroundColor: `${primaryColor}08`, color: bodyColor }}
            >
              <Clock className="w-4 h-4" style={{ color: primaryColor }} />
              <span>
                Timezone: <span className="font-semibold" style={{ color: titleColor }}>
                  {Intl.DateTimeFormat().resolvedOptions().timeZone}
                </span>
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Confirm button */}
      {selectedDate && selectedTime && selectedService && customerName && customerEmail && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 space-y-4"
        >
          {/* Service summary with payment indicator */}
          <div 
            className="p-5 rounded-2xl"
            style={{
              backgroundColor: cardBg,
              border: `2px solid ${cardBorder}`,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
            {(() => {
              const service = services.find(s => s.id === selectedService);
              if (!service) return null;
              
              return (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${primaryColor}15` }}
                    >
                      {getServiceIcon(service.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-base mb-1" style={{ color: titleColor }}>
                        {service.name}
                      </h4>
                      <div className="flex items-center gap-2 text-sm" style={{ color: bodyColor }}>
                        <Clock className="w-4 h-4" />
                        <span>{service.duration} min</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      {service.price !== undefined && service.price > 0 ? (
                        <div className="font-bold text-2xl" style={{ color: primaryColor }}>
                          ${service.price}
                        </div>
                      ) : (
                        <div className="px-3 py-1 rounded-full text-xs font-bold" style={{ 
                          backgroundColor: '#10b98115',
                          color: '#10b981'
                        }}>
                          FREE
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Appointment details */}
                  <div 
                    className="p-3 rounded-xl space-y-2"
                    style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4" style={{ color: primaryColor }} />
                      <span style={{ color: titleColor }}>
                        {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Timer className="w-4 h-4" style={{ color: primaryColor }} />
                      <span style={{ color: titleColor }}>
                        {formatTime(selectedTime)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Payment pre-auth indicator */}
                  {service.requiresPayment && service.price && service.price > 0 && (
                    <div 
                      className="flex items-start gap-3 text-xs p-3 rounded-xl"
                      style={{ 
                        backgroundColor: `${primaryColor}10`, 
                        border: `1px solid ${primaryColor}30`
                      }}
                    >
                      <CreditCard className="w-5 h-5 mt-0.5 shrink-0" style={{ color: primaryColor }} />
                      <div>
                        <div className="font-semibold mb-1" style={{ color: titleColor }}>
                          Payment Authorization Required
                        </div>
                        <div style={{ color: bodyColor }}>
                          We'll pre-authorize ${service.price} on your card. You won't be charged until after your appointment is completed.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
          
          {/* Book button - Large and prominent */}
          <motion.button
            onClick={handleSubmit}
            disabled={isSubmitting || isCheckoutLoading}
            className="w-full py-5 rounded-2xl font-bold text-lg text-white flex items-center justify-center gap-3 shadow-lg"
            style={{ 
              backgroundColor: primaryColor,
              boxShadow: `0 10px 25px -5px ${primaryColor}50`
            }}
            whileHover={{ 
              scale: 1.02, 
              boxShadow: `0 20px 35px -5px ${primaryColor}60`,
              y: -2
            }}
            whileTap={{ scale: 0.98, y: 0 }}
          >
            {isSubmitting || isCheckoutLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                {(() => {
                  const service = services.find(s => s.id === selectedService);
                  return service?.requiresPayment && service.price && service.price > 0 ? (
                    <>
                      <CreditCard className="w-6 h-6" />
                      <span>Authorize ${service.price} & Confirm Booking</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-6 h-6" />
                      <span>Confirm Appointment</span>
                    </>
                  );
                })()}
              </>
            )}
          </motion.button>
          
          {/* Trust indicators */}
          <div 
            className="flex items-center justify-center gap-2 text-xs"
            style={{ color: bodyColor }}
          >
            <Check className="w-4 h-4" style={{ color: '#10b981' }} />
            <span>Instant confirmation • Free cancellation up to 24h before</span>
          </div>
        </motion.div>
      )}
      
      {/* Calendar export modal (shown after successful booking) */}
      <AnimatePresence>
        {showCalendarOptions && selectedDate && selectedTime && selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCalendarOptions(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md w-full rounded-2xl p-6"
              style={{ backgroundColor: isDark ? '#18181b' : '#ffffff' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Success message */}
              <div className="text-center mb-6">
                <div 
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `${BrandColors.googleCalendar}15` }}
                >
                  <Check className="w-8 h-8" style={{ color: BrandColors.googleCalendar }} />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: titleColor }}>
                  Booking Confirmed!
                </h3>
                <p className="text-sm" style={{ color: bodyColor }}>
                  Add this appointment to your calendar
                </p>
              </div>
              
              {/* Calendar integration buttons */}
              <div className="space-y-3">
                <motion.button
                  onClick={() => addToCalendar('google')}
                  className="w-full flex items-center gap-3 p-4 rounded-xl transition-all"
                  style={{
                    backgroundColor: cardBg,
                    border: `1px solid ${cardBorder}`,
                  }}
                  whileHover={{ 
                    borderColor: BrandColors.googleCalendar,
                    backgroundColor: `${BrandColors.googleCalendar}08`,
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <GoogleCalendarIcon className="w-6 h-6" style={{ color: BrandColors.googleCalendar }} />
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-sm" style={{ color: titleColor }}>Google Calendar</div>
                    <div className="text-xs" style={{ color: bodyColor }}>Add to Google Calendar</div>
                  </div>
                  <ChevronRight className="w-5 h-5" style={{ color: bodyColor }} />
                </motion.button>
                
                <motion.button
                  onClick={() => addToCalendar('outlook')}
                  className="w-full flex items-center gap-3 p-4 rounded-xl transition-all"
                  style={{
                    backgroundColor: cardBg,
                    border: `1px solid ${cardBorder}`,
                  }}
                  whileHover={{ 
                    borderColor: BrandColors.outlook,
                    backgroundColor: `${BrandColors.outlook}08`,
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <OutlookIcon className="w-6 h-6" style={{ color: BrandColors.outlook }} />
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-sm" style={{ color: titleColor }}>Outlook</div>
                    <div className="text-xs" style={{ color: bodyColor }}>Add to Outlook Calendar</div>
                  </div>
                  <ChevronRight className="w-5 h-5" style={{ color: bodyColor }} />
                </motion.button>
                
                <motion.button
                  onClick={() => addToCalendar('apple')}
                  className="w-full flex items-center gap-3 p-4 rounded-xl transition-all"
                  style={{
                    backgroundColor: cardBg,
                    border: `1px solid ${cardBorder}`,
                  }}
                  whileHover={{ 
                    borderColor: BrandColors.appleCalendar,
                    backgroundColor: `${BrandColors.appleCalendar}08`,
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <AppleCalendarIcon className="w-6 h-6" style={{ color: BrandColors.appleCalendar }} />
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-sm" style={{ color: titleColor }}>Apple Calendar</div>
                    <div className="text-xs" style={{ color: bodyColor }}>Download .ics file</div>
                  </div>
                  <ChevronRight className="w-5 h-5" style={{ color: bodyColor }} />
                </motion.button>
              </div>
              
              {/* Close button */}
              <button
                onClick={() => setShowCalendarOptions(false)}
                className="w-full mt-4 py-3 text-sm font-medium rounded-xl transition-colors"
                style={{
                  color: bodyColor,
                  backgroundColor: `${bodyColor}10`,
                }}
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
