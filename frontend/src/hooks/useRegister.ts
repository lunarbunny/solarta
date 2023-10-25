import { API_URL } from "@/types";
import { useState } from "react";

interface RegisterState {
  register: (name: string, email: string, password: string) => Promise<void>;
  registered: boolean;
  loading: boolean;
  error: string | null;
}

const useRegister = (): RegisterState => {
  const [registered, setRegistered] = useState<boolean>(false);
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

      let msg = await res.text();

      if (!res.ok) {
        setError(msg);
        return;
      }

      console.log('Registered successfully');
      setRegistered(true);
    } catch (e) {
      console.warn(e);
      setError('An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return { register, registered, loading, error };
};

export default useRegister;