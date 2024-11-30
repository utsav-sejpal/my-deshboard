// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, updateTask, deleteTask, setTasksFromLocalStorage } from '../redux/taskslice';
import TaskForm from '../components/taskform';
import TaskList from '../components/tasklists';
import "../utils/dashboard.css"

const Dashboard = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);

  // Load tasks from localStorage on mount
  useEffect(() => {
    // Check if tasks are saved in localStorage
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      const parsedTasks = JSON.parse(storedTasks);
      if (Array.isArray(parsedTasks)) {
        // Dispatch to set tasks in Redux store from localStorage
        dispatch(setTasksFromLocalStorage(parsedTasks));
      } else {
        console.error('Stored tasks are not in array format!');
      }
    }
  }, [dispatch]);

  return (
    <div className='main1'>
      <h1>Dashboard</h1>
      <TaskForm />
      <TaskList tasks={tasks} />
    </div>
  );
};

export default Dashboard;
