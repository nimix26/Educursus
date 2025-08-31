import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  BookOpen, 
  Clock, 
  Target, 
  Play, 
  CheckCircle, 
  Star,
  ArrowRight,
  Zap,
  Award,
  Users,
  TrendingUp
} from 'lucide-react';

const LearningProjects = () => {
  const { user, completeProject, addExperiencePoints, addBadge } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Mock data for demonstration
        const mockProjects = [
          {
            id: 'python_basics',
            title: 'Python Basics Project',
            description: 'Build a simple calculator and learn Python fundamentals',
            longDescription: 'This project will teach you Python basics including variables, functions, loops, and user input. You\'ll build a functional calculator that can perform basic arithmetic operations.',
            difficulty: 'beginner',
            skills_required: ['python'],
            estimated_time: 8,
            project_type: 'programming',
            resources: [
              'Python Installation Guide',
              'Basic Syntax Tutorial',
              'Function Documentation'
            ],
            steps: [
              'Set up Python environment',
              'Learn basic syntax',
              'Create calculator functions',
              'Add user input handling',
              'Test and debug',
              'Document your code'
            ],
            expected_outcome: 'A working calculator application with clean, documented code',
            rewards: {
              experience_points: 100,
              skill_boost: 2,
              badge: 'Python Beginner'
            }
          },
          {
            id: 'data_analysis',
            title: 'Sales Data Analysis',
            description: 'Analyze company sales data to identify trends and insights',
            longDescription: 'Work with real sales data to practice data analysis skills. You\'ll clean data, perform exploratory analysis, create visualizations, and present your findings.',
            difficulty: 'intermediate',
            skills_required: ['python', 'pandas', 'data_visualization'],
            estimated_time: 12,
            project_type: 'data_analysis',
            resources: [
              'Pandas Documentation',
              'Matplotlib Tutorial',
              'Data Cleaning Best Practices'
            ],
            steps: [
              'Import and explore the dataset',
              'Clean and preprocess data',
              'Perform exploratory analysis',
              'Create visualizations',
              'Identify key insights',
              'Write analysis report'
            ],
            expected_outcome: 'Comprehensive data analysis report with visualizations and insights',
            rewards: {
              experience_points: 150,
              skill_boost: 3,
              badge: 'Data Explorer'
            }
          },
          {
            id: 'web_app',
            title: 'Todo Web Application',
            description: 'Build a full-stack todo application with React and Node.js',
            longDescription: 'Create a complete web application from frontend to backend. Learn modern web development practices, state management, API design, and database operations.',
            difficulty: 'advanced',
            skills_required: ['javascript', 'react', 'nodejs', 'database'],
            estimated_time: 20,
            project_type: 'web_development',
            resources: [
              'React Documentation',
              'Node.js Tutorial',
              'Express.js Guide',
              'MongoDB Basics'
            ],
            steps: [
              'Plan application architecture',
              'Set up development environment',
              'Build React frontend',
              'Create Node.js backend',
              'Design and implement database',
              'Add authentication',
              'Deploy application'
            ],
            expected_outcome: 'Fully functional todo web application with user authentication',
            rewards: {
              experience_points: 250,
              skill_boost: 4,
              badge: 'Full Stack Developer'
            }
          }
        ];

        setProjects(mockProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectStart = (project) => {
    setSelectedProject(project);
  };

  const handleProjectComplete = (project) => {
    completeProject();
    addExperiencePoints(project.rewards.experience_points);
    addBadge(project.rewards.badge);
    
    // Update user skills
    project.skills_required.forEach(skill => {
      const currentLevel = user.current_skills[skill] || 0;
      const newLevel = Math.min(10, currentLevel + project.rewards.skill_boost);
      // In a real app, this would call the API to update skills
    });
    
    setSelectedProject(null);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'badge-success';
      case 'intermediate': return 'badge-warning';
      case 'advanced': return 'badge-secondary';
      default: return 'badge-primary';
    }
  };

  const getProjectTypeIcon = (type) => {
    switch (type) {
      case 'programming': return '💻';
      case 'data_analysis': return '📊';
      case 'web_development': return '🌐';
      case 'machine_learning': return '🤖';
      default: return '📚';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-xl text-white">Loading learning projects...</p>
        </div>
      </div>
    );
  }

  if (selectedProject) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          {/* Project Header */}
          <div className="card-glass p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {selectedProject.title}
                </h1>
                <p className="text-lg text-gray-600 mb-4">
                  {selectedProject.longDescription}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary-600">
                  {getProjectTypeIcon(selectedProject.project_type)}
                </div>
                <p className="text-sm text-gray-500">Project Type</p>
              </div>
            </div>

            {/* Project Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-blue-600">
                  {selectedProject.estimated_time}h
                </div>
                <p className="text-sm text-blue-700">Estimated Time</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <Target className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-green-600">
                  {selectedProject.difficulty}
                </div>
                <p className="text-sm text-green-700">Difficulty</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <Zap className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-purple-600">
                  +{selectedProject.rewards.experience_points} XP
                </div>
                <p className="text-sm text-purple-700">Reward</p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <Award className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-orange-600">
                  {selectedProject.rewards.badge}
                </div>
                <p className="text-sm text-orange-700">Badge</p>
              </div>
            </div>

            {/* Required Skills */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {selectedProject.skills_required.map((skill) => (
                  <span key={skill} className="badge badge-primary">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Project Steps */}
          <div className="card-glass p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Project Steps</h3>
            <div className="space-y-4">
              {selectedProject.steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary-600">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Resources */}
          <div className="card-glass p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Learning Resources</h3>
            <div className="space-y-3">
              {selectedProject.resources.map((resource, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <BookOpen className="w-5 h-5 text-primary-500" />
                  <span className="text-gray-700">{resource}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Expected Outcome */}
          <div className="card-glass p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Expected Outcome</h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">{selectedProject.expected_outcome}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              onClick={() => setSelectedProject(null)}
              className="btn-secondary flex items-center space-x-2"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span>Back to Projects</span>
            </button>
            
            <button
              onClick={() => handleProjectComplete(selectedProject)}
              className="btn-success flex items-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Mark as Complete</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Learning Projects 📚
          </h1>
          <p className="text-xl text-white/80">
            Hands-on projects to build real-world skills and earn experience points
          </p>
        </div>

        {/* User Progress */}
        <div className="card-glass p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Your Learning Progress
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">{user?.completed_projects || 0}</div>
              <p className="text-gray-600">Projects Completed</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-success-600">{user?.experience_points || 0}</div>
              <p className="text-gray-600">Total Experience Points</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-warning-600">{user?.level || 'Explorer'}</div>
              <p className="text-gray-600">Current Level</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{user?.badges?.length || 0}</div>
              <p className="text-gray-600">Badges Earned</p>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="card-glass p-6 hover:scale-105 transition-transform">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">
                  {getProjectTypeIcon(project.project_type)}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
              </div>

              {/* Project Stats */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Difficulty:</span>
                  <span className={`badge ${getDifficultyColor(project.difficulty)}`}>
                    {project.difficulty}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Time:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {project.estimated_time} hours
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Skills:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {project.skills_required.length} required
                  </span>
                </div>
              </div>

              {/* Required Skills */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {project.skills_required.map((skill) => (
                    <span key={skill} className="badge badge-primary text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Rewards */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-yellow-800">Rewards:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-800">+{project.rewards.experience_points} XP</span>
                    <span className="text-yellow-800">•</span>
                    <span className="text-yellow-800">{project.rewards.badge}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleProjectStart(project)}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Start Project</span>
              </button>
            </div>
          ))}
        </div>

        {/* Learning Tips */}
        <div className="mt-12 card-glass p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            💡 Learning Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Set Clear Goals</h3>
              <p className="text-sm text-gray-600">
                Define what you want to achieve with each project
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Time Management</h3>
              <p className="text-sm text-gray-600">
                Break projects into smaller, manageable tasks
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Collaborate</h3>
              <p className="text-sm text-gray-600">
                Work with others to learn different approaches
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningProjects;
