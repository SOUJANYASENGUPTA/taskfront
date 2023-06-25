import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    projectId: '',
    name: '',
    description: '',
    assignedTo: '',
    priority: '',
    deadline: '',
    status: ''
  });
  const [editTask, setEditTask] = useState(null);

  // Fetch all tasks
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios.get('http://localhost:8080/tasks/getAll')
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
      });
  };

  const createTask = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/tasks/add', newTask)
      .then(() => {
        console.log('New task added');
        setNewTask({
          projectId: '',
          name: '',
          description: '',
          assignedTo: '',
          priority: '',
          deadline: '',
          status: ''
        });
        fetchTasks();
      })
      .catch(error => {
        console.error('Error creating task:', error);
      });
  };

  const editTaskForm = (task) => {
    setEditTask(task);
    setNewTask({
      projectId: task.projectId,
      name: task.name,
      description: task.description,
      assignedTo: task.assignedTo,
      priority: task.priority,
      deadline: task.deadline,
      status: task.status
    });
  };

  const updateTask = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:8080/tasks/${editTask.id}`, newTask)
      .then(() => {
        console.log('Task updated');
        setEditTask(null);
        setNewTask({
          projectId: '',
          name: '',
          description: '',
          assignedTo: '',
          priority: '',
          deadline: '',
          status: ''
        });
        fetchTasks();
      })
      .catch(error => {
        console.error('Error updating task:', error);
      });
  };

  const cancelEdit = () => {
    setEditTask(null);
    setNewTask({
      projectId: '',
      name: '',
      description: '',
      assignedTo: '',
      priority: '',
      deadline: '',
      status: ''
    });
  };

  const deleteTask = (id) => {
    axios.delete(`http://localhost:8080/tasks/${id}`)
      .then(() => {
        console.log('Task deleted');
        fetchTasks();
      })
      .catch(error => {
        console.error('Error deleting task:', error);
      });
  };

  return (
    <div>
      <h1>Task Management</h1>

      <div>
        <h2>Create Task</h2>
        <form onSubmit={editTask ? updateTask : createTask}>
          <input
            type="text"
            placeholder="Project ID"
            value={newTask.projectId}
            onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
          />
          <input
            type="text"
            placeholder="Name"
            value={newTask.name}
            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <input
            type="text"
            placeholder="Assigned To"
            value={newTask.assignedTo}
            onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
          />
          <input
            type="text"
            placeholder="Priority"
            value={newTask.priority}
            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
          />
          <input
            type="text"
            placeholder="Deadline"
            value={newTask.deadline}
            onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
          />
          <input
            type="text"
            placeholder="Status"
            value={newTask.status}
            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
          />
          <button type="submit">{editTask ? 'Update Task' : 'Create Task'}</button>
          {editTask && <button onClick={cancelEdit}>Cancel Edit</button>}
        </form>
      </div>

      <div>
        <h2>Tasks</h2>
        <table>
          <thead>
            <tr>
              <th>Project ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Assigned To</th>
              <th>Priority</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td>{task.projectId}</td>
                <td>{task.name}</td>
                <td>{task.description}</td>
                <td>{task.assignedTo}</td>
                <td>{task.priority}</td>
                <td>{task.deadline}</td>
                <td>{task.status}</td>
                <td>
                  <button onClick={() => editTaskForm(task)}>Edit</button>
                  <button onClick={() => deleteTask(task.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskManagement;
