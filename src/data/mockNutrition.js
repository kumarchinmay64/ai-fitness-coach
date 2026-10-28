export const DEFAULT_NUTRITION_TARGETS = {
  calories: 2200,
  proteinGrams: 160,
  carbsGrams: 220,
  fatGrams: 65,
  waterLiters: 2.5,
  targetGlasses: 10,
};

// Clean unlogged meal slots ready to be filled by the user
export const INITIAL_MEAL_SLOTS = [
  {
    id: 'slot-breakfast',
    category: 'Breakfast',
    slotTime: '08:00 AM',
    name: 'Breakfast Slot',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    prepTime: '--',
    completed: false,
    isSlotOpen: true,
    imageNote: 'Slot available: Log whole eggs, oatmeal, fruit, or protein shake',
    instructions: 'Tap "Log Meal" to add your morning fuel.'
  },
  {
    id: 'slot-lunch',
    category: 'Lunch',
    slotTime: '01:00 PM',
    name: 'Lunch Slot',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    prepTime: '--',
    completed: false,
    isSlotOpen: true,
    imageNote: 'Slot available: Log lean poultry, grains, greens, and healthy fats',
    instructions: 'Tap "Log Meal" to record your midday meal.'
  },
  {
    id: 'slot-snack',
    category: 'Afternoon Fuel',
    slotTime: '04:30 PM',
    name: 'Afternoon Snack Slot',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    prepTime: '--',
    completed: false,
    isSlotOpen: true,
    imageNote: 'Slot available: Greek yogurt, raw almonds, protein bar, or fruit',
    instructions: 'Tap "Log Meal" to add pre-workout fuel.'
  },
  {
    id: 'slot-dinner',
    category: 'Dinner',
    slotTime: '08:00 PM',
    name: 'Dinner Slot',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    prepTime: '--',
    completed: false,
    isSlotOpen: true,
    imageNote: 'Slot available: Fish, lean beef, roasted vegetables, and complex carbs',
    instructions: 'Tap "Log Meal" to record your evening dinner.'
  }
];

// Sample template that users can optionally load
export const SAMPLE_MEAL_PLAN = [
  {
    id: 'sample-1',
    category: 'Breakfast',
    slotTime: '08:00 AM',
    name: 'Power Oats with Whey & Blueberries',
    calories: 480,
    protein: 38,
    carbs: 58,
    fat: 10,
    prepTime: '10 mins',
    completed: true,
    isSlotOpen: false,
    imageNote: 'Rolled oats, 1 scoop whey protein isolate, fresh blueberries, chia seeds',
    instructions: 'Cook oats with water or almond milk. Stir in whey off heat, top with fresh berries.'
  },
  {
    id: 'sample-2',
    category: 'Lunch',
    slotTime: '01:00 PM',
    name: 'Grilled Chicken & Quinoa Bowl',
    calories: 620,
    protein: 52,
    carbs: 55,
    fat: 16,
    prepTime: '20 mins',
    completed: true,
    isSlotOpen: false,
    imageNote: '180g grilled chicken breast, fluffy tricolor quinoa, steamed broccoli, olive oil drizzle',
    instructions: 'Season chicken breast with paprika and black pepper. Serve over cooked quinoa and broccoli.'
  },
  {
    id: 'sample-3',
    category: 'Afternoon Fuel',
    slotTime: '04:30 PM',
    name: 'Greek Yogurt & Raw Almonds',
    calories: 280,
    protein: 24,
    carbs: 18,
    fat: 12,
    prepTime: '3 mins',
    completed: true,
    isSlotOpen: false,
    imageNote: 'Non-fat strained Greek yogurt, 15g raw almonds, dash of cinnamon',
    instructions: 'Stir Greek yogurt with cinnamon and top with raw almonds.'
  },
  {
    id: 'sample-4',
    category: 'Dinner',
    slotTime: '08:00 PM',
    name: 'Pan-Seared Salmon & Roasted Sweet Potato',
    calories: 580,
    protein: 44,
    carbs: 45,
    fat: 22,
    prepTime: '25 mins',
    completed: false,
    isSlotOpen: false,
    imageNote: '170g wild salmon fillet, baked sweet potato wedges, sautéed spinach with garlic',
    instructions: 'Pan sear salmon for 4 minutes per side. Bake sweet potato wedges at 200°C until tender.'
  }
];

export const MOCK_NUTRITION_PROFILE = {
  dailyTargets: DEFAULT_NUTRITION_TARGETS,
  currentConsumed: {
    calories: 0,
    proteinGrams: 0,
    carbsGrams: 0,
    fatGrams: 0,
    waterGlasses: 0,
    targetGlasses: 10,
  },
  dietPreference: 'High Protein',
  activeDietOptions: ['High Protein', 'Balanced', 'Keto', 'Plant-Based / Vegan', 'Paleo'],
  meals: INITIAL_MEAL_SLOTS,
};
