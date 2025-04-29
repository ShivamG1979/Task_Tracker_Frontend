import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import AuthContext from '../../context/AuthContext';
import ProjectList from '../projects/ProjectList';
import ProjectForm from '../projects/ProjectForm';

const Dashboard = () => {
  const { auth } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('https://task-tracker-backend-da1d.onrender.com/api/projects', {
          headers: {
            'Authorization': `Bearer ${auth.token}`
          }
        });

        const data = await response.json();

        if (data.success) {
          setProjects(data.data);
        } else {
          setError(data.error || 'Failed to fetch projects');
        }
      } catch (err) {
        setError('Server error, please try again');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [auth.token]);

  const addProject = (project) => {
    setProjects([...projects, project]);
  };

  const updateProject = (updatedProject) => {
    setProjects(projects.map(project =>
      project._id === updatedProject._id ? updatedProject : project
    ));
  };

  const deleteProject = async (projectId) => {
    try {
      const response = await fetch(`https://task-tracker-backend-da1d.onrender.com/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setProjects(projects.filter(project => project._id !== projectId));
      } else {
        setError(data.error || 'Failed to delete project');
      }
    } catch (err) {
      setError('Server error, please try again');
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container className="my-4">
      <h1 className="mb-4 text-center text-md-start">Your Projects</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        <Col xs={12} md={8} className="mb-4">
          {projects.length === 0 ? (
            <Alert variant="info">
              No projects yet. Create your first project to get started!
            </Alert>
          ) : (
            <ProjectList
              projects={projects}
              onDeleteProject={deleteProject}
              onUpdateProject={updateProject}
            />
          )}
        </Col>

        <Col xs={12} md={4}>
          <h2 className="mb-3 text-center text-md-start">Create New Project</h2>
          <ProjectForm onAddProject={addProject} />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
