import { Button, FormControl, Input, InputGroup, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import useRegister from '@/hooks/useRegister';
import { validateEmail, validatePwd, validateText } from '@/utils';

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
  const [nameHasError, setNameHasError] = useState(false);
  const [emailHasError, setEmailHasError] = useState(false);
  const [passwordHasError, setPasswordHasError] = useState(false);

  const { register, registered, loading, error: registerError } = useRegister();

  useEffect(() => {
    if (registered) {
      setError('Registration successful! Please check your email for a verification link.');
    }
  }, [registered]);

  const onRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset error message
    if (error) setError('');
    if (nameHasError) setNameHasError(false);
    if (emailHasError) setEmailHasError(false);
    if (passwordHasError) setPasswordHasError(false);

    if (!validateText(registerForm.name)) {
      setError('Please enter a name that is 3-64 chars long.');
      setNameHasError(true);
      return;
    }

    if (!validateEmail(registerForm.email)) {
      setError('Please enter a valid email address.');
      setEmailHasError(true);
      return;
    }

    if (!validatePwd(registerForm.password)) {
      setError('Password must be at least 12 characters long.');
      setPasswordHasError(true);
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match.');
      setPasswordHasError(true);
      return;
    }

    register(registerForm.name, registerForm.email, registerForm.password);
  }

  return (
    <>
      <Text textAlign="center" fontSize="20pt" color="white" mb={2}>Register for a Solarta account</Text>

      <form onSubmit={onRegisterSubmit}>
        <FormControl isInvalid={nameHasError}>
          <Input
            type="text"
            placeholder="Name"
            value={registerForm.name}
            onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
          />
        </FormControl>

        <FormControl isInvalid={emailHasError}>
          <Input
            type="email"
            placeholder="Email"
            value={registerForm.email}
            onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
            mt={2}
          />
        </FormControl>

        <FormControl isInvalid={passwordHasError}>
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
        </FormControl>

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