// Shram Setu Admin — Auth Context (Admin & Verifier Role Aware)
import { createContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../api/supabaseClient';
import { getUserProfile } from '../api/authApi';

export const AuthContext = createContext({
  user: null,
  profile: null,
  session: null,
  loading: true,
  role: null, // 'admin' | 'verifier' | 'both'
  institutionMember: null,
  signIn: async () => {},
  signOut: async () => {},
  setDemoUser: () => {},
});

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null);
      return;
    }
    const { data } = await getUserProfile(userId);
    if (data) {
      setProfile(data);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        loadProfile(s.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, s) => {
        setSession(s);
        setUser(s?.user ?? null);
        if (s?.user) {
          loadProfile(s.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
  }, []);

  // Demo user helper for testing without backend pre-provisioning
  const setDemoUser = useCallback((demoRole) => {
    const demoProfile = {
      id: `demo-${demoRole}-001`,
      full_name: demoRole === 'admin' ? 'Operations Admin' : 'CTEVT Reviewer',
      email: demoRole === 'admin' ? 'admin@shramsetu.com' : 'verifier@ctevt.org.np',
      role: demoRole,
      institution_member: demoRole === 'verifier' ? {
        id: 'mem-ctevt-1',
        institution_id: 'inst-ctevt-001',
        institutions: { name: 'CTEVT Nepal', slug: 'ctevt' },
      } : null,
    };
    setUser({ id: demoProfile.id, email: demoProfile.email });
    setProfile(demoProfile);
    setSession({ access_token: 'demo-token' });
  }, []);

  const currentRole = profile?.role || null;
  const institutionMember = profile?.institution_member || null;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        role: currentRole,
        institutionMember,
        signOut: handleSignOut,
        setDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
