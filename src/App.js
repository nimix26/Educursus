import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import CareerExplorer from './components/CareerExplorer';
import SkillAssessment from './components/SkillAssessment';
import LearningProjects from './components/LearningProjects';
import MockInterview from './components/MockInterview';
import CareerSimulation from './components/CareerSimulation';
import MarketTrends from './components/MarketTrends';
import Profile from './components/Profile';
import PersonalizedQuestions from './components/PersonalizedQuestions';
import Login from './components/Login';
import Register from './components/Register';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-xl text-white">Loading Educursus...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
        {isAuthenticated && <Navbar />}
        <main className="pt-16">
          <Routes>
            {!isAuthenticated ? (
              <>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Dashboard />} />
                <Route path="/career-explorer" element={<CareerExplorer />} />
                <Route path="/skill-assessment" element={<SkillAssessment />} />
                <Route path="/learning-projects" element={<LearningProjects />} />
                <Route path="/mock-interview" element={<MockInterview />} />
                <Route path="/career-simulation" element={<CareerSimulation />} />
                <Route path="/market-trends" element={<MarketTrends />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/personalized-questions" element={<PersonalizedQuestions />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}
          </Routes>
        </main>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
