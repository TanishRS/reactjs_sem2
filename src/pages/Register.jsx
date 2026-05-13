import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';
import { getList, addToList, KEYS } from '../utils/storage';
import { formatDate, formatTime } from '../utils/dateHelpers';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { showToast } from '../components/Toast';
import { GlowCard } from '../components/ui/spotlight-card';
import { Button } from '../components/ui/button';
import { ButtonColorful } from '../components/ui/button-colorful';

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-slate-500">Event not found.</p>
      </div>
    );
  }

  if (alreadyRegistered) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <GlowCard customSize={true} className="bg-card border border-border/50 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4 text-green-400">✓</div>
          <h2 className="text-2xl font-bold text-white mb-2">Already Registered</h2>
          <p className="text-slate-400 text-sm mb-8">
            You have already registered for <strong className="text-white">{event.title}</strong>.
          </p>
          <Link to="/my-tickets">
            <ButtonColorful label="View My Tickets" className="w-full" />
          </Link>
        </GlowCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back link */}
        <Link to={`/events/${eventId}`} className="inline-flex">
          <Button variant="ghost" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-zinc-400 mb-6 px-0 hover:bg-transparent">
            <ArrowLeft className="w-4 h-4" /> Back to event
          </Button>
        </Link>

        {/* Event summary card */}
        <GlowCard customSize={true} className="bg-card border border-border/50 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 mb-6">
          <img src={event.imageUrl} alt={event.title} className="w-full sm:w-24 h-24 rounded-xl object-cover flex-shrink-0" />
          <div className="flex flex-col justify-center">
            <p className="font-bold text-white text-lg">{event.title}</p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-slate-400 mt-2">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-zinc-400" />
                <span>{formatDate(event.date)} · {formatTime(event.time)}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1 sm:mt-0">
                <MapPin className="w-4 h-4 text-zinc-400" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>
        </GlowCard>

        {/* Registration form */}
        <GlowCard customSize={true} className="bg-card border border-border/50 rounded-2xl p-6 md:p-8">
          <h1 className="text-2xl font-bold text-white mb-8">Registration Form</h1>
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Full Name *</label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 bg-slate-950/50 border rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 ${errors.fullName ? 'border-red-500' : 'border-slate-800'}`}
              />
              {errors.fullName && <p className="text-red-400 text-xs mt-1.5">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="student@college.edu"
                className={`w-full px-4 py-3 bg-slate-950/50 border rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 ${errors.email ? 'border-red-500' : 'border-slate-800'}`}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="10-digit mobile number"
                maxLength={10}
                className={`w-full px-4 py-3 bg-slate-950/50 border rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 ${errors.phone ? 'border-red-500' : 'border-slate-800'}`}
              />
              {errors.phone && <p className="text-red-400 text-xs mt-1.5">{errors.phone}</p>}
            </div>

            {/* Year + Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Year of Study *</label>
                <select
                  value={form.year}
                  onChange={(e) => handleChange('year', e.target.value)}
                  className={`w-full px-4 py-3 bg-slate-950/50 border rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 ${errors.year ? 'border-red-500' : 'border-slate-800'}`}
                >
                  <option value="" className="bg-slate-900">Select year</option>
                  {YEARS.map((year) => (
                    <option key={year} value={year} className="bg-slate-900">{year}</option>
                  ))}
                </select>
                {errors.year && <p className="text-red-400 text-xs mt-1.5">{errors.year}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Department *</label>
                <select
                  value={form.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  className={`w-full px-4 py-3 bg-slate-950/50 border rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 ${errors.department ? 'border-red-500' : 'border-slate-800'}`}
                >
                  <option value="" className="bg-slate-900">Select department</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept} className="bg-slate-900">{dept}</option>
                  ))}
                </select>
                {errors.department && <p className="text-red-400 text-xs mt-1.5">{errors.department}</p>}
              </div>
            </div>

            <div className="mt-4">
              <ButtonColorful 
                disabled={submitting}
                label={submitting ? 'Registering...' : 'Complete Registration'}
                className="w-full h-12 text-base"
              />
            </div>
          </form>
        </GlowCard>
      </div>
    </div>
  );
}
