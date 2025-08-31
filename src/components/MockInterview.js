import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  MessageSquare, 
  Play, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Star,
  ArrowRight,
  RotateCcw,
  Mic,
  MicOff,
  Volume2,
  VolumeX
} from 'lucide-react';
import toast from 'react-hot-toast';

const MockInterview = () => {
  const { user, completeMockInterview, addExperiencePoints, addBadge } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [currentInterview, setCurrentInterview] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        // Mock data for demonstration
        const mockInterviews = [
          {
            id: 'data_analyst',
            title: 'Data Analyst Interview',
            description: 'Practice common data analyst interview questions',
            career_path: 'Data Analyst',
            difficulty: 'Intermediate',
            duration: 15,
            questions: [
              {
                question: 'How would you approach analyzing a large dataset with missing values?',
                type: 'technical',
                expected_keywords: ['data cleaning', 'imputation', 'analysis', 'validation', 'missing data'],
                hints: [
                  'Start with data exploration',
                  'Identify patterns in missing data',
                  'Choose appropriate imputation strategy',
                  'Validate your approach'
                ],
                sample_answer: 'I would start by exploring the dataset to understand the extent and patterns of missing values. Then I\'d use appropriate imputation techniques like mean, median, or forward-fill depending on the data type and context. Finally, I\'d validate the results to ensure data quality.'
              },
              {
                question: 'Describe a time when your analysis led to a significant business decision.',
                type: 'behavioral',
                expected_keywords: ['impact', 'decision', 'results', 'communication', 'stakeholder', 'business value'],
                hints: [
                  'Use STAR method (Situation, Task, Action, Result)',
                  'Quantify the impact',
                  'Explain your role clearly',
                  'Show business understanding'
                ],
                sample_answer: 'I analyzed customer churn data and identified that customers who didn\'t engage with our product within the first week had a 70% higher churn rate. I presented this to stakeholders, and we implemented an onboarding improvement that reduced churn by 25%.'
              },
              {
                question: 'What\'s the difference between correlation and causation?',
                type: 'technical',
                expected_keywords: ['correlation', 'causation', 'relationship', 'variables', 'confounding', 'experiment'],
                hints: [
                  'Correlation measures association',
                  'Causation implies direct influence',
                  'Confounding variables can create false correlations',
                  'Experiments help establish causation'
                ],
                sample_answer: 'Correlation measures the strength and direction of a relationship between variables, while causation implies that one variable directly influences another. Correlation doesn\'t imply causation because confounding variables or reverse causality might be at play.'
              }
            ]
          },
          {
            id: 'fullstack_developer',
            title: 'Full Stack Developer Interview',
            description: 'Test your full-stack development knowledge',
            career_path: 'Full Stack Developer',
            difficulty: 'Advanced',
            duration: 20,
            questions: [
              {
                question: 'Explain the difference between REST and GraphQL APIs.',
                type: 'technical',
                expected_keywords: ['rest', 'graphql', 'api', 'endpoints', 'over-fetching', 'under-fetching'],
                hints: [
                  'REST uses multiple endpoints',
                  'GraphQL uses a single endpoint',
                  'Consider data fetching efficiency',
                  'Think about flexibility vs. simplicity'
                ],
                sample_answer: 'REST APIs use multiple endpoints for different resources, which can lead to over-fetching or under-fetching data. GraphQL uses a single endpoint with a query language, allowing clients to request exactly the data they need, improving efficiency and flexibility.'
              },
              {
                question: 'How do you handle state management in a React application?',
                type: 'technical',
                expected_keywords: ['state', 'context', 'redux', 'hooks', 'local state', 'global state'],
                hints: [
                  'Consider local vs. global state',
                  'Use appropriate state management tools',
                  'Think about scalability',
                  'Consider team collaboration'
                ],
                sample_answer: 'I start with local state using useState for component-specific data. For shared state across components, I use Context API for simple cases and Redux for complex applications. I also leverage custom hooks to encapsulate state logic and make it reusable.'
              }
            ]
          },
          {
            id: 'ml_engineer',
            title: 'Machine Learning Engineer Interview',
            description: 'Advanced ML and engineering questions',
            career_path: 'ML Engineer',
            difficulty: 'Expert',
            duration: 25,
            questions: [
              {
                question: 'What\'s the difference between overfitting and underfitting?',
                type: 'technical',
                expected_keywords: ['overfitting', 'underfitting', 'validation', 'generalization', 'bias', 'variance'],
                hints: [
                  'Overfitting: model learns noise',
                  'Underfitting: model is too simple',
                  'Use validation data',
                  'Balance complexity'
                ],
                sample_answer: 'Overfitting occurs when a model learns the training data too well, including noise, leading to poor generalization on unseen data. Underfitting happens when a model is too simple to capture the underlying patterns, resulting in poor performance on both training and test data.'
              },
              {
                question: 'How would you deploy a machine learning model in production?',
                type: 'technical',
                expected_keywords: ['deployment', 'mlops', 'monitoring', 'scaling', 'versioning', 'testing'],
                hints: [
                  'Consider model versioning',
                  'Implement monitoring and logging',
                  'Plan for scalability',
                  'Include testing and validation'
                ],
                sample_answer: 'I would containerize the model using Docker, implement CI/CD pipelines for automated testing and deployment, add monitoring for model performance and data drift, use model versioning for rollbacks, and ensure the system can scale horizontally based on demand.'
              }
            ]
          }
        ];

        setInterviews(mockInterviews);
      } catch (error) {
        console.error('Error fetching interviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  const startInterview = (interview) => {
    setCurrentInterview(interview);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setShowResults(false);
    setIsRecording(false);
    setIsPlaying(false);
  };

  const handleAnswerSubmit = () => {
    if (currentQuestion < currentInterview.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeInterview();
    }
  };

  const completeInterview = () => {
    // Evaluate answers
    const totalScore = evaluateAnswers();
    const finalScore = Math.round((totalScore / (currentInterview.questions.length * 10)) * 100);
    
    // Update user progress
    completeMockInterview();
    addExperiencePoints(finalScore);
    
    if (finalScore >= 80) {
      addBadge(`${currentInterview.career_path} Interview Master`);
      toast.success(`Excellent! You earned ${finalScore} XP and a new badge! 🎉`);
    } else {
      toast.info('Good effort! Keep practicing to improve your interview skills.');
    }
    
    setShowResults(true);
  };

  const evaluateAnswers = () => {
    let totalScore = 0;
    
    currentInterview.questions.forEach((question, index) => {
      const answer = userAnswers[index] || '';
      const keywordMatches = question.expected_keywords.filter(keyword => 
        answer.toLowerCase().includes(keyword.toLowerCase())
      );
      const questionScore = Math.min(10, keywordMatches.length * 2);
      totalScore += questionScore;
    });
    
    return totalScore;
  };

  const resetInterview = () => {
    setCurrentInterview(null);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setShowResults(false);
    setIsRecording(false);
    setIsPlaying(false);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, this would handle actual audio recording
    toast.info(isRecording ? 'Recording stopped' : 'Recording started');
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    // In a real app, this would handle actual audio playback
    toast.info(isPlaying ? 'Playback stopped' : 'Playing answer');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-xl text-white">Preparing interview questions...</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    const totalScore = evaluateAnswers();
    const finalScore = Math.round((totalScore / (currentInterview.questions.length * 10)) * 100);
    
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <div className="card-glass p-8 text-center">
            <div className="mb-6">
              {finalScore >= 80 ? (
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              ) : (
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-12 h-12 text-yellow-600" />
                </div>
              )}
              
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Interview Complete!
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                {currentInterview.title}
              </p>
              
              <div className="text-6xl font-bold text-primary-600 mb-4">
                {finalScore}%
              </div>
              
              <div className="text-lg text-gray-600 mb-6">
                {finalScore >= 80 ? 'Outstanding performance! You\'re ready for real interviews.' : 'Good effort! Review the feedback to improve your skills.'}
              </div>

              <div className="flex items-center justify-center space-x-4 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-success-600">+{finalScore} XP</div>
                  <p className="text-sm text-gray-500">Experience Points</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning-600">+1</div>
                  <p className="text-sm text-gray-500">Interviews Taken</p>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={resetInterview}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Take Another Interview</span>
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

  if (currentInterview) {
    const currentQ = currentInterview.questions[currentQuestion];
    
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          {/* Interview Header */}
          <div className="card-glass p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentInterview.title}
                </h1>
                <p className="text-gray-600">
                  Question {currentQuestion + 1} of {currentInterview.questions.length}
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {currentInterview.difficulty}
                </div>
                <p className="text-sm text-gray-500">Difficulty</p>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-success-600">
                  {currentInterview.duration} min
                </div>
                <p className="text-sm text-gray-500">Duration</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / currentInterview.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="card-glass p-6 mb-6">
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <span className={`badge ${
                  currentQ.type === 'technical' ? 'badge-primary' : 'badge-success'
                }`}>
                  {currentQ.type}
                </span>
                <span className="text-sm text-gray-500">
                  Question {currentQuestion + 1}
                </span>
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {currentQ.question}
              </h2>
            </div>

            {/* Answer Input */}
            <div className="mb-6">
              <label className="form-label text-gray-900">
                Your Answer:
              </label>
              <textarea
                value={userAnswers[currentQuestion] || ''}
                onChange={(e) => {
                  const newAnswers = [...userAnswers];
                  newAnswers[currentQuestion] = e.target.value;
                  setUserAnswers(newAnswers);
                }}
                className="form-input h-32 resize-none"
                placeholder="Describe your approach, provide examples, or explain your solution..."
              />
            </div>

            {/* Audio Controls */}
            <div className="flex items-center space-x-4 mb-6">
              <button
                onClick={toggleRecording}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isRecording 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isRecording ? 'Stop Recording' : 'Record Answer'}</span>
              </button>

              <button
                onClick={togglePlayback}
                disabled={!userAnswers[currentQuestion]}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isPlaying 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50'
                }`}
              >
                {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{isPlaying ? 'Stop' : 'Play Answer'}</span>
              </button>
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

            {/* Sample Answer */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-green-900 mb-2">📝 Sample Answer:</h3>
              <p className="text-green-800 text-sm">{currentQ.sample_answer}</p>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={resetInterview}
                className="btn-secondary flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Exit Interview</span>
              </button>
              
              <button
                onClick={handleAnswerSubmit}
                className="btn-primary flex items-center space-x-2"
              >
                <span>
                  {currentQuestion === currentInterview.questions.length - 1 ? 'Finish Interview' : 'Next Question'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
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
            Mock Interview Center 💼
          </h1>
          <p className="text-xl text-white/80">
            Practice with AI-powered interview questions and get instant feedback
          </p>
        </div>

        {/* User Stats */}
        <div className="card-glass p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Your Interview Progress
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">{user?.mock_interviews_taken || 0}</div>
              <p className="text-gray-600">Interviews Taken</p>
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

        {/* Available Interviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews.map((interview) => (
            <div key={interview.id} className="card-glass p-6 hover:scale-105 transition-transform">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {interview.title}
                </h3>
                <p className="text-gray-600 mb-4">{interview.description}</p>
              </div>

              {/* Interview Stats */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Career Path:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {interview.career_path}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Difficulty:</span>
                  <span className={`badge ${
                    interview.difficulty === 'Intermediate' ? 'badge-warning' :
                    interview.difficulty === 'Advanced' ? 'badge-secondary' :
                    interview.difficulty === 'Expert' ? 'badge-primary' :
                    'badge-success'
                  }`}>
                    {interview.difficulty}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Questions:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {interview.questions.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Duration:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {interview.duration} min
                  </span>
                </div>
              </div>

              <button
                onClick={() => startInterview(interview)}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Start Interview</span>
              </button>
            </div>
          ))}
        </div>

        {/* Interview Tips */}
        <div className="mt-12 card-glass p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            💡 Interview Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Use STAR Method</h3>
              <p className="text-sm text-gray-600">
                Structure behavioral answers with Situation, Task, Action, and Result
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Be Specific</h3>
              <p className="text-sm text-gray-600">
                Provide concrete examples and quantify your achievements
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Practice Regularly</h3>
              <p className="text-sm text-gray-600">
                Consistent practice improves confidence and performance
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockInterview;
