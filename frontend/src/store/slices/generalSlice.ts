import { createSlice, PayloadAction } from '@reduxjs/toolkit';


export type GlobalOptions = {
    credentialsLogin?: boolean;
    githubLogin?: boolean;
    googleLogin?: boolean;
    setup?: boolean;
};

declare global {
    interface Window {
        globalOptions?: GlobalOptions;
    }
}
export type GeneralState = {
    credentialsLogin: boolean;
    githubLogin: boolean;
    googleLogin: boolean;
    setup: boolean;
};

const initialState: GeneralState = {
    credentialsLogin: true,
    githubLogin: false,
    googleLogin: false,
    setup: false,
    ...window.globalOptions
};

export const generalSlice = createSlice({
    name: 'general',
    initialState,
    reducers: {
        setCredentialsLogin: (state, action: PayloadAction<boolean>) => {
            state.credentialsLogin = action.payload;
        },
        setSetup: (state, action: PayloadAction<boolean>) => {
            state.setup = action.payload;
        }
    },
});

export const {
    setCredentialsLogin,
    setSetup
} = generalSlice.actions;

export default generalSlice.reducer;