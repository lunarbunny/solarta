import { Center, Container } from '@chakra-ui/react';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState } from 'recoil';
import { authAtom } from '../../atoms/auth';
import { auth } from '../../firebase/clientApp';
import Login from './Login';
import Register from './Register';

const Auth: React.FC = () => {
  const [authState, setAuthState] = useRecoilState(authAtom);
  const [user, loading, error] = useAuthState(auth);

  const onViewChange = (view: 'login' | 'register') => {
    setAuthState({ ...authState, view });
  }

  return (
    <Center height="90vh">
      <Container bg="#364259" borderRadius={8} padding={4}>
        {authState.view === 'login' && <Login onRegisterClick={() => onViewChange('register')} />}
        {authState.view === 'register' && <Register onLoginClick={() => onViewChange('login')} />}
      </Container>
    </Center>
  )
}

export default Auth;