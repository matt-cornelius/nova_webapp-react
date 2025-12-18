import { Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { ExplorePage } from './pages/ExplorePage'
import { GroupsPage } from './pages/GroupsPage'
import { ProfilePage } from './pages/ProfilePage'
import { GroupChatPage } from './pages/GroupChatPage'
import { OrganizationProfilePage } from './pages/OrganizationProfilePage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute'

export function AppRouter() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/groups"
        element={
          <ProtectedRoute>
            <GroupsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/groups/chat"
        element={
          <ProtectedRoute>
            <GroupChatPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/explore"
        element={
          <ProtectedRoute>
            <ExplorePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/organization/:id"
        element={
          <ProtectedRoute>
            <OrganizationProfilePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

