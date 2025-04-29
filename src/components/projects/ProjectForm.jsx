import { useState, useContext } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import AuthContext from '../../context/AuthContext';

const ProjectForm = ({ onAddProject }) => {
  const { auth } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const { name, description } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('https://task-tracker-backend-da1d.onrender.com/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify({ name, description })
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Failed to create project');
        setLoading(false);
        return;
      }

      // Reset form
      setFormData({
        name: '',
        description: ''
      });
      
      // Add project to state
      onAddProject(data.data);
      
      // Show success message
      setSuccess('Project created successfully!');
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
        <Form.Label>Project Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={name}
          onChange={onChange}
          placeholder="Enter project name"
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
          placeholder="Describe your project"
          required
        />
      </Form.Group>

      <Button
        type="submit"
        variant="success"
        className="w-100"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Project'}
      </Button>
    </Form>
  );
};

export default ProjectForm;