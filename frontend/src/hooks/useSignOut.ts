import { API_URL } from "@/types";
import { useState } from "react";

interface SignOutState {
  signOut: () => void;
  loading: boolean;
  error: string | null;
}

const useSignOut = (): SignOutState => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const signOut = async () => {
    setLoading(true);
    setError(null);

    try {
      let res = await fetch(`${API_URL}/user/logout`, {
        credentials: 'include',
      });

      if (!res.ok) {
        let msg = await res.text();
        setError(msg);
        return;
      }

      console.log('Signed out successfully');
      window.location.href = '/auth';
    } catch (e) {
      console.warn(e);
      setError('An error occurred during sign-out.');
    } finally {
      setLoading(false);
    }
  };

  return { signOut, loading, error };
};

export default useSignOut;