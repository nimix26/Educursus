# Groq AI Integration Setup

## 🚀 Real-time AI Features

This backend now includes real-time AI features powered by Groq:

### ✨ **New AI Endpoints:**

1. **AI Assessment Questions**: `/ai/assessment-questions/{skill_name}`
   - Generates real-time assessment questions for any skill
   - Adapts difficulty level dynamically

2. **AI Interview Questions**: `/ai/interview-questions/{career_path}`
   - Creates personalized interview questions based on career path
   - Includes technical, behavioral, and problem-solving questions

3. **AI Learning Paths**: `/ai/learning-path`
   - Generates personalized learning paths based on user skills and constraints
   - Adapts to part-time, budget, and remote work preferences

4. **AI Market Insights**: `/ai/market-insights/{career_path}`
   - Provides real-time market analysis and trends
   - Includes salary ranges, demand, and growth opportunities

5. **AI Career Recommendations**: `/ai/career-recommendation`
   - Suggests career paths based on skills and interests
   - Provides match scores and next steps

6. **AI Skill Evaluation**: `/ai/skill-evaluation`
   - Evaluates user answers with detailed feedback
   - Identifies strengths and areas for improvement

## 🔑 **Setup Instructions:**

### 1. Get Groq API Key:
- Visit [https://console.groq.com/](https://console.groq.com/)
- Sign up and get your API key
- The API key is free with generous limits

### 2. Set Environment Variable:
Create a `.env` file in the backend directory:
```bash
GROQ_API_KEY=your_actual_groq_api_key_here
MONGODB_URL=mongodb://localhost:27017
```

### 3. Install Dependencies:
```bash
pip install -r requirements.txt
```

### 4. Start the Backend:
```bash
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 🌟 **Features:**

- **Real-time Question Generation**: Every assessment gets fresh, unique questions
- **Dynamic Learning Paths**: Paths adapt to user progress and constraints
- **Live Market Data**: Always up-to-date career insights
- **AI-Powered Feedback**: Personalized evaluation and recommendations
- **Fallback System**: Graceful degradation if Groq is unavailable

## 🔧 **Usage Examples:**

### Get AI Assessment Questions:
```bash
curl "http://localhost:8000/ai/assessment-questions/python?difficulty=intermediate"
```

### Generate AI Learning Path:
```bash
curl -X POST "http://localhost:8000/ai/learning-path" \
  -H "Content-Type: application/json" \
  -d '{
    "user_skills": {"python": 5, "sql": 3},
    "career_goal": "Data Scientist",
    "constraints": {"part_time": true, "budget_limited": false}
  }'
```

### Get Real-time Market Insights:
```bash
curl "http://localhost:8000/ai/market-insights/data%20scientist?location=India"
```

## 📊 **API Documentation:**
Visit `http://localhost:8000/docs` for interactive API documentation.

## 🎯 **Benefits:**

1. **Always Fresh Content**: No more static questions or outdated information
2. **Personalized Experience**: Every user gets unique, tailored content
3. **Real-time Updates**: Market insights and trends are current
4. **Adaptive Learning**: Paths evolve based on user progress
5. **Professional Quality**: AI-generated content matches industry standards

The platform now provides a truly dynamic, real-time career guidance experience! 🚀
