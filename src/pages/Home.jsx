// Home page — shows the event discovery grid with category and date-range filters.
// Seeds localStorage with initial events if it's empty on first load.

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import EventCard from '../components/EventCard';
import { getList, setItem, KEYS } from '../utils/storage';
import seedEvents from '../data/seedEvents';
import { isUpcoming, isPast, isThisWeek } from '../utils/dateHelpers';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['All', 'Festival', 'Workshop', 'Sports'];
const DATE_FILTERS = ['All', 'Upcoming', 'This Week', 'Past'];

export default function Home() {
  const [events, setEvents] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeDateFilter, setActiveDateFilter] = useState('All');
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Seed events into localStorage on first load if the list is empty.
  useEffect(() => {
    let stored = getList(KEYS.EVENTS);
    if (stored.length === 0) {
      setItem(KEYS.EVENTS, seedEvents);
      stored = seedEvents;
    }
    setEvents(stored);
  }, []);

  // Apply both category and date filters to the events list.
  const filteredEvents = events.filter((event) => {
    const categoryMatch = activeCategory === 'All' || event.category === activeCategory;

    let dateMatch = true;
    if (activeDateFilter === 'Upcoming') dateMatch = isUpcoming(event.date);
    else if (activeDateFilter === 'Past') dateMatch = isPast(event.date);
    else if (activeDateFilter === 'This Week') dateMatch = isThisWeek(event.date);

    return categoryMatch && dateMatch;
  });

  function handleRegister(event) {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: `/register/${event.id}` } });
    } else {
      navigate(`/register/${event.id}`);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Discover Campus Events</h1>
          <p className="text-indigo-200 text-base md:text-lg max-w-xl mx-auto">
            Find workshops, festivals, sports events and more happening at your campus.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters row */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-600">Category:</span>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:ml-auto">
            <span className="text-sm font-medium text-gray-600">When:</span>
            <select
              value={activeDateFilter}
              onChange={(e) => setActiveDateFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {DATE_FILTERS.map((filter) => (
                <option key={filter} value={filter}>{filter}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Result count */}
        <p className="text-sm text-gray-500 mb-4">
          {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
        </p>

        {/* Events grid or empty state */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <SlidersHorizontal className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-lg font-medium text-gray-500">No events match your filters</p>
            <p className="text-sm mt-1">Try changing the category or date range</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                actionLabel="Register"
                onAction={handleRegister}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
