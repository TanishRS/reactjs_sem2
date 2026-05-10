// App.jsx: root component that sets up all routes and wraps the app in context providers.

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import EventDetails from './pages/EventDetails';
import Register from './pages/Register';
import Ticket from './pages/Ticket';
import MySchedule from './pages/MySchedule';
import MyTickets from './pages/MyTickets';
import Admin from './pages/Admin';
import EventForm from './pages/EventForm';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <AppRoutes />
          <Toast />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

// Separating routes into a child component so the Navbar can read auth context.
function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/events/:id" element={<EventDetails />} />

        <Route
          path="/register/:eventId"
          element={
            <ProtectedRoute>
              <Register />
            </ProtectedRoute>
          }
        />

        <Route path="/ticket/:ticketId" element={<Ticket />} />

        <Route
          path="/my-schedule"
          element={
            <ProtectedRoute>
              <MySchedule />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-tickets"
          element={
            <ProtectedRoute>
              <MyTickets />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/new"
          element={
            <ProtectedRoute requireAdmin>
              <EventForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/edit/:id"
          element={
            <ProtectedRoute requireAdmin>
              <EventForm />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}
