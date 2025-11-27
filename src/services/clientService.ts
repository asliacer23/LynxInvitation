import { supabase } from '@/lib/supabase';
import type { Client } from '@/types';
import { clientSchema } from '@/lib/validators';

class ClientService {
  /**
   * Fetch a single client by slug
   */
  async getClientBySlug(slug: string): Promise<Client | null> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data as Client;
    } catch (error) {
      console.error('Error fetching client:', error);
      return null;
    }
  }

  /**
   * Fetch all clients
   */
  async getAllClients(): Promise<Client[]> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) throw error;
      return (data as Client[]) || [];
    } catch (error) {
      console.error('Error fetching clients:', error);
      return [];
    }
  }

  /**
   * Create a new client
   */
  async createClient(clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const validatedData = clientSchema.omit({ id: true, createdAt: true, updatedAt: true }).parse(clientData);

      const { data, error } = await supabase
        .from('clients')
        .insert([validatedData])
        .select()
        .single();

      if (error) throw error;
      return data as Client;
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  }

  /**
   * Update a client
   */
  async updateClient(id: string, updates: Partial<Omit<Client, 'id' | 'createdAt' | 'updatedAt'>>) {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Client;
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  }

  /**
   * Delete a client
   */
  async deleteClient(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting client:', error);
      return false;
    }
  }
}

export const clientService = new ClientService();
