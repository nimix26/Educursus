import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Edit, 
  Save, 
  X, 
  Star, 
  Trophy, 
  Target,
  TrendingUp,
  Award,
  Settings,
  Bell,
  Shield
} from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUserProfile, updateSkills } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    interests: user?.interests || [],
    career_goals: user?.career_goals || []
  });

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({
      username: user?.username || '',
      email: user?.email || '',
      interests: user?.interests || [],
      career_goals: user?.career_goals || []
    });
  };

  const handleSave = () => {
    updateUserProfile(editForm);
    setIsEditing(false);
    toast.success('Profile updated successfully! 🎉');
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleInterestChange = (interest, checked) => {
    if (checked) {
      setEditForm(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }));
    } else {
      setEditForm(prev => ({
        ...prev,
        interests: prev.interests.filter(i => i !== interest)
      }));
    }
  };

  const handleCareerGoalChange = (goal, checked) => {
    if (checked) {
      setEditForm(prev => ({
        ...prev,
        career_goals: [...prev.career_goals, goal]
      }));
    } else {
      setEditForm(prev => ({
        ...prev,
        career_goals: prev.career_goals.filter(g => g !== goal)
      }));
    }
  };

  const availableInterests = [
    'technology', 'data science', 'web development', 'mobile development',
    'artificial intelligence', 'machine learning', 'cybersecurity', 'cloud computing',
    'blockchain', 'game development', 'ui/ux design', 'product management'
  ];

  const availableCareerGoals = [
    'fullstack_developer', 'data_analyst', 'ml_engineer', 'devops_engineer',
    'cybersecurity_analyst', 'product_manager', 'ui_ux_designer', 'data_scientist'
  ];

  // Prepare radar chart data
  const radarData = Object.entries(user?.current_skills || {}).map(([skill, level]) => ({
    skill: skill.charAt(0).toUpperCase() + skill.slice(1),
    level: level,
    fullMark: 10
  }));

  const getLevelColor = (level) => {
    if (level >= 8) return 'text-green-600';
    if (level >= 6) return 'text-blue-600';
    if (level >= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getLevelLabel = (level) => {
    if (level >= 8) return 'Expert';
    if (level >= 6) return 'Advanced';
    if (level >= 4) return 'Intermediate';
    if (level >= 2) return 'Beginner';
    return 'Novice';
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            Your Profile 👤
          </h1>
          <p className="text-xl text-white/80">
            Manage your skills, preferences, and career goals
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="card-glass p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                      className="form-input text-center font-semibold text-lg"
                    />
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      className="form-input text-center"
                    />
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {user?.username}
                    </h2>
                    <p className="text-gray-600">{user?.email}</p>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="text-gray-700">Level</span>
                  </div>
                  <span className="font-semibold text-gray-900">{user?.level}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-primary-500" />
                    <span className="text-gray-700">Experience</span>
                  </div>
                  <span className="font-semibold text-gray-900">{user?.experience_points} XP</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Projects</span>
                  </div>
                  <span className="font-semibold text-gray-900">{user?.completed_projects}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-700">Badges</span>
                  </div>
                  <span className="font-semibold text-gray-900">{user?.badges?.length}</span>
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing ? (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="flex-1 btn-success flex items-center justify-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 btn-secondary flex items-center justify-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleEdit}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skills Management */}
            <div className="card-glass p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Skills Management</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {Object.entries(user?.current_skills || {}).map(([skill, level]) => (
                  <div key={skill} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 capitalize">
                        {skill.replace('_', ' ')}
                      </h4>
                      <span className={`text-sm font-medium ${getLevelColor(level)}`}>
                        {getLevelLabel(level)}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Current Level: {level}/10</span>
                        <span className="text-gray-500">Target: 10</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(level / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex space-x-2">
                      <button
                        onClick={() => updateSkills(skill, Math.max(1, level - 1))}
                        className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        -
                      </button>
                      <button
                        onClick={() => updateSkills(skill, Math.min(10, level + 1))}
                        className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Skill */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Add New Skill</h4>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Skill name"
                    className="form-input flex-1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        updateSkills(e.target.value.trim().toLowerCase(), 1);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.target.previousElementSibling;
                      if (input.value.trim()) {
                        updateSkills(input.value.trim().toLowerCase(), 1);
                        input.value = '';
                      }
                    }}
                    className="btn-primary px-4"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Skills Radar Chart */}
            <div className="card-glass p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Skills Overview</h3>
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
            </div>

            {/* Interests & Career Goals */}
            <div className="card-glass p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Interests & Career Goals</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Interests */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Interests</h4>
                  <div className="space-y-2">
                    {availableInterests.map((interest) => (
                      <label key={interest} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={editForm.interests.includes(interest)}
                          onChange={(e) => handleInterestChange(interest, e.target.checked)}
                          disabled={!isEditing}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 capitalize">
                          {interest.replace('_', ' ')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Career Goals */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Career Goals</h4>
                  <div className="space-y-2">
                    {availableCareerGoals.map((goal) => (
                      <label key={goal} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={editForm.career_goals.includes(goal)}
                          onChange={(e) => handleCareerGoalChange(goal, e.target.checked)}
                          disabled={!isEditing}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 capitalize">
                          {goal.replace('_', ' ')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Badges Collection */}
            <div className="card-glass p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Badges Collection</h3>
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

            {/* Settings */}
            <div className="card-glass p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Account Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">Email Notifications</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">Privacy Settings</span>
                  </div>
                  <button className="text-sm text-primary-600 hover:text-primary-700">
                    Manage
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">Advanced Settings</span>
                  </div>
                  <button className="text-sm text-primary-600 hover:text-primary-700">
                    Configure
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
