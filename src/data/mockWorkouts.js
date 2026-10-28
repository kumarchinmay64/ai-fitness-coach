export const MOCK_EXERCISES = [
  {
    id: 'ex-1',
    name: 'Barbell Deep Squats',
    category: 'Legs',
    difficulty: 'Intermediate',
    targetMuscles: ['Quadriceps', 'Glutes', 'Core', 'Hamstrings'],
    defaultSets: 4,
    defaultReps: 10,
    restSeconds: 90,
    equipment: 'Barbell / Bodyweight',
    caloriesPerRep: 0.8,
    formCues: [
      'Keep feet shoulder-width apart, toes flared slightly outwards (15-30°)',
      'Break at the hips and knees simultaneously; aim for hip crease below knee cap',
      'Maintain an upright chest and neutral spine throughout the descent',
      'Drive through mid-foot and squeeze glutes at the lockout'
    ],
    commonMistakes: [
      'Knees caving inwards (valgus collapse)',
      'Excessive forward torso lean / rounding lumbar spine',
      'Heels lifting off the ground'
    ],
    idealAngles: {
      hipDepthDeg: 100, // standard parallel depth target in 2D camera view
      backAngleMinDeg: 45
    }
  },
  {
    id: 'ex-2',
    name: 'Chest Push-Ups',
    category: 'Chest',
    difficulty: 'Beginner',
    targetMuscles: ['Pectoralis Major', 'Triceps', 'Anterior Deltoid', 'Core'],
    defaultSets: 3,
    defaultReps: 15,
    restSeconds: 60,
    equipment: 'Bodyweight',
    caloriesPerRep: 0.5,
    formCues: [
      'Place hands slightly wider than shoulder-width, fingers spread',
      'Keep rigid plank position with glutes and core braced',
      'Lower until chest is 2 inches above the floor (elbows at 45-60° angle)',
      'Push the ground away without shrugging shoulders toward ears'
    ],
    commonMistakes: [
      'Sagging hips or hyperextended lumbar spine',
      'Flaring elbows out at 90 degrees',
      'Head dropping down before chest descends'
    ],
    idealAngles: {
      elbowDepthDeg: 90,
      spineAlignment: 'Straight'
    }
  },
  {
    id: 'ex-3',
    name: 'Romanian Deadlifts',
    category: 'Back & Hamstrings',
    difficulty: 'Intermediate',
    targetMuscles: ['Hamstrings', 'Gluteus Maximus', 'Erector Spinae', 'Lats'],
    defaultSets: 4,
    defaultReps: 8,
    restSeconds: 120,
    equipment: 'Dumbbells / Barbell',
    caloriesPerRep: 1.1,
    formCues: [
      'Hinge backward at hips with slight soft bend in the knees',
      'Keep weights close to shins and engage lats to keep back locked flat',
      'Lower until feeling deep hamstring stretch around mid-shin level',
      'Drive hips forward to return to standing lockout'
    ],
    commonMistakes: [
      'Rounding upper or lower back',
      'Squatting the weight rather than hinging hips backwards',
      'Over-extending spine at top lockout'
    ],
    idealAngles: {
      hipHingeDeg: 70
    }
  },
  {
    id: 'ex-4',
    name: 'Dumbbell Bicep Curls',
    category: 'Arms',
    difficulty: 'Beginner',
    targetMuscles: ['Biceps Brachii', 'Brachialis', 'Forearms'],
    defaultSets: 3,
    defaultReps: 12,
    restSeconds: 45,
    equipment: 'Dumbbells',
    caloriesPerRep: 0.4,
    formCues: [
      'Stand upright with shoulders pinned back and down',
      'Pin elbows firmly at sides without swinging momentum',
      'Curl dumbbells toward anterior delts with full squeeze at peak contraction',
      'Lower under controlled 3-second eccentric tempo'
    ],
    commonMistakes: [
      'Swinging torso to launch weights',
      'Elbows drifting forward during the curl',
      'Dropping weights too fast without eccentric tension'
    ],
    idealAngles: {
      curlFlexionDeg: 45
    }
  },
  {
    id: 'ex-5',
    name: 'Forward Walking Lunges',
    category: 'Legs',
    difficulty: 'Intermediate',
    targetMuscles: ['Quadriceps', 'Glutes', 'Calves', 'Core Balance'],
    defaultSets: 3,
    defaultReps: 12,
    restSeconds: 60,
    equipment: 'Bodyweight / Dumbbells',
    caloriesPerRep: 0.7,
    formCues: [
      'Take a large controlled stride forward',
      'Lower back knee until hovering 1 inch from ground (90° on both knees)',
      'Keep front knee tracked directly over second toe',
      'Press through front heel to step through cleanly'
    ],
    commonMistakes: [
      'Front knee drifting excessively past toes',
      'Torso collapsing forward onto front thigh',
      'Narrow stance causing balance loss'
    ],
    idealAngles: {
      frontKneeDeg: 90,
      backKneeDeg: 90
    }
  },
  {
    id: 'ex-6',
    name: 'Isometric Core Plank',
    category: 'Core',
    difficulty: 'Beginner',
    targetMuscles: ['Rectus Abdominis', 'Transverse Abdominis', 'Shoulders'],
    defaultSets: 3,
    defaultReps: 45, // seconds
    restSeconds: 45,
    equipment: 'Bodyweight',
    caloriesPerRep: 0.2, // per sec
    formCues: [
      'Elbows directly under shoulders, forearms parallel',
      'Create straight line from crown of head through heels',
      'Tuck pelvis slightly (posterior tilt) and squeeze quads and glutes',
      'Breathe steadily into diaphragm without holding breath'
    ],
    commonMistakes: [
      'Hips sagging down or piking high toward ceiling',
      'Arching neck to look up at the screen',
      'Holding breath'
    ],
    idealAngles: {
      bodyLineDeg: 180
    }
  }
];

export const MOCK_WEEKLY_SCHEDULE = [
  {
    day: 'Monday',
    title: 'Lower Body Power & Squat Mastery',
    duration: '45 mins',
    intensity: 'High',
    focus: 'Legs & Core',
    completed: false,
    exercises: [
      { exerciseId: 'ex-1', sets: 4, reps: 10, completedSets: 0, note: 'Focus on hitting parallel depth and keeping chest tall' },
      { exerciseId: 'ex-5', sets: 3, reps: 12, completedSets: 0, note: 'Watch balance during descent, drive through mid-foot' },
      { exerciseId: 'ex-6', sets: 3, reps: 45, completedSets: 0, note: 'Brace core with posterior pelvic tilt' },
    ]
  },
  {
    day: 'Tuesday',
    title: 'Upper Body Hypertrophy & Posture',
    duration: '50 mins',
    intensity: 'Medium',
    focus: 'Chest, Arms & Back',
    completed: false,
    exercises: [
      { exerciseId: 'ex-2', sets: 3, reps: 15, completedSets: 0, note: 'Maintain full depth 90° elbow bend, no hip sag' },
      { exerciseId: 'ex-4', sets: 3, reps: 12, completedSets: 0, note: 'Strict tempo, 3s eccentric with zero torso swing' },
      { exerciseId: 'ex-6', sets: 3, reps: 45, completedSets: 0, note: 'Maintain full tension throughout' },
    ]
  },
  {
    day: 'Wednesday',
    title: 'Active Recovery & Mobility Flow',
    duration: '30 mins',
    intensity: 'Low',
    focus: 'Joint Mobility & Stretching',
    completed: false,
    isRest: true,
    exercises: []
  },
  {
    day: 'Thursday',
    title: 'Posterior Chain & Core Stability',
    duration: '45 mins',
    intensity: 'High',
    focus: 'Hamstrings & Back',
    completed: false,
    isToday: true,
    exercises: [
      { exerciseId: 'ex-3', sets: 4, reps: 8, completedSets: 0, note: 'Primary focus: neutral spine and hip hinge' },
      { exerciseId: 'ex-1', sets: 3, reps: 10, completedSets: 0, note: 'Moderate load, focus on depth cues' },
      { exerciseId: 'ex-6', sets: 4, reps: 45, completedSets: 0, note: 'Hold solid tension throughout' },
    ]
  },
  {
    day: 'Friday',
    title: 'Full Body Athletic Conditioning',
    duration: '40 mins',
    intensity: 'High',
    focus: 'Total Body',
    completed: false,
    exercises: [
      { exerciseId: 'ex-2', sets: 4, reps: 12, completedSets: 0, note: 'Fast concentric, slow eccentric' },
      { exerciseId: 'ex-5', sets: 3, reps: 12, completedSets: 0, note: 'Keep chest upright' },
      { exerciseId: 'ex-4', sets: 3, reps: 10, completedSets: 0, note: 'Peak contraction 1s pause' },
    ]
  },
  {
    day: 'Saturday',
    title: 'Functional Endurance & Core Circuit',
    duration: '35 mins',
    intensity: 'Medium',
    focus: 'Cardio & Abs',
    completed: false,
    exercises: [
      { exerciseId: 'ex-1', sets: 3, reps: 15, completedSets: 0, note: 'Bodyweight rapid reps' },
      { exerciseId: 'ex-2', sets: 3, reps: 15, completedSets: 0, note: 'Chest floor taps' },
      { exerciseId: 'ex-6', sets: 3, reps: 60, completedSets: 0, note: 'Extended endurance plank' },
    ]
  },
  {
    day: 'Sunday',
    title: 'Rest & Strategic Nutrition Reload',
    duration: '0 mins',
    intensity: 'Rest',
    focus: 'Recovery & Protein Intake',
    completed: false,
    isRest: true,
    exercises: []
  }
];
