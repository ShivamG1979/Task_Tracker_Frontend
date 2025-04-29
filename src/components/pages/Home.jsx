import { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import AuthContext from '../../context/AuthContext';

const Home = () => {
  const { auth } = useContext(AuthContext);

  if (auth.isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <Container className="py-5">
      <Row className="align-items-center">
        <Col md={6} className="mb-4 mb-md-0">
          <h1 className="display-4 fw-bold mb-4">Manage Your Tasks with Ease</h1>
          <p className="lead mb-4">
            TaskMaster helps you organize your projects and tasks in one place.
            Track progress, set priorities, and achieve your goals effectively.
          </p>
          <div className="d-flex gap-3">
            <Button as={Link} to="/register" variant="dark" size="lg">
              Get Started
            </Button>
            <Button as={Link} to="/login" variant="outline-dark" size="lg">
              Login
            </Button>
          </div>
        </Col>
        <Col md={6}>
          <div className="text-center">
            <img 
              src="./Task-1.webp" 
              alt="Task Management" 
              className="img-fluid rounded shadow"
            />
          </div>
        </Col>
      </Row>

      <Row className="mt-5 pt-5">
        <h2 className="text-center mb-4">Key Features</h2>
        
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center p-4">
              <div className="mb-3">
                <i className="bi bi-kanban fs-1 text-primary"></i>
              </div>
              <Card.Title>Project Management</Card.Title>
              <Card.Text>
                Create and organize projects to keep your work structured.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center p-4">
              <div className="mb-3">
                <i className="bi bi-check2-square fs-1 text-primary"></i>
              </div>
              <Card.Title>Task Tracking</Card.Title>
              <Card.Text>
                Easily manage tasks with status tracking and descriptions.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center p-4">
              <div className="mb-3">
                <i className="bi bi-graph-up fs-1 text-primary"></i>
              </div>
              <Card.Title>Progress Monitoring</Card.Title>
              <Card.Text>
                See your progress and accomplishments at a glance.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;