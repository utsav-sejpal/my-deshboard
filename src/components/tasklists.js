import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTask, deleteTask, setTasksFromLocalStorage } from '../redux/taskslice';
import '../utils/TaskList.css';

const TaskList = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks); // Access tasks from Redux store

  // State for search input, selected status, and selected priority
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(''); // For filtering by status
  const [selectedPriority, setSelectedPriority] = useState(''); // For filtering by priority
  const [filteredTasks, setFilteredTasks] = useState(tasks); // State for filtered tasks

  // State for managing editing a task
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({
    id: '',
    taskName: '',
    status: '',
    priority: '',
    dueDate: ''
  });

  // State for showing task details
  const [taskDetails, setTaskDetails] = useState(null);

  // Load tasks from localStorage on initial render
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      const parsedTasks = JSON.parse(storedTasks);
      if (Array.isArray(parsedTasks)) {
        dispatch(setTasksFromLocalStorage(parsedTasks)); // Dispatch to set tasks in Redux store from localStorage
      } else {
        console.error('Stored tasks are not in array format!');
      }
    }
  }, [dispatch]);

  // Update filtered tasks whenever tasks, search query, status, or priority changes
  useEffect(() => {
    const filtered = tasks.filter((task) => {
      // Filter by search query
      const matchesSearch = task.taskName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            task.priority.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            task.status.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by selected status
      const matchesStatus = selectedStatus ? task.status === selectedStatus : true;

      // Filter by selected priority
      const matchesPriority = selectedPriority ? task.priority === selectedPriority : true;

      return matchesSearch && matchesStatus && matchesPriority;
    });
    setFilteredTasks(filtered);
  }, [tasks, searchQuery, selectedStatus, selectedPriority]);

  // Handle deleting a task
  const handleDelete = (id) => {
    dispatch(deleteTask(id));
  };

  // Toggle task status (started, in-progress, finished)
  const handleStatusChange = (task) => {
    const updatedTask = {
      ...task,
      status: task.status === 'started' ? 'in-progress' : task.status === 'in-progress' ? 'finished' : 'started',
    };
    dispatch(updateTask(updatedTask));
  };

  // Handle opening the edit modal
  const handleEditClick = (task) => {
    setEditedTask({ ...task }); // Prepopulate the form with the task's current data
    setIsEditing(true); // Show the edit form
  };

  // Handle saving the edited task
  const handleSaveEdit = () => {
    dispatch(updateTask(editedTask)); // Dispatch to update task in Redux store
    setIsEditing(false); // Close the edit form
    setEditedTask({ id: '', taskName: '', status: '', priority: '', dueDate: '' }); // Reset edited task
  };

  // Handle changes in the edit form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Show task details in the task details section
  const handleShowDetails = (task) => {
    setTaskDetails(task); // Show task details
  };

  // Update localStorage whenever tasks change
  useEffect(() => {
    if (Array.isArray(tasks)) {
      localStorage.setItem('tasks', JSON.stringify(tasks)); // Save tasks to localStorage whenever tasks change
    }
  }, [tasks]);

  if (!Array.isArray(tasks)) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div>
      <h2>Task List</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Filters for Status and Priority */}
      <div>
        <label>Status:</label>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="started">Started</option>
          <option value="in-progress">In Progress</option>
          <option value="finished">Finished</option>
        </select>
      </div>

      <div>
        <label>Priority:</label>
        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Filtered Task List */}
      <ul>
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <li key={task.id}>
              <div>
                <h3>{task.taskName}</h3>
                <p>Priority: {task.priority}</p>
                <p>Status: {task.status}</p>
                <p>Due: {task.dueDate}</p>
                <button onClick={() => handleStatusChange(task)}>Toggle Status</button>
                <button onClick={() => handleDelete(task.id)}>Delete</button>
                <button onClick={() => handleEditClick(task)}>Edit</button>
                <button onClick={() => handleShowDetails(task)}>View Details</button>
              </div>
            </li>
          ))
        ) : (
          <p>No tasks match your search criteria.</p>
        )}
      </ul>

      {/* Edit Task Modal */}
      {isEditing && (
        <div className="edit-modal">
          <h3>Edit Task</h3>
          <form onSubmit={(e) => e.preventDefault()}>
            <div>
              <label>Task Name:</label>
              <input
                type="text"
                name="taskName"
                value={editedTask.taskName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Status:</label>
              <select
                name="status"
                value={editedTask.status}
                onChange={handleInputChange}
              >
                <option value="started">Started</option>
                <option value="in-progress">In Progress</option>
                <option value="finished">Finished</option>
              </select>
            </div>
            <div>
              <label>Priority:</label>
              <select
                name="priority"
                value={editedTask.priority}
                onChange={handleInputChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label>Due Date:</label>
              <input
                type="date"
                name="dueDate"
                value={editedTask.dueDate}
                onChange={handleInputChange}
              />
            </div>
            <button type="button" onClick={handleSaveEdit}>Save</button>
            <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
          </form>
        </div>
      )}

      {/* Task Details Modal */}
      {taskDetails && (
        <div className="task-details-modal">
          <h3>Task Details</h3>
          <p><strong>Task Name:</strong> {taskDetails.taskName}</p>
          <p><strong>Status:</strong> {taskDetails.status}</p>
          <p><strong>Priority:</strong> {taskDetails.priority}</p>
          <p><strong>Due Date:</strong> {taskDetails.dueDate}</p>
          <button onClick={() => setTaskDetails(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default TaskList;
