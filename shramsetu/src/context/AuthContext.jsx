// Shram Setu — Auth Context (Unified Clerk + Supabase + Local Fallback)
import { createContext, useState, useEffect, useCallback } from 'react';
import { useUser, useSession, useClerk } from '@clerk/react';
import { supabase } from '../api/supabaseClient';
import { getUserProfile } from '../api/authApi';

export const AuthContext = createContext({
  user: null,
  profile: null,
  session: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
  saveProfile: async () => {},
});

export function AuthProvider({ children }) {
  const { isLoaded: isUserLoaded, user: clerkUser } = useUser();
  const { isLoaded: isSessionLoaded, session: clerkSession } = useSession();
  const clerk = useClerk();

  // Local state initialized with localStorage fallback
  const [localUser, setLocalUser] = useState(() => {
    try {
      const saved = localStorage.getItem('shramsetu_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('shramsetu_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [profileLoading, setProfileLoading] = useState(false);

  // Active user normalized
  const appUser = clerkUser
    ? {
        id: profile?.id || clerkUser.id, // Use Supabase UUID when profile is loaded
        clerkId: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress || clerkUser.emailAddresses?.[0]?.emailAddress || null,
        phone: clerkUser.primaryPhoneNumber?.phoneNumber || clerkUser.phoneNumbers?.[0]?.phoneNumber || null,
        fullName: clerkUser.fullName || `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || null,
        rawUser: clerkUser,
      }
    : localUser;

  // Persist user
  useEffect(() => {
    if (clerkUser) {
      const u = {
        id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress || clerkUser.emailAddresses?.[0]?.emailAddress || null,
        phone: clerkUser.primaryPhoneNumber?.phoneNumber || clerkUser.phoneNumbers?.[0]?.phoneNumber || null,
        fullName: clerkUser.fullName || `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || null,
      };
      setLocalUser(u);
      localStorage.setItem('shramsetu_user', JSON.stringify(u));
    }
  }, [clerkUser]);

  const loadProfile = useCallback(async (userId) => {
    if (!userId) return;
    setProfileLoading(true);
    try {
      // First try by Clerk ID (in case profiles store it)
      let { data, error } = await getUserProfile(userId);
      
      // If not found, try by phone number
      if (error && clerkUser?.primaryPhoneNumber?.phoneNumber) {
        const phone = clerkUser.primaryPhoneNumber.phoneNumber;
        const result = await supabase
          .from('profiles')
          .select('*')
          .eq('phone', phone)
          .maybeSingle();
        data = result.data;
        error = result.error;
      }
      
      // If still not found, try by email
      if (error && clerkUser?.primaryEmailAddress?.emailAddress) {
        const email = clerkUser.primaryEmailAddress.emailAddress;
        const result = await supabase
          .from('profiles')
          .select('*')
          .eq('email', email)
          .maybeSingle();
        data = result.data;
        error = result.error;
      }
      
      if (!error && data) {
        if (data.is_suspended) {
          await clerk.signOut();
          setProfile(null);
          localStorage.removeItem('shramsetu_profile');
          return;
        }
        setProfile(data);
        localStorage.setItem('shramsetu_profile', JSON.stringify(data));
      }
    } catch (err) {
      console.warn('Profile fetch error:', err);
    } finally {
      setProfileLoading(false);
    }
  }, [clerk, clerkUser]);

  const refreshProfile = useCallback(async () => {
    const activeId = clerkUser?.id || localUser?.id;
    if (activeId) {
      await loadProfile(activeId);
    }
  }, [clerkUser?.id, localUser?.id, loadProfile]);

  const saveProfile = useCallback(async (newProfileData) => {
    setProfile(newProfileData);
    localStorage.setItem('shramsetu_profile', JSON.stringify(newProfileData));
    if (!localUser && newProfileData?.id) {
      const u = {
        id: newProfileData.id,
        email: newProfileData.email,
        phone: newProfileData.phone,
        fullName: newProfileData.full_name,
      };
      setLocalUser(u);
      localStorage.setItem('shramsetu_user', JSON.stringify(u));
    }
  }, [localUser]);

  useEffect(() => {
    if (isUserLoaded && clerkUser?.id) {
      loadProfile(clerkUser.id);
    }
  }, [isUserLoaded, clerkUser?.id, loadProfile]);

  const handleSignOut = useCallback(async () => {
    try {
      await clerk.signOut();
    } catch (err) {
      console.warn('SignOut error:', err);
    }
    setProfile(null);
    setLocalUser(null);
    localStorage.removeItem('shramsetu_user');
    localStorage.removeItem('shramsetu_profile');
  }, [clerk]);

  const authLoading = (!isUserLoaded && !localUser) || profileLoading;

  return (
    <AuthContext.Provider
      value={{
        user: appUser,
        profile,
        session: clerkSession || (appUser ? { user: appUser } : null),
        loading: authLoading,
        signOut: handleSignOut,
        refreshProfile,
        saveProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
