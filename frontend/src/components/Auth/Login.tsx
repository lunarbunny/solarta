import { Button, FormControl, Input, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import useSignIn from '@/hooks/useSignIn';
import { validateEmail, validateOTP, validatePwd } from '@/utils';
import router from 'next/router';

type LoginProps = {
  onRegisterClick: () => void;
  onForgetClick: () => void;
}

const Login: React.FC<LoginProps> = ({ onRegisterClick, onForgetClick }) => {
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    otp: '',
  });

  const [error, setError] = useState('');
  const [emailHasError, setEmailHasError] = useState(false);
  const [passwordHasError, setPasswordHasError] = useState(false);
  const [otpHasError, setOtpHasError] = useState(false);

  const { signIn, loggedIn, loading, error: loginError } = useSignIn();

  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset error message
    if (error) setError('');
    if (emailHasError) setEmailHasError(false);
    if (passwordHasError) setPasswordHasError(false);
    if (otpHasError) setOtpHasError(false);

    if (!validateEmail(loginForm.email)) {
      setError('Please enter a valid email address.');
      setEmailHasError(true);
      return;
    }

    // Don't enforce password length for login
    if (!validatePwd(loginForm.password, false)) {
      setError('Password cannot be empty or consist of only spaces.');
      setPasswordHasError(true);
      return;
    }

    if (!validateOTP(loginForm.otp)) {
      setError('Please enter a valid 6 digit OTP.');
      setOtpHasError(true);
      return;
    }

    signIn(loginForm.email, loginForm.password, loginForm.otp);
  }

  useEffect(() => {
    if (loggedIn) {
      router.push('/');
    }
  }, [loggedIn]);

  return (
    <>
      <Text textAlign="center" fontSize="20pt" color="white" mb={2}>Login to Solarta</Text>

      <form onSubmit={handleLoginSubmit}>
        <FormControl isInvalid={emailHasError}>
          <Input
            type="email"
            placeholder="Email"
            value={loginForm.email}
            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
          />
        </FormControl>

        <FormControl isInvalid={passwordHasError}>
          <Input
            type="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            mt={2}
          />
        </FormControl>

        <FormControl isInvalid={otpHasError}>
          <Input
            type="number"
            placeholder="OTP"
            value={loginForm.otp}
            onChange={(e) => setLoginForm({ ...loginForm, otp: e.target.value })}
            mt={2}
          />
        </FormControl>

        <Text textAlign="center" mt={2} fontSize="12pt" color="red.300" noOfLines={2}>
          {error || loginError}
        </Text>

        <Button
          width="100%"
          borderRadius={32}
          mt={2}
          type="submit"
          isLoading={loading}
        >
          Log In
        </Button>
      </form>

      <Button
        variant={'link'}
        width="100%"
        onClick={onForgetClick}
        mt={4}
      >
        Forgot password?
      </Button>

      <Button
        variant={'link'}
        width="100%"
        onClick={onRegisterClick}
        mt={4}
      >
        No account yet? Click here to sign up.
      </Button>
    </>
  )
}

export default Login;