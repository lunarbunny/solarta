import { Button, Input, InputGroup, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import useRegister from '@/hooks/useRegister';

type RegisterProps = {
  onLoginClick: () => void;
}

const Register: React.FC<RegisterProps> = ({ onLoginClick }) => {
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const { register, loading, error: registerError } = useRegister();

  function onRegisterSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (error) setError(''); // Reset error message

    if (!registerForm.name ||
      !registerForm.email ||
      !registerForm.password ||
      !registerForm.confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    register(registerForm.name, registerForm.email, registerForm.password);
  }

  return (
    <>
      <Text textAlign="center" fontSize="20pt" color="white" mb={2}>Register for a Solarta account</Text>

      <form onSubmit={onRegisterSubmit}>
        <Input
          type="text"
          placeholder="Name"
          value={registerForm.name}
          onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
        />
        <Input
          type="email"
          placeholder="Email"
          value={registerForm.email}
          onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
          mt={2}
        />

        <InputGroup mt={2}>
          <Input
            type="password"
            placeholder="Password"
            value={registerForm.password}
            onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
          />
          <Input
            type="password"
            placeholder="Confirm password"
            value={registerForm.confirmPassword}
            onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
            ms={2}
          />
        </InputGroup>

        <Text textAlign="center" mt={2} fontSize="12pt" color="red.300">
          {error || registerError}
        </Text>

        <Button
          width="100%"
          borderRadius={32}
          mt={1}
          type="submit"
          isLoading={loading}
        >
          Register
        </Button>
      </form>

      <Button
        variant={'link'}
        width="100%"
        onClick={onLoginClick}
        mt={4}
      >
        Already registered? Login here.
      </Button>
    </>
  )
}

export default Register;