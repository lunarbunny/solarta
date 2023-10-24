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
      let formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);

      let res = await fetch(`${API_URL}/user/register`, {
        method: 'POST',
        body: formData,
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