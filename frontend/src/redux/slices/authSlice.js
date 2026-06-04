import { createSlice } from '@reduxjs/toolkit';

// Helper function to check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiryTime = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expiryTime;
  } catch (error) {
    return true;
  }
};

// Helper function to get validated user from localStorage
const getValidatedUser = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.token || isTokenExpired(user.token)) {
      localStorage.removeItem('user');
      return null;
    }
    return user;
  } catch (error) {
    localStorage.removeItem('user');
    return null;
  }
};

const initialState = {
  user: getValidatedUser(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('user');
    },
    validateSession: (state) => {
      state.user = getValidatedUser();
    }
  },
});

export const { login, logout, validateSession } = authSlice.actions;
export default authSlice.reducer;
