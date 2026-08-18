// Shram Setu — Worker API module (stub)
import { supabase } from './supabaseClient';

export async function getWorkerProfile(workerId) {
  const { data, error } = await supabase
    .from('profiles')
    .select(`*, worker_profiles (*), worker_skills (*), certifications (*), portfolio_items (*)`)
    .eq('id', workerId)
    .single();
  return { data, error };
}

export async function searchWorkers(filters = {}) {
  let query = supabase
    .from('worker_profiles')
    .select(`*, profiles!inner (id, full_name, avatar_url, district, municipality, is_suspended), worker_skills (skill_name, trade_id)`)
    .eq('profiles.is_suspended', false);

  if (filters.trade) query = query.eq('primary_trade', filters.trade);
  if (filters.verification) query = query.eq('verification_status', filters.verification);
  if (filters.availability) query = query.eq('availability', filters.availability);
  if (filters.minExp != null) query = query.gte('years_experience', filters.minExp);
  if (filters.minRating != null) query = query.gte('average_rating', filters.minRating);
  if (filters.district) query = query.eq('profiles.district', filters.district);

  const { data, error } = await query.order('average_rating', { ascending: false });
  return { data, error };
}

export async function updateWorkerProfile(userId, updates) {
  const { data, error } = await supabase
    .from('worker_profiles')
    .update(updates)
    .eq('id', userId);
  return { data, error };
}
