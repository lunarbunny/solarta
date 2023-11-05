import { API_URL } from "@/types";
import { postWithCsrfToken } from "@/utils";
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

      let res = await postWithCsrfToken(`${API_URL}/user/register`, formData);

      if (!res.ok) {
        if (res.status == 400) {
          // Only show validation errors, otherwise the response is just nachoneko
          let msg = await res.text();
          setError(msg);
        } else {
          setError('Registration failed, please try again.');
        }
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