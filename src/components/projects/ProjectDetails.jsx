import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col, Alert, Spinner, Badge } from 'react-bootstrap';
import AuthContext from '../../context/AuthContext';
import TaskList from '../tasks/TaskList';
import TaskForm from '../tasks/TaskForm';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch project and tasks
  const fetchProjectAndTasks = async () => {
    try {
      // Fetch project details
      const projectResponse = await fetch(`https://task-tracker-backend-da1d.onrender.com/api/projects/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      });
      
      const projectData = await projectResponse.json();
      
      if (!projectData.success) {
        setError('Project not found');
        setLoading(false);
        return;
      }
      
      setProject(projectData.data);
      
      // Fetch tasks for this project
      const tasksResponse = await fetch(`https://task-tracker-backend-da1d.onrender.com/api/projects/${id}/tasks`, {
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      });
      
      const tasksData = await tasksResponse.json();
      
      if (tasksData.success) {
        setTasks(tasksData.data);
      }
    } catch (err) {
      setError('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectAndTasks();
  }, [id, auth.token]);

  // Add new task
  const addTask = (task) => {
    setTasks([...tasks, task]);
  };

  // Update task
  const updateTask = (updatedTask) => {
    setTasks(tasks.map(task => 
      task._id === updatedTask._id ? updatedTask : task
    ));
  };

  // Delete task
  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`https://task-tracker-backend-da1d.onrender.com/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setTasks(tasks.filter(task => task._id !== taskId));
      }
    } catch (err) {
      setError('Failed to delete task');
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

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Button as={Link} to="/dashboard" variant="dark " size="sm">
            &larr; Back to Dashboard
          </Button>
          <h1 className="mt-2">{project.name}</h1>
        </div>
      </div>

      <Row className="mb-4">
        <Col xs={12} md={12}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Project Details</Card.Title>
              <Card.Text>{project.description}</Card.Text>
              <Card.Text className="text-muted">
                Created: {new Date(project.createdAt).toLocaleDateString()}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col xs={12} md={8} className="mb-4">
          <h2>Tasks</h2>
          {tasks.length === 0 ? (
            <Alert variant="info">No tasks yet. Add your first task to get started!</Alert>
          ) : (
            <TaskList 
              tasks={tasks} 
              onUpdateTask={updateTask} 
              onDeleteTask={deleteTask} 
            />
          )}
        </Col>

        <Col xs={12} md={4}>
          <h2 className="mb-3">Add New Task</h2>
          <TaskForm projectId={id} onAddTask={addTask} />
        </Col>
      </Row>
    </>
  );
};

// Add this line to fix the error
export default ProjectDetails;
