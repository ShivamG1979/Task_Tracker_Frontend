import { useState, useContext } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import AuthContext from '../../context/AuthContext';

const TaskForm = ({ projectId, onAddTask }) => {
  const { auth } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Not Started'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const { title, description, status } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch(`https://task-tracker-backend-da1d.onrender.com/api/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify({ ...formData, project: projectId })
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Failed to create task');
        setLoading(false);
        return;
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        status: 'Not Started'
      });
      
      // Add task to state
      onAddTask(data.data);
      
      // Show success message
      setSuccess('Task created successfully!');
      setLoading(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError('Server error, please try again');
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={onSubmit} className="card p-3 shadow-sm">
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Form.Group className="mb-3">
        <Form.Label>Task Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={title}
          onChange={onChange}
          placeholder="Enter task title"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="description"
          value={description}
          onChange={onChange}
          placeholder="Describe your task"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Status</Form.Label>
        <Form.Select
          name="status"
          value={status}
          onChange={onChange}
          required
        >
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </Form.Select>
      </Form.Group>

      <Button
        type="submit"
        variant="success"
        className="w-100"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Task'}
      </Button>
    </Form>
  );
};

export default TaskForm;