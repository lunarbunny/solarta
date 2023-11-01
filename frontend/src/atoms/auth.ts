import { User } from '@/types';
import { atom } from 'recoil';

export interface AuthState {
    view: 'login' | 'register' | 'forgot';
    user: User | null;
}

const defaultAuthState: AuthState = {
    view: 'login',
    user: null,
}

export const authAtom = atom<AuthState>({
    key: 'authAtom',
    default: defaultAuthState,
});