// EventCard displays a single event in the grid on the Home and schedule pages.
// It shows the event image, category badge, title, date, location, and a CTA button.

import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';
import { formatDate, formatTime } from '../utils/dateHelpers';

const CATEGORY_COLORS = {
  Festival: 'bg-purple-100 text-purple-700',
  Workshop: 'bg-blue-100 text-blue-700',
  Sports: 'bg-green-100 text-green-700',
};

export default function EventCard({ event, actionLabel, onAction }) {
  const categoryStyle = CATEGORY_COLORS[event.category] || 'bg-gray-100 text-gray-700';

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-200 flex flex-col">
      {/* Event image */}
      <div className="relative">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-44 object-cover"
          onError={(e) => {
            e.target.src = `https://picsum.photos/seed/${event.id}/400/250`;
          }}
        />
        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${categoryStyle}`}>
          {event.category}
        </span>
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-base leading-snug mb-2 line-clamp-2">
          {event.title}
        </h3>

        <div className="flex flex-col gap-1 text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 flex-shrink-0 text-indigo-400" />
            <span>{formatDate(event.date)} · {formatTime(event.time)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 flex-shrink-0 text-indigo-400" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 flex-shrink-0 text-indigo-400" />
            <span>Capacity: {event.capacity}</span>
          </div>
        </div>

        {/* Pushes buttons to the bottom of the card */}
        <div className="mt-auto flex gap-2">
          <Link
            to={`/events/${event.id}`}
            className="flex-1 text-center px-3 py-2 text-sm rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            View Details
          </Link>
          {onAction && (
            <button
              onClick={() => onAction(event)}
              className="flex-1 px-3 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              {actionLabel || 'Register'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
