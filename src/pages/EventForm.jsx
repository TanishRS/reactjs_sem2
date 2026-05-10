// EventForm is used for both creating a new event (/admin/new)
// and editing an existing one (/admin/edit/:id). It detects the mode via the URL.

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ImageIcon } from 'lucide-react';
import { getList, addToList, updateInList, KEYS } from '../utils/storage';
import { showToast } from '../components/Toast';
import { useNotifications } from '../context/NotificationContext';

const CATEGORIES = ['Festival', 'Workshop', 'Sports'];

const EMPTY_FORM = {
  title: '',
  description: '',
  category: 'Festival',
  date: '',
  time: '',
  location: '',
  capacity: '',
  imageUrl: '',
};

function validateEventForm(form) {
  const errors = {};
  if (!form.title.trim() || form.title.trim().length < 3) errors.title = 'Title must be at least 3 characters.';
  if (!form.description.trim()) errors.description = 'Description is required.';
  if (!form.date) errors.date = 'Date is required.';
  if (!form.time) errors.time = 'Time is required.';
  if (!form.location.trim()) errors.location = 'Location is required.';
  if (!form.capacity || isNaN(form.capacity) || Number(form.capacity) < 1) {
    errors.capacity = 'Capacity must be a positive number.';
  }
  return errors;
}

export default function EventForm() {
  const { id } = useParams(); // present only on the edit route
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const isEditing = !!id;

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Pre-fill form when editing an existing event.
  useEffect(() => {
    if (isEditing) {
      const events = getList(KEYS.EVENTS);
      const existing = events.find((ev) => ev.id === id);
      if (existing) {
        setForm({
          title: existing.title,
          description: existing.description,
          category: existing.category,
          date: existing.date,
          time: existing.time,
          location: existing.location,
          capacity: String(existing.capacity),
          imageUrl: existing.imageUrl || '',
        });
      }
    }
  }, [id, isEditing]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateEventForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    const eventData = {
      ...form,
      capacity: Number(form.capacity),
      imageUrl: form.imageUrl.trim() || `https://picsum.photos/seed/${id || Date.now()}/400/250`,
    };

    if (isEditing) {
      updateInList(KEYS.EVENTS, id, eventData);
      addNotification(`Event "${form.title}" has been updated by admin.`, 'info');
      showToast('Event updated successfully!', 'success');
    } else {
      const newEvent = {
        ...eventData,
        id: `evt-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      addToList(KEYS.EVENTS, newEvent);
      addNotification(`New event added: "${form.title}"`, 'info');
      showToast('Event created successfully!', 'success');
    }

    navigate('/admin');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Link to="/admin" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Admin
        </Link>

        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-6">
            {isEditing ? 'Edit Event' : 'Create New Event'}
          </h1>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="e.g. Annual Tech Fest 2026"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.title ? 'border-red-400' : 'border-gray-300'}`}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe the event..."
                rows={4}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none ${errors.description ? 'border-red-400' : 'border-gray-300'}`}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                value={form.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.date ? 'border-red-400' : 'border-gray-300'}`}
                />
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.time ? 'border-red-400' : 'border-gray-300'}`}
                />
                {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="e.g. Main Auditorium"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.location ? 'border-red-400' : 'border-gray-300'}`}
              />
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
            </div>

            {/* Capacity + Image URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity *</label>
                <input
                  type="number"
                  value={form.capacity}
                  onChange={(e) => handleChange('capacity', e.target.value)}
                  placeholder="e.g. 200"
                  min={1}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.capacity ? 'border-red-400' : 'border-gray-300'}`}
                />
                {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) => handleChange('imageUrl', e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>

            {/* Image preview */}
            {form.imageUrl && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Image preview:</p>
                <img
                  src={form.imageUrl}
                  alt="Event preview"
                  className="w-full h-36 object-cover rounded-xl"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}

            <div className="flex gap-3 mt-2">
              <Link
                to="/admin"
                className="flex-1 text-center py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60 text-sm"
              >
                {saving ? 'Saving...' : isEditing ? 'Update Event' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
