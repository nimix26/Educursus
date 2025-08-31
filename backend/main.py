from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
from dotenv import load_dotenv
import json
import asyncio
from datetime import datetime, timedelta
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import uuid
import groq
from groq import Groq

load_dotenv()

app = FastAPI(
    title="Educursus Career Guidance API",
    description="AI-powered interactive career guidance platform with gamification",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
client = AsyncIOMotorClient(os.getenv("MONGODB_URL", "mongodb://localhost:27017"))
db = client.educursus

# Groq AI client for real-time features
groq_api_key = os.getenv("GROQ_API_KEY")
if groq_api_key:
    try:
        groq_client = Groq(api_key=groq_api_key)
        GROQ_AVAILABLE = True
    except Exception as e:
        print(f"Failed to initialize Groq client: {e}")
        GROQ_AVAILABLE = False
        groq_client = None
else:
    print("GROQ_API_KEY not found. Using fallback mock functions.")
    GROQ_AVAILABLE = False
    groq_client = None

# Security
security = HTTPBearer()

# Data Models
class User(BaseModel):
    username: str
    email: str
    password: str
    interests: List[str] = []
    current_skills: Dict[str, int] = {}
    career_goals: List[str] = []
    learning_preferences: Dict[str, Any] = {}

class UserLogin(BaseModel):
    email: str
    password: str

class UserProfile(BaseModel):
    username: str
    email: str
    interests: List[str] = []
    current_skills: Dict[str, int] = {}
    career_goals: List[str] = []
    learning_preferences: Dict[str, Any] = {}
    experience_level: str = "beginner"
    preferred_location: str = "India"
    time_available: int = 20  # hours per week
    budget_constraints: str = "moderate"  # low, moderate, high

class SkillAssessment(BaseModel):
    user_id: str
    skill_name: str
    score: int
    assessment_type: str
    timestamp: datetime

class CareerPath(BaseModel):
    name: str
    description: str
    required_skills: Dict[str, int]
    market_demand: float
    salary_range: Dict[str, float]
    learning_path: List[Dict[str, Any]]

class LearningProject(BaseModel):
    title: str
    description: str
    difficulty: str
    skills_required: List[str]
    estimated_time: int
    project_type: str

class MockInterview(BaseModel):
    user_id: str
    career_path: str
    questions: List[Dict[str, Any]]
    answers: List[Dict[str, Any]]
    score: float
    feedback: str

# Mock data for demonstration
CAREER_PATHS = {
    "data_analyst": {
        "name": "Data Analyst",
        "description": "Transform raw data into actionable insights",
        "required_skills": {
            "python": 7,
            "sql": 8,
            "excel": 6,
            "statistics": 7,
            "data_visualization": 6
        },
        "market_demand": 0.85,
        "salary_range": {"min": 400000, "max": 1200000},
        "learning_path": [
            {"skill": "python", "resources": ["Python for Data Science", "Pandas Tutorial"], "time_estimate": 40},
            {"skill": "sql", "resources": ["SQL Fundamentals", "Advanced SQL"], "time_estimate": 30},
            {"skill": "statistics", "resources": ["Statistics 101", "Practical Statistics"], "time_estimate": 35}
        ]
    },
    "fullstack_developer": {
        "name": "Full Stack Developer",
        "description": "Build complete web applications from frontend to backend",
        "required_skills": {
            "javascript": 8,
            "react": 7,
            "nodejs": 7,
            "python": 6,
            "database": 6,
            "git": 5
        },
        "market_demand": 0.92,
        "salary_range": {"min": 600000, "max": 2000000},
        "learning_path": [
            {"skill": "javascript", "resources": ["JavaScript ES6+", "Modern JS Patterns"], "time_estimate": 50},
            {"skill": "react", "resources": ["React Fundamentals", "Advanced React"], "time_estimate": 45},
            {"skill": "nodejs", "resources": ["Node.js Basics", "Express.js"], "time_estimate": 40}
        ]
    },
    "ml_engineer": {
        "name": "Machine Learning Engineer",
        "description": "Build and deploy machine learning systems",
        "required_skills": {
            "python": 9,
            "machine_learning": 8,
            "deep_learning": 7,
            "mathematics": 8,
            "mlops": 6,
            "cloud": 6
        },
        "market_demand": 0.78,
        "salary_range": {"min": 800000, "max": 2500000},
        "learning_path": [
            {"skill": "python", "resources": ["Advanced Python", "Scientific Python"], "time_estimate": 60},
            {"skill": "machine_learning", "resources": ["ML Fundamentals", "Scikit-learn"], "time_estimate": 70},
            {"skill": "mathematics", "resources": ["Linear Algebra", "Calculus for ML"], "time_estimate": 80}
        ]
    }
}

LEARNING_PROJECTS = {
    "data_analyst": [
        {
            "title": "Sales Data Analysis",
            "description": "Analyze company sales data to identify trends and insights",
            "difficulty": "beginner",
            "skills_required": ["python", "pandas", "data_visualization"],
            "estimated_time": 8,
            "project_type": "data_analysis"
        },
        {
            "title": "Customer Segmentation",
            "description": "Use clustering algorithms to segment customers",
            "difficulty": "intermediate",
            "skills_required": ["python", "scikit-learn", "statistics"],
            "estimated_time": 12,
            "project_type": "machine_learning"
        }
    ],
    "fullstack_developer": [
        {
            "title": "Todo App",
            "description": "Build a full-stack todo application with React and Node.js",
            "difficulty": "beginner",
            "skills_required": ["javascript", "react", "nodejs"],
            "estimated_time": 15,
            "project_type": "web_development"
        },
        {
            "title": "E-commerce Platform",
            "description": "Create a complete e-commerce solution with payment integration",
            "difficulty": "advanced",
            "skills_required": ["javascript", "react", "nodejs", "database", "payment"],
            "estimated_time": 40,
            "project_type": "web_development"
        }
    ]
}

# Utility functions
def calculate_skill_gap(user_skills: Dict[str, int], required_skills: Dict[str, int]) -> Dict[str, int]:
    """Calculate the gap between user skills and required skills for a career path"""
    gaps = {}
    for skill, required_level in required_skills.items():
        user_level = user_skills.get(skill, 0)
        gaps[skill] = max(0, required_level - user_level)
    return gaps

def calculate_career_match(user_skills: Dict[str, int], career_path: Dict[str, Any]) -> float:
    """Calculate how well a user matches a career path"""
    required_skills = career_path["required_skills"]
    total_required = sum(required_skills.values())
    
    if total_required == 0:
        return 0.0
    
    user_score = 0
    for skill, required_level in required_skills.items():
        user_level = user_skills.get(skill, 0)
        user_score += min(user_level, required_level)
    
    return user_score / total_required

# Real-time AI functions using Groq
async def generate_ai_assessment_questions(skill_name: str, difficulty: str = "intermediate") -> List[Dict[str, Any]]:
    """Generate real-time assessment questions using Groq AI"""
    if not GROQ_AVAILABLE or not groq_client:
        return generate_mock_questions(skill_name, difficulty)
    
    try:
        prompt = f"""
        Generate 5 interactive assessment questions for {skill_name} at {difficulty} level.
        Each question should be practical and test real-world understanding.
        Return as JSON with format:
        {{
            "questions": [
                {{
                    "question": "question text",
                    "type": "multiple_choice|coding|scenario",
                    "options": ["option1", "option2", "option3", "option4"],
                    "correct_answer": "correct option or answer",
                    "explanation": "why this is correct",
                    "difficulty": "{difficulty}"
                }}
            ]
        }}
        """
        
        response = groq_client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=1000
        )
        
        # Parse the response and return questions
        content = response.choices[0].message.content
        try:
            import json
            data = json.loads(content)
            return data.get("questions", [])
        except:
            # Fallback to mock questions if parsing fails
            return generate_mock_questions(skill_name, difficulty)
            
    except Exception as e:
        print(f"Groq API error: {e}")
        return generate_mock_questions(skill_name, difficulty)

async def generate_ai_interview_questions(career_path: str, user_level: str = "intermediate") -> List[Dict[str, Any]]:
    """Generate real-time interview questions using Groq AI"""
    if not GROQ_AVAILABLE or not groq_client:
        return generate_mock_interview_questions(career_path, user_level)
    
    try:
        prompt = f"""
        Generate 10 interview questions for {career_path} position at {user_level} level.
        Include technical, behavioral, and problem-solving questions.
        Return as JSON with format:
        {{
            "questions": [
                {{
                    "question": "question text",
                    "type": "technical|behavioral|problem_solving",
                    "category": "specific area",
                    "difficulty": "{user_level}",
                    "expected_answer": "what we're looking for",
                    "tips": "hints for the candidate"
                }}
            ]
        }}
        """
        
        response = groq_client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=1500
        )
        
        content = response.choices[0].message.content
        try:
            import json
            data = json.loads(content)
            return data.get("questions", [])
        except:
            return generate_mock_interview_questions(career_path, user_level)
            
    except Exception as e:
        print(f"Groq API error: {e}")
        return generate_mock_interview_questions(career_path, user_level)

async def generate_ai_learning_path(user_skills: Dict[str, int], career_goal: str, constraints: Dict[str, Any]) -> Dict[str, Any]:
    """Generate personalized learning path using Groq AI"""
    if not GROQ_AVAILABLE or not groq_client:
        return generate_mock_learning_path(career_goal)
    
    try:
        skills_str = ", ".join([f"{skill}: {level}/10" for skill, level in user_skills.items()])
        constraints_str = ", ".join([f"{k}: {v}" for k, v in constraints.items()])
        
        prompt = f"""
        Create a personalized learning path for someone with skills: {skills_str}
        Career goal: {career_goal}
        Constraints: {constraints_str}
        
        Return as JSON with format:
        {{
            "learning_path": [
                {{
                    "phase": "phase number",
                    "title": "phase title",
                    "skills_to_learn": ["skill1", "skill2"],
                    "resources": ["resource1", "resource2"],
                    "time_estimate": "hours",
                    "projects": ["project1", "project2"],
                    "milestones": ["milestone1", "milestone2"]
                }}
            ],
            "total_time": "total hours",
            "difficulty": "beginner|intermediate|advanced",
            "recommendations": ["rec1", "rec2"]
        }}
        """
        
        response = groq_client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.8,
            max_tokens=2000
        )
        
        content = response.choices[0].message.content
        try:
            import json
            data = json.loads(content)
            return data
        except:
            return generate_mock_learning_path(career_goal)
            
    except Exception as e:
        print(f"Groq API error: {e}")
        return generate_mock_learning_path(career_goal)

async def get_real_time_market_insights(career_path: str, location: str = "India") -> Dict[str, Any]:
    """Get real-time market insights using Groq AI"""
    if not GROQ_AVAILABLE or not groq_client:
        return generate_mock_market_insights(career_path)
    
    try:
        prompt = f"""
        Provide current market insights for {career_path} in {location} as of 2024.
        Include: demand trends, salary ranges, required skills, growth opportunities.
        Return as JSON with format:
        {{
            "demand_trend": "high|medium|low",
            "growth_rate": "percentage",
            "salary_range": {{"min": "amount", "max": "amount"}},
            "hot_skills": ["skill1", "skill2"],
            "market_opportunities": ["opp1", "opp2"],
            "challenges": ["challenge1", "challenge2"],
            "recommendations": ["rec1", "rec2"]
        }}
        """
        
        response = groq_client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.6,
            max_tokens=1000
        )
        
        content = response.choices[0].message.content
        try:
            import json
            data = json.loads(content)
            return data
        except:
            return generate_mock_market_insights(career_path)
            
    except Exception as e:
        print(f"Groq API error: {e}")
        return generate_mock_market_insights(career_path)

# Fallback mock functions
def generate_mock_questions(skill_name: str, difficulty: str) -> List[Dict[str, Any]]:
    """Fallback mock questions if Groq fails"""
    return [
        {
            "question": f"What is the primary use of {skill_name}?",
            "type": "multiple_choice",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correct_answer": "Option A",
            "explanation": "This is the correct answer because...",
            "difficulty": difficulty
        }
    ]

def generate_mock_interview_questions(career_path: str, user_level: str) -> List[Dict[str, Any]]:
    """Fallback mock interview questions if Groq fails"""
    return [
        {
            "question": f"Tell me about your experience with {career_path}",
            "type": "behavioral",
            "category": "experience",
            "difficulty": user_level,
            "expected_answer": "Looking for relevant experience",
            "tips": "Be specific and provide examples"
        }
    ]

def generate_mock_learning_path(career_goal: str) -> Dict[str, Any]:
    """Fallback mock learning path if Groq fails"""
    return {
        "learning_path": [
            {
                "phase": 1,
                "title": "Foundation",
                "skills_to_learn": ["basic_skill1", "basic_skill2"],
                "resources": ["Resource 1", "Resource 2"],
                "time_estimate": "40 hours",
                "projects": ["Project 1", "Project 2"],
                "milestones": ["Milestone 1", "Milestone 2"]
            }
        ],
        "total_time": "40 hours",
        "difficulty": "beginner",
        "recommendations": ["Start with basics", "Practice regularly"]
    }

def generate_mock_market_insights(career_path: str) -> Dict[str, Any]:
    """Fallback mock market insights if Groq fails"""
    return {
        "demand_trend": "high",
        "growth_rate": "15%",
        "salary_range": {"min": "500000", "max": "1500000"},
        "hot_skills": ["skill1", "skill2"],
        "market_opportunities": ["Remote work", "AI integration"],
        "challenges": ["Competition", "Skill requirements"],
        "recommendations": ["Upskill regularly", "Network actively"]
    }

# API Endpoints
@app.get("/")
async def root():
    return {"message": "Educursus Career Guidance API", "version": "1.0.0"}

# User Authentication Endpoints
@app.post("/auth/register")
async def register_user(user: User):
    """Register a new user"""
    try:
        # Check if user already exists
        existing_user = await db.users.find_one({"email": user.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="User with this email already exists")
        
        # Create user document
        user_dict = user.dict()
        user_dict["_id"] = str(uuid.uuid4())
        user_dict["created_at"] = datetime.now().isoformat()
        user_dict["level"] = 1
        user_dict["experience_points"] = 0
        user_dict["badges"] = []
        user_dict["completed_projects"] = []
        
        # Store user in database
        await db.users.insert_one(user_dict)
        
        return {
            "message": "User registered successfully",
            "user_id": user_dict["_id"],
            "username": user.username
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@app.post("/auth/login")
async def login_user(login_data: UserLogin):
    """Login user"""
    try:
        # Find user by email
        user = await db.users.find_one({"email": login_data.email})
        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # In a real app, you would hash and verify passwords
        # For now, we'll do simple comparison
        if user["password"] != login_data.password:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Return user profile (without password)
        user_profile = {
            "user_id": user["_id"],
            "username": user["username"],
            "email": user["email"],
            "interests": user.get("interests", []),
            "current_skills": user.get("current_skills", {}),
            "career_goals": user.get("career_goals", []),
            "level": user.get("level", 1),
            "experience_points": user.get("experience_points", 0),
            "badges": user.get("badges", [])
        }
        
        return {
            "message": "Login successful",
            "user": user_profile
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")

@app.get("/auth/profile/{user_id}")
async def get_user_profile(user_id: str):
    """Get user profile"""
    try:
        user = await db.users.find_one({"_id": user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Return user profile without password
        user_profile = {
            "user_id": user["_id"],
            "username": user["username"],
            "email": user["email"],
            "interests": user.get("interests", []),
            "current_skills": user.get("current_skills", {}),
            "career_goals": user.get("career_goals", []),
            "level": user.get("level", 1),
            "experience_points": user.get("experience_points", 0),
            "badges": user.get("badges", []),
            "completed_projects": user.get("completed_projects", [])
        }
        
        return user_profile
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get profile: {str(e)}")

@app.put("/auth/profile/{user_id}")
async def update_user_profile(user_id: str, profile: UserProfile):
    """Update user profile"""
    try:
        # Update user profile
        update_data = profile.dict()
        update_data["updated_at"] = datetime.now().isoformat()
        
        # Remove email from update if it's being changed
        if "email" in update_data:
            del update_data["email"]
        
        result = await db.users.update_one(
            {"_id": user_id},
            {"$set": update_data}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"message": "Profile updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update profile: {str(e)}")

@app.get("/career-paths")
async def get_career_paths():
    """Get all available career paths"""
    return {"career_paths": list(CAREER_PATHS.values())}

@app.get("/career-paths/{career_id}")
async def get_career_path(career_id: str):
    """Get specific career path details"""
    if career_id not in CAREER_PATHS:
        raise HTTPException(status_code=404, detail="Career path not found")
    return CAREER_PATHS[career_id]

@app.post("/skill-assessment")
async def submit_skill_assessment(assessment: SkillAssessment):
    """Submit a skill assessment result"""
    # Store assessment in database
    assessment_dict = assessment.dict()
    assessment_dict["_id"] = str(uuid.uuid4())
    await db.skill_assessments.insert_one(assessment_dict)
    
    # Update user's current skills
    await db.users.update_one(
        {"_id": assessment.user_id},
        {"$set": {f"current_skills.{assessment.skill_name}": assessment.score}}
    )
    
    return {"message": "Assessment submitted successfully", "assessment_id": assessment_dict["_id"]}

@app.post("/skill-gap-analysis")
async def analyze_skill_gaps(user_id: str, career_path_id: str):
    """Analyze skill gaps for a specific career path"""
    # Get user skills
    user = await db.users.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if career_path_id not in CAREER_PATHS:
        raise HTTPException(status_code=404, detail="Career path not found")
    
    career_path = CAREER_PATHS[career_path_id]
    user_skills = user.get("current_skills", {})
    
    # Calculate gaps
    skill_gaps = calculate_skill_gap(user_skills, career_path["required_skills"])
    career_match = calculate_career_match(user_skills, career_path)
    
    return {
        "skill_gaps": skill_gaps,
        "career_match_percentage": round(career_match * 100, 2),
        "missing_skills": [skill for skill, gap in skill_gaps.items() if gap > 0],
        "strong_skills": [skill for skill, level in user_skills.items() if level >= career_path["required_skills"].get(skill, 0)]
    }

@app.get("/learning-projects/{career_path_id}")
async def get_learning_projects(career_path_id: str):
    """Get learning projects for a specific career path"""
    if career_path_id not in LEARNING_PROJECTS:
        raise HTTPException(status_code=404, detail="Career path not found")
    
    return {"projects": LEARNING_PROJECTS[career_path_id]}

@app.post("/mock-interview")
async def start_mock_interview(user_id: str, career_path_id: str):
    """Start a mock interview for a specific career path"""
    if career_path_id not in CAREER_PATHS:
        raise HTTPException(status_code=404, detail="Career path not found")
    
    # Generate interview questions based on career path
    questions = generate_interview_questions(career_path_id)
    
    interview = MockInterview(
        user_id=user_id,
        career_path=career_path_id,
        questions=questions,
        answers=[],
        score=0.0,
        feedback=""
    )
    
    # Store interview in database
    interview_dict = interview.dict()
    interview_dict["_id"] = str(uuid.uuid4())
    interview_dict["started_at"] = datetime.utcnow()
    await db.mock_interviews.insert_one(interview_dict)
    
    return {
        "interview_id": interview_dict["_id"],
        "questions": questions,
        "career_path": CAREER_PATHS[career_path_id]["name"]
    }

@app.post("/mock-interview/{interview_id}/submit")
async def submit_interview_answers(interview_id: str, answers: List[Dict[str, Any]]):
    """Submit answers for a mock interview and get feedback"""
    # Get interview
    interview = await db.mock_interviews.find_one({"_id": interview_id})
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    # Evaluate answers and generate feedback
    score, feedback = evaluate_interview_answers(interview["questions"], answers, interview["career_path"])
    
    # Update interview
    await db.mock_interviews.update_one(
        {"_id": interview_id},
        {
            "$set": {
                "answers": answers,
                "score": score,
                "feedback": feedback,
                "completed_at": datetime.utcnow()
            }
        }
    )
    
    return {
        "score": score,
        "feedback": feedback,
        "questions": interview["questions"]
    }

@app.get("/market-trends")
async def get_market_trends():
    """Get current market trends and job demand"""
    # Mock market data - in real app, this would come from job APIs
    trends = {
        "fullstack_developer": {
            "demand_change": "+14%",
            "salary_trend": "+8%",
            "hot_locations": ["Bangalore", "Mumbai", "Pune", "Hyderabad"],
            "skills_in_demand": ["React", "Node.js", "Python", "Cloud"]
        },
        "data_analyst": {
            "demand_change": "+12%",
            "salary_trend": "+6%",
            "hot_locations": ["Delhi", "Bangalore", "Chennai", "Mumbai"],
            "skills_in_demand": ["Python", "SQL", "Tableau", "Power BI"]
        },
        "ml_engineer": {
            "demand_change": "+18%",
            "salary_trend": "+12%",
            "hot_locations": ["Bangalore", "Hyderabad", "Pune", "Mumbai"],
            "skills_in_demand": ["Python", "TensorFlow", "PyTorch", "MLOps"]
        }
    }
    
    return {"market_trends": trends}

@app.post("/career-simulation")
async def simulate_career_path(
    user_id: str,
    career_path_id: str,
    constraints: Dict[str, Any]
):
    """Simulate career path with different constraints"""
    if career_path_id not in CAREER_PATHS:
        raise HTTPException(status_code=404, detail="Career path not found")
    
    career_path = CAREER_PATHS[career_path_id]
    
    # Apply constraints to generate modified learning path
    modified_path = apply_constraints_to_path(career_path, constraints)
    
    return {
        "original_path": career_path,
        "modified_path": modified_path,
        "constraints_applied": constraints,
        "estimated_completion_time": calculate_completion_time(modified_path, constraints)
    }

# Helper functions
def generate_interview_questions(career_path_id: str) -> List[Dict[str, Any]]:
    """Generate interview questions based on career path"""
    questions = {
        "data_analyst": [
            {
                "question": "How would you approach analyzing a large dataset with missing values?",
                "type": "technical",
                "expected_keywords": ["data cleaning", "imputation", "analysis", "validation"]
            },
            {
                "question": "Describe a time when your analysis led to a significant business decision.",
                "type": "behavioral",
                "expected_keywords": ["impact", "decision", "results", "communication"]
            }
        ],
        "fullstack_developer": [
            {
                "question": "Explain the difference between REST and GraphQL APIs.",
                "type": "technical",
                "expected_keywords": ["rest", "graphql", "api", "endpoints"]
            },
            {
                "question": "How do you handle state management in a React application?",
                "type": "technical",
                "expected_keywords": ["state", "context", "redux", "hooks"]
            }
        ],
        "ml_engineer": [
            {
                "question": "What's the difference between overfitting and underfitting?",
                "type": "technical",
                "expected_keywords": ["overfitting", "underfitting", "validation", "generalization"]
            },
            {
                "question": "How would you deploy a machine learning model in production?",
                "type": "technical",
                "expected_keywords": ["deployment", "mlops", "monitoring", "scaling"]
            }
        ]
    }
    
    return questions.get(career_path_id, [])

def evaluate_interview_answers(questions: List[Dict], answers: List[Dict], career_path: str) -> tuple:
    """Evaluate interview answers and provide feedback"""
    total_score = 0
    feedback_points = []
    
    for i, (question, answer) in enumerate(zip(questions, answers)):
        score = 0
        answer_text = answer.get("answer", "").lower()
        
        # Check for expected keywords
        expected_keywords = question.get("expected_keywords", [])
        keyword_matches = sum(1 for keyword in expected_keywords if keyword.lower() in answer_text)
        
        if keyword_matches > 0:
            score = min(10, keyword_matches * 2)  # Max 10 points per question
        
        total_score += score
        
        if score < 5:
            feedback_points.append(f"Question {i+1}: Consider including more technical details about {', '.join(expected_keywords)}")
    
    final_score = (total_score / (len(questions) * 10)) * 100
    
    if final_score >= 80:
        overall_feedback = "Excellent! You demonstrate strong knowledge in this area."
    elif final_score >= 60:
        overall_feedback = "Good performance! Focus on the areas mentioned in feedback to improve."
    else:
        overall_feedback = "Keep practicing! Review the fundamental concepts and try again."
    
    feedback = overall_feedback + "\n\n" + "\n".join(feedback_points)
    
    return round(final_score, 2), feedback

def apply_constraints_to_path(career_path: Dict, constraints: Dict) -> Dict:
    """Apply constraints to modify the learning path"""
    modified_path = career_path.copy()
    
    if constraints.get("part_time"):
        # Increase time estimates for part-time learning
        for learning_item in modified_path["learning_path"]:
            learning_item["time_estimate"] = int(learning_item["time_estimate"] * 1.5)
    
    if constraints.get("budget_limited"):
        # Focus on free resources
        for learning_item in modified_path["learning_path"]:
            learning_item["resources"] = [f"Free: {resource}" for resource in learning_item["resources"]]
    
    if constraints.get("remote_only"):
        # Add remote work skills
        modified_path["required_skills"]["remote_collaboration"] = 6
        modified_path["learning_path"].append({
            "skill": "remote_collaboration",
            "resources": ["Remote Work Best Practices", "Digital Collaboration Tools"],
            "time_estimate": 15
        })
    
    return modified_path

def calculate_completion_time(modified_path: Dict, constraints: Dict) -> Dict[str, Any]:
    """Calculate estimated completion time based on constraints"""
    total_hours = sum(item["time_estimate"] for item in modified_path["learning_path"])
    
    if constraints.get("part_time"):
        # Assuming 10 hours per week for part-time
        weeks = total_hours / 10
        months = weeks / 4.33
        return {
            "total_hours": total_hours,
            "estimated_weeks": round(weeks, 1),
            "estimated_months": round(months, 1),
            "learning_pace": "part_time"
        }
    else:
        # Assuming 25 hours per week for full-time
        weeks = total_hours / 25
        months = weeks / 4.33
        return {
            "total_hours": total_hours,
            "estimated_weeks": round(weeks, 1),
            "estimated_months": round(months, 1),
            "learning_pace": "full_time"
        }

# New Real-time AI Endpoints
@app.get("/ai/assessment-questions/{skill_name}")
async def get_ai_assessment_questions(skill_name: str, difficulty: str = "intermediate"):
    """Get AI-generated assessment questions in real-time"""
    questions = await generate_ai_assessment_questions(skill_name, difficulty)
    return {
        "skill_name": skill_name,
        "difficulty": difficulty,
        "questions": questions,
        "generated_at": datetime.now().isoformat()
    }

@app.get("/ai/interview-questions/{career_path}")
async def get_ai_interview_questions(career_path: str, user_level: str = "intermediate"):
    """Get AI-generated interview questions in real-time"""
    questions = await generate_ai_interview_questions(career_path, user_level)
    return {
        "career_path": career_path,
        "user_level": user_level,
        "questions": questions,
        "generated_at": datetime.now().isoformat()
    }

@app.post("/ai/learning-path")
async def generate_ai_learning_path_endpoint(
    user_skills: Dict[str, int],
    career_goal: str,
    constraints: Dict[str, Any]
):
    """Generate personalized AI learning path in real-time"""
    learning_path = await generate_ai_learning_path(user_skills, career_goal, constraints)
    return {
        "career_goal": career_goal,
        "user_skills": user_skills,
        "constraints": constraints,
        "learning_path": learning_path,
        "generated_at": datetime.now().isoformat()
    }

@app.get("/ai/market-insights/{career_path}")
async def get_ai_market_insights(career_path: str, location: str = "India"):
    """Get real-time AI market insights"""
    insights = await get_real_time_market_insights(career_path, location)
    return {
        "career_path": career_path,
        "location": location,
        "insights": insights,
        "generated_at": datetime.now().isoformat()
    }

@app.post("/ai/career-recommendation")
async def get_ai_career_recommendation(
    user_skills: Dict[str, int],
    interests: List[str],
    experience_level: str = "beginner"
):
    """Get AI-powered career recommendations based on skills and interests"""
    if not GROQ_AVAILABLE or not groq_client:
        return {
            "user_skills": user_skills,
            "interests": interests,
            "experience_level": experience_level,
            "recommendations": [
                {
                    "career_path": "Data Analyst",
                    "match_score": "75%",
                    "reason": "Good match based on analytical skills",
                    "next_steps": ["Learn SQL", "Practice Python"],
                    "market_outlook": "positive"
                }
            ],
            "generated_at": datetime.now().isoformat(),
            "note": "Using fallback data - Groq not available"
        }
    
    try:
        skills_str = ", ".join([f"{skill}: {level}/10" for skill, level in user_skills.items()])
        interests_str = ", ".join(interests)
        
        prompt = f"""
        Based on the following user profile, recommend 3-5 career paths:
        Skills: {skills_str}
        Interests: {interests_str}
        Experience Level: {experience_level}
        
        Return as JSON with format:
        {{
            "recommendations": [
                {{
                    "career_path": "career name",
                    "match_score": "percentage",
                    "reason": "why this career fits",
                    "next_steps": ["step1", "step2"],
                    "market_outlook": "positive|neutral|negative"
                }}
            ]
        }}
        """
        
        response = groq_client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=1500
        )
        
        content = response.choices[0].message.content
        try:
            import json
            data = json.loads(content)
            return {
                "user_skills": user_skills,
                "interests": interests,
                "experience_level": experience_level,
                "recommendations": data.get("recommendations", []),
                "generated_at": datetime.now().isoformat()
            }
        except:
            return {
                "user_skills": user_skills,
                "interests": interests,
                "experience_level": experience_level,
                "recommendations": [
                    {
                        "career_path": "Data Analyst",
                        "match_score": "75%",
                        "reason": "Good match based on analytical skills",
                        "next_steps": ["Learn SQL", "Practice Python"],
                        "market_outlook": "positive"
                    }
                ],
                "generated_at": datetime.now().isoformat()
            }
            
    except Exception as e:
        print(f"Groq API error: {e}")
        return {
            "user_skills": user_skills,
            "interests": interests,
            "experience_level": experience_level,
            "recommendations": [
                {
                    "career_path": "Data Analyst",
                    "match_score": "75%",
                    "reason": "Good match based on analytical skills",
                    "next_steps": ["Learn SQL", "Practice Python"],
                    "market_outlook": "positive"
                }
            ],
            "generated_at": datetime.now().isoformat()
        }

@app.post("/ai/skill-evaluation")
async def evaluate_skill_with_ai(
    skill_name: str,
    user_answer: str,
    question_context: str
):
    """Evaluate user's skill answer using AI"""
    if not GROQ_AVAILABLE or not groq_client:
        return {
            "skill_name": skill_name,
            "question_context": question_context,
            "user_answer": user_answer,
            "evaluation": {
                "score": "7/10",
                "feedback": "Good understanding shown",
                "strengths": ["Clear explanation"],
                "areas_for_improvement": ["Could add more examples"],
                "suggestions": ["Practice with real scenarios"]
            },
            "evaluated_at": datetime.now().isoformat(),
            "note": "Using fallback data - Groq not available"
        }
    
    try:
        prompt = f"""
        Evaluate this answer for a {skill_name} question:
        Question Context: {question_context}
        User Answer: {user_answer}
        
        Provide evaluation in JSON format:
        {{
            "score": "score out of 10",
            "feedback": "detailed feedback",
            "strengths": ["strength1", "strength2"],
            "areas_for_improvement": ["area1", "area2"],
            "suggestions": ["suggestion1", "suggestion2"]
        }}
        """
        
        response = groq_client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.6,
            max_tokens=1000
        )
        
        content = response.choices[0].message.content
        try:
            import json
            data = json.loads(content)
            return {
                "skill_name": skill_name,
                "question_context": question_context,
                "user_answer": user_answer,
                "evaluation": data,
                "evaluated_at": datetime.now().isoformat()
            }
        except:
            return {
                "skill_name": skill_name,
                "question_context": question_context,
                "user_answer": user_answer,
                "evaluation": {
                    "score": "7/10",
                    "feedback": "Good understanding shown",
                    "strengths": ["Clear explanation"],
                    "areas_for_improvement": ["Could add more examples"],
                    "suggestions": ["Practice with real scenarios"]
                },
                "evaluated_at": datetime.now().isoformat()
            }
            
    except Exception as e:
        print(f"Groq API error: {e}")
        return {
            "skill_name": skill_name,
            "question_context": question_context,
            "user_answer": user_answer,
            "evaluation": {
                "score": "7/10",
                "feedback": "Good understanding shown",
                "strengths": ["Clear explanation"],
                "areas_for_improvement": ["Could add more examples"],
                "suggestions": ["Practice with real scenarios"]
            },
            "evaluated_at": datetime.now().isoformat()
        }

@app.post("/ai/personalized-questions")
async def get_personalized_questions(
    user_id: str,
    career_interest: str = None,
    skill_focus: str = None
):
    """Get personalized questions based on user profile and interests"""
    try:
        # Get user profile
        user = await db.users.find_one({"_id": user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_skills = user.get("current_skills", {})
        user_interests = user.get("interests", [])
        experience_level = user.get("experience_level", "beginner")
        
        # Generate personalized questions based on user profile
        if not GROQ_AVAILABLE or not groq_client:
            return generate_personalized_mock_questions(user_skills, user_interests, experience_level, career_interest, skill_focus)
        
        try:
            skills_str = ", ".join([f"{skill}: {level}/10" for skill, level in user_skills.items()])
            interests_str = ", ".join(user_interests) if user_interests else "general technology"
            
            prompt = f"""
            Generate 5 personalized assessment questions for a user with:
            Current Skills: {skills_str}
            Interests: {interests_str}
            Experience Level: {experience_level}
            Career Interest: {career_interest or "general"}
            Skill Focus: {skill_focus or "balanced"}
            
            Questions should be:
            1. Appropriate for their skill level
            2. Related to their interests
            3. Helpful for career development
            4. Mix of technical and soft skills
            
            Return as JSON with format:
            {{
                "questions": [
                    {{
                        "question": "question text",
                        "type": "technical|behavioral|scenario|career_planning",
                        "category": "specific area",
                        "difficulty": "{experience_level}",
                        "expected_answer": "what we're looking for",
                        "tips": "hints for the user",
                        "career_relevance": "how this helps their career"
                    }}
                ],
                "personalized_insights": "brief analysis of their profile",
                "recommendations": ["rec1", "rec2"]
            }}
            """
            
            response = groq_client.chat.completions.create(
                model="llama3-8b-8192",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.8,
                max_tokens=2000
            )
            
            content = response.choices[0].message.content
            try:
                import json
                data = json.loads(content)
                return {
                    "user_id": user_id,
                    "user_skills": user_skills,
                    "user_interests": user_interests,
                    "experience_level": experience_level,
                    "questions": data.get("questions", []),
                    "personalized_insights": data.get("personalized_insights", ""),
                    "recommendations": data.get("recommendations", []),
                    "generated_at": datetime.now().isoformat()
                }
            except:
                return generate_personalized_mock_questions(user_skills, user_interests, experience_level, career_interest, skill_focus)
                
        except Exception as e:
            print(f"Groq API error: {e}")
            return generate_personalized_mock_questions(user_skills, user_interests, experience_level, career_interest, skill_focus)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate personalized questions: {str(e)}")

def generate_personalized_mock_questions(user_skills, user_interests, experience_level, career_interest, skill_focus):
    """Generate mock personalized questions if Groq is unavailable"""
    questions = []
    
    # Generate questions based on user skills
    if user_skills:
        for skill, level in user_skills.items():
            if level < 5:
                questions.append({
                    "question": f"How would you improve your {skill} skills from level {level} to level {level + 2}?",
                    "type": "skill_development",
                    "category": skill,
                    "difficulty": experience_level,
                    "expected_answer": "Specific learning plan and practice strategies",
                    "tips": "Focus on practical projects and consistent practice",
                    "career_relevance": f"Improving {skill} will enhance your career prospects"
                })
                break
    
    # Generate questions based on interests
    if user_interests:
        interest = user_interests[0] if user_interests else "technology"
        questions.append({
            "question": f"How do you plan to apply your interest in {interest} to your career goals?",
            "type": "career_planning",
            "category": "career_development",
            "difficulty": experience_level,
            "expected_answer": "Clear connection between interest and career path",
            "tips": "Research job roles and required skills",
            "career_relevance": "Aligning interests with career creates job satisfaction"
        })
    
    # Add general career development questions
    questions.extend([
        {
            "question": "What are your top 3 career goals for the next 2 years?",
            "type": "career_planning",
            "category": "goal_setting",
            "difficulty": experience_level,
            "expected_answer": "Specific, measurable, achievable goals",
            "tips": "Make goals SMART (Specific, Measurable, Achievable, Relevant, Time-bound)",
            "career_relevance": "Clear goals help focus your learning and career decisions"
        },
        {
            "question": "How do you stay updated with industry trends in your field of interest?",
            "type": "behavioral",
            "category": "continuous_learning",
            "difficulty": experience_level,
            "expected_answer": "Specific resources, communities, and learning methods",
            "tips": "Mention blogs, podcasts, conferences, online courses",
            "career_relevance": "Staying current is essential for career growth"
        }
    ])
    
    return {
        "user_id": "mock_user",
        "user_skills": user_skills,
        "user_interests": user_interests,
        "experience_level": experience_level,
        "questions": questions[:5],  # Limit to 5 questions
        "personalized_insights": f"Based on your {experience_level} level and interests, focus on building practical skills and networking.",
        "recommendations": [
            "Complete hands-on projects to build portfolio",
            "Join professional communities and forums",
            "Set specific learning milestones"
        ],
        "generated_at": datetime.now().isoformat(),
        "note": "Using fallback data - Groq not available"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
