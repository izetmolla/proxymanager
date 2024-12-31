import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ThemeState = {
    themeColor: string;
    theme: string;
};

const initialState: ThemeState = {
    themeColor: 'default',
    theme: 'light',
};

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setColor: (state, action: PayloadAction<string>) => {
            state.themeColor = action.payload;
        },
        setTheme: (state, action: PayloadAction<string>) => {
            state.theme = action.payload;
        },
    },
});

export const { setColor, setTheme } = themeSlice.actions;

export default themeSlice.reducer;