import { Center, Container } from '@chakra-ui/react';
import React from 'react';
import Login from './Login';
import Register from './Register';
import ForgetPassword from './ForgetPassword';

export interface AuthState {
  view: 'login' | 'register' | 'forgot';
}

const Auth: React.FC = () => {
  const [view, setView] = React.useState<'login' | 'register' | 'forgot'>('login');

  return (
    <Center width="100%" height="90vh">
      <Container bg="#364259" borderRadius={8} padding={4}>
        {view == 'login' && <Login onRegisterClick={() => setView('register')} onForgetClick={() => setView('forgot')} />}
        {view == 'register' && <Register onLoginClick={() => setView('login')} />}
        {view == 'forgot' && <ForgetPassword onLoginClick={() => setView('login')} />}
      </Container>
    </Center>
  )
}

export default Auth;