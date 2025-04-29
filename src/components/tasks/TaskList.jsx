import { useState } from 'react';
import { ListGroup, Badge, Button, Modal, Form } from 'react-bootstrap';
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';

const TaskList = ({ tasks, onUpdateTask, onDeleteTask }) => {
  const { auth } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: ''
  });

  // Open edit modal
  const openEditModal = (task) => {
    setCurrentTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status
    });
    setShowModal(true);
  };

  // Handle input change
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const onSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`https://task-tracker-backend-da1d.onrender.com/api/tasks/${currentTask._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        onUpdateTask(data.data);
        setShowModal(false);
      }
    } catch (err) {
      console.error('Failed to update task');
    }
  };

  // Get badge color based on status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Not Started':
        return 'danger';
      case 'In Progress':
        return 'warning';
      case 'Completed':
        return 'success';
      default:
        return 'secondary';
    }
  };

  return (
    <>
      <ListGroup className="shadow-sm">
        {tasks.map(task => (
          <ListGroup.Item 
            key={task._id}
            className="d-flex justify-content-between align-items-start"
          >
            <div className="ms-2 me-auto">
              <div className="fw-bold">{task.title}</div>
              <p className="mb-1">{task.description}</p>
              <small className="text-muted">
                Created: {new Date(task.createdAt).toLocaleDateString()}
                {task.completedAt && (
                  <> • Completed: {new Date(task.completedAt).toLocaleDateString()}</>
                )}
              </small>
            </div>
            <div className="d-flex flex-column align-items-end">
              <Badge bg={getStatusBadge(task.status)} className="mb-2">
                {task.status}
              </Badge>
              <div>
                <Button 
                  variant="outline-dark" 
                  size="sm"
                  className="me-1"
                  onClick={() => openEditModal(task)}
                >
                  Edit
                </Button>
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => onDeleteTask(task._id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Edit Task Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={onChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={onChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={onChange}
                required
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </Form.Select>
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="dark" type="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TaskList;
