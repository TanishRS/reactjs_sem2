// My Tickets shows all tickets the user has earned from registrations.
// Each ticket links to its full ticket page with QR code.

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Calendar, MapPin } from 'lucide-react';
import { getList, KEYS } from '../utils/storage';
import { formatDate, formatTime, isPast } from '../utils/dateHelpers';
import { useAuth } from '../context/AuthContext';

export default function MyTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const registrations = getList(KEYS.REGISTRATIONS);
    const events = getList(KEYS.EVENTS);
    const myRegistrations = registrations.filter((r) => r.userId === user.id);

    const paired = myRegistrations
      .map((registration) => ({
        registration,
        event: events.find((ev) => ev.id === registration.eventId),
      }))
      .filter((item) => item.event)
      .sort((a, b) => new Date(b.registration.registeredAt) - new Date(a.registration.registeredAt));

    setTickets(paired);
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Tickets</h1>

        {tickets.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <Ticket className="w-14 h-14 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium text-gray-500">No tickets yet</p>
            <p className="text-sm mt-1 mb-6">Register for an event to get your ticket</p>
            <Link
              to="/"
              className="inline-block px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors text-sm"
            >
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tickets.map(({ registration, event }) => {
              const past = isPast(event.date);
              const shortId = registration.ticketId.split('-')[0].toUpperCase();

              return (
                <Link
                  key={registration.id}
                  to={`/ticket/${registration.ticketId}`}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                >
                  <div className="relative">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-32 object-cover group-hover:opacity-90 transition-opacity"
                    />
                    <span className={`absolute top-2 right-2 text-xs font-medium px-2 py-0.5 rounded-full ${past ? 'bg-gray-800/70 text-white' : 'bg-indigo-600/90 text-white'}`}>
                      {past ? 'Past' : 'Upcoming'}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="font-bold text-gray-900 text-sm mb-2 line-clamp-1">{event.title}</p>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{formatDate(event.date)} · {formatTime(event.time)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-gray-400">Ticket #{shortId}</span>
                      <span className="text-xs text-indigo-600 font-medium group-hover:underline">
                        View →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
