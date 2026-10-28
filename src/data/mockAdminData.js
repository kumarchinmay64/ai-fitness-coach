export const MOCK_ADMIN_USERS = [
  {
    id: 'usr-101',
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    role: 'user',
    status: 'Active',
    joinedDate: '2025-01-15',
    workoutsCompleted: 3,
    avgAccuracy: 92.5,
    goal: 'Muscle Hypertrophy',
    tier: 'Athlete Free'
  },
  {
    id: 'usr-102',
    name: 'Sarah Chen',
    email: 'sarah.c@fitmail.com',
    role: 'user',
    status: 'Active',
    joinedDate: '2025-02-01',
    workoutsCompleted: 5,
    avgAccuracy: 94.0,
    goal: 'Endurance & Mobility',
    tier: 'Athlete Free'
  },
  {
    id: 'usr-103',
    name: 'Marcus Vance',
    email: 'marcus.v@fitness.io',
    role: 'user',
    status: 'Pending',
    joinedDate: '2025-02-20',
    workoutsCompleted: 0,
    avgAccuracy: null,
    goal: 'Fat Loss',
    tier: 'Athlete Free'
  }
];

export const MOCK_ADMIN_ANALYTICS = {
  activeAthletes: 3,
  platformVersion: 'v1.2.0-preview',
  databaseEngine: 'Client-Side Storage (LocalStorage / IndexedDB)',
  hardwareDiagnostics: [
    { component: 'Webcam Stream Engine', status: 'Operational', detail: 'HTML5 MediaDevices / getUserMedia API' },
    { component: 'Joint Skeleton Renderer', status: 'Operational', detail: 'HTML5 60 FPS Canvas Vector Pipeline' },
    { component: 'Voice & Sound Cues', status: 'Operational', detail: 'Web Audio API Synthesis Engine' },
    { component: 'Data Persistence Layer', status: 'Operational', detail: 'Local browser storage with REST endpoint proxy' }
  ],
  movementCatalogStats: [
    { category: 'Legs', exerciseCount: 2, keyMovements: 'Barbell Deep Squat, Walking Lunges' },
    { category: 'Chest & Arms', exerciseCount: 2, keyMovements: 'Push-Ups, Dumbbell Bicep Curls' },
    { category: 'Back & Core', exerciseCount: 2, keyMovements: 'Romanian Deadlifts, Isometric Plank' }
  ]
};

export const MOCK_ACTIVITY_LOGS = [
  {
    id: 'act-1',
    type: 'SESSION_INITIALIZED',
    title: 'Trainer Console Accessed',
    detail: 'Administrative dashboard initialized in browser session',
    time: 'Just now',
    severity: 'info'
  },
  {
    id: 'act-2',
    type: 'CONTENT_UPDATE',
    title: 'Movement Thresholds Calibrated',
    detail: 'Squat depth angle threshold confirmed at 85° flexion',
    time: '12 mins ago',
    severity: 'success'
  },
  {
    id: 'act-3',
    type: 'USER_REGISTERED',
    title: 'New Athlete Profile Slot Initialized',
    detail: 'Target goal set to Muscle Hypertrophy & Posture',
    time: '1 hour ago',
    severity: 'info'
  }
];
