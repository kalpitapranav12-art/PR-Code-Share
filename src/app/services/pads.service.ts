import { Injectable } from '@angular/core';
import { supabase } from '../lib/supabase';

@Injectable({ providedIn: 'root' })
export class PadsService {
  
  // Create a new pad
  async createPad(content: string) {
    const { data, error } = await supabase
      .from('pads')
      .insert({ content })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get an existing pad by ID
  async getPad(id: string) {
    const { data, error } = await supabase
      .from('pads')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  // Update pad content
  async updatePad(id: string, content: string) {
    const { error } = await supabase
      .from('pads')
      .update({ content })
      .eq('id', id);

    if (error) throw error;
  }

  // Subscribe to real-time changes for a pad
  subscribePad(id: string, callback: (content: string) => void) {
    return supabase
      .channel(`pad-${id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'pads',
          filter: `id=eq.${id}`
        },
        payload => {
          callback(payload.new['content']);
        }
      )
      .subscribe();
  }

  // Remove a real-time subscription
  removeSubscription(subscription: any) {
    supabase.removeChannel(subscription);
  }
}
