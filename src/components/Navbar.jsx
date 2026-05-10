// Navbar is the persistent top navigation bar.
// It includes the app logo, nav links (role-based), search bar with auto-suggest,
// a notification bell, and a login/logout button.

import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell, Search, Calendar, LogOut, LogIn, Shield, BookOpen, Ticket, Menu, X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { getList, KEYS } from '../utils/storage';

export default function Navbar() {
  const { user, isAdmin, isLoggedIn, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllRead, clearAll } = useNotifications();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  // Debounced search: wait 200ms after the user stops typing before querying.
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(() => {
      const events = getList(KEYS.EVENTS);
      const query = searchQuery.toLowerCase();
      const matches = events
        .filter(
          (event) =>
            event.title.toLowerCase().includes(query) ||
            event.category.toLowerCase().includes(query)
        )
        .slice(0, 5);
      setSuggestions(matches);
      setShowSuggestions(true);
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close dropdowns when clicking outside.
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSuggestionClick(event) {
    setSearchQuery('');
    setShowSuggestions(false);
    navigate(`/events/${event.id}`);
  }

  // Highlights the matching part of a suggestion label in bold.
  function highlightMatch(text, query) {
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;
    return (
      <>
        {text.slice(0, index)}
        <strong className="text-indigo-600">{text.slice(index, index + query.length)}</strong>
        {text.slice(index + query.length)}
      </>
    );
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg hidden sm:block">CampusEvent</span>
          </Link>

          {/* Search bar */}
          <div className="flex-1 max-w-md relative" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
              />
            </div>

            {/* Suggestion dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
                {suggestions.map((event) => (
                  <button
                    key={event.id}
                    onMouseDown={() => handleSuggestionClick(event)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-indigo-50 text-left text-sm"
                  >
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600 flex-shrink-0">
                      {event.category}
                    </span>
                    <span className="text-gray-800 truncate">
                      {highlightMatch(event.title, searchQuery)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right side: nav links + bell + user */}
          <div className="hidden md:flex items-center gap-1">
            {isLoggedIn && (
              <>
                <Link to="/my-schedule" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                  <BookOpen className="w-4 h-4" /> Schedule
                </Link>
                <Link to="/my-tickets" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                  <Ticket className="w-4 h-4" /> Tickets
                </Link>
              </>
            )}
            {isAdmin && (
              <Link to="/admin" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-indigo-600 hover:bg-indigo-50 font-medium transition-colors">
                <Shield className="w-4 h-4" /> Admin
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Notification bell */}
            {isLoggedIn && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setShowNotifications((prev) => !prev)}
                  className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </button>

                {/* Notification dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b">
                      <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
                      <button onClick={markAllRead} className="text-xs text-indigo-600 hover:underline">
                        Mark all read
                      </button>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-center text-sm text-gray-400 py-8">No notifications yet</p>
                      ) : (
                        notifications.slice().reverse().map((notif) => (
                          <button
                            key={notif.id}
                            onClick={() => markAsRead(notif.id)}
                            className={`w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 ${
                              !notif.read ? 'bg-indigo-50' : ''
                            }`}
                          >
                            <p className="text-sm text-gray-800 leading-snug">{notif.message}</p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {new Date(notif.createdAt).toLocaleDateString()}
                            </p>
                          </button>
                        ))
                      )}
                    </div>
                    <div className="px-4 py-2 border-t">
                      <button onClick={clearAll} className="text-xs text-red-500 hover:underline">
                        Clear all
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User name + logout OR login button */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 hidden sm:block font-medium">
                  Hi, {user.name}
                </span>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <LogIn className="w-4 h-4" /> Login
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-3 border-t pt-2 flex flex-col gap-1">
            {isLoggedIn && (
              <>
                <Link to="/my-schedule" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
                  <BookOpen className="w-4 h-4" /> My Schedule
                </Link>
                <Link to="/my-tickets" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
                  <Ticket className="w-4 h-4" /> My Tickets
                </Link>
              </>
            )}
            {isAdmin && (
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-indigo-600 hover:bg-indigo-50">
                <Shield className="w-4 h-4" /> Admin Panel
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
