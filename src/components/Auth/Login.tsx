import { Button, Center, Container, Input, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/clientApp';

type LoginProps = {
  onRegisterClick: () => void;
}

const Login: React.FC<LoginProps> = ({ onRegisterClick }) => {
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const [signInEmailPwd, _, loading, loginError] =
    useSignInWithEmailAndPassword(auth);

  function onLoginSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (error) setError(''); // Reset error message

    if (!loginForm.email || !loginForm.password) {
      setError('Please fill in all fields.');
      return;
    }

    signInEmailPwd(loginForm.email, loginForm.password);
  }

  return (
    <>
      <Text textAlign="center" fontSize="20pt" color="white" mb={2}>Login to Solarta</Text>

      <form onSubmit={onLoginSubmit}>
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

        <Text textAlign="center" mt={2} fontSize="12pt" color="red.300">
          {error || loginError?.message}
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