import { atom } from 'recoil';

export interface AuthState {
    view: 'login' | 'register';
}

const defaultAuthState: AuthState = {
    view: 'login',
}

export const authAtom = atom<AuthState>({
    key: 'authAtom',
    default: defaultAuthState,
});