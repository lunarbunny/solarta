import { authAtom } from "@/atoms/auth";
import { API_URL } from "@/types";
import { useState } from "react";
import { useRecoilState } from "recoil";

interface RegisterState {
  register: (name: string, email: string, password: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const useRegister = (): RegisterState => {
  const [authState, setAuthState] = useRecoilState(authAtom);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      let res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      if (!res.ok) {
        let msg = await res.text();
        setError(msg);
        return;
      }

      const { accessToken } = await res.json();
      setAuthState({ ...authState, accessToken });
      console.log('Logged in successfully');
      window.location.href = '/';
    } catch (e) {
      console.warn(e);
      setError('An error occurred during sign-in.');
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
};

export default useRegister;