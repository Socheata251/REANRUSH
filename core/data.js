(function () {
  function buildQuizSet() {
    var questionBank = {
      'Forces & Motion': [
        { prompt: 'Which unit is used to measure force?', options: ['Joule (J)', 'Newton (N)', 'Watt (W)', 'Pascal (Pa)'], answer: 'Newton (N)' },
        { prompt: 'What is the force that pulls objects toward Earth?', options: ['Magnetism', 'Gravity', 'Friction', 'Tension'], answer: 'Gravity' },
        { prompt: 'If an object has mass 2 kg and acceleration 3 m/s², what is the force?', options: ['3 N', '5 N', '6 N', '9 N'], answer: '6 N' },
        { prompt: 'Which is a contact force?', options: ['Gravity', 'Magnetism', 'Friction', 'Electric field'], answer: 'Friction' },
        { prompt: 'What happens to motion when balanced forces act on an object?', options: ['It speeds up', 'It slows down', 'It stays at rest or constant velocity', 'It spins'], answer: 'It stays at rest or constant velocity' },
        { prompt: 'What is the SI unit of mass?', options: ['Newton', 'Kilogram', 'Meter', 'Second'], answer: 'Kilogram' }
      ],
      'Energy & Heat': [
        { prompt: 'Which form of energy is stored in food?', options: ['Kinetic energy', 'Chemical energy', 'Sound energy', 'Nuclear energy'], answer: 'Chemical energy' },
        { prompt: 'What is the SI unit of power?', options: ['Joule', 'Watt', 'Newton', 'Volt'], answer: 'Watt' },
        { prompt: 'When a hot object touches a cooler object, heat moves by?', options: ['Conduction', 'Refraction', 'Reflection', 'Evaporation'], answer: 'Conduction' },
        { prompt: 'Which factor increases the kinetic energy of a moving object?', options: ['Lower mass', 'Higher temperature', 'Higher speed', 'More friction'], answer: 'Higher speed' },
        { prompt: 'The energy of motion is called?', options: ['Potential energy', 'Thermal energy', 'Kinetic energy', 'Light energy'], answer: 'Kinetic energy' },
        { prompt: 'Which object is the best conductor of heat?', options: ['Wood', 'Plastic', 'Metal', 'Glass'], answer: 'Metal' }
      ],
      'Waves & Light': [
        { prompt: 'What travels in a wave?', options: ['Matter only', 'Energy only', 'Both matter and energy', 'Heat only'], answer: 'Energy only' },
        { prompt: 'Which color has the longest wavelength?', options: ['Violet', 'Red', 'Green', 'Blue'], answer: 'Red' },
        { prompt: 'What happens when light bends as it passes into a new medium?', options: ['Reflection', 'Refraction', 'Diffraction', 'Absorption'], answer: 'Refraction' },
        { prompt: 'Sound is an example of which kind of wave?', options: ['Electromagnetic', 'Mechanical', 'Gravitational', 'Nuclear'], answer: 'Mechanical' },
        { prompt: 'The pitch of a sound depends mostly on its?', options: ['Amplitude', 'Frequency', 'Speed', 'Volume'], answer: 'Frequency' },
        { prompt: 'Which part of the eye focuses light?', options: ['Retina', 'Lens', 'Cornea', 'Pupil'], answer: 'Lens' }
      ],
      'Atoms & Molecules': [
        { prompt: 'What is the center of an atom called?', options: ['Electron cloud', 'Nucleus', 'Shell', 'Photon'], answer: 'Nucleus' },
        { prompt: 'Which particle carries a negative charge?', options: ['Proton', 'Neutron', 'Electron', 'Photon'], answer: 'Electron' },
        { prompt: 'A molecule is made of?', options: ['One atom only', 'Two or more atoms bonded together', 'A single proton', 'A mixture of electrons'], answer: 'Two or more atoms bonded together' },
        { prompt: 'What is the chemical symbol for oxygen?', options: ['O', 'Ox', 'Oy', 'Om'], answer: 'O' },
        { prompt: 'In solids, particles are usually?', options: ['Far apart and moving freely', 'Closely packed and vibrating', 'Only in liquid form', 'Always stationary'], answer: 'Closely packed and vibrating' },
        { prompt: 'Which state of matter has a fixed volume but no fixed shape?', options: ['Solid', 'Liquid', 'Gas', 'Plasma'], answer: 'Liquid' }
      ],
      'Earth Science': [
        { prompt: 'What is the process by which water vapor changes to liquid?', options: ['Evaporation', 'Condensation', 'Melting', 'Freezing'], answer: 'Condensation' },
        { prompt: 'Which layer of Earth do we live on?', options: ['Core', 'Mantle', 'Crust', 'Outer core'], answer: 'Crust' },
        { prompt: 'Which force causes rocks to fall downhill?', options: ['Gravity', 'Magnetism', 'Friction', 'Pressure'], answer: 'Gravity' },
        { prompt: 'What is the main source of energy for Earth’s weather?', options: ['Moon', 'Sun', 'Mantle', 'Ocean currents'], answer: 'Sun' },
        { prompt: 'Which type of rock forms from cooled magma?', options: ['Sedimentary', 'Metamorphic', 'Igneous', 'Limestone'], answer: 'Igneous' },
        { prompt: 'Which gas is most abundant in Earth’s atmosphere?', options: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Helium'], answer: 'Nitrogen' }
      ],
      'Human Body': [
        { prompt: 'Which organ pumps blood throughout the body?', options: ['Lungs', 'Heart', 'Brain', 'Liver'], answer: 'Heart' },
        { prompt: 'Which system carries oxygen to the body cells?', options: ['Digestive', 'Respiratory', 'Muscular', 'Nervous'], answer: 'Respiratory' },
        { prompt: 'What is the main job of red blood cells?', options: ['Break down food', 'Carry oxygen', 'Produce hormones', 'Filter waste'], answer: 'Carry oxygen' },
        { prompt: 'Which organ helps digest food by producing enzymes?', options: ['Kidney', 'Liver', 'Stomach', 'Bladder'], answer: 'Stomach' },
        { prompt: 'Which part of the body controls balance and coordination?', options: ['Cerebrum', 'Cerebellum', 'Lungs', 'Pancreas'], answer: 'Cerebellum' },
        { prompt: 'What is the basic unit of life?', options: ['Atom', 'Cell', 'Tissue', 'Organ'], answer: 'Cell' }
      ]
    };

    var titles = [
      'Physics Warm-Up',
      'Biology Sprint',
      'Chemistry Challenge',
      'Earth Science Quest',
      'STEM Power Round',
      'Human Body Lab'
    ];

    return titles.map(function (title, quizIndex) {
      var roundNames = ['Forces & Motion', 'Energy & Heat', 'Waves & Light'];
      if (quizIndex % 2 === 1) {
        roundNames = ['Atoms & Molecules', 'Earth Science', 'Human Body'];
      }

      return {
        id: 'quiz-' + (quizIndex + 1),
        title: title,
        subject: ['Physics', 'Biology', 'Chemistry', 'Earth Science', 'STEM', 'Health'][quizIndex],
        rounds: roundNames.map(function (roundName, roundIndex) {
          return {
            id: 'round-' + (quizIndex + 1) + '-' + (roundIndex + 1),
            name: roundName,
            questions: (questionBank[roundName] || []).map(function (question, questionIndex) {
              return {
                id: 'question-' + (quizIndex + 1) + '-' + (roundIndex + 1) + '-' + (questionIndex + 1),
                prompt: question.prompt,
                options: question.options,
                answer: question.answer,
                points: 100 + (questionIndex * 15)
              };
            })
          };
        })
      };
    });
  }

  function buildFlashcards() {
    var cards = [
      'What is force?', 'What is gravity?', 'What is the SI unit of energy?', 'What is friction?', 'What is velocity?',
      'What is acceleration?', 'What is a cell?', 'What is kinetic energy?', 'What is a molecule?', 'What is condensation?',
      'What is the heart’s role?', 'What is refraction?', 'What is a conductor?', 'What is a wave?', 'What is a nucleus?',
      'What is an atom?', 'What is a planet?', 'What is the atmosphere?', 'What is a lever?', 'What is inertia?'
    ];

    return cards.map(function (prompt, index) {
      return {
        id: 'flashcard-' + (index + 1),
        front: prompt,
        back: 'Demo answer for ' + prompt.toLowerCase() + ' in the ReanRush classroom app.'
      };
    });
  }

  var store = window.ReanRushStore || { get: function () { return null; }, set: function (key, value) { window.localStorage.setItem(key, JSON.stringify(value)); } };
  var existing = store.get('reanrush_store', null);
  var payload = existing || {
    users: [
      { id: 'user-student', email: 'student@school.edu.kh', password: 'student123', role: 'student', name: 'Sokha V.' },
      { id: 'user-host', email: 'host@school.edu.kh', password: 'host123', role: 'host', name: 'Kru Rathana' },
      { id: 'user-admin', email: 'admin@reanrush.edu.kh', password: 'admin123', role: 'admin', name: 'ReanRush Admin' }
    ],
    classes: [
      { id: 'class-physics', name: 'Grade 12-A Physics', subject: 'រូបវិទ្យា', players: 38, pin: 'RUSH-849', score: 1240 },
      { id: 'class-chemistry', name: 'Grade 12-B Chemistry', subject: 'គីមីវិទ្យា', players: 42, pin: 'RUSH-512', score: 1085 }
    ],
    quizzes: buildQuizSet(),
    games: [
      { id: 'game-1', name: 'Physics Arena', status: 'live', pin: '402198', students: 18 },
      { id: 'game-2', name: 'STEM Clash', status: 'waiting', pin: '402201', students: 12 }
    ],
    players: [
      { id: 'player-1', name: 'Sokha V.', team: 'A', score: 2480 },
      { id: 'player-2', name: 'Dara M.', team: 'B', score: 2310 },
      { id: 'player-3', name: 'Lina C.', team: 'A', score: 2190 }
    ],
    answers: [
      { id: 'answer-1', questionId: 'question-1-1-1', correct: true },
      { id: 'answer-2', questionId: 'question-1-1-2', correct: false },
      { id: 'answer-3', questionId: 'question-2-2-3', correct: true }
    ],
    mistakes: [
      { id: 'mistake-1', title: 'Force and Motion', detail: 'Confused acceleration with speed.' },
      { id: 'mistake-2', title: 'Earth Science', detail: 'Need to review the water cycle.' }
    ],
    flashcards: buildFlashcards(),
    notifications: [
      { id: 'note-1', title: 'New quiz published', text: 'Physics Warm-Up is ready for class.', time: '2 min ago' },
      { id: 'note-2', title: 'Student challenge', text: 'Team A is leading by 170 points.', time: '12 min ago' }
    ],
    leaderboard: [
      { name: 'Sokha V.', team: 'A', points: 2480 },
      { name: 'Dara M.', team: 'B', points: 2310 },
      { name: 'Lina C.', team: 'A', points: 2190 },
      { name: 'Vicheka P.', team: 'B', points: 1940 }
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
    teamScores: { 'Team A': 8420, 'Team B': 7980 },
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

  if (!existing) {
    store.set('reanrush_store', payload);
  }

  window.ReanRushData = payload;
})();
