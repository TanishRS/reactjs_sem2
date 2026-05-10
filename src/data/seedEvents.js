// Seed data: 8 realistic college events across all three categories.
// Images come from picsum.photos keyed by event ID for consistency.

const seedEvents = [
  {
    id: 'evt-001',
    title: 'Annual Tech Fest 2026',
    description:
      'The biggest technology festival on campus! Featuring hackathons, coding competitions, robotics exhibitions, and talks by industry leaders from top tech companies. Come showcase your projects and win exciting prizes.',
    category: 'Festival',
    date: '2026-06-15',
    time: '09:00',
    location: 'Main Auditorium & Ground Floor',
    capacity: 500,
    imageUrl: 'https://picsum.photos/seed/evt-001/400/250',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'evt-002',
    title: 'React Workshop: Build Modern UIs',
    description:
      'A hands-on workshop covering React fundamentals, hooks, and state management. You will build a real project from scratch. Laptop required. Aimed at students with basic JavaScript knowledge.',
    category: 'Workshop',
    date: '2026-05-20',
    time: '10:00',
    location: 'Computer Lab 3, Block B',
    capacity: 40,
    imageUrl: 'https://picsum.photos/seed/evt-002/400/250',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'evt-003',
    title: 'Inter-College Football Championship',
    description:
      'The annual inter-college football tournament is back! Eight colleges compete for the championship trophy. Come support your team and enjoy an exciting day of football, food stalls, and live music.',
    category: 'Sports',
    date: '2026-05-25',
    time: '08:00',
    location: 'College Sports Ground',
    capacity: 1000,
    imageUrl: 'https://picsum.photos/seed/evt-003/400/250',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'evt-004',
    title: 'Cultural Night: Echoes of India',
    description:
      'A vibrant cultural evening celebrating the diversity of India. Enjoy classical dance performances, folk music, drama, and stand-up comedy by student artists. Traditional food stalls will be set up.',
    category: 'Festival',
    date: '2026-06-01',
    time: '18:00',
    location: 'Open Air Theatre',
    capacity: 600,
    imageUrl: 'https://picsum.photos/seed/evt-004/400/250',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'evt-005',
    title: 'Machine Learning Bootcamp',
    description:
      'A two-day intensive bootcamp on machine learning basics. Topics include Python for ML, scikit-learn, data preprocessing, and building your first model. Certificate provided on completion.',
    category: 'Workshop',
    date: '2026-06-08',
    time: '09:30',
    location: 'Seminar Hall 2',
    capacity: 60,
    imageUrl: 'https://picsum.photos/seed/evt-005/400/250',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'evt-006',
    title: 'Cricket Premier League — Campus Edition',
    description:
      'Twenty20 cricket tournament among department teams. Register your department team of 11 players. Best batsman, bowler, and fielder awards. Knockout format — may the best team win!',
    category: 'Sports',
    date: '2026-05-18',
    time: '07:30',
    location: 'Cricket Ground, East Campus',
    capacity: 300,
    imageUrl: 'https://picsum.photos/seed/evt-006/400/250',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'evt-007',
    title: 'Entrepreneurship Summit 2026',
    description:
      'Meet successful alumni entrepreneurs and pitch your startup idea to a panel of investors and mentors. Workshops on idea validation, funding, and growth hacking. Free registration. Limited seats!',
    category: 'Workshop',
    date: '2026-07-05',
    time: '10:00',
    location: 'Conference Hall, Admin Block',
    capacity: 150,
    imageUrl: 'https://picsum.photos/seed/evt-007/400/250',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'evt-008',
    title: 'Freshers Welcome Carnival',
    description:
      'Welcome to campus! First-year students get to experience a fun-filled carnival with games, music, cultural performances, and the chance to connect with seniors and faculty. Food and goodies included.',
    category: 'Festival',
    date: '2026-07-12',
    time: '16:00',
    location: 'Campus Central Lawn',
    capacity: 800,
    imageUrl: 'https://picsum.photos/seed/evt-008/400/250',
    createdAt: new Date().toISOString(),
  },
];

export default seedEvents;
