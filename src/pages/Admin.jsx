import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Users, Calendar } from 'lucide-react';
import { getList, removeFromList, KEYS } from '../utils/storage';
import { formatDate } from '../utils/dateHelpers';
import ConfirmDialog from '../components/ConfirmDialog';
import { showToast } from '../components/Toast';
import { useNotifications } from '../context/NotificationContext';
import { GlowCard } from '../components/ui/spotlight-card';
import { ButtonColorful } from '../components/ui/button-colorful';

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
    addNotification('An event was removed.', 'info');
    loadData();
    showToast('Event deleted.', 'error');
  }

  function registrationCount(eventId) {
    return registrations.filter((r) => r.eventId === eventId).length;
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Hosted Events</h1>
            <p className="text-sm text-slate-400 mt-1">{events.length} events · {registrations.length} total registrations</p>
          </div>
          <Link to="/hosted-events/new">
            <ButtonColorful label="Add Event" />
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <GlowCard customSize={true} className="bg-card border border-border/50 rounded-xl p-5">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Total Events</p>
            <p className="text-3xl font-bold text-zinc-400 mt-2">{events.length}</p>
          </GlowCard>
          <GlowCard customSize={true} className="bg-card border border-border/50 rounded-xl p-5">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Registrations</p>
            <p className="text-3xl font-bold text-zinc-400 mt-2">{registrations.length}</p>
          </GlowCard>
          <GlowCard customSize={true} className="bg-card border border-border/50 rounded-xl p-5">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Festivals</p>
            <p className="text-3xl font-bold text-zinc-400 mt-2">
              {events.filter((ev) => ev.category === 'Festival').length}
            </p>
          </GlowCard>
          <GlowCard customSize={true} className="bg-card border border-border/50 rounded-xl p-5">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Workshops</p>
            <p className="text-3xl font-bold text-zinc-400 mt-2">
              {events.filter((ev) => ev.category === 'Workshop').length}
            </p>
          </GlowCard>
        </div>

        {/* Events table */}
        <GlowCard customSize={true} className="bg-card border border-border/50 rounded-2xl overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-900/50 border-b border-border/50 relative z-10">
                <tr>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Event</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide hidden sm:table-cell">Category</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide hidden md:table-cell">Date</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide hidden lg:table-cell">Capacity</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Regs</th>
                  <th className="text-right px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 relative z-10">
                {events.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-500">
                      No events yet. Click "Add Event" to create one.
                    </td>
                  </tr>
                ) : (
                  events.map((event) => (
                    <tr key={event.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0 hidden sm:block"
                            onError={(e) => {
                              e.target.src = `https://picsum.photos/seed/${event.id}/80/80`;
                            }}
                          />
                          <div>
                            <p className="font-medium text-slate-200 line-clamp-1">{event.title}</p>
                            <p className="text-xs text-slate-500 line-clamp-1 hidden sm:block mt-0.5">{event.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">
                          {event.category}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-400 hidden md:table-cell">
                        {formatDate(event.date)}
                      </td>
                      <td className="px-5 py-4 text-slate-400 hidden lg:table-cell">
                        {event.capacity}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                          <Users className="w-4 h-4 text-zinc-400" />
                          {registrationCount(event.id)}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            to={`/hosted-events/edit/${event.id}`}
                            className="p-2 text-slate-400 hover:text-zinc-400 bg-slate-900/50 hover:bg-slate-900 rounded-lg transition-colors border border-transparent hover:border-zinc-900/50"
                            title="Edit event"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setConfirmDeleteId(event.id)}
                            className="p-2 text-slate-400 hover:text-red-400 bg-slate-900/50 hover:bg-slate-900 rounded-lg transition-colors border border-transparent hover:border-red-900/50"
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
        </GlowCard>
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
