import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Brain, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Trophy, 
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

const SkillAssessment = () => {
  const { user, updateSkills, addExperiencePoints, addBadge } = useAuth();
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const assessments = [
    {
      id: 'python_basics',
      title: 'Python Basics Challenge',
      description: 'Test your Python fundamentals with real-world problems',
      duration: 300, // 5 minutes
      difficulty: 'Beginner',
      skills: ['python'],
      questions: [
        {
          question: 'Here\'s a real-world dataset, try to answer 3 questions in 5 minutes.',
          type: 'coding',
          code: `# Sample sales data
sales_data = [
    {"product": "Laptop", "price": 1200, "quantity": 5, "date": "2024-01-15"},
    {"product": "Mouse", "price": 25, "quantity": 20, "date": "2024-01-15"},
    {"product": "Keyboard", "price": 80, "quantity": 8, "date": "2024-01-16"},
    {"product": "Monitor", "price": 300, "quantity": 3, "date": "2024-01-16"},
    {"product": "Laptop", "price": 1200, "quantity": 2, "date": "2024-01-17"}
]

# Questions:
# 1. Calculate total revenue for each product
# 2. Find the product with highest total sales value
# 3. Calculate average order value per day`,
          expectedKeywords: ['revenue', 'total', 'product', 'sales', 'average', 'day'],
          hints: [
            'Use a dictionary to group by product',
            'Calculate revenue = price * quantity',
            'Group by date and calculate daily totals'
          ]
        },
        {
          question: 'Solve this small puzzle like a penetration tester.',
          type: 'security',
          code: `# You find this encoded message:
encoded = "U2FsdGVkX1+Qh8K8s8Cl0A=="

# And this Python code:
def decrypt_message(encoded_msg, password):
    # Implementation here
    pass

# What would you do to decode this message?`,
          expectedKeywords: ['base64', 'decode', 'password', 'crack', 'hash', 'encryption'],
          hints: [
            'This looks like base64 encoding',
            'Try common password cracking techniques',
            'Look for patterns in the encoded string'
          ]
        }
      ]
    },
    {
      id: 'data_analysis',
      title: 'Data Analysis Challenge',
      description: 'Analyze real datasets and extract insights',
      duration: 600, // 10 minutes
      difficulty: 'Intermediate',
      skills: ['python', 'pandas', 'data_visualization'],
      questions: [
        {
          question: 'Analyze this customer dataset and identify key insights.',
          type: 'analysis',
          code: `import pandas as pd

# Customer dataset
customers = pd.DataFrame({
    'customer_id': range(1, 101),
    'age': np.random.randint(18, 70, 100),
    'income': np.random.randint(20000, 150000, 100),
    'purchase_amount': np.random.randint(50, 5000, 100),
    'loyalty_score': np.random.randint(1, 10, 100)
})

# Tasks:
# 1. Identify customer segments
# 2. Find correlation between variables
# 3. Suggest marketing strategies`,
          expectedKeywords: ['segmentation', 'correlation', 'clustering', 'analysis', 'insights', 'strategy'],
          hints: [
            'Use clustering algorithms for segmentation',
            'Check correlation matrix',
            'Group by loyalty scores'
          ]
        }
      ]
    }
  ];

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleTimeUp();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startAssessment = (assessment) => {
    setCurrentAssessment(assessment);
    setCurrentQuestion(0);
    setTimeLeft(assessment.duration);
    setIsActive(true);
    setScore(0);
    setShowResults(false);
    setUserAnswer('');
  };

  const handleTimeUp = () => {
    setIsActive(false);
    toast.error('Time\'s up! Assessment completed.');
    evaluateAssessment();
  };

  const handleNextQuestion = () => {
    if (currentQuestion < currentAssessment.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setUserAnswer('');
    } else {
      setIsActive(false);
      evaluateAssessment();
    }
  };

  const evaluateAssessment = () => {
    const totalQuestions = currentAssessment.questions.length;
    let totalScore = 0;
    let feedback = [];

    currentAssessment.questions.forEach((q, index) => {
      const answer = userAnswer || '';
      const keywordMatches = q.expectedKeywords.filter(keyword => 
        answer.toLowerCase().includes(keyword.toLowerCase())
      );
      const questionScore = Math.min(10, keywordMatches.length * 2);
      totalScore += questionScore;

      if (questionScore < 5) {
        feedback.push(`Question ${index + 1}: Consider including more details about ${q.expectedKeywords.join(', ')}`);
      }
    });

    const finalScore = Math.round((totalScore / (totalQuestions * 10)) * 100);
    setScore(finalScore);
    setShowResults(true);

    // Update user skills and give rewards
    if (finalScore >= 70) {
      currentAssessment.skills.forEach(skill => {
        const currentLevel = user.current_skills[skill] || 0;
        const newLevel = Math.min(10, currentLevel + 1);
        updateSkills(skill, newLevel);
      });
      
      addExperiencePoints(finalScore);
      addBadge(`${currentAssessment.title} Master`);
      
      toast.success(`Great job! You earned ${finalScore} XP and a new badge! 🎉`);
    } else {
      addExperiencePoints(Math.floor(finalScore / 2));
      toast.info('Keep practicing! You\'ll get better with each attempt.');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const pauseAssessment = () => {
    setIsActive(false);
  };

  const resumeAssessment = () => {
    setIsActive(true);
  };

  const resetAssessment = () => {
    setCurrentAssessment(null);
    setCurrentQuestion(0);
    setTimeLeft(0);
    setIsActive(false);
    setScore(0);
    setShowResults(false);
    setUserAnswer('');
  };

  if (!currentAssessment) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Skill Assessment Center 🧠
            </h1>
            <p className="text-xl text-white/80">
              Test your skills with real-world challenges and earn experience points
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessments.map((assessment) => (
              <div key={assessment.id} className="card-glass p-6 hover:scale-105 transition-transform">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {assessment.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{assessment.description}</p>
                  
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{Math.floor(assessment.duration / 60)} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Trophy className="w-4 h-4" />
                      <span>{assessment.difficulty}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {assessment.skills.map((skill) => (
                      <span key={skill} className="badge badge-primary">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => startAssessment(assessment)}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Assessment</span>
                </button>
              </div>
            ))}
          </div>

          {/* User Progress */}
          <div className="mt-12 card-glass p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Your Assessment Progress
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">{user?.completed_projects || 0}</div>
                <p className="text-gray-600">Assessments Completed</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-success-600">{user?.experience_points || 0}</div>
                <p className="text-gray-600">Total Experience Points</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-warning-600">{user?.level || 'Explorer'}</div>
                <p className="text-gray-600">Current Level</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <div className="card-glass p-8 text-center">
            <div className="mb-6">
              {score >= 70 ? (
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              ) : (
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-12 h-12 text-yellow-600" />
                </div>
              )}
              
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Assessment Complete!
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                {currentAssessment.title}
              </p>
              
              <div className="text-6xl font-bold text-primary-600 mb-4">
                {score}%
              </div>
              
              <div className="text-lg text-gray-600 mb-6">
                {score >= 70 ? 'Excellent work! You\'ve mastered this skill.' : 'Good effort! Keep practicing to improve.'}
              </div>

              <div className="flex items-center justify-center space-x-4 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-success-600">+{score} XP</div>
                  <p className="text-sm text-gray-500">Experience Points</p>
                </div>
                {score >= 70 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warning-600">+1 Level</div>
                    <p className="text-sm text-gray-500">Skill Level</p>
                  </div>
                )}
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={resetAssessment}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Take Another Assessment</span>
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="btn-primary flex items-center space-x-2"
                >
                  <span>Back to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = currentAssessment.questions[currentQuestion];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="card-glass p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentAssessment.title}
              </h1>
              <p className="text-gray-600">Question {currentQuestion + 1} of {currentAssessment.questions.length}</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {formatTime(timeLeft)}
              </div>
              <p className="text-sm text-gray-500">Time Remaining</p>
            </div>

            <div className="flex space-x-2">
              {isActive ? (
                <button
                  onClick={pauseAssessment}
                  className="btn-warning flex items-center space-x-2"
                >
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </button>
              ) : (
                <button
                  onClick={resumeAssessment}
                  className="btn-success flex items-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Resume</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="card-glass p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {currentQ.question}
          </h2>
          
          {currentQ.code && (
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg mb-4 font-mono text-sm overflow-x-auto">
              <pre>{currentQ.code}</pre>
            </div>
          )}

          <div className="mb-6">
            <label className="form-label text-gray-900">
              Your Answer:
            </label>
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="form-input h-32 resize-none"
              placeholder="Describe your approach, write code, or explain your solution..."
            />
          </div>

          {/* Hints */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">💡 Hints:</h3>
            <ul className="text-blue-800 text-sm space-y-1">
              {currentQ.hints.map((hint, index) => (
                <li key={index}>• {hint}</li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={resetAssessment}
              className="btn-secondary flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Exit Assessment</span>
            </button>
            
            <button
              onClick={handleNextQuestion}
              className="btn-primary flex items-center space-x-2"
            >
              <span>
                {currentQuestion === currentAssessment.questions.length - 1 ? 'Finish' : 'Next Question'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="card-glass p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">
              {currentQuestion + 1} / {currentAssessment.questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / currentAssessment.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillAssessment;
