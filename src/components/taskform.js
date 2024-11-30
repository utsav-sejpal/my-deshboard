// src/components/TaskForm.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '../redux/taskslice';

const TaskForm = () => {
  const dispatch = useDispatch();
  const [taskName, setTaskName] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('started');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      id: Date.now(),
      taskName,
      priority,
      status,
      dueDate,
    };
    dispatch(addTask(newTask));
    localStorage.setItem('tasks', JSON.stringify(newTask));  // Store in localStorage
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="Task Name"
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="started">Started</option>
        <option value="in-progress">In Progress</option>
        <option value="finished">Finished</option>
      </select>
      <input
        type="datetime-local"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;
