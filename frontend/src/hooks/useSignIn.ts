import { authAtom } from "@/atoms/auth";
import { API_URL } from "@/types";
import { useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";

interface SignInState {
  signIn: (email: string, password: string, otp: string) => Promise<void>;
  loggedIn: boolean;
  loading: boolean;
  error: string | null;
}

const useSignIn = (): SignInState => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (email: string, password: string, otp: string) => {
    setLoading(true);
    setError(null);

    try {
      let formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      formData.append('mfa', otp);

      let res = await fetch(`${API_URL}/user/login`, {
        method: 'POST',
        body: formData,
      });

      let msg = await res.text();

      if (!res.ok) {
        setError(msg || 'Invalid credentials.');
        return;
      }

      setLoggedIn(true);
      console.log('Logged in successfully');
    } catch (e) {
      console.warn(e);
      setError('An error occurred during sign-in.');
    } finally {
      setLoading(false);
    }
  };

  return { signIn, loggedIn, loading, error };
};

export default useSignIn;