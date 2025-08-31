import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Play, 
  Settings, 
  Clock, 
  DollarSign, 
  MapPin, 
  Users,
  Target,
  TrendingUp,
  Calculator,
  RotateCcw,
  Save,
  Download,
  Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CareerSimulation = () => {
  const { user } = useAuth();
  const [careerPaths, setCareerPaths] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [constraints, setConstraints] = useState({
    part_time: false,
    budget_limited: false,
    remote_only: false,
    time_available: 20, // hours per week
    budget_per_month: 5000,
    preferred_locations: []
  });
  const [simulationResults, setSimulationResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCareerPaths = async () => {
      try {
        // Mock data for demonstration
        const mockCareerPaths = [
          {
            id: 'fullstack_developer',
            name: 'Full Stack Developer',
            description: 'Build complete web applications from frontend to backend',
            base_time: 120, // hours
            base_cost: 15000,
            salary_range: { min: 600000, max: 2000000 },
            skills_required: ['javascript', 'react', 'nodejs', 'python', 'database'],
            learning_path: [
              { skill: 'javascript', time: 30, cost: 2000, resources: ['Free tutorials', 'Paid courses'] },
              { skill: 'react', time: 25, cost: 3000, resources: ['Documentation', 'Video courses'] },
              { skill: 'nodejs', time: 20, cost: 2500, resources: ['Online courses', 'Projects'] },
              { skill: 'python', time: 25, cost: 2000, resources: ['Free resources', 'Books'] },
              { skill: 'database', time: 20, cost: 1500, resources: ['SQL tutorials', 'Practice projects'] }
            ]
          },
          {
            id: 'data_analyst',
            name: 'Data Analyst',
            description: 'Transform raw data into actionable insights',
            base_time: 100,
            base_cost: 12000,
            salary_range: { min: 400000, max: 1200000 },
            skills_required: ['python', 'sql', 'excel', 'statistics', 'data_visualization'],
            learning_path: [
              { skill: 'python', time: 35, cost: 2500, resources: ['Free courses', 'Paid bootcamps'] },
              { skill: 'sql', time: 20, cost: 1500, resources: ['Online tutorials', 'Practice databases'] },
              { skill: 'excel', time: 15, cost: 1000, resources: ['Free videos', 'Advanced courses'] },
              { skill: 'statistics', time: 20, cost: 3000, resources: ['University courses', 'Books'] },
              { skill: 'data_visualization', time: 10, cost: 2000, resources: ['Tool tutorials', 'Design courses'] }
            ]
          },
          {
            id: 'ml_engineer',
            name: 'Machine Learning Engineer',
            description: 'Build and deploy machine learning systems',
            base_time: 150,
            base_cost: 25000,
            salary_range: { min: 800000, max: 2500000 },
            skills_required: ['python', 'machine_learning', 'deep_learning', 'mathematics', 'mlops'],
            learning_path: [
              { skill: 'python', time: 40, cost: 3000, resources: ['Advanced courses', 'Specialized training'] },
              { skill: 'machine_learning', time: 45, cost: 8000, resources: ['University courses', 'Bootcamps'] },
              { skill: 'deep_learning', time: 35, cost: 7000, resources: ['Specialized courses', 'Research papers'] },
              { skill: 'mathematics', time: 20, cost: 4000, resources: ['Online courses', 'Textbooks'] },
              { skill: 'mlops', time: 10, cost: 3000, resources: ['Industry courses', 'Workshops'] }
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

  const runSimulation = () => {
    if (!selectedCareer) return;

    const basePath = selectedCareer;
    let modifiedPath = { ...basePath };
    let totalTime = basePath.base_time;
    let totalCost = basePath.base_cost;
    let modifiedLearningPath = [...basePath.learning_path];

    // Apply constraints
    if (constraints.part_time) {
      totalTime = Math.round(totalTime * 1.5);
      modifiedPath.base_time = totalTime;
    }

    if (constraints.budget_limited) {
      // Reduce costs by focusing on free resources
      totalCost = Math.round(totalCost * 0.6);
      modifiedPath.base_cost = totalCost;
      modifiedLearningPath = modifiedLearningPath.map(item => ({
        ...item,
        cost: Math.round(item.cost * 0.6),
        resources: item.resources.map(resource => 
          resource.includes('Free') ? resource : `Free: ${resource}`
        )
      }));
    }

    if (constraints.remote_only) {
      // Add remote work skills
      modifiedLearningPath.push({
        skill: 'remote_collaboration',
        time: 15,
        cost: 2000,
        resources: ['Remote Work Best Practices', 'Digital Collaboration Tools']
      });
      totalTime += 15;
      totalCost += 2000;
    }

    // Calculate completion time based on available hours
    const weeksToComplete = Math.ceil(totalTime / constraints.time_available);
    const monthsToComplete = Math.ceil(weeksToComplete / 4.33);

    // Calculate ROI
    const avgSalary = (basePath.salary_range.min + basePath.salary_range.max) / 2;
    const investment = totalCost;
    const roi = ((avgSalary - investment) / investment) * 100;

    // Generate timeline data
    const timelineData = [];
    let cumulativeTime = 0;
    let cumulativeCost = 0;

    modifiedLearningPath.forEach((item, index) => {
      cumulativeTime += item.time;
      cumulativeCost += item.cost;
      const week = Math.ceil(cumulativeTime / constraints.time_available);
      
      timelineData.push({
        week: week,
        skill: item.skill,
        time: cumulativeTime,
        cost: cumulativeCost,
        progress: Math.min(100, (cumulativeTime / totalTime) * 100)
      });
    });

    setSimulationResults({
      originalPath: basePath,
      modifiedPath: modifiedPath,
      constraints: constraints,
      timeline: timelineData,
      completion: {
        weeks: weeksToComplete,
        months: monthsToComplete,
        totalTime: totalTime,
        totalCost: totalCost
      },
      roi: roi,
      salary: avgSalary
    });
  };

  const handleConstraintChange = (key, value) => {
    setConstraints(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetSimulation = () => {
    setConstraints({
      part_time: false,
      budget_limited: false,
      remote_only: false,
      time_available: 20,
      budget_per_month: 5000,
      preferred_locations: []
    });
    setSimulationResults(null);
  };

  const exportSimulation = () => {
    if (!simulationResults) return;
    
    const data = {
      career_path: simulationResults.modifiedPath.name,
      constraints: simulationResults.constraints,
      completion: simulationResults.completion,
      roi: simulationResults.roi,
      salary: simulationResults.salary,
      generated_at: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `career-simulation-${simulationResults.modifiedPath.name.toLowerCase().replace(' ', '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-xl text-white">Preparing simulation environment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Career Simulation Sandbox 🎮
          </h1>
          <p className="text-xl text-white/80">
            Test different scenarios and see how they affect your learning journey
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Career Path Selection */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card-glass p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Select Career Path</h3>
              <div className="space-y-3">
                {careerPaths.map((career) => (
                  <div
                    key={career.id}
                    onClick={() => setSelectedCareer(career)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${
                      selectedCareer?.id === career.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <h4 className="font-semibold text-gray-900 mb-2">{career.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{career.description}</p>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-600">{career.base_time}h</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-600">₹{career.base_cost.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Constraints Configuration */}
            <div className="card-glass p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Set Your Constraints</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="part_time"
                    checked={constraints.part_time}
                    onChange={(e) => handleConstraintChange('part_time', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="part_time" className="text-sm text-gray-700">
                    Part-time learning
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="budget_limited"
                    checked={constraints.budget_limited}
                    onChange={(e) => handleConstraintChange('budget_limited', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="budget_limited" className="text-sm text-gray-700">
                    Limited budget
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remote_only"
                    checked={constraints.remote_only}
                    onChange={(e) => handleConstraintChange('remote_only', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="remote_only" className="text-sm text-gray-700">
                    Remote work preference
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hours available per week
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    value={constraints.time_available}
                    onChange={(e) => handleConstraintChange('time_available', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>5h</span>
                    <span>{constraints.time_available}h</span>
                    <span>40h</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly budget (₹)
                  </label>
                  <input
                    type="number"
                    value={constraints.budget_per_month}
                    onChange={(e) => handleConstraintChange('budget_per_month', parseInt(e.target.value))}
                    className="form-input"
                    min="1000"
                    max="50000"
                    step="1000"
                  />
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={runSimulation}
                  disabled={!selectedCareer}
                  className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Play className="w-4 h-4" />
                  <span>Run Simulation</span>
                </button>
                
                <button
                  onClick={resetSimulation}
                  className="w-full btn-secondary flex items-center justify-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>

          {/* Simulation Results */}
          <div className="lg:col-span-2 space-y-6">
            {!simulationResults ? (
              <div className="card-glass p-12 text-center">
                <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Ready to Simulate?
                </h3>
                <p className="text-gray-600">
                  Select a career path and set your constraints to see how they affect your learning journey.
                </p>
              </div>
            ) : (
              <>
                {/* Results Overview */}
                <div className="card-glass p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Simulation Results: {simulationResults.modifiedPath.name}
                    </h2>
                    <button
                      onClick={exportSimulation}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-lg font-bold text-blue-600">
                        {simulationResults.completion.weeks} weeks
                      </div>
                      <p className="text-sm text-blue-700">Time to Complete</p>
                    </div>
                    
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <div className="text-lg font-bold text-green-600">
                        ₹{simulationResults.completion.totalCost.toLocaleString()}
                      </div>
                      <p className="text-sm text-green-700">Total Investment</p>
                    </div>
                    
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <div className="text-lg font-bold text-purple-600">
                        {Math.round(simulationResults.roi)}%
                      </div>
                      <p className="text-sm text-purple-700">ROI</p>
                    </div>
                    
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <Target className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                      <div className="text-lg font-bold text-orange-600">
                        ₹{Math.round(simulationResults.salary / 100000).toFixed(1)}L
                      </div>
                      <p className="text-sm text-orange-700">Avg Salary</p>
                    </div>
                  </div>

                  {/* Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Original Path</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Time:</span>
                          <span className="font-medium">{simulationResults.originalPath.base_time}h</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cost:</span>
                          <span className="font-medium">₹{simulationResults.originalPath.base_cost.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-primary-200 rounded-lg p-4 bg-primary-50">
                      <h4 className="font-semibold text-gray-900 mb-3">Modified Path</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Time:</span>
                          <span className="font-medium">{simulationResults.completion.totalTime}h</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cost:</span>
                          <span className="font-medium">₹{simulationResults.completion.totalCost.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline Chart */}
                <div className="card-glass p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Learning Timeline</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={simulationResults.timeline}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="progress" stroke="#3b82f6" strokeWidth={3} name="Progress %" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Detailed Learning Path */}
                <div className="card-glass p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Modified Learning Path</h3>
                  <div className="space-y-4">
                    {simulationResults.modifiedPath.learning_path.map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900 capitalize">
                            {item.skill.replace('_', ' ')}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-gray-600">
                              <Clock className="w-4 h-4 inline mr-1" />
                              {item.time}h
                            </span>
                            <span className="text-gray-600">
                              <DollarSign className="w-4 h-4 inline mr-1" />
                              ₹{item.cost.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {item.resources.map((resource, idx) => (
                            <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                              <span>{resource}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Insights */}
                <div className="card-glass p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">💡 Simulation Insights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Time Impact</h4>
                      <p className="text-sm text-blue-800">
                        {constraints.part_time ? 
                          'Part-time learning extends your journey but maintains quality.' : 
                          'Full-time learning provides the fastest path to your career goal.'
                        }
                      </p>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">Budget Impact</h4>
                      <p className="text-sm text-green-800">
                        {constraints.budget_limited ? 
                          'Limited budget focuses on free resources while maintaining learning quality.' : 
                          'Full budget allows access to premium courses and resources.'
                        }
                      </p>
                    </div>
                    
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-2">ROI Analysis</h4>
                      <p className="text-sm text-purple-800">
                        With an investment of ₹{simulationResults.completion.totalCost.toLocaleString()}, 
                        you can expect a return of {Math.round(simulationResults.roi)}% based on average salary.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <h4 className="font-semibold text-orange-900 mb-2">Career Outlook</h4>
                      <p className="text-sm text-orange-800">
                        This path leads to a career with an average salary of ₹{Math.round(simulationResults.salary / 100000).toFixed(1)}L, 
                        making it a strong investment in your future.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerSimulation;
