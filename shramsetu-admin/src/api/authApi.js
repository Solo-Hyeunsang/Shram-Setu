// Shram Setu Admin — Auth API
import { supabase } from './supabaseClient';

export async function signInWithPassword(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  return { session: data?.session ?? null, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getUserProfile(userId) {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (profileError) return { data: null, error: profileError };

  // If verifier, also fetch institution membership
  const { data: membership } = await supabase
    .from('institution_members')
    .select('*, institutions (*)')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single();

  return {
    data: {
      ...profile,
      institution_member: membership || null,
    },
    error: null,
  };
}
