import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Brain, 
  Target, 
  Lightbulb, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  BookOpen,
  Users,
  Award,
  ArrowRight
} from 'lucide-react';

const PersonalizedQuestions = () => {
  const { user, getPersonalizedQuestions } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState('');
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    loadPersonalizedQuestions();
  }, []);

  const loadPersonalizedQuestions = async () => {
    try {
      setLoading(true);
      const result = await getPersonalizedQuestions();
      
      if (result.success) {
        setQuestions(result.data.questions);
        setInsights(result.data.personalized_insights);
        setRecommendations(result.data.recommendations);
      }
    } catch (error) {
      console.error('Failed to load questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResults(true);
      // Mark assessment as completed
      localStorage.setItem('educursus_assessment_completed', 'true');
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const getQuestionTypeIcon = (type) => {
    switch (type) {
      case 'career_planning':
        return <Target className="w-5 h-5 text-blue-500" />;
      case 'skill_development':
        return <Brain className="w-5 h-5 text-green-500" />;
      case 'behavioral':
        return <Users className="w-5 h-5 text-purple-500" />;
      case 'technical':
        return <BookOpen className="w-5 h-5 text-orange-500" />;
      default:
        return <Lightbulb className="w-5 h-5 text-gray-500" />;
    }
  };

  const getQuestionTypeColor = (type) => {
    switch (type) {
      case 'career_planning':
        return 'border-blue-200 bg-blue-50';
      case 'skill_development':
        return 'border-green-200 bg-green-50';
      case 'behavioral':
        return 'border-purple-200 bg-purple-50';
      case 'technical':
        return 'border-orange-200 bg-orange-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-xl text-white">Generating personalized questions...</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">
              Assessment Complete! 🎉
            </h1>
            <p className="text-xl text-white/80">
              Here are your personalized insights and recommendations
            </p>
          </div>

          {/* Insights Card */}
          <div className="card-glass p-6 mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <Lightbulb className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-semibold text-gray-900">Personalized Insights</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">{insights}</p>
          </div>

          {/* Recommendations */}
          <div className="card-glass p-6 mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-900">Action Plan</h2>
            </div>
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span className="text-gray-700">{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Answer Summary */}
          <div className="card-glass p-6">
            <div className="flex items-center space-x-3 mb-4">
              <BookOpen className="w-6 h-6 text-purple-500" />
              <h2 className="text-xl font-semibold text-gray-900">Your Responses</h2>
            </div>
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    {getQuestionTypeIcon(question.type)}
                    <span className="text-sm text-gray-500 capitalize">{question.type.replace('_', ' ')}</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">{question.question}</h3>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-gray-700">
                      <strong>Your Answer:</strong> {userAnswers[index] || 'No answer provided'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div className="text-center mt-8">
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="btn-primary flex items-center space-x-2 mx-auto"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Brain className="w-16 h-16 text-primary-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">
            Personalized Assessment 🎯
          </h1>
          <p className="text-xl text-white/80">
            Let's understand your career goals and skills better
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-white/80 mb-2">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="card-glass p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            {getQuestionTypeIcon(currentQuestion.type)}
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${getQuestionTypeColor(currentQuestion.type)}`}>
                {currentQuestion.type.replace('_', ' ')}
              </span>
              <span className="ml-2 text-sm text-gray-500 capitalize">{currentQuestion.category}</span>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            {currentQuestion.question}
          </h2>

          {/* Answer Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Answer
            </label>
            <textarea
              value={userAnswers[currentQuestionIndex] || ''}
              onChange={(e) => handleAnswerChange(currentQuestionIndex, e.target.value)}
              placeholder="Type your answer here..."
              className="form-input w-full h-32 resize-none"
              rows="4"
            />
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">💡 Tips</h4>
                <p className="text-blue-800 text-sm">{currentQuestion.tips}</p>
              </div>
            </div>
          </div>

          {/* Career Relevance */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Award className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-green-900 mb-1">🎯 Career Impact</h4>
                <p className="text-green-800 text-sm">{currentQuestion.career_relevance}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <button
            onClick={handleNextQuestion}
            className="btn-primary flex items-center space-x-2"
          >
            {currentQuestionIndex === questions.length - 1 ? (
              <>
                <span>Complete Assessment</span>
                <CheckCircle className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedQuestions;
