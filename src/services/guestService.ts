import { supabase } from '@/lib/supabase';
import type { Guest } from '@/types';
import { guestSchema } from '@/lib/validators';

class GuestService {
  /**
   * Fetch all guests for an event
   */
  async getEventGuests(eventId: string): Promise<Guest[]> {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('eventId', eventId)
        .order('createdAt', { ascending: false });

      if (error) throw error;
      return (data as Guest[]) || [];
    } catch (error) {
      console.error('Error fetching guests:', error);
      return [];
    }
  }

  /**
   * Search for a guest by name and email
   */
  async searchGuest(eventId: string, fullName: string, email?: string): Promise<Guest | null> {
    try {
      let query = supabase
        .from('guests')
        .select('*')
        .eq('eventId', eventId)
        .ilike('fullName', `%${fullName}%`);

      if (email) {
        query = query.ilike('email', `%${email}%`);
      }

      const { data, error } = await query.single();

      if (error && error.code !== 'PGRST116') throw error;
      return (data as Guest) || null;
    } catch (error) {
      console.error('Error searching guest:', error);
      return null;
    }
  }

  /**
   * Get a single guest by ID
   */
  async getGuest(guestId: string): Promise<Guest | null> {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('id', guestId)
        .single();

      if (error) throw error;
      return (data as Guest) || null;
    } catch (error) {
      console.error('Error fetching guest:', error);
      return null;
    }
  }

  /**
   * Create a new guest
   */
  async createGuest(guestData: Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const validatedData = guestSchema.omit({ id: true, createdAt: true, updatedAt: true }).parse(guestData);

      const { data, error } = await supabase
        .from('guests')
        .insert([validatedData])
        .select()
        .single();

      if (error) throw error;
      return data as Guest;
    } catch (error) {
      console.error('Error creating guest:', error);
      throw error;
    }
  }

  /**
   * Update a guest
   */
  async updateGuest(guestId: string, updates: Partial<Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>>) {
    try {
      const { data, error } = await supabase
        .from('guests')
        .update(updates)
        .eq('id', guestId)
        .select()
        .single();

      if (error) throw error;
      return data as Guest;
    } catch (error) {
      console.error('Error updating guest:', error);
      throw error;
    }
  }

  /**
   * Send invitation to guest
   */
  async sendInvitation(guestId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('guests')
        .update({ invitationSentAt: new Date().toISOString() })
        .eq('id', guestId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error sending invitation:', error);
      return false;
    }
  }

  /**
   * Send reminder to guest
   */
  async sendReminder(guestId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('guests')
        .update({ lastReminderSentAt: new Date().toISOString() })
        .eq('id', guestId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error sending reminder:', error);
      return false;
    }
  }

  /**
   * Delete a guest
   */
  async deleteGuest(guestId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', guestId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting guest:', error);
      return false;
    }
  }

  /**
   * Get guest statistics for an event
   */
  async getGuestStatistics(eventId: string) {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('eventId', eventId);

      if (error) throw error;

      const guests = (data as Guest[]) || [];
      const invited = guests.filter((g) => g.invitationSentAt).length;
      const reminded = guests.filter((g) => g.lastReminderSentAt).length;

      return {
        total: guests.length,
        invited,
        reminded,
        notInvited: guests.length - invited,
      };
    } catch (error) {
      console.error('Error getting guest statistics:', error);
      return { total: 0, invited: 0, reminded: 0, notInvited: 0 };
    }
  }
}

export const guestService = new GuestService();
