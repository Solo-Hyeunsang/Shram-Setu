// Shram Setu Admin — CTEVT Verification API
import { supabase } from './supabaseClient';

export async function listVerificationQueue(institutionId, status = 'pending') {
  let query = supabase
    .from('verification_requests')
    .select(`
      *,
      worker_profiles!worker_id (
        *,
        profiles (*),
        certifications (*)
      )
    `)
    .order('submitted_at', { ascending: true });

  if (institutionId) {
    query = query.eq('institution_id', institutionId);
  }
  if (status !== 'all') {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  return { data, error };
}

export async function claimVerificationRequest(requestId, reviewerId) {
  const { data, error } = await supabase
    .from('verification_requests')
    .update({
      status: 'in_review',
      reviewer_id: reviewerId,
    })
    .eq('id', requestId);
  return { data, error };
}

export async function approveVerification(requestId, reviewerNotes = '') {
  const { data, error } = await supabase
    .from('verification_requests')
    .update({
      status: 'approved',
      reviewer_notes: reviewerNotes,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', requestId);
  return { data, error };
}

export async function rejectVerification(requestId, rejectionReason, reviewerNotes = '') {
  const { data, error } = await supabase
    .from('verification_requests')
    .update({
      status: 'rejected',
      rejection_reason: rejectionReason,
      reviewer_notes: reviewerNotes,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', requestId);
  return { data, error };
}

export async function requestMoreInfo(requestId, moreInfoMessage, reviewerNotes = '') {
  const { data, error } = await supabase
    .from('verification_requests')
    .update({
      status: 'more_info_needed',
      more_info_message: moreInfoMessage,
      reviewer_notes: reviewerNotes,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', requestId);
  return { data, error };
}

export async function getVerificationAuditTrail(institutionId) {
  let query = supabase
    .from('verification_requests')
    .select(`
      *,
      worker_profiles!worker_id (
        *,
        profiles (*)
      )
    `)
    .in('status', ['approved', 'rejected', 'more_info_needed'])
    .order('reviewed_at', { ascending: false });

  if (institutionId) {
    query = query.eq('institution_id', institutionId);
  }

  const { data, error } = await query;
  return { data, error };
}
