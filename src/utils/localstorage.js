
const storedTasks = localStorage.getItem('tasks');
if (storedTasks) {
  const parsedTasks = JSON.parse(storedTasks);
  if (Array.isArray(parsedTasks)) {
    dispatch(setTasksFromLocalStorage(parsedTasks));
  } else {
    console.error('Stored tasks are not in array format!');
  }
}
