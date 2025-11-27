import { supabase } from '@/lib/supabase';
import type { RSVP, RSVPFormData } from '@/types';
import { rsvpSchema, rsvpFormSchema } from '@/lib/validators';

class RSVPService {
  /**
   * Fetch all RSVPs for an event
   */
  async getEventRSVPs(eventId: string): Promise<RSVP[]> {
    try {
      const { data, error } = await supabase
        .from('rsvps')
        .select('*')
        .eq('eventId', eventId)
        .order('respondedAt', { ascending: false });

      if (error) throw error;
      return (data as RSVP[]) || [];
    } catch (error) {
      console.error('Error fetching RSVPs:', error);
      return [];
    }
  }

  /**
   * Get RSVP count by response
   */
  async getEventRSVPSummary(eventId: string) {
    try {
      const { data, error } = await supabase
        .from('rsvps')
        .select('attending')
        .eq('eventId', eventId);

      if (error) throw error;

      const summary = {
        yes: 0,
        no: 0,
        maybe: 0,
        total: data?.length || 0,
      };

      (data as any[])?.forEach((rsvp) => {
        if (rsvp.attending === 'yes') summary.yes++;
        else if (rsvp.attending === 'no') summary.no++;
        else if (rsvp.attending === 'maybe') summary.maybe++;
      });

      return summary;
    } catch (error) {
      console.error('Error fetching RSVP summary:', error);
      return { yes: 0, no: 0, maybe: 0, total: 0 };
    }
  }

  /**
   * Submit an RSVP
   */
  async submitRSVP(eventId: string, guestId: string, rsvpData: RSVPFormData) {
    try {
      const validatedData = rsvpFormSchema.parse(rsvpData);

      const { data, error } = await supabase
        .from('rsvps')
        .insert([
          {
            eventId,
            guestId,
            ...validatedData,
            respondedAt: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data as RSVP;
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      throw error;
    }
  }

  /**
   * Update an RSVP
   */
  async updateRSVP(rsvpId: string, updates: Partial<RSVPFormData>) {
    try {
      const { data, error } = await supabase
        .from('rsvps')
        .update(updates)
        .eq('id', rsvpId)
        .select()
        .single();

      if (error) throw error;
      return data as RSVP;
    } catch (error) {
      console.error('Error updating RSVP:', error);
      throw error;
    }
  }

  /**
   * Get RSVP by guest and event
   */
  async getGuestRSVP(eventId: string, guestId: string): Promise<RSVP | null> {
    try {
      const { data, error } = await supabase
        .from('rsvps')
        .select('*')
        .eq('eventId', eventId)
        .eq('guestId', guestId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
      return (data as RSVP) || null;
    } catch (error) {
      console.error('Error fetching guest RSVP:', error);
      return null;
    }
  }

  /**
   * Export RSVPs as CSV
   */
  async exportRSVPsAsCSV(eventId: string): Promise<string | null> {
    try {
      const rsvps = await this.getEventRSVPs(eventId);

      if (rsvps.length === 0) return null;

      const headers = ['Full Name', 'Email', 'Phone', 'Attending', 'Party Size', 'Dietary Restrictions', 'Message', 'Responded At'];
      const rows = rsvps.map((rsvp) => [
        rsvp.fullName,
        rsvp.email,
        rsvp.phone || '',
        rsvp.attending,
        rsvp.partySize || '',
        rsvp.dietaryRestrictions || '',
        rsvp.message || '',
        new Date(rsvp.respondedAt).toLocaleDateString(),
      ]);

      const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');

      return csv;
    } catch (error) {
      console.error('Error exporting RSVPs:', error);
      return null;
    }
  }
}

export const rsvpService = new RSVPService();
