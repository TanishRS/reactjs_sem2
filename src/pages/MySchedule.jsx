// My Schedule shows all events the logged-in user has registered for,
// sorted by upcoming date first. Allows cancelling a registration.

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket, Trash2, Star } from 'lucide-react';
import { getList, removeFromList, KEYS } from '../utils/storage';
import { formatDate, formatTime, isPast } from '../utils/dateHelpers';
import { useAuth } from '../context/AuthContext';
import ConfirmDialog from '../components/ConfirmDialog';
import { showToast } from '../components/Toast';

export default function MySchedule() {
  const { user } = useAuth();
  const [myEvents, setMyEvents] = useState([]);
  const [confirmReg, setConfirmReg] = useState(null); // registration to cancel

  function loadSchedule() {
    const registrations = getList(KEYS.REGISTRATIONS);
    const events = getList(KEYS.EVENTS);
    const myRegistrations = registrations.filter((r) => r.userId === user.id);

    // Pair each registration with its event data and sort upcoming first.
    const paired = myRegistrations
      .map((registration) => ({
        registration,
        event: events.find((ev) => ev.id === registration.eventId),
      }))
      .filter((item) => item.event)
      .sort((a, b) => new Date(a.event.date) - new Date(b.event.date));

    setMyEvents(paired);
  }

  useEffect(() => {
    loadSchedule();
  }, [user]);

  function cancelRegistration(registrationId) {
    removeFromList(KEYS.REGISTRATIONS, registrationId);
    loadSchedule();
    showToast('Registration cancelled.', 'info');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Schedule</h1>

        {myEvents.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <Calendar className="w-14 h-14 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium text-gray-500">No events on your schedule yet</p>
            <p className="text-sm mt-1 mb-6">Register for an event and it will appear here</p>
            <Link
              to="/"
              className="inline-block px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors text-sm"
            >
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {myEvents.map(({ registration, event }) => {
              const past = isPast(event.date);
              return (
                <div key={registration.id} className="bg-white rounded-2xl shadow-sm overflow-hidden flex">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-28 h-auto object-cover flex-shrink-0 hidden sm:block"
                  />
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${past ? 'bg-gray-100 text-gray-500' : 'bg-indigo-100 text-indigo-600'}`}>
                          {past ? 'Past' : 'Upcoming'}
                        </span>
                        <h3 className="font-bold text-gray-900 mt-1">{event.title}</h3>
                      </div>
                      {/* Only allow cancelling upcoming events */}
                      {!past && (
                        <button
                          onClick={() => setConfirmReg(registration)}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                          title="Cancel registration"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col gap-1 text-sm text-gray-500 mt-2">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-indigo-400" />
                        <span>{formatDate(event.date)} · {formatTime(event.time)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-indigo-400" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-3">
                      <Link
                        to={`/ticket/${registration.ticketId}`}
                        className="flex items-center gap-1.5 text-xs text-indigo-600 hover:underline"
                      >
                        <Ticket className="w-3.5 h-3.5" /> View Ticket
                      </Link>
                      {past && (
                        <Link
                          to={`/events/${event.id}`}
                          className="flex items-center gap-1.5 text-xs text-yellow-600 hover:underline"
                        >
                          <Star className="w-3.5 h-3.5" /> Rate Event
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!confirmReg}
        onClose={() => setConfirmReg(null)}
        onConfirm={() => cancelRegistration(confirmReg?.id)}
        title="Cancel Registration"
        message={`Are you sure you want to cancel your registration? This action cannot be undone.`}
      />
    </div>
  );
}
