// Shram Setu — Employer API module (stub)
import { supabase } from './supabaseClient';

export async function getEmployerProfile(employerId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, employer_profiles (*)')
    .eq('id', employerId)
    .single();
  return { data, error };
}

export async function createEmployerProfile(userId, profile) {
  const { data, error } = await supabase.from('employer_profiles').insert({
    id: userId,
    ...profile,
  });
  return { data, error };
}
