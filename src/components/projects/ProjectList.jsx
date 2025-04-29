import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Button, Modal, Form, Alert } from 'react-bootstrap';
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';

const ProjectList = ({ projects, onDeleteProject, onUpdateProject }) => {
  const { auth } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Open edit modal
  const openEditModal = (project) => {
    setCurrentProject(project);
    setFormData({
      name: project.name,
      description: project.description
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
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch(`https://task-tracker-backend-da1d.onrender.com/api/projects/${currentProject._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        onUpdateProject(data.data);
        setShowModal(false);
        setLoading(false);
      } else {
        setError(data.error || 'Failed to update project');
        setLoading(false);
      }
    } catch (err) {
      setError('Server error, please try again');
      setLoading(false);
    }
  };

  return (
    <>
      <Row className="g-4">
        {projects.map(project => (
          <Col md={6} key={project._id}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>{project.name}</Card.Title>
                <Card.Text className="text-muted">
                  Created: {new Date(project.createdAt).toLocaleDateString()}
                </Card.Text>
                <Card.Text>
                  {project.description.length > 100
                    ? `${project.description.substring(0, 100)}...`
                    : project.description}
                </Card.Text>
              </Card.Body>
              <Card.Footer className="bg-white">
                <div className="d-flex justify-content-between">
                  <div>
                    <Button 
                      as={Link} 
                      to={`/project/${project._id}`} 
                      variant="dark"
                      size="sm"
                      className="me-2"
                    >
                      View Details
                    </Button>
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={() => openEditModal(project)}
                    >
                      Edit
                    </Button>
                  </div>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => onDeleteProject(project._id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Edit Project Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
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
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProjectList;