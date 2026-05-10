// Admin dashboard: shows a table of all events with Edit and Delete buttons.
// Only accessible when the user has the "admin" role.

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Users, Calendar } from 'lucide-react';
import { getList, removeFromList, KEYS } from '../utils/storage';
import { formatDate } from '../utils/dateHelpers';
import ConfirmDialog from '../components/ConfirmDialog';
import { showToast } from '../components/Toast';
import { useNotifications } from '../context/NotificationContext';

export default function Admin() {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const { addNotification } = useNotifications();

  function loadData() {
    setEvents(getList(KEYS.EVENTS));
    setRegistrations(getList(KEYS.REGISTRATIONS));
  }

  useEffect(() => {
    loadData();
  }, []);

  function deleteEvent(eventId) {
    removeFromList(KEYS.EVENTS, eventId);
    addNotification('An event was removed by admin.', 'info');
    loadData();
    showToast('Event deleted.', 'error');
  }

  // Count how many students have registered for a given event.
  function registrationCount(eventId) {
    return registrations.filter((r) => r.eventId === eventId).length;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">{events.length} events · {registrations.length} total registrations</p>
          </div>
          <Link
            to="/admin/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" /> Add Event
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Total Events</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">{events.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Registrations</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">{registrations.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Festivals</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">
              {events.filter((ev) => ev.category === 'Festival').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Workshops</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {events.filter((ev) => ev.category === 'Workshop').length}
            </p>
          </div>
        </div>

        {/* Events table */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Event</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Capacity</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Regs</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {events.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400">
                      No events yet. Click "Add Event" to create one.
                    </td>
                  </tr>
                ) : (
                  events.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0 hidden sm:block"
                          />
                          <div>
                            <p className="font-medium text-gray-900 line-clamp-1">{event.title}</p>
                            <p className="text-xs text-gray-400 line-clamp-1 hidden sm:block">{event.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                          {event.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                        {formatDate(event.date)}
                      </td>
                      <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">
                        {event.capacity}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Users className="w-3.5 h-3.5 text-indigo-400" />
                          {registrationCount(event.id)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/edit/${event.id}`}
                            className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors"
                            title="Edit event"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setConfirmDeleteId(event.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={() => deleteEvent(confirmDeleteId)}
        title="Delete Event"
        message="Are you sure you want to delete this event? All registrations for this event will be lost."
      />
    </div>
  );
}
