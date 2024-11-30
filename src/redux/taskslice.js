// src/redux/taskSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],  // Ensure this is always initialized as an array
  history: [],
  loggedIn: false,
  user: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasksFromLocalStorage: (state, action) => {
      const tasks = action.payload;
      // Ensure that tasks is an array
      if (Array.isArray(tasks)) {
        state.tasks = tasks;
      } else {
        console.error('Error: tasks from localStorage are not in an array format');
        state.tasks = [];  // Fallback to an empty array
      }
    },
    login: (state, action) => {
      state.loggedIn = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.loggedIn = false;
      state.user = null;
    },
    addTask: (state, action) => {
      state.tasks.push(action.payload);
      localStorage.setItem('tasks', JSON.stringify(state.tasks));  // Save tasks to localStorage
    },
    updateTask: (state, action) => {
      const taskIndex = state.tasks.findIndex((task) => task.id === action.payload.id);
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = action.payload;
        localStorage.setItem('tasks', JSON.stringify(state.tasks));  // Save updated tasks to localStorage
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      localStorage.setItem('tasks', JSON.stringify(state.tasks));  // Save updated tasks to localStorage
    },
    addToHistory: (state, action) => {
      state.history.push(action.payload);
    },
  },
});

export const {
  login,
  logout,
  addTask,
  updateTask,
  deleteTask,
  addToHistory,
  setTasksFromLocalStorage,
} = taskSlice.actions;

export default taskSlice.reducer;
