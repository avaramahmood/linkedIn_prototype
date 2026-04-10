import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice.js';
import postsReducer from '../features/postsSlice.js';

export default configureStore({
  reducer: {
    user: userReducer,
    posts: postsReducer,
  },
});
