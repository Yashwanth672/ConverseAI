// src/routes/AppRoutes.jsx (or appRouter.jsx)
import React from 'react'
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom'

import Login from '../screens/Login'
import Register from '../screens/Register'
import Home from '../screens/Home'
import Project from '../screens/Project'
import Compiler from '../screens/Compiler'
import StudyMaterial from '../screens/StudyMaterial'
import News from '../screens/News'
import UserAuth from '../auth/UserAuth'

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes (wrap with UserAuth) */}
        <Route
          path="/home"
          element={
            <UserAuth>
              <Home />
            </UserAuth>
          }
        />
        <Route
          path="/project"
          element={
            <UserAuth>
              <Project />
            </UserAuth>
          }
        />

        {/* New protected feature pages */}
        <Route
          path="/compiler"
          element={
            <UserAuth>
              <Compiler />
            </UserAuth>
          }
        />
        <Route
          path="/study"
          element={
            <UserAuth>
              <StudyMaterial />
            </UserAuth>
          }
        />
        <Route
          path="/news"
          element={
            <UserAuth>
              <News />
            </UserAuth>
          }
        />

        {/* Fallback: send unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
