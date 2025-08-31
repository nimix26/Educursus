import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Compass, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  BookOpen, 
  Target,
  ArrowRight,
  Star,
  MapPin,
  Users,
  Zap
} from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

const CareerExplorer = () => {
  const { user } = useAuth();
  const [careerPaths, setCareerPaths] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [skillGaps, setSkillGaps] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCareerPaths = async () => {
      try {
        // Mock data for demonstration
        const mockCareerPaths = [
          {
            id: 'data_analyst',
            name: 'Data Analyst',
            description: 'Transform raw data into actionable insights that drive business decisions',
            longDescription: 'Data Analysts are the bridge between raw data and business insights. They collect, process, and analyze data to help organizations make informed decisions. This role combines technical skills with business acumen to identify trends, patterns, and opportunities.',
            required_skills: {
              'python': 7,
              'sql': 8,
              'excel': 6,
              'statistics': 7,
              'data_visualization': 6,
              'business_intelligence': 5
            },
            market_demand: 0.85,
            salary_range: { min: 400000, max: 1200000 },
            learning_path: [
              {
                skill: 'python',
                resources: ['Python for Data Science', 'Pandas Tutorial', 'NumPy Fundamentals'],
                time_estimate: 40,
                difficulty: 'Beginner'
              },
              {
                skill: 'sql',
                resources: ['SQL Fundamentals', 'Advanced SQL Queries', 'Database Design'],
                time_estimate: 30,
                difficulty: 'Beginner'
              },
              {
                skill: 'statistics',
                resources: ['Statistics 101', 'Practical Statistics', 'Hypothesis Testing'],
                time_estimate: 35,
                difficulty: 'Intermediate'
              }
            ],
            market_trends: {
              demand_change: '+12%',
              salary_trend: '+6%',
              hot_locations: ['Delhi', 'Bangalore', 'Chennai', 'Mumbai'],
              skills_in_demand: ['Python', 'SQL', 'Tableau', 'Power BI', 'R']
            },
            career_progression: [
              'Junior Data Analyst (0-2 years)',
              'Data Analyst (2-4 years)',
              'Senior Data Analyst (4-6 years)',
              'Lead Data Analyst (6+ years)',
              'Data Science Manager'
            ]
          },
          {
            id: 'fullstack_developer',
            name: 'Full Stack Developer',
            description: 'Build complete web applications from frontend to backend',
            longDescription: 'Full Stack Developers are versatile programmers who can work on both the frontend and backend of web applications. They understand the complete development stack and can build end-to-end solutions, making them highly valuable in modern software development teams.',
            required_skills: {
              'javascript': 8,
              'react': 7,
              'nodejs': 7,
              'python': 6,
              'database': 6,
              'git': 5,
              'html_css': 6,
              'api_design': 6
            },
            market_demand: 0.92,
            salary_range: { min: 600000, max: 2000000 },
            learning_path: [
              {
                skill: 'javascript',
                resources: ['JavaScript ES6+', 'Modern JS Patterns', 'Async Programming'],
                time_estimate: 50,
                difficulty: 'Beginner'
              },
              {
                skill: 'react',
                resources: ['React Fundamentals', 'Advanced React', 'State Management'],
                time_estimate: 45,
                difficulty: 'Intermediate'
              },
              {
                skill: 'nodejs',
                resources: ['Node.js Basics', 'Express.js', 'REST APIs'],
                time_estimate: 40,
                difficulty: 'Intermediate'
              }
            ],
            market_trends: {
              demand_change: '+14%',
              salary_trend: '+8%',
              hot_locations: ['Bangalore', 'Mumbai', 'Pune', 'Hyderabad'],
              skills_in_demand: ['React', 'Node.js', 'Python', 'Cloud', 'DevOps']
            },
            career_progression: [
              'Junior Developer (0-2 years)',
              'Full Stack Developer (2-4 years)',
              'Senior Developer (4-6 years)',
              'Tech Lead (6+ years)',
              'Engineering Manager'
            ]
          },
          {
            id: 'ml_engineer',
            name: 'Machine Learning Engineer',
            description: 'Build and deploy machine learning systems at scale',
            longDescription: 'Machine Learning Engineers combine software engineering skills with machine learning expertise to build, deploy, and maintain ML systems in production. They work on the intersection of data science and software engineering, ensuring ML models are scalable, reliable, and maintainable.',
            required_skills: {
              'python': 9,
              'machine_learning': 8,
              'deep_learning': 7,
              'mathematics': 8,
              'mlops': 6,
              'cloud': 6,
              'software_engineering': 7,
              'data_engineering': 6
            },
            market_demand: 0.78,
            salary_range: { min: 800000, max: 2500000 },
            learning_path: [
              {
                skill: 'python',
                resources: ['Advanced Python', 'Scientific Python', 'Performance Optimization'],
                time_estimate: 60,
                difficulty: 'Intermediate'
              },
              {
                skill: 'machine_learning',
                resources: ['ML Fundamentals', 'Scikit-learn', 'Feature Engineering'],
                time_estimate: 70,
                difficulty: 'Intermediate'
              },
              {
                skill: 'mathematics',
                resources: ['Linear Algebra', 'Calculus for ML', 'Probability & Statistics'],
                time_estimate: 80,
                difficulty: 'Advanced'
              }
            ],
            market_trends: {
              demand_change: '+18%',
              salary_trend: '+12%',
              hot_locations: ['Bangalore', 'Hyderabad', 'Pune', 'Mumbai'],
              skills_in_demand: ['Python', 'TensorFlow', 'PyTorch', 'MLOps', 'AWS/Azure']
            },
            career_progression: [
              'ML Engineer (0-2 years)',
              'Senior ML Engineer (2-4 years)',
              'Lead ML Engineer (4-6 years)',
              'ML Engineering Manager (6+ years)',
              'Director of ML Engineering'
            ]
          }
        ];

        setCareerPaths(mockCareerPaths);
      } catch (error) {
        console.error('Error fetching career paths:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCareerPaths();
  }, []);

  const calculateSkillGaps = (careerPath) => {
    const userSkills = user?.current_skills || {};
    const gaps = {};
    
    Object.entries(careerPath.required_skills).forEach(([skill, requiredLevel]) => {
      const userLevel = userSkills[skill] || 0;
      gaps[skill] = Math.max(0, requiredLevel - userLevel);
    });
    
    return gaps;
  };

  const calculateCareerMatch = (careerPath) => {
    const userSkills = user?.current_skills || {};
    const requiredSkills = careerPath.required_skills;
    
    let totalScore = 0;
    let maxPossibleScore = 0;
    
    Object.entries(requiredSkills).forEach(([skill, requiredLevel]) => {
      const userLevel = userSkills[skill] || 0;
      totalScore += Math.min(userLevel, requiredLevel);
      maxPossibleScore += requiredLevel;
    });
    
    return maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;
  };

  const handleCareerSelect = (career) => {
    setSelectedCareer(career);
    const gaps = calculateSkillGaps(career);
    setSkillGaps(gaps);
  };

  const formatSalary = (amount) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${(amount / 1000).toFixed(0)}K`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-xl text-white">Exploring career paths...</p>
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
            Career Explorer 🧭
          </h1>
          <p className="text-xl text-white/80">
            Discover your ideal career path and understand the skills you need
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Career Paths List */}
          <div className="lg:col-span-1 space-y-4">
            {careerPaths.map((career) => {
              const matchPercentage = calculateCareerMatch(career);
              return (
                <div
                  key={career.id}
                  onClick={() => handleCareerSelect(career)}
                  className={`card-glass p-4 cursor-pointer transition-all duration-200 hover:scale-105 ${
                    selectedCareer?.id === career.id ? 'ring-2 ring-primary-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{career.name}</h3>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600 font-medium">
                        {career.market_trends.demand_change}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{career.description}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-gray-600">
                        {formatSalary(career.salary_range.min)} - {formatSalary(career.salary_range.max)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-900">
                        {Math.round(matchPercentage)}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${matchPercentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Career Details */}
          <div className="lg:col-span-2">
            {selectedCareer ? (
              <div className="space-y-6">
                {/* Career Overview */}
                <div className="card-glass p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {selectedCareer.name}
                      </h2>
                      <p className="text-lg text-gray-600 mb-4">
                        {selectedCareer.longDescription}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary-600">
                        {Math.round(calculateCareerMatch(selectedCareer))}%
                      </div>
                      <p className="text-sm text-gray-500">Match Score</p>
                    </div>
                  </div>

                  {/* Market Trends */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <div className="text-lg font-bold text-green-600">
                        {selectedCareer.market_trends.demand_change}
                      </div>
                      <p className="text-sm text-green-700">Demand</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <DollarSign className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-lg font-bold text-blue-600">
                        {selectedCareer.market_trends.salary_trend}
                      </div>
                      <p className="text-sm text-blue-700">Salary Trend</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <MapPin className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <div className="text-lg font-bold text-purple-600">
                        {selectedCareer.market_trends.hot_locations.length}
                      </div>
                      <p className="text-sm text-purple-700">Hot Locations</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <Users className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                      <div className="text-lg font-bold text-orange-600">
                        {selectedCareer.market_demand * 100}%
                      </div>
                      <p className="text-sm text-orange-700">Market Demand</p>
                    </div>
                  </div>

                  {/* Hot Locations */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">🔥 Hot Locations</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCareer.market_trends.hot_locations.map((location) => (
                        <span key={location} className="badge badge-primary">
                          {location}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Skills in Demand */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">🚀 Skills in Demand</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCareer.market_trends.skills_in_demand.map((skill) => (
                        <span key={skill} className="badge badge-success">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Skills Radar Chart */}
                <div className="card-glass p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Required Skills vs Your Skills</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={Object.entries(selectedCareer.required_skills).map(([skill, level]) => ({
                        skill: skill.replace('_', ' ').toUpperCase(),
                        required: level,
                        current: user?.current_skills?.[skill] || 0,
                        fullMark: 10
                      }))}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="skill" />
                        <PolarRadiusAxis angle={90} domain={[0, 10]} />
                        <Radar
                          name="Required Skills"
                          dataKey="required"
                          stroke="#ef4444"
                          fill="#ef4444"
                          fillOpacity={0.3}
                        />
                        <Radar
                          name="Your Skills"
                          dataKey="current"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.3}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Learning Path */}
                <div className="card-glass p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Learning Path</h3>
                  <div className="space-y-4">
                    {selectedCareer.learning_path.map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900 capitalize">
                            {item.skill.replace('_', ' ')}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <span className={`badge ${
                              item.difficulty === 'Beginner' ? 'badge-success' :
                              item.difficulty === 'Intermediate' ? 'badge-warning' :
                              'badge-secondary'
                            }`}>
                              {item.difficulty}
                            </span>
                            <span className="text-sm text-gray-500">
                              {item.time_estimate}h
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {item.resources.map((resource, idx) => (
                            <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                              <BookOpen className="w-4 h-4" />
                              <span>{resource}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Career Progression */}
                <div className="card-glass p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Career Progression</h3>
                  <div className="space-y-3">
                    {selectedCareer.career_progression.map((level, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-primary-600">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{level}</p>
                          <p className="text-sm text-gray-500">
                            {index === 0 ? 'Entry level' : 
                             index === selectedCareer.career_progression.length - 1 ? 'Senior level' :
                             'Mid level'}
                          </p>
                        </div>
                        {index < selectedCareer.career_progression.length - 1 && (
                          <ArrowRight className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button className="btn-primary flex items-center space-x-2">
                    <Target className="w-4 h-4" />
                    <span>Set as Career Goal</span>
                  </button>
                  <button className="btn-secondary flex items-center space-x-2">
                    <Zap className="w-4 h-4" />
                    <span>Start Learning Path</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="card-glass p-12 text-center">
                <Compass className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Select a Career Path
                </h3>
                <p className="text-gray-600">
                  Choose a career path from the left to explore details, required skills, and learning paths.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerExplorer;
