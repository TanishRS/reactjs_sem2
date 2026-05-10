// Registration form page for a specific event.
// Validates all fields manually (no form library) and saves the registration to localStorage.

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';
import { getList, addToList, KEYS } from '../utils/storage';
import { formatDate, formatTime } from '../utils/dateHelpers';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { showToast } from '../components/Toast';

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'PG 1st Year', 'PG 2nd Year'];
const DEPARTMENTS = [
  'Computer Science', 'Information Technology', 'Electronics & Communication',
  'Mechanical Engineering', 'Civil Engineering', 'Business Administration',
  'Arts & Humanities', 'Commerce', 'Other',
];

function validate(form) {
  const errors = {};
  if (!form.fullName.trim() || form.fullName.trim().length < 3) {
    errors.fullName = 'Full name must be at least 3 characters.';
  }
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.trim())) {
    errors.phone = 'Phone number must be exactly 10 digits.';
  }
  if (!form.year) errors.year = 'Please select your year of study.';
  if (!form.department) errors.department = 'Please select your department.';
  return errors;
}

export default function Register() {
  const { eventId } = useParams();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.name || '',
    email: '',
    phone: '',
    year: '',
    department: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const events = getList(KEYS.EVENTS);
    const found = events.find((ev) => ev.id === eventId);
    setEvent(found || null);

    const registrations = getList(KEYS.REGISTRATIONS);
    const registered = registrations.some(
      (r) => r.eventId === eventId && r.userId === user?.id
    );
    setAlreadyRegistered(registered);
  }, [eventId, user]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear the error for this field as the user types.
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    const ticketId = uuidv4();
    const registration = {
      id: `reg-${Date.now()}`,
      eventId,
      userId: user.id,
      ticketId,
      attendeeData: { ...form },
      registeredAt: new Date().toISOString(),
    };

    addToList(KEYS.REGISTRATIONS, registration);

    // Notify the registrant.
    addNotification(
      `You've successfully registered for "${event.title}"!`,
      'success',
      user.id
    );

    showToast('Registration successful! Your ticket is ready.', 'success');
    navigate(`/ticket/${ticketId}`);
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Event not found.</p>
      </div>
    );
  }

  if (alreadyRegistered) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-md p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">✓</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Already Registered</h2>
          <p className="text-gray-500 text-sm mb-6">
            You have already registered for <strong>{event.title}</strong>.
          </p>
          <Link
            to="/my-tickets"
            className="inline-block px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            View My Tickets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back link */}
        <Link to={`/events/${eventId}`} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to event
        </Link>

        {/* Event summary card */}
        <div className="bg-white rounded-2xl shadow-sm p-4 flex gap-4 mb-6">
          <img src={event.imageUrl} alt={event.title} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
          <div>
            <p className="font-bold text-gray-900">{event.title}</p>
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(event.date)} · {formatTime(event.time)}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>

        {/* Registration form */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-6">Registration Form</h1>
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                placeholder="Enter your full name"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.fullName ? 'border-red-400' : 'border-gray-300'}`}
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="student@college.edu"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.email ? 'border-red-400' : 'border-gray-300'}`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="10-digit mobile number"
                maxLength={10}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.phone ? 'border-red-400' : 'border-gray-300'}`}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* Year + Department in a row on wider screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year of Study *</label>
                <select
                  value={form.year}
                  onChange={(e) => handleChange('year', e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.year ? 'border-red-400' : 'border-gray-300'}`}
                >
                  <option value="">Select year</option>
                  {YEARS.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                <select
                  value={form.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.department ? 'border-red-400' : 'border-gray-300'}`}
                >
                  <option value="">Select department</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60 mt-2"
            >
              {submitting ? 'Registering...' : 'Complete Registration'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
