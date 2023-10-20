import { atom } from 'recoil';

export interface AuthState {
    view: 'login' | 'register';
    id: number;
    name: string;
    email: string;
    accessToken: string | null;
}

const defaultAuthState: AuthState = {
    view: 'login',
    id: -1,
    name: '',
    email: '',
    accessToken: null,
}

export const authAtom = atom<AuthState>({
    key: 'authAtom',
    default: defaultAuthState,
});