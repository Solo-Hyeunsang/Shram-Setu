// Shram Setu — Verification API module (stub)
import { supabase } from './supabaseClient';

export async function submitVerificationRequest(workerId, institutionId) {
  const { data, error } = await supabase.from('verification_requests').insert({
    worker_id: workerId,
    institution_id: institutionId,
    status: 'pending',
  });
  return { data, error };
}

export async function getMyVerificationRequests(workerId) {
  const { data, error } = await supabase
    .from('verification_requests')
    .select('*')
    .eq('worker_id', workerId)
    .order('created_at', { ascending: false });
  return { data, error };
}

// Prototype: resolve CTEVT as the only institution
export async function getCtevtInstitution() {
  const { data, error } = await supabase
    .from('institutions')
    .select('id')
    .eq('slug', 'ctevt')
    .eq('is_active', true)
    .single();
  return { data, error };
}
