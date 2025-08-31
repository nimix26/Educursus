import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock user data for demonstration
  const mockUser = {
    id: '1',
    username: 'demo_user',
    email: 'demo@educursus.com',
    interests: ['technology', 'data science', 'web development'],
    current_skills: {
      'python': 6,
      'javascript': 4,
      'sql': 5,
      'react': 3,
      'nodejs': 2
    },
    career_goals: ['fullstack_developer', 'data_analyst'],
    learning_preferences: {
      'learning_pace': 'moderate',
      'preferred_format': 'hands_on',
      'time_availability': 'part_time'
    },
    level: 'Explorer',
    experience_points: 1250,
    badges: ['First Steps', 'Python Beginner', 'Data Explorer'],
    completed_projects: 3,
    mock_interviews_taken: 2
  };

  useEffect(() => {
    // Simulate authentication check
    const checkAuth = async () => {
      try {
        // In a real app, this would check for valid JWT token
        // For demo purposes, we'll auto-login with mock user
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setUser(mockUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      // Simple login system - always use demo mode for now
      if (email === 'demo@educursus.com' && password === 'demo123') {
        setUser(mockUser);
        setIsAuthenticated(true);
        return { success: true, note: 'Demo mode - Welcome!' };
      } else if (email === 'test@educursus.com' && password === 'test123') {
        // Add another test user
        const testUser = {
          ...mockUser,
          username: 'test_user',
          email: 'test@educursus.com',
          level: 'Intermediate',
          experience_points: 2500,
          badges: ['First Steps', 'Python Intermediate', 'Data Explorer', 'Quick Learner']
        };
        setUser(testUser);
        setIsAuthenticated(true);
        return { success: true, note: 'Test user - Welcome!' };
      } else {
        throw new Error('Invalid credentials. Use demo@educursus.com / demo123 or test@educursus.com / test123');
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      // Simple local registration - no API calls
      const newUser = {
        ...userData,
        id: Date.now().toString(),
        current_skills: {},
        career_goals: [],
        learning_preferences: {},
        level: 'Explorer',
        experience_points: 0,
        badges: ['First Steps'],
        completed_projects: 0,
        mock_interviews_taken: 0
      };
      
      setUser(newUser);
      setIsAuthenticated(true);
      return { success: true, note: 'Registration successful!' };
    } catch (error) {
      throw new Error('Registration failed. Please try again.');
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUserProfile = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const updateSkills = (skillName, newLevel) => {
    setUser(prev => ({
      ...prev,
      current_skills: {
        ...prev.current_skills,
        [skillName]: newLevel
      }
    }));
  };

  const addExperiencePoints = (points) => {
    setUser(prev => {
      const newPoints = prev.experience_points + points;
      let newLevel = prev.level;
      
      // Level progression logic
      if (newPoints >= 5000) newLevel = 'Industry Ready';
      else if (newPoints >= 3000) newLevel = 'Skilled';
      else if (newPoints >= 1500) newLevel = 'Intermediate';
      else if (newPoints >= 500) newLevel = 'Explorer';
      
      return {
        ...prev,
        experience_points: newPoints,
        level: newLevel
      };
    });
  };

  const addBadge = (badgeName) => {
    setUser(prev => ({
      ...prev,
      badges: [...new Set([...prev.badges, badgeName])]
    }));
  };

  const completeProject = () => {
    setUser(prev => ({
      ...prev,
      completed_projects: prev.completed_projects + 1
    }));
    addExperiencePoints(100);
  };

  const completeMockInterview = () => {
    setUser(prev => ({
      ...prev,
      mock_interviews_taken: prev.mock_interviews_taken + 1
    }));
    addExperiencePoints(50);
  };

  const getPersonalizedQuestions = async (careerInterest = null, skillFocus = null) => {
    // Return personalized questions based on user profile
    const questions = [
      {
        question: "What are your top 3 career goals for the next 2 years?",
        type: "career_planning",
        category: "goal_setting",
        difficulty: "beginner",
        expected_answer: "Specific, measurable, achievable goals",
        tips: "Make goals SMART (Specific, Measurable, Achievable, Relevant, Time-bound)",
        career_relevance: "Clear goals help focus your learning and career decisions"
      },
      {
        question: "How do you plan to improve your technical skills?",
        type: "skill_development",
        category: "learning",
        difficulty: "beginner",
        expected_answer: "Specific learning plan and practice strategies",
        tips: "Focus on practical projects and consistent practice",
        career_relevance: "Improving technical skills will enhance your career prospects"
      },
      {
        question: "What interests you most about technology and programming?",
        type: "behavioral",
        category: "interests",
        difficulty: "beginner",
        expected_answer: "Genuine interest and motivation",
        tips: "Be honest about what excites you",
        career_relevance: "Passion drives long-term success in tech"
      },
      {
        question: "How do you handle learning new programming languages or tools?",
        type: "behavioral",
        category: "learning_style",
        difficulty: "beginner",
        expected_answer: "Structured approach to learning",
        tips: "Mention specific strategies you use",
        career_relevance: "Learning ability is crucial in fast-changing tech"
      },
      {
        question: "What would you do if you get stuck on a coding problem?",
        type: "problem_solving",
        category: "troubleshooting",
        difficulty: "beginner",
        expected_answer: "Systematic approach to debugging",
        tips: "Show your problem-solving process",
        career_relevance: "Problem-solving skills are essential for developers"
      }
    ];
    
    return { 
      success: true, 
      data: {
        questions: questions,
        personalized_insights: `Based on your ${user?.level || 'beginner'} level, focus on building practical skills and networking.`,
        recommendations: [
          "Complete hands-on projects to build portfolio",
          "Join professional communities and forums",
          "Set specific learning milestones",
          "Practice coding daily",
          "Learn from real-world examples"
        ]
      }
    };
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUserProfile,
    updateSkills,
    addExperiencePoints,
    addBadge,
    completeProject,
    completeMockInterview,
    getPersonalizedQuestions
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
