// Shram Setu Admin — Admin Operations API
import { supabase } from './supabaseClient';

export async function getPlatformStats() {
  try {
    const results = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'worker'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'employer'),
      supabase.from('jobs').select('*', { count: 'exact', head: true }),
      supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
      supabase.from('worker_profiles').select('*', { count: 'exact', head: true }).eq('verification_status', 'verified'),
    ]);

    return {
      workers: results[0].count ?? 0,
      employers: results[1].count ?? 0,
      jobs: results[2].count ?? 0,
      completedJobs: results[3].count ?? 0,
      verifiedWorkers: results[4].count ?? 0,
    };
  } catch (err) {
    console.error('Failed to fetch platform stats:', err);
    return { workers: 0, employers: 0, jobs: 0, completedJobs: 0, verifiedWorkers: 0 };
  }
}

export async function listUsers(role = 'all', searchQuery = '') {
  let query = supabase
    .from('profiles')
    .select('*, worker_profiles (*), employer_profiles (*)')
    .order('created_at', { ascending: false });

  if (role !== 'all') {
    query = query.eq('role', role);
  }
  if (searchQuery) {
    query = query.ilike('full_name', `%${searchQuery}%`);
  }

  const { data, error } = await query;
  return { data, error };
}

export async function toggleSuspendUser(userId, isSuspended) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ is_suspended: isSuspended })
    .eq('id', userId);
  return { data, error };
}

export async function listAllJobs(status = 'all', district = 'all') {
  let query = supabase
    .from('jobs')
    .select('*, trades (name_en, slug, icon), profiles!employer_id (full_name)')
    .order('created_at', { ascending: false });

  if (status !== 'all') query = query.eq('status', status);
  if (district !== 'all') query = query.eq('district', district);

  const { data, error } = await query;
  return { data, error };
}

export async function cancelJob(jobId) {
  const { data, error } = await supabase
    .from('jobs')
    .update({ status: 'cancelled' })
    .eq('id', jobId);
  return { data, error };
}

export async function deleteReview(reviewId) {
  const { data, error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId);
  return { data, error };
}
