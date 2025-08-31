import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  TrendingUp, 
  Target, 
  BookOpen, 
  MessageSquare, 
  Play, 
  Award,
  ArrowRight,
  Zap,
  Users,
  Calendar,
  CheckCircle,
  Clock,
  Brain
} from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [careerPaths, setCareerPaths] = useState([]);
  const [marketTrends, setMarketTrends] = useState({});
  const [loading, setLoading] = useState(true);
  const [showQuestionsPrompt, setShowQuestionsPrompt] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock data for demonstration
        const mockCareerPaths = [
          {
            id: 'fullstack_developer',
            name: 'Full Stack Developer',
            match: 65,
            demand: 'High',
            salary: '₹6L - ₹20L'
          },
          {
            id: 'data_analyst',
            name: 'Data Analyst',
            match: 78,
            demand: 'High',
            salary: '₹4L - ₹12L'
          },
          {
            id: 'ml_engineer',
            name: 'ML Engineer',
            match: 45,
            demand: 'Very High',
            salary: '₹8L - ₹25L'
          }
        ];

        const mockMarketTrends = {
          'fullstack_developer': { demand_change: '+14%', hot_locations: ['Bangalore', 'Mumbai', 'Pune'] },
          'data_analyst': { demand_change: '+12%', hot_locations: ['Delhi', 'Bangalore', 'Chennai'] },
          'ml_engineer': { demand_change: '+18%', hot_locations: ['Bangalore', 'Hyderabad', 'Pune'] }
        };

        setCareerPaths(mockCareerPaths);
        setMarketTrends(mockMarketTrends);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Check if user should complete personalized questions
  useEffect(() => {
    // Check if user has completed the initial assessment
    const hasCompletedAssessment = localStorage.getItem('educursus_assessment_completed');
    
    if (!hasCompletedAssessment && user) {
      // Show prompt after a short delay
      const timer = setTimeout(() => {
        setShowQuestionsPrompt(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleStartAssessment = () => {
    navigate('/personalized-questions');
  };

  const handleSkipAssessment = () => {
    localStorage.setItem('educursus_assessment_completed', 'true');
    setShowQuestionsPrompt(false);
  };

  // Prepare radar chart data
  const radarData = Object.entries(user?.current_skills || {}).map(([skill, level]) => ({
    skill: skill.charAt(0).toUpperCase() + skill.slice(1),
    level: level,
    fullMark: 10
  }));

  const quickActions = [
    {
      title: 'Take Skill Assessment',
      description: 'Evaluate your current skills',
      icon: BookOpen,
      href: '/skill-assessment',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Start Mock Interview',
      description: 'Practice with AI interviewer',
      icon: MessageSquare,
      href: '/mock-interview',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Explore Projects',
      description: 'Hands-on learning projects',
      icon: Play,
      href: '/learning-projects',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Career Simulation',
      description: 'Test different scenarios',
      icon: Target,
      href: '/career-simulation',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const recentActivities = [
    { type: 'project', title: 'Completed Python Basics Project', time: '2 hours ago', points: '+50 XP' },
    { type: 'assessment', title: 'Finished SQL Assessment', time: '1 day ago', points: '+30 XP' },
    { type: 'interview', title: 'Completed Mock Interview', time: '3 days ago', points: '+25 XP' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-xl text-white">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Assessment Prompt Modal
  if (showQuestionsPrompt) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="card-glass p-8 max-w-2xl text-center">
          <Brain className="w-20 h-20 text-primary-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Educursus! 🎉
          </h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            To provide you with the best personalized career guidance, let's start with a quick assessment. 
            This will help us understand your skills, interests, and career goals better.
          </p>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-3 text-left">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">Personalized learning recommendations</span>
            </div>
            <div className="flex items-center space-x-3 text-left">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">AI-powered career insights</span>
            </div>
            <div className="flex items-center space-x-3 text-left">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">Customized skill development paths</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleStartAssessment}
              className="btn-primary flex items-center space-x-2"
            >
              <Brain className="w-5 h-5" />
              <span>Start Assessment</span>
            </button>
            <button
              onClick={handleSkipAssessment}
              className="btn-secondary"
            >
              Skip for Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user?.username}! 👋
          </h1>
          <p className="text-xl text-white/80">
            Ready to level up your career? Let's see your progress!
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card-glass text-center p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-4">
              <Award className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{user?.level}</h3>
            <p className="text-gray-600">Current Level</p>
          </div>

          <div className="card-glass text-center p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-success-100 rounded-lg mx-auto mb-4">
              <Zap className="w-6 h-6 text-success-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{user?.experience_points}</h3>
            <p className="text-gray-600">Experience Points</p>
          </div>

          <div className="card-glass text-center p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-warning-100 rounded-lg mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-warning-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{user?.completed_projects}</h3>
            <p className="text-gray-600">Projects Completed</p>
          </div>

          <div className="card-glass text-center p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{user?.mock_interviews_taken}</h3>
            <p className="text-gray-600">Interviews Taken</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Skill Radar Chart */}
          <div className="lg:col-span-2">
            <div className="card-glass p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Skills Radar</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="skill" />
                    <PolarRadiusAxis angle={90} domain={[0, 10]} />
                    <Radar
                      name="Skill Level"
                      dataKey="level"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Track your skill development across different areas
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="card-glass p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={index}
                      to={action.href}
                      className="block p-3 rounded-lg bg-gradient-to-r hover:scale-105 transition-all duration-200 text-white"
                      style={{
                        background: `linear-gradient(135deg, ${action.color.split(' ')[1]} 0%, ${action.color.split(' ')[3]} 100%)`
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Icon className="w-5 h-5" />
                          <div className="text-left">
                            <p className="font-medium">{action.title}</p>
                            <p className="text-sm opacity-90">{action.description}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="card-glass p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className="flex-shrink-0">
                      {activity.type === 'project' && <CheckCircle className="w-5 h-5 text-success-500" />}
                      {activity.type === 'assessment' && <BookOpen className="w-5 h-5 text-primary-500" />}
                      {activity.type === 'interview' && <MessageSquare className="w-5 h-5 text-purple-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{activity.time}</span>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-success-600">{activity.points}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Career Path Recommendations */}
        <div className="card-glass p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Career Path Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {careerPaths.map((career) => (
              <div key={career.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{career.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    career.demand === 'Very High' ? 'bg-red-100 text-red-800' :
                    career.demand === 'High' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {career.demand}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Match Score</span>
                    <span className="text-sm font-medium text-gray-900">{career.match}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${career.match}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  <p>Salary Range: {career.salary}</p>
                  <p className="text-xs mt-1">
                    Hot locations: {marketTrends[career.id]?.hot_locations?.slice(0, 2).join(', ')}
                  </p>
                </div>

                <Link
                  to={`/career-explorer?path=${career.id}`}
                  className="block w-full text-center bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium"
                >
                  Explore Path
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Badges Section */}
        <div className="card-glass p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Badges</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {user?.badges?.map((badge, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <p className="text-xs font-medium text-gray-900">{badge}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
