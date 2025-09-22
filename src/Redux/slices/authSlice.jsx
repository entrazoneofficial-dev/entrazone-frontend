import { createSlice } from "@reduxjs/toolkit";

const loadState = () => {
  try {
    const serializedState = localStorage.getItem("authTokens");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    return undefined;
  }
};

const initialState = loadState() || {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isProfileComplete: false,
  isRegisterPageVisible: false,
  phone: null,
  requestId: null,
  hasSelectedCourse: false,
  route: null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
    },

    loginSuccess: (state, action) => {
      const { phone, request_id, route } = action.payload;
      state.phone = phone;
      state.requestId = request_id;
      state.route = route;
    },

    verifyOtpSuccess: (state, action) => {
      const { user, access, refresh } = action.payload;      
      state.user = user;
      state.accessToken = access;
      state.refreshToken = refresh;
      state.isAuthenticated = true;
      state.isProfileComplete = Boolean(user.name);
    },

    register: (state, action) => {
      const { user } = action.payload;
      state.user = user;
      state.isProfileComplete = true;
    },

    updateProfile: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload,
      };
      state.isProfileComplete = Boolean(action.payload.name || state.user.name);
    },

    setIsRegisterPageVisible: (state, action) => {
      state.isRegisterPageVisible = action.payload;
    },

    setHasSelectedCourse: (state, action) => {
      state.hasSelectedCourse = action.payload;
    },

    logout: (state) => {
        (state.user = null),
        (state.accessToken = null),
        (state.refreshToken = null),
        (state.isAuthenticated = false),
        (state.isProfileComplete = false),
        (state.isRegisterPageVisible = false),
        (state.phone = null),
        (state.requestId = null),
        (state.hasSelectedCourse = false),
        (state.route = null),
        (state.loading = false),
        (state.error = null);
      localStorage.removeItem("authTokens");
    },
  },
});

export const {
  startLoading,
  loginSuccess,
  verifyOtpSuccess,
  register,
  setIsRegisterPageVisible,
  setHasSelectedCourse,
  updateProfile,
  logout,
} = authSlice.actions;
export default authSlice.reducer;
