// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './taskslice';

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
  },
});
  