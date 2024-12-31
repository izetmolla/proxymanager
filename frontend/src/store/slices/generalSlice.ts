import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ThemeState = {
    pageHeader?: {
        title?: string;
        breadcrumb?: { name: string; href?: string }[];
        className?: string;
    };
};

const initialState: ThemeState = {
    pageHeader: {
        title: undefined,
        breadcrumb: [],
        className: undefined,
    },
};

export const generalSlice = createSlice({
    name: 'general',
    initialState,
    reducers: {
        clearPageHeader(state) {
            state.pageHeader = initialState.pageHeader;
        },
        setPageHeaderTitle(state, action: PayloadAction<string>) {
            state.pageHeader = {
                ...state.pageHeader,
                title: action.payload,
                breadcrumb:
                    state.pageHeader?.breadcrumb?.map((x) => {
                        if (!x.href) return { name: action.payload };
                        return x;
                    }) || [],
            };
        },
    },
});

export const { setPageHeaderTitle, clearPageHeader } = generalSlice.actions;

export default generalSlice.reducer;