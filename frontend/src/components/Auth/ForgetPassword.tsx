import { Button, FormControl, FormLabel, Input, InputGroup, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import useSignIn from '@/hooks/useSignIn';
import { API_URL } from '@/types';
import { validateEmail } from '@/utils';

type Props = {
  onLoginClick: () => void;
}

const ForgetPassword: React.FC<Props> = ({ onLoginClick }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [emailHasError, setEmailHasError] = useState(false);

  const handleRequestForgetEmail = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (error) setError(''); // Reset error message

    if (!email) {
      setError('Please enter your email.');
      setEmailHasError(true);
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      setEmailHasError(true);
      return;
    }

    const formData = new FormData();
    formData.append('email', email);

    let res = await fetch(`${API_URL}/user/reset`, {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      setError('An email with the password reset link has been sent.');
    } else if (res.status == 418) {
      setError('You have requested too many reset requests, please try again later.');
    }
  }

  return (
    <>
      <Text textAlign="center" fontSize="20pt" color="white" mb={2}>Reset Password</Text>

      <FormControl isInvalid={emailHasError}>
        <Input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
      </FormControl>

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