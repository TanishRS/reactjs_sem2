// EventDetails shows full info about a single event: description, stats,
// a register button, and the feedback section (ratings + comments).

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowLeft, Star } from 'lucide-react';
import StarRating from '../components/StarRating';
import { getList, addToList, KEYS } from '../utils/storage';
import { formatDate, formatTime, isPast } from '../utils/dateHelpers';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../components/Toast';

export default function EventDetails() {
  const { id } = useParams();
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [feedbackList, setFeedbackList] = useState([]);
  const [userFeedback, setUserFeedback] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const events = getList(KEYS.EVENTS);
    const found = events.find((ev) => ev.id === id);
    setEvent(found || null);

    const allFeedback = getList(KEYS.FEEDBACK);
    const eventFeedback = allFeedback.filter((fb) => fb.eventId === id);
    setFeedbackList(eventFeedback);

    if (user) {
      const myFeedback = eventFeedback.find((fb) => fb.userId === user.id);
      setUserFeedback(myFeedback || null);

      const registrations = getList(KEYS.REGISTRATIONS);
      const registered = registrations.some(
        (r) => r.eventId === id && r.userId === user.id
      );
      setIsRegistered(registered);
    }
  }, [id, user]);

  function submitFeedback() {
    if (rating === 0) {
      showToast('Please select a star rating.', 'error');
      return;
    }
    const feedback = {
      id: `fb-${Date.now()}`,
      eventId: id,
      userId: user.id,
      userName: user.name,
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    };
    addToList(KEYS.FEEDBACK, feedback);
    setFeedbackList((prev) => [...prev, feedback]);
    setUserFeedback(feedback);
    showToast('Thanks for your feedback!', 'success');
  }

  // Compute average rating from all feedback for this event.
  const avgRating =
    feedbackList.length > 0
      ? (feedbackList.reduce((sum, fb) => sum + fb.rating, 0) / feedbackList.length).toFixed(1)
      : null;

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p className="text-xl font-medium">Event not found</p>
          <Link to="/" className="mt-3 inline-block text-indigo-600 hover:underline text-sm">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const eventIsPast = isPast(event.date);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back link */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {/* Event image */}
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-56 md:h-72 object-cover"
          />

          <div className="p-6 md:p-8">
            {/* Category + title */}
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 mb-3">
              {event.category}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>

            {/* Event meta */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-5 h-5 text-indigo-400" />
                <div>
                  <p className="text-xs text-gray-400">Date & Time</p>
                  <p className="text-sm font-medium">{formatDate(event.date)}</p>
                  <p className="text-sm">{formatTime(event.time)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-5 h-5 text-indigo-400" />
                <div>
                  <p className="text-xs text-gray-400">Location</p>
                  <p className="text-sm font-medium">{event.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-5 h-5 text-indigo-400" />
                <div>
                  <p className="text-xs text-gray-400">Capacity</p>
                  <p className="text-sm font-medium">{event.capacity} seats</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed mb-6">{event.description}</p>

            {/* Average rating display */}
            {avgRating && (
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="font-bold text-gray-900">{avgRating}</span>
                <span className="text-sm text-gray-500">({feedbackList.length} ratings)</span>
              </div>
            )}

            {/* Register button */}
            {!eventIsPast && (
              <div className="mb-6">
                {isRegistered ? (
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-100 text-green-700 text-sm font-medium">
                    ✓ You are registered for this event
                  </div>
                ) : (
                  <Link
                    to={isLoggedIn ? `/register/${event.id}` : '/login'}
                    state={!isLoggedIn ? { from: `/register/${event.id}` } : undefined}
                    className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Register Now
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Feedback section */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Reviews & Ratings</h2>

          {/* Submit feedback form (only if past event, registered, and not yet reviewed) */}
          {eventIsPast && isLoggedIn && isRegistered && !userFeedback && (
            <div className="bg-indigo-50 rounded-xl p-5 mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">How was this event?</h3>
              <StarRating value={rating} onChange={setRating} />
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience (optional)..."
                rows={3}
                className="w-full mt-3 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              />
              <button
                onClick={submitFeedback}
                className="mt-3 px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Submit Feedback
              </button>
            </div>
          )}

          {userFeedback && (
            <div className="bg-green-50 rounded-lg p-3 mb-4 text-sm text-green-700">
              ✓ You rated this event {userFeedback.rating}/5
            </div>
          )}

          {/* Comments list */}
          {feedbackList.length === 0 ? (
            <p className="text-gray-400 text-sm">No reviews yet. Be the first!</p>
          ) : (
            <div className="flex flex-col gap-4">
              {feedbackList.map((fb) => (
                <div key={fb.id} className="border-b pb-4 last:border-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-gray-800">{fb.userName}</span>
                    <StarRating value={fb.rating} readonly />
                  </div>
                  {fb.comment && <p className="text-sm text-gray-600">{fb.comment}</p>}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(fb.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
