import { SignInCredentialResponse } from '@/services/auth.servoce';
import { User } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AuthState = {
    loading: boolean;
    signedIn: boolean;
    user?: User;
    tokens: {
        access_token?: string;
        refresh_token?: string;
    };
};

const initialState: AuthState = {
    loading: false,
    signedIn: false,
    tokens: {},
    user: undefined,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        signIn(state, action: PayloadAction<SignInCredentialResponse>) {
            state.loading = false;
            state.signedIn = true;
            if (action.payload?.tokens) {
                state.tokens = action.payload?.tokens;
                state.user = action.payload?.user;
            }
        },
        setAccessToken(state, action: PayloadAction<string>) {
            state.tokens.access_token = action.payload;
        },
        signOutSuccess(state) {
            state.signedIn = false;
            state.tokens = {};
            state.user = undefined;
        },
        signInSuccesful(state, action: PayloadAction<SignInCredentialResponse>) {
            state.loading = false;
            state.signedIn = true;
            if (action.payload?.tokens) {
                state.tokens = action.payload?.tokens;
                state.user = action.payload?.user;
            }
        },
        signOutAction(state) {
            state.signedIn = false;
            state.tokens = {};
            state.user = undefined;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
    },
});

export const {
    signIn,
    setAccessToken,
    signOutSuccess,
    signInSuccesful,
    signOutAction,
    setLoading,
} = authSlice.actions;

export default authSlice.reducer;