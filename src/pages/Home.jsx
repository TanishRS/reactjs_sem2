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
import { ShaderAnimation } from '../components/ui/shader-lines';
import { ScrollTiltedGrid } from '../components/ui/scroll-tilted-grid';

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
    
    // Sync seed images if they were updated
    let modified = false;
    stored = stored.map(event => {
      const seedMatch = seedEvents.find(se => se.id === event.id);
      if (seedMatch && event.imageUrl !== seedMatch.imageUrl) {
        modified = true;
        return { ...event, imageUrl: seedMatch.imageUrl };
      }
      return event;
    });

    if (stored.length === 0) {
      setItem(KEYS.EVENTS, seedEvents);
      stored = seedEvents;
    } else if (modified) {
      setItem(KEYS.EVENTS, stored);
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
    <div className="min-h-screen relative text-slate-100 bg-background">
      {/* Hero section */}
      <div className="relative py-24 px-4 overflow-hidden border-b border-white/10">
        <ShaderAnimation />
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">Discover Campus Events</h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-xl mx-auto font-light drop-shadow">
            Find workshops, festivals, sports events and more happening at your campus.
          </p>
        </div>
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters row */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-card/60 backdrop-blur-md p-4 rounded-2xl border border-border/50">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-300">Category:</span>
              <div className="flex gap-2 flex-wrap">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      activeCategory === category
                        ? 'bg-zinc-600 text-white'
                        : 'bg-card/80 text-slate-300 border border-border hover:border-zinc-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 sm:ml-auto">
              <span className="text-sm font-medium text-slate-300">When:</span>
              <select
                value={activeDateFilter}
                onChange={(e) => setActiveDateFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-border text-sm text-slate-200 bg-card/80 focus:outline-none focus:ring-2 focus:ring-zinc-400"
              >
                {DATE_FILTERS.map((filter) => (
                  <option key={filter} value={filter}>{filter}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Result count */}
          <p className="text-sm text-slate-400 mb-4 bg-background/50 inline-block px-3 py-1 rounded-full backdrop-blur-md">
            {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
          </p>

          {/* Events grid or empty state */}
          {filteredEvents.length === 0 ? (
            <div className="text-center py-20 text-slate-500 bg-background/40 backdrop-blur-md rounded-2xl border border-border/50 mt-4">
              <SlidersHorizontal className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-lg font-medium text-slate-400">No events match your filters</p>
              <p className="text-sm mt-1">Try changing the category or date range</p>
            </div>
          ) : (
            <div className="overflow-hidden relative -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
              <ScrollTiltedGrid
                images={filteredEvents.map((event) => (
                  <div key={event.id} className="w-full h-full p-2">
                    <EventCard
                      event={event}
                      actionLabel="Register"
                      onAction={() => handleRegister(event)}
                    />
                  </div>
                ))}
                loop={false}
                maxWidth="none"
                aspectRatio="1/1"
                maxBlur={0}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
