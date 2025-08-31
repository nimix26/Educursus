import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  MapPin, 
  Users, 
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Zap
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

const MarketTrends = () => {
  const [marketData, setMarketData] = useState({});
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('quarterly');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        // Mock market data for demonstration
        const mockData = {
          overall_trends: {
            total_jobs: 15420,
            growth_rate: '+12.5%',
            average_salary: '₹8.2L',
            salary_growth: '+8.3%',
            top_skills: ['Python', 'React', 'Data Analysis', 'Cloud Computing', 'Machine Learning']
          },
          career_paths: {
            'fullstack_developer': {
              demand_change: '+14%',
              salary_trend: '+8%',
              hot_locations: ['Bangalore', 'Mumbai', 'Pune', 'Hyderabad'],
              skills_in_demand: ['React', 'Node.js', 'Python', 'Cloud', 'DevOps'],
              job_count: 3240,
              avg_salary: '₹12.5L',
              growth_forecast: '+18%'
            },
            'data_analyst': {
              demand_change: '+12%',
              salary_trend: '+6%',
              hot_locations: ['Delhi', 'Bangalore', 'Chennai', 'Mumbai'],
              skills_in_demand: ['Python', 'SQL', 'Tableau', 'Power BI', 'Statistics'],
              job_count: 2180,
              avg_salary: '₹7.8L',
              growth_forecast: '+15%'
            },
            'ml_engineer': {
              demand_change: '+18%',
              salary_trend: '+12%',
              hot_locations: ['Bangalore', 'Hyderabad', 'Pune', 'Mumbai'],
              skills_in_demand: ['Python', 'TensorFlow', 'PyTorch', 'MLOps', 'AWS/Azure'],
              job_count: 1560,
              avg_salary: '₹18.2L',
              growth_forecast: '+25%'
            },
            'devops_engineer': {
              demand_change: '+16%',
              salary_trend: '+10%',
              hot_locations: ['Bangalore', 'Mumbai', 'Pune', 'Chennai'],
              skills_in_demand: ['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Terraform'],
              job_count: 1890,
              avg_salary: '₹14.5L',
              growth_forecast: '+20%'
            }
          },
          locations: {
            'Bangalore': {
              total_jobs: 4850,
              growth_rate: '+15%',
              avg_salary: '₹11.2L',
              top_companies: ['Amazon', 'Google', 'Microsoft', 'Infosys', 'Wipro'],
              market_share: '31.5%'
            },
            'Mumbai': {
              total_jobs: 3240,
              growth_rate: '+12%',
              avg_salary: '₹9.8L',
              top_companies: ['JPMorgan', 'Goldman Sachs', 'Morgan Stanley', 'TCS', 'Cognizant'],
              market_share: '21.0%'
            },
            'Pune': {
              total_jobs: 2180,
              growth_rate: '+18%',
              avg_salary: '₹8.5L',
              top_companies: ['Persistent', 'Tech Mahindra', 'Infosys', 'Cognizant', 'Accenture'],
              market_share: '14.1%'
            },
            'Hyderabad': {
              total_jobs: 1890,
              growth_rate: '+14%',
              avg_salary: '₹8.2L',
              top_companies: ['Microsoft', 'Amazon', 'Google', 'Infosys', 'TCS'],
              market_share: '12.3%'
            },
            'Delhi': {
              total_jobs: 1560,
              growth_rate: '+10%',
              avg_salary: '₹9.1L',
              top_companies: ['HCL', 'TCS', 'Infosys', 'Wipro', 'Cognizant'],
              market_share: '10.1%'
            }
          },
          skills_analysis: {
            'Python': { demand: 85, growth: '+22%', avg_salary: '₹9.8L' },
            'React': { demand: 78, growth: '+18%', avg_salary: '₹11.2L' },
            'Data Analysis': { demand: 72, growth: '+15%', avg_salary: '₹8.5L' },
            'Cloud Computing': { demand: 68, growth: '+25%', avg_salary: '₹12.8L' },
            'Machine Learning': { demand: 65, growth: '+28%', avg_salary: '₹15.2L' },
            'DevOps': { demand: 62, growth: '+20%', avg_salary: '₹13.5L' }
          }
        };

        setMarketData(mockData);
      } catch (error) {
        console.error('Error fetching market data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  const formatSalary = (amount) => {
    if (amount.includes('L')) return amount;
    const num = parseFloat(amount);
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    return `₹${(num / 1000).toFixed(0)}K`;
  };

  const getGrowthColor = (growth) => {
    if (growth.startsWith('+')) return 'text-green-600';
    if (growth.startsWith('-')) return 'text-red-600';
    return 'text-gray-600';
  };

  const getGrowthIcon = (growth) => {
    if (growth.startsWith('+')) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (growth.startsWith('-')) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Activity className="w-4 h-4 text-gray-500" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-xl text-white">Analyzing market trends...</p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const careerPathData = Object.entries(marketData.career_paths || {}).map(([key, value]) => ({
    name: key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    demand: parseInt(value.demand_change.replace('+', '').replace('%', '')),
    salary: parseFloat(value.avg_salary.replace('₹', '').replace('L', '')),
    jobs: value.job_count
  }));

  const locationData = Object.entries(marketData.locations || {}).map(([key, value]) => ({
    name: key,
    jobs: value.total_jobs,
    growth: parseInt(value.growth_rate.replace('+', '').replace('%', '')),
    salary: parseFloat(value.avg_salary.replace('₹', '').replace('L', ''))
  }));

  const skillsData = Object.entries(marketData.skills_analysis || {}).map(([key, value]) => ({
    name: key,
    demand: value.demand,
    growth: parseInt(value.growth.replace('+', '').replace('%', '')),
    salary: parseFloat(value.avg_salary.replace('₹', '').replace('L', ''))
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Job Market Pulse 📊
          </h1>
          <p className="text-xl text-white/80">
            Real-time insights into hiring trends, salary data, and market demand
          </p>
        </div>

        {/* Overall Market Overview */}
        <div className="card-glass p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Market Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {marketData.overall_trends?.total_jobs?.toLocaleString()}
              </div>
              <p className="text-blue-700 font-medium">Total Jobs</p>
              <div className="flex items-center justify-center space-x-1 mt-1">
                {getGrowthIcon(marketData.overall_trends?.growth_rate)}
                <span className={`text-sm font-medium ${getGrowthColor(marketData.overall_trends?.growth_rate)}`}>
                  {marketData.overall_trends?.growth_rate}
                </span>
              </div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">
                {marketData.overall_trends?.average_salary}
              </div>
              <p className="text-green-700 font-medium">Average Salary</p>
              <div className="flex items-center justify-center space-x-1 mt-1">
                {getGrowthIcon(marketData.overall_trends?.salary_growth)}
                <span className={`text-sm font-medium ${getGrowthColor(marketData.overall_trends?.salary_growth)}`}>
                  {marketData.overall_trends?.salary_growth}
                </span>
              </div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {marketData.overall_trends?.growth_rate}
              </div>
              <p className="text-purple-700 font-medium">Growth Rate</p>
              <p className="text-sm text-purple-600 mt-1">vs. last quarter</p>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-600">
                {marketData.overall_trends?.top_skills?.length || 0}
              </div>
              <p className="text-orange-700 font-medium">Hot Skills</p>
              <p className="text-sm text-orange-600 mt-1">in demand</p>
            </div>
          </div>
        </div>

        {/* Career Path Analysis */}
        <div className="card-glass p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Career Path Demand Analysis
          </h2>
          <div className="h-80 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={careerPathData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="demand" fill="#3b82f6" name="Demand Growth (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(marketData.career_paths || {}).map(([key, value]) => (
              <div key={key} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-900 mb-2 capitalize">
                  {key.replace('_', ' ')}
                </h3>
                
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Demand:</span>
                    <div className="flex items-center space-x-1">
                      {getGrowthIcon(value.demand_change)}
                      <span className={`text-sm font-medium ${getGrowthColor(value.demand_change)}`}>
                        {value.demand_change}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Salary:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {value.avg_salary}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Jobs:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {value.job_count.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  <p>Forecast: {value.growth_forecast}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Location Analysis */}
        <div className="card-glass p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Location-wise Market Analysis
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={locationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="jobs" fill="#10b981" name="Job Count" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Location Details */}
            <div className="space-y-4">
              {Object.entries(marketData.locations || {}).map(([key, value]) => (
                <div key={key} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{key}</h3>
                    <span className="text-sm text-gray-500">{value.market_share}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-600">Total Jobs</p>
                      <p className="font-medium text-gray-900">{value.total_jobs.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Avg Salary</p>
                      <p className="font-medium text-gray-900">{value.avg_salary}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    {getGrowthIcon(value.growth_rate)}
                    <span className={`text-sm font-medium ${getGrowthColor(value.growth_rate)}`}>
                      {value.growth_rate} growth
                    </span>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Top Companies:</p>
                    <div className="flex flex-wrap gap-2">
                      {value.top_companies.slice(0, 3).map((company, index) => (
                        <span key={index} className="badge badge-primary text-xs">
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skills Analysis */}
        <div className="card-glass p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Skills Demand & Salary Analysis
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={skillsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="demand"
                  >
                    {skillsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>

            {/* Skills Details */}
            <div className="space-y-4">
              {Object.entries(marketData.skills_analysis || {}).map(([key, value]) => (
                <div key={key} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">{key}</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Demand Score</span>
                        <span className="text-sm font-medium text-gray-900">{value.demand}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${value.demand}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Growth:</span>
                      <div className="flex items-center space-x-1">
                        {getGrowthIcon(value.growth)}
                        <span className={`text-sm font-medium ${getGrowthColor(value.growth)}`}>
                          {value.growth}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Avg Salary:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {value.avg_salary}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Market Insights */}
        <div className="card-glass p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            💡 Market Insights & Recommendations
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">High Growth Areas</h3>
              <p className="text-sm text-gray-600">
                ML Engineering and DevOps show the highest growth rates. Consider upskilling in these areas for better career prospects.
              </p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Location Strategy</h3>
              <p className="text-sm text-gray-600">
                Bangalore leads with 31.5% market share. Pune shows the highest growth rate at 18%, making it an emerging tech hub.
              </p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Skill Priorities</h3>
              <p className="text-sm text-gray-600">
                Python, React, and Cloud Computing are the most in-demand skills. Focus on these for maximum employability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketTrends;
