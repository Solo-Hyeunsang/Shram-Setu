// Shram Setu — Job API module (stub)
import { supabase } from './supabaseClient';

export async function listOpenJobs(filters = {}) {
  let query = supabase
    .from('jobs')
    .select('*, trades (slug, name_en, icon)')
    .in('status', ['open', 'applications_received']);

  if (filters.tradeId) query = query.eq('trade_id', filters.tradeId);
  if (filters.district) query = query.eq('district', filters.district);

  const { data, error } = await query.order('created_at', { ascending: false });
  return { data, error };
}

export async function createJob(job) {
  const { data, error } = await supabase.from('jobs').insert({ ...job, status: 'open' });
  return { data, error };
}

export async function applyToJob(jobId, workerId, message) {
  const { data, error } = await supabase.from('job_applications').insert({
    job_id: jobId,
    worker_id: workerId,
    message,
    status: 'pending',
  });
  return { data, error };
}
