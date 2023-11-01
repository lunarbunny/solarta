import { Center, Container } from '@chakra-ui/react';
import React from 'react';
import { useRecoilState } from 'recoil';
import { authAtom } from '../../atoms/auth';
import Login from './Login';
import Register from './Register';
import ForgetPassword from './ForgetPassword';

const Auth: React.FC = () => {
  const [authState, setAuthState] = useRecoilState(authAtom);

  const onViewChange = (view: 'login' | 'register' | 'forgot') => {
    setAuthState({ ...authState, view });
  }

  return (
    <Center width="100%" height="90vh">
      <Container bg="#364259" borderRadius={8} padding={4}>
        {authState.view == 'login' && <Login onRegisterClick={() => onViewChange('register')} onForgetClick={() => onViewChange('forgot')} />}
        {authState.view == 'register' && <Register onLoginClick={() => onViewChange('login')} />}
        {authState.view == 'forgot' && <ForgetPassword onLoginClick={() => onViewChange('login')} />}
      </Container>
    </Center>
  )
}

export default Auth;