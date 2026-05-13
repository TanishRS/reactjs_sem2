import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, MapPin, User, Ticket as TicketIcon, Download } from 'lucide-react';
import { getList, KEYS } from '../utils/storage';
import { formatDate, formatTime } from '../utils/dateHelpers';
import { GlowCard } from '../components/ui/spotlight-card';
import { Button } from '../components/ui/button';
import { ButtonColorful } from '../components/ui/button-colorful';

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-slate-500">
          <TicketIcon className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium">Ticket not found</p>
          <Link to="/" className="text-zinc-600 hover:underline text-sm mt-2 block">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const shortId = ticketId.split('-')[0].toUpperCase();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-white text-center mb-6">Your Ticket</h1>

        {/* Ticket card */}
        <GlowCard customSize={true} className="bg-card border border-border/50 rounded-2xl p-0 overflow-hidden relative">
          {/* Top: event image */}
          <div className="relative">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-40 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-5">
              <div>
                <span className="text-xs font-medium bg-zinc-500/20 text-zinc-300 border border-zinc-500/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
                  {event.category}
                </span>
                <h2 className="text-white font-bold text-xl mt-2 leading-tight drop-shadow-md">{event.title}</h2>
              </div>
            </div>
          </div>

          {/* Middle: event details */}
          <div className="px-6 py-6 border-b border-dashed border-border/50 grid grid-cols-2 gap-5 relative z-10">
            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-zinc-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Date</p>
                <p className="text-sm font-semibold text-slate-100 leading-tight">{formatDate(event.date)}</p>
                <p className="text-xs text-slate-400 mt-0.5">{formatTime(event.time)}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-zinc-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Location</p>
                <p className="text-sm font-semibold text-slate-100 leading-tight">{event.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <User className="w-4 h-4 text-zinc-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Attendee</p>
                <p className="text-sm font-semibold text-slate-100 leading-tight">{registration.attendeeData.fullName}</p>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{registration.attendeeData.department}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <TicketIcon className="w-4 h-4 text-zinc-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Ticket ID</p>
                <p className="text-sm font-bold text-zinc-400 leading-tight">{shortId}</p>
              </div>
            </div>
          </div>

          {/* Stub: QR code section */}
          <div className="relative px-6 py-8 bg-slate-900/30">
            {/* Notch circles for the ticket-stub effect */}
            <div className="absolute -left-3 top-0 -translate-y-1/2 w-6 h-6 bg-background rounded-full border-r border-dashed border-border/50" />
            <div className="absolute -right-3 top-0 -translate-y-1/2 w-6 h-6 bg-background rounded-full border-l border-dashed border-border/50" />

            <div className="flex flex-col items-center gap-4 relative z-10">
              <div className="bg-white p-3 rounded-xl shadow-lg shadow-black/20">
                <QRCodeSVG
                  value={ticketId}
                  size={140}
                  level="M"
                  includeMargin={false}
                />
              </div>
              <p className="text-xs text-slate-400 text-center max-w-[200px]">
                Scan this QR code at the event entrance
              </p>
              <p className="text-xs font-mono text-slate-500 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                {ticketId}
              </p>
            </div>
          </div>
        </GlowCard>

        {/* Action buttons */}
        <div className="flex gap-4 mt-8">
          <Link to="/my-tickets" className="flex-1">
            <Button variant="outline" className="w-full py-6">
              All Tickets
            </Button>
          </Link>
          <Link to="/" className="flex-1">
            <ButtonColorful label="Browse Events" className="w-full py-6" />
          </Link>
        </div>
      </div>
    </div>
  );
}
