import { API_URL } from "@/types";
import { useState } from "react";
import { postWithCsrfToken } from "@/utils";

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

      const res = await postWithCsrfToken(`${API_URL}/user/login`, formData);

      if (!res.ok) {
        setError('Sign-in failed, please try again.');
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