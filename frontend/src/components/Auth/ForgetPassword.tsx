import { Button, Input, InputGroup, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import useSignIn from '@/hooks/useSignIn';
import { API_URL } from '@/types';

type Props = {
  onLoginClick: () => void;
}

const ForgetPassword: React.FC<Props> = ({ onLoginClick }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleRequestForgetEmail = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (error) setError(''); // Reset error message

    if (!email) {
      setError('Please enter your email.');
      return;
    }

    const formData = new FormData();
    formData.append('email', email);

    let res = await fetch(`${API_URL}/user/reset`, {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      setError('An email with the password reset lik has been sent.');
    }
  }

  return (
    <>
      <Text textAlign="center" fontSize="20pt" color="white" mb={2}>Reset Password</Text>

      <Input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />

      <Text textAlign="center" mt={2} fontSize="12pt" color="red.300" noOfLines={2}>
        {error}
      </Text>

      <Button width="100%" borderRadius={32} mt={2} onClick={handleRequestForgetEmail}>
        Request Reset Email
      </Button>

      <Button
        variant={'link'}
        width="100%"
        onClick={onLoginClick}
        mt={4}
      >
        Back to Login
      </Button>
    </>
  )
}

export default ForgetPassword;