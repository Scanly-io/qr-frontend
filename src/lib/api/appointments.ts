/**
 * Appointments API Client
 * Handles all appointment booking and scheduling operations
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const INTEGRATIONS_SERVICE_URL = `${API_BASE_URL}/integrations`;

export interface AppointmentData {
  micrositeId: string;
  creatorId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  serviceId?: string;
  serviceName: string;
  serviceType: string;
  duration: number;
  price?: number;
  appointmentDate: string; // ISO string
  appointmentTime: string; // "14:00" format
  notes?: string;
  timezone?: string;
  calendarType?: 'google' | 'outlook' | 'apple' | 'calendly';
  metadata?: Record<string, unknown>;
}

export interface Appointment {
  id: string;
  micrositeId: string;
  creatorId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  serviceId?: string;
  serviceName: string;
  serviceType: string;
  duration: number;
  price: string;
  appointmentDate: string;
  appointmentTime: string;
  timezone: string;
  status: 'confirmed' | 'canceled' | 'completed' | 'no_show';
  paymentStatus: 'not_required' | 'pending' | 'paid' | 'refunded';
  canceledAt?: string;
  canceledBy?: string;
  cancelReason?: string;
  notes?: string;
  calendarType?: string;
  meetingLink?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentResponse {
  success: boolean;
  appointment: {
    id: string;
    serviceName: string;
    appointmentDate: string;
    appointmentTime: string;
    duration: number;
    status: string;
    confirmationCode: string;
  };
}

export interface AvailabilityResponse {
  success: boolean;
  date: string;
  bookedTimes: string[];
  availableSlots: string[];
}

/**
 * Create a new appointment
 */
export async function createAppointment(data: AppointmentData): Promise<CreateAppointmentResponse> {
  try {
    const response = await fetch(`${INTEGRATIONS_SERVICE_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || error.error || 'Failed to create appointment');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
}

/**
 * Get appointment by ID
 */
export async function getAppointment(id: string): Promise<Appointment> {
  try {
    const response = await fetch(`${INTEGRATIONS_SERVICE_URL}/appointments/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch appointment');
    }

    const data = await response.json();
    return data.appointment;
  } catch (error) {
    console.error('Error fetching appointment:', error);
    throw error;
  }
}

/**
 * Get all appointments for a creator
 */
export async function getCreatorAppointments(
  creatorId: string,
  options?: {
    startDate?: string;
    endDate?: string;
    status?: string;
  }
): Promise<Appointment[]> {
  try {
    const params = new URLSearchParams();
    if (options?.startDate) params.append('startDate', options.startDate);
    if (options?.endDate) params.append('endDate', options.endDate);
    if (options?.status) params.append('status', options.status);

    const queryString = params.toString();
    const url = `${INTEGRATIONS_SERVICE_URL}/appointments/creator/${creatorId}${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch creator appointments');
    }

    const data = await response.json();
    return data.appointments;
  } catch (error) {
    console.error('Error fetching creator appointments:', error);
    throw error;
  }
}

/**
 * Cancel an appointment
 */
export async function cancelAppointment(
  id: string,
  canceledBy: 'customer' | 'creator' | 'system',
  cancelReason?: string
): Promise<Appointment> {
  try {
    const response = await fetch(`${INTEGRATIONS_SERVICE_URL}/appointments/${id}/cancel`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ canceledBy, cancelReason }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to cancel appointment');
    }

    const data = await response.json();
    return data.appointment;
  } catch (error) {
    console.error('Error canceling appointment:', error);
    throw error;
  }
}

/**
 * Reschedule an appointment
 */
export async function rescheduleAppointment(
  id: string,
  appointmentDate: string,
  appointmentTime: string,
  reason?: string
): Promise<Appointment> {
  try {
    const response = await fetch(`${INTEGRATIONS_SERVICE_URL}/appointments/${id}/reschedule`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ appointmentDate, appointmentTime, reason }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to reschedule appointment');
    }

    const data = await response.json();
    return data.appointment;
  } catch (error) {
    console.error('Error rescheduling appointment:', error);
    throw error;
  }
}

/**
 * Check availability for a specific date
 */
export async function checkAvailability(
  creatorId: string,
  date: string
): Promise<AvailabilityResponse> {
  try {
    const response = await fetch(
      `${INTEGRATIONS_SERVICE_URL}/appointments/availability/${creatorId}?date=${date}`
    );

    if (!response.ok) {
      throw new Error('Failed to check availability');
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking availability:', error);
    throw error;
  }
}
