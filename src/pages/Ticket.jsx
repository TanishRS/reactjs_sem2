// Ticket page shows a styled ticket for a confirmed registration.
// It displays event details, attendee info, a unique ticket ID, and a QR code.

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, MapPin, User, Ticket as TicketIcon, Download } from 'lucide-react';
import { getList, KEYS } from '../utils/storage';
import { formatDate, formatTime } from '../utils/dateHelpers';

export default function Ticket() {
  const { ticketId } = useParams();
  const [registration, setRegistration] = useState(null);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const registrations = getList(KEYS.REGISTRATIONS);
    const reg = registrations.find((r) => r.ticketId === ticketId);
    setRegistration(reg || null);

    if (reg) {
      const events = getList(KEYS.EVENTS);
      const found = events.find((ev) => ev.id === reg.eventId);
      setEvent(found || null);
    }
  }, [ticketId]);

  if (!registration || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <TicketIcon className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium">Ticket not found</p>
          <Link to="/" className="text-indigo-600 hover:underline text-sm mt-2 block">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const shortId = ticketId.split('-')[0].toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">Your Ticket</h1>

        {/* Ticket card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Top: event image */}
          <div className="relative">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-40 object-cover"
            />
            <div className="absolute inset-0 bg-indigo-900/60 flex items-end p-4">
              <div>
                <span className="text-xs font-medium bg-white/20 text-white px-2 py-0.5 rounded-full">
                  {event.category}
                </span>
                <h2 className="text-white font-bold text-lg mt-1 leading-tight">{event.title}</h2>
              </div>
            </div>
          </div>

          {/* Middle: event details */}
          <div className="px-6 py-5 border-b border-dashed border-gray-200 grid grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Date</p>
                <p className="text-sm font-semibold text-gray-800">{formatDate(event.date)}</p>
                <p className="text-xs text-gray-500">{formatTime(event.time)}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Location</p>
                <p className="text-sm font-semibold text-gray-800">{event.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <User className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Attendee</p>
                <p className="text-sm font-semibold text-gray-800">{registration.attendeeData.fullName}</p>
                <p className="text-xs text-gray-500">{registration.attendeeData.department}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <TicketIcon className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Ticket ID</p>
                <p className="text-sm font-bold text-indigo-600">{shortId}</p>
              </div>
            </div>
          </div>

          {/* Stub: QR code section */}
          <div className="relative px-6 py-5 bg-indigo-50">
            {/* Notch circles for the ticket-stub effect */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gradient-to-br from-indigo-50 to-blue-100 rounded-full border-r border-dashed border-gray-200" />
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gradient-to-br from-indigo-50 to-blue-100 rounded-full border-l border-dashed border-gray-200" />

            <div className="flex flex-col items-center gap-3">
              <div className="bg-white p-3 rounded-xl shadow-sm">
                <QRCodeSVG
                  value={ticketId}
                  size={120}
                  level="M"
                  includeMargin={false}
                />
              </div>
              <p className="text-xs text-gray-400 text-center">
                Scan this QR code at the event entrance
              </p>
              <p className="text-xs font-mono text-gray-500 bg-white px-3 py-1 rounded-lg">
                {ticketId}
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-6">
          <Link
            to="/my-tickets"
            className="flex-1 text-center px-4 py-3 border border-indigo-200 text-indigo-600 rounded-xl font-medium hover:bg-indigo-50 transition-colors text-sm"
          >
            All Tickets
          </Link>
          <Link
            to="/"
            className="flex-1 text-center px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors text-sm"
          >
            Browse Events
          </Link>
        </div>
      </div>
    </div>
  );
}
