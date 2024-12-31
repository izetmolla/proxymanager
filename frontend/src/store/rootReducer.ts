import { combineReducers } from '@reduxjs/toolkit';
import theme from './slices/themeSlice';
import auth from './slices/authSlice';
import general from './slices/generalSlice';

const rootReducer = combineReducers({
    theme: theme,
    auth: auth,
    general: general,
});

export default rootReducer;