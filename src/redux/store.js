




// redux/store.js
import { configureStore, createSlice } from "@reduxjs/toolkit";
import cameraReducer from './cameraSlice';

// ========== Auth Slice ==========
const authInitialState = {
  access: null,
  refresh: null,
  user: null,        
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: authInitialState,
  reducers: {
    setCredentials: (state, action) => {
      state.access = action.payload.access;
      state.refresh = action.payload.refresh;
      state.user = action.payload.user;   
      state.isAuthenticated = true;
       
    },
    logout: (state) => {
      state.access = null;
      state.refresh = null;
      state.user = null;   
      state.isAuthenticated = false;
    },
  },
});

// ========== Permissions Slice ==========
const permissionsInitialState = {
  cameraGranted: false,
  locationGranted: false,
  punchInTime: null,
  punchOutTime: null,
};

const permissionsSlice = createSlice({
  name: "permissions",
  initialState: permissionsInitialState,
  reducers: {
    setCameraPermission: (state, action) => {
      state.cameraGranted = action.payload;
    },
    setLocationPermission: (state, action) => {
      state.locationGranted = action.payload;
    },
    setPunchInTime: (state, action) => {
      state.punchInTime = action.payload;
    },
    setPunchOutTime: (state, action) => {
      state.punchOutTime = action.payload;
    },
  },
});



// ========== Export Actions ==========
export const { setCredentials, logout } = authSlice.actions;
export const { setCameraPermission, setLocationPermission, setPunchInTime, setPunchOutTime } = permissionsSlice.actions;

// ========== Configure Store ==========
const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    permissions: permissionsSlice.reducer,
     camera: cameraReducer, 
  },
});

export default store;

 
