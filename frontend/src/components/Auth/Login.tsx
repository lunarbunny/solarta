import { Button, Input, InputGroup, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import useSignIn from '@/hooks/useSignIn';

type LoginProps = {
  onRegisterClick: () => void;
}

const Login: React.FC<LoginProps> = ({ onRegisterClick }) => {
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    otp: '',
  });
  const [error, setError] = useState('');

  const { signIn, loggedIn, loading, error: loginError } = useSignIn();

  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (error) setError(''); // Reset error message

    if (!loginForm.email || !loginForm.password) {
      setError('Please fill in all fields.');
      return;
    }

    signIn(loginForm.email, loginForm.password, loginForm.otp);
  }

  useEffect(() => {
    if (loggedIn) {
      window.location.href = '/';
    }
  }
  , [loggedIn]);

  return (
    <>
      <Text textAlign="center" fontSize="20pt" color="white" mb={2}>Login to Solarta</Text>

      <form onSubmit={handleLoginSubmit}>
        <Input
          type="email"
          placeholder="Email"
          value={loginForm.email}
          onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
        />
        <Input
          type="password"
          placeholder="Password"
          value={loginForm.password}
          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
          mt={2}
        />
        <Input
          type="number"
          placeholder="OTP"
          value={loginForm.otp}
          onChange={(e) => setLoginForm({ ...loginForm, otp: e.target.value })}
          mt={2}
        />

        <Text textAlign="center" mt={2} fontSize="12pt" color="red.300" noOfLines={2}>
          {error || (loginError && 'Error occured while logging in.')}
        </Text>

        <Button
          width="100%"
          borderRadius={32}
          mt={1}
          type="submit"
          isLoading={loading}
        >
          Log In
        </Button>
      </form>

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