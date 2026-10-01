window.ReanRushData = {
  users: [
    { email: 'student@school.edu.kh', password: 'student123', role: 'student', name: 'Sokha V.' },
    { email: 'host@school.edu.kh', password: 'host123', role: 'host', name: 'Kru Rathana' },
    { email: 'admin@reanrush.edu.kh', password: 'admin123', role: 'admin', name: 'ReanRush Admin' }
  ],
  classes: [
    { name: 'Grade 12-A Physics', subject: 'រូបវិទ្យា', players: 38, pin: 'RUSH-849', score: 1240 },
    { name: 'Grade 12-B Chemistry', subject: 'គីមីវិទ្យា', players: 42, pin: 'RUSH-512', score: 1085 },
    { name: 'Grade 11-A Math', subject: 'គណិតវិទ្យា', players: 36, pin: 'RUSH-204', score: 940 }
  ],
  leaderboard: [
    { name: 'Sokha V.', team: 'A', points: 2480 }, { name: 'Dara M.', team: 'B', points: 2310 },
    { name: 'Lina C.', team: 'A', points: 2190 }, { name: 'Vicheka P.', team: 'B', points: 1940 }
  ],
  flashcards: [
    { front: 'តើកម្លាំងមានន័យដូចម្តេច?', back: 'A push or pull that can change an object’s motion.' },
    { front: 'What is the SI unit of force?', back: 'The newton (N).' },
    { front: 'State Newton’s second law.', back: 'Force equals mass multiplied by acceleration: F = ma.' }
  ],
  lobbyPlayers: [
    { name: 'Sokha V.', team: 'A' },
    { name: 'Dara M.', team: 'B' },
    { name: 'Lina C.', team: 'A' },
    { name: 'Vicheka P.', team: 'B' },
    { name: 'Mony S.', team: 'A' },
    { name: 'Rithy K.', team: 'B' }
  ],
  battleQuestions: [
    [{ question: 'Which unit is used to measure force?', choices: ['Joule (J)', 'Newton (N)', 'Watt (W)', 'Pascal (Pa)'], answer: 'Newton (N)', points: 120 },
      { question: 'What is the force that pulls objects toward Earth?', choices: ['Magnetism', 'Gravity', 'Friction', 'Tension'], answer: 'Gravity', points: 110 },
      { question: 'If an object has mass 2 kg and acceleration 3 m/s², what is the force?', choices: ['3 N', '5 N', '6 N', '9 N'], answer: '6 N', points: 130 }],
    [{ question: 'Which is a contact force?', choices: ['Gravity', 'Magnetism', 'Friction', 'Electric field'], answer: 'Friction', points: 120 },
      { question: 'What happens to motion when balanced forces act on an object?', choices: ['It speeds up', 'It slows down', 'It stays at rest or constant velocity', 'It spins'], answer: 'It stays at rest or constant velocity', points: 110 },
      { question: 'What is the SI unit of mass?', choices: ['Newton', 'Kilogram', 'Meter', 'Second'], answer: 'Kilogram', points: 100 }],
    [{ question: 'Which object has the greatest inertia?', choices: ['A toy car', 'A bicycle', 'A truck', 'A tennis ball'], answer: 'A truck', points: 130 },
      { question: 'A force that resists motion between surfaces is called?', choices: ['Lift', 'Motion', 'Friction', 'Gravity'], answer: 'Friction', points: 115 },
      { question: 'What does acceleration measure?', choices: ['Change in speed only', 'Change in direction only', 'Change in velocity over time', 'Mass times force'], answer: 'Change in velocity over time', points: 125 }]
  ],
  teamScores: {
    'Team A': 8420,
    'Team B': 7980
  },
  defaultQuiz: {
    title: 'Physics warm-up',
    subject: 'Physics',
    questions: [
      { prompt: 'What force pulls objects toward Earth?', options: ['Gravity', 'Magnetism', 'Friction', 'Sound'], answer: 'Gravity' },
      { prompt: 'What is the unit for force?', options: ['Joule', 'Newton', 'Watt', 'Volt'], answer: 'Newton' },
      { prompt: 'Which is a simple machine?', options: ['Lamp', 'Lever', 'Window', 'Shoe'], answer: 'Lever' }
    ]
  },
  mistakeVault: []
};
