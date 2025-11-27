import { z } from 'zod';

// Client Schema
export const clientSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Client name is required'),
  slug: z.string().min(1, 'Client slug is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Client = z.infer<typeof clientSchema>;

// Event Schema
export const eventSchema = z.object({
  id: z.string().uuid(),
  clientId: z.string().uuid(),
  title: z.string().min(1, 'Event title is required'),
  description: z.string().optional(),
  date: z.date(),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
  venue: z.string().optional(),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  headerImage: z.string().url().optional(),
  dressCode: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Event = z.infer<typeof eventSchema>;

// RSVP Schema
export const rsvpResponseSchema = z.enum(['yes', 'no', 'maybe']);
export type RSVPResponse = z.infer<typeof rsvpResponseSchema>;

export const rsvpSchema = z.object({
  id: z.string().uuid(),
  eventId: z.string().uuid(),
  guestId: z.string().uuid(),
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  attending: rsvpResponseSchema,
  partySize: z.number().min(1, 'Party size must be at least 1').optional(),
  dietaryRestrictions: z.string().optional(),
  message: z.string().max(500, 'Message cannot exceed 500 characters').optional(),
  respondedAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type RSVP = z.infer<typeof rsvpSchema>;

// Guest Schema
export const guestSchema = z.object({
  id: z.string().uuid(),
  eventId: z.string().uuid(),
  fullName: z.string().min(1, 'Guest name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  category: z.enum(['vip', 'regular', 'plus-one']).optional(),
  invitationSentAt: z.date().optional(),
  lastReminderSentAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Guest = z.infer<typeof guestSchema>;

// Gallery Schema
export const gallerySchema = z.object({
  id: z.string().uuid(),
  eventId: z.string().uuid(),
  imageUrl: z.string().url(),
  caption: z.string().optional(),
  order: z.number(),
  createdAt: z.date(),
});

export type Gallery = z.infer<typeof gallerySchema>;

// Gift Schema
export const giftSchema = z.object({
  id: z.string().uuid(),
  eventId: z.string().uuid(),
  type: z.enum(['roses', 'candles', 'treasures', 'billetes']),
  description: z.string(),
  giver: z.string().optional(),
  createdAt: z.date(),
});

export type Gift = z.infer<typeof giftSchema>;

// Form Validation Schemas

// RSVP Form Schema
export const rsvpFormSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  attending: z.enum(['yes', 'no', 'maybe'], {
    errorMap: () => ({ message: 'Please select an attendance option' }),
  }),
  partySize: z.number().min(1, 'Party size must be at least 1').optional(),
  dietaryRestrictions: z.string().optional(),
  message: z.string().max(500, 'Message cannot exceed 500 characters').optional(),
});

export type RSVPFormData = z.infer<typeof rsvpFormSchema>;

// Find Invitation Form Schema
export const findInvitationSchema = z.object({
  fullName: z.string().min(2, 'Please enter your full name'),
});

export type FindInvitationFormData = z.infer<typeof findInvitationSchema>;

// Guest Search Schema
export const guestSearchSchema = z.object({
  fullName: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email required'),
});

export type GuestSearchData = z.infer<typeof guestSearchSchema>;
