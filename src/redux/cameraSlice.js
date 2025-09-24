import { createSlice } from '@reduxjs/toolkit';

const cameraSlice = createSlice({
  name: 'camera',
  initialState: {
    imageUri: null,
  },
  reducers: {
    setImageUri: (state, action) => {
      state.imageUri = action.payload;
    },
    clearImageUri: (state) => {
      state.imageUri = null;
    },
  },
});
 
export const { setImageUri, clearImageUri } = cameraSlice.actions;
export default cameraSlice.reducer;
