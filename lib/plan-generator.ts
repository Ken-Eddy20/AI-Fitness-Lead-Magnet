export type FormData = {
  weight: string
  weightUnit: "kg" | "lbs"
  height: string
  heightUnit: "cm" | "ft-in"
  age: string
  gender: "Male" | "Female" | "Other"
  goal: "Lose weight" | "Build muscle" | "Maintain" | "Get toned" | "Improve health"
  targetWeight: string
  workoutPreference: string[]
  workoutDays: string
  dietRestriction: string
  dietaryFocus: string
  email: string
}

export interface WorkoutPlan {
  title: string
  description: string
  weekly: {
    day: string
    focus: string
    exercises: string[]
    duration: string
  }[]
}

export interface NutritionPlan {
  dailyCalories: number
  protein: number
  carbs: number
  fats: number
  mealPlan: {
    meal: string
    examples: string[]
  }[]
}

export interface LifestyleTips {
  sleep: string
  hydration: string
  recovery: string
  motivation: string
}

export function generateWorkoutPlan(formData: FormData): WorkoutPlan {
  const goal = formData.goal
  const workoutDays = parseInt(formData.workoutDays)
  const hasStrength = formData.workoutPreference.includes("Strength")
  const hasCardio = formData.workoutPreference.includes("Cardio")
  const hasHIIT = formData.workoutPreference.includes("HIIT")

  let plans: { [key: number]: WorkoutPlan } = {
    3: {
      title: "3-Day Full Body Strength Focus",
      description: "Perfect for muscle building with compound movements",
      weekly: [
        {
          day: "Monday",
          focus: "Upper Body Push",
          exercises: [
            "Bench Press (4x6-8)",
            "Overhead Press (3x8-10)",
            "Incline Dumbbell Press (3x10-12)",
            "Tricep Dips (3x8-10)",
            "Overhead Rope Extension (3x12-15)",
          ],
          duration: "60 minutes",
        },
        {
          day: "Wednesday",
          focus: "Lower Body & Core",
          exercises: [
            "Squats (4x6-8)",
            "Romanian Deadlift (3x8-10)",
            "Leg Press (3x10-12)",
            "Leg Curls (3x10-12)",
            "Weighted Ab Exercises (3x12-15)",
          ],
          duration: "60 minutes",
        },
        {
          day: "Friday",
          focus: "Upper Body Pull",
          exercises: [
            "Deadlifts (4x5-6)",
            "Barbell Rows (4x6-8)",
            "Pull-ups or Lat Pulldowns (3x8-10)",
            "Barbell Curls (3x8-10)",
            "Face Pulls (3x12-15)",
          ],
          duration: "60 minutes",
        },
        { day: "Tue, Thu, Sat, Sun", focus: "Rest or Light Cardio", exercises: ["20-30 min light activity"], duration: "20-30 min" },
      ],
    },
    4: {
      title: "4-Day Upper/Lower Split",
      description: "Maximize strength and size gains with strategic splits",
      weekly: [
        {
          day: "Monday",
          focus: "Upper Body Strength",
          exercises: [
            "Barbell Bench Press (4x5)",
            "Barbell Rows (4x5)",
            "Incline Dumbbell Press (3x8-10)",
            "Pull-ups (3x8-10)",
            "Barbell Curls (3x8-10)",
          ],
          duration: "75 minutes",
        },
        {
          day: "Tuesday",
          focus: "Lower Body Strength",
          exercises: [
            "Squats (4x5)",
            "Romanian Deadlifts (4x6-8)",
            "Leg Press (3x10)",
            "Leg Curls (3x12)",
            "Weighted Ab Work (3x12-15)",
          ],
          duration: "75 minutes",
        },
        {
          day: "Thursday",
          focus: "Upper Body Hypertrophy",
          exercises: [
            "Dumbbell Press (4x8-10)",
            "Cable Rows (4x10-12)",
            "Machine Chest Fly (3x12-15)",
            "Lat Pulldowns (3x10-12)",
            "Machine Bicep Curls (3x12-15)",
          ],
          duration: "75 minutes",
        },
        {
          day: "Friday",
          focus: "Lower Body Hypertrophy",
          exercises: [
            "Leg Extensions (4x10-12)",
            "Leg Curls (4x10-12)",
            "Smith Machine Squats (3x12-15)",
            "Seated Calf Raises (3x15-20)",
            "Ab Circuit (3 rounds)",
          ],
          duration: "75 minutes",
        },
        { day: "Wed, Sat, Sun", focus: "Rest or Cardio", exercises: ["20-30 min activity"], duration: "20-30 min" },
      ],
    },
    5: {
      title: "5-Day Push/Pull/Legs",
      description: "High frequency training for maximum muscle development",
      weekly: [
        {
          day: "Monday",
          focus: "Chest & Triceps Push",
          exercises: [
            "Barbell Bench Press (4x6-8)",
            "Incline Dumbbell Press (3x8-10)",
            "Chest Flyes (3x10-12)",
            "Tricep Rope Pushdowns (3x12-15)",
            "Overhead Extensions (3x12-15)",
          ],
          duration: "60 minutes",
        },
        {
          day: "Tuesday",
          focus: "Back & Biceps Pull",
          exercises: [
            "Deadlifts (4x5-6)",
            "Barbell Rows (4x6-8)",
            "Pull-ups (3x8-10)",
            "Barbell Curls (3x8-10)",
            "Face Pulls (3x12-15)",
          ],
          duration: "60 minutes",
        },
        {
          day: "Wednesday",
          focus: "Legs & Core",
          exercises: [
            "Squats (4x6-8)",
            "Romanian Deadlifts (3x8-10)",
            "Leg Press (3x10-12)",
            "Leg Curls (3x12-15)",
            "Weighted Ab Work (3x12-15)",
          ],
          duration: "60 minutes",
        },
        {
          day: "Thursday",
          focus: "Shoulders & Back",
          exercises: [
            "Overhead Press (4x6-8)",
            "Lateral Raises (3x10-12)",
            "Reverse Flyes (3x12-15)",
            "Barbell Rows (3x8-10)",
            "Cable Rows (3x10-12)",
          ],
          duration: "60 minutes",
        },
        {
          day: "Friday",
          focus: "Full Body Finisher",
          exercises: [
            "Squats (3x8-10)",
            "Bench Press (3x8-10)",
            "Rows (3x8-10)",
            "Shoulder Work (2 exercises x 10-12)",
            "Core Circuit (3 rounds)",
          ],
          duration: "60 minutes",
        },
        { day: "Sat, Sun", focus: "Rest", exercises: ["Active recovery or rest"], duration: "Rest" },
      ],
    },
    6: {
      title: "6-Day Push/Pull/Legs/Upper",
      description: "Advanced high-frequency training for optimal gains",
      weekly: [
        {
          day: "Monday",
          focus: "Push A (Chest Emphasis)",
          exercises: [
            "Barbell Bench Press (4x5-6)",
            "Incline Dumbbell Press (3x8-10)",
            "Machine Chest Fly (3x10-12)",
            "Tricep Rope (3x12-15)",
            "Dips (3x8-10)",
          ],
          duration: "60 minutes",
        },
        {
          day: "Tuesday",
          focus: "Pull A (Back Emphasis)",
          exercises: [
            "Deadlifts (4x5-6)",
            "Barbell Rows (4x6-8)",
            "Pull-ups (3x8-10)",
            "Pendulum Rows (3x10-12)",
            "Face Pulls (3x12-15)",
          ],
          duration: "60 minutes",
        },
        {
          day: "Wednesday",
          focus: "Legs A",
          exercises: [
            "Squats (4x6-8)",
            "Leg Press (3x8-10)",
            "Leg Extensions (3x12-15)",
            "Leg Curls (3x12-15)",
            "Weighted Ab Circuit",
          ],
          duration: "60 minutes",
        },
        {
          day: "Thursday",
          focus: "Push B (Shoulder Emphasis)",
          exercises: [
            "Overhead Press (4x6-8)",
            "Incline Press (3x8-10)",
            "Lateral Raises (3x12-15)",
            "Overhead Tricep Extension (3x12-15)",
            "Machine Press (3x10-12)",
          ],
          duration: "60 minutes",
        },
        {
          day: "Friday",
          focus: "Pull B (Bicep Emphasis)",
          exercises: [
            "Bent Rows (4x6-8)",
            "Pull-ups (3x8-10)",
            "Barbell Curls (3x8-10)",
            "Lat Pulldowns (3x10-12)",
            "Dumbbell Curls (3x10-12)",
          ],
          duration: "60 minutes",
        },
        {
          day: "Saturday",
          focus: "Legs B",
          exercises: [
            "Romanian Deadlifts (4x6-8)",
            "Leg Curls (4x8-10)",
            "Leg Extensions (3x12-15)",
            "Calf Raises (3x15-20)",
            "Core Work (3 exercises)",
          ],
          duration: "60 minutes",
        },
        { day: "Sunday", focus: "Rest & Recovery", exercises: ["Active recovery"], duration: "Rest" },
      ],
    },
  }

  if (goal === "Lose weight") {
    return {
      title: "4-Day Fat Loss Program",
      description: "Strength training + cardio for maximum fat loss",
      weekly: [
        {
          day: "Monday",
          focus: "Full Body Strength",
          exercises: [
            "Squats (3x8-10)",
            "Bench Press (3x8-10)",
            "Deadlifts (3x5-6)",
            "Rows (3x8-10)",
            "Core Work (3x12-15)",
          ],
          duration: "45 minutes",
        },
        {
          day: "Tuesday",
          focus: "HIIT Cardio",
          exercises: ["30 sec high intensity / 30 sec rest", "Repeat 20 rounds", "Total: 20 minutes"],
          duration: "25 minutes",
        },
        {
          day: "Thursday",
          focus: "Full Body Strength",
          exercises: [
            "Leg Press (3x10-12)",
            "Incline Dumbbell Press (3x10-12)",
            "Romanian Deadlifts (3x8-10)",
            "Pull-ups/Lat Pulldowns (3x10-12)",
            "Weighted Ab Work (3x12-15)",
          ],
          duration: "45 minutes",
        },
        {
          day: "Friday",
          focus: "Steady State Cardio",
          exercises: ["30-40 min moderate intensity walking, running, or cycling", "Target Zone: 60-70% max HR"],
          duration: "40 minutes",
        },
        { day: "Wed, Sat, Sun", focus: "Light Activity or Rest", exercises: ["20-30 min walking or yoga"], duration: "20-30 min" },
      ],
    }
  }

  return plans[workoutDays] || plans[4]
}

export function generateNutritionPlan(formData: FormData, bmi: number): NutritionPlan {
  // Calculate BMR
  const weightInKg =
    formData.weightUnit === "kg" ? parseFloat(formData.weight) : parseFloat(formData.weight) * 0.453592
  const heightInM =
    formData.heightUnit === "cm" ? parseFloat(formData.height) / 100 : parseFloat(formData.height) * 0.0254
  const age = parseInt(formData.age)

  let bmr = 0
  if (formData.gender === "Male") {
    bmr = 10 * weightInKg + 6.25 * (heightInM * 100) - 5 * age + 5
  } else {
    bmr = 10 * weightInKg + 6.25 * (heightInM * 100) - 5 * age - 161
  }

  // Activity multiplier (assuming gym member = moderately active)
  const activityMultiplier = 1.55
  let tdee = Math.round(bmr * activityMultiplier)

  // Adjust for goal
  let dailyCalories = tdee
  if (formData.goal === "Lose weight") {
    dailyCalories = Math.round(tdee * 0.85) // 15% deficit
  } else if (formData.goal === "Build muscle") {
    dailyCalories = Math.round(tdee * 1.1) // 10% surplus
  }

  // Calculate macros
  const protein = Math.round((weightInKg * 2.2) / 1) // 2.2g per kg
  const fats = Math.round((dailyCalories * 0.25) / 9)
  const carbs = Math.round((dailyCalories - protein * 4 - fats * 9) / 4)

  let mealPlan = [
    {
      meal: "Breakfast",
      examples: [] as string[],
    },
    {
      meal: "Mid-Morning Snack",
      examples: [] as string[],
    },
    {
      meal: "Lunch",
      examples: [] as string[],
    },
    {
      meal: "Pre-Workout",
      examples: [] as string[],
    },
    {
      meal: "Post-Workout",
      examples: [] as string[],
    },
    {
      meal: "Dinner",
      examples: [] as string[],
    },
  ]

  // Customize based on diet restriction
  if (formData.dietRestriction === "Vegan") {
    mealPlan = [
      {
        meal: "Breakfast",
        examples: [
          "Oatmeal with almond butter, banana, and berries",
          "Tofu scramble with vegetables and whole grain toast",
          "Protein smoothie with plant-based protein, almond milk",
        ],
      },
      {
        meal: "Mid-Morning Snack",
        examples: ["Hummus with veggie sticks", "Nuts and seeds mix", "Protein bar"],
      },
      {
        meal: "Lunch",
        examples: [
          "Tempeh stir-fry with brown rice and vegetables",
          "Lentil soup with whole grain bread",
          "Tofu and quinoa Buddha bowl",
        ],
      },
      {
        meal: "Pre-Workout",
        examples: ["Banana with almond butter", "Rice cakes with jam", "Dates and nuts"],
      },
      {
        meal: "Post-Workout",
        examples: [
          "Protein smoothie (plant-based protein + fruit)",
          "Tofu with sweet potato and vegetables",
          "Lentil pasta with marinara sauce",
        ],
      },
      {
        meal: "Dinner",
        examples: [
          "Chickpea curry with quinoa",
          "Lentil bolognese with whole wheat pasta",
          "Bean and vegetable tacos with whole grain tortillas",
        ],
      },
    ]
  } else if (formData.dietRestriction === "Vegetarian") {
    mealPlan = [
      {
        meal: "Breakfast",
        examples: [
          "Egg white omelet with spinach and whole wheat toast",
          "Greek yogurt with granola and berries",
          "Protein pancakes with almond butter",
        ],
      },
      {
        meal: "Mid-Morning Snack",
        examples: ["Protein shake", "Greek yogurt with almonds", "Cottage cheese with fruit"],
      },
      {
        meal: "Lunch",
        examples: [
          "Chickpea salad with quinoa",
          "Lentil curry with brown rice",
          "Paneer and vegetable stir-fry",
        ],
      },
      {
        meal: "Pre-Workout",
        examples: ["Banana with Greek yogurt", "Energy bar", "Rice cakes with honey"],
      },
      {
        meal: "Post-Workout",
        examples: [
          "Protein shake with fruit",
          "Cottage cheese with granola",
          "Lentil soup with bread",
        ],
      },
      {
        meal: "Dinner",
        examples: [
          "Grilled halloumi with roasted vegetables",
          "Baked tofu with sweet potato",
          "Lentil and vegetable stew",
        ],
      },
    ]
  } else if (formData.dietRestriction === "Keto") {
    mealPlan = [
      {
        meal: "Breakfast",
        examples: [
          "Bacon and eggs with avocado",
          "Keto smoothie (heavy cream, MCT oil, berries)",
          "Cheese and ham omelette",
        ],
      },
      {
        meal: "Mid-Morning Snack",
        examples: ["Macadamia nuts", "Cheese cubes", "Almond butter"],
      },
      {
        meal: "Lunch",
        examples: [
          "Grilled chicken thighs with cauliflower rice",
          "Salmon with asparagus and butter",
          "Beef with broccoli and olive oil",
        ],
      },
      {
        meal: "Pre-Workout",
        examples: ["Bulletproof coffee", "Almond butter with celery", "MCT oil shot"],
      },
      {
        meal: "Post-Workout",
        examples: [
          "Protein shake with heavy cream",
          "Chicken with avocado",
          "Salmon with olive oil",
        ],
      },
      {
        meal: "Dinner",
        examples: [
          "Ribeye steak with garlic butter",
          "Grilled lamb chops with zucchini noodles",
          "Baked salmon with creamed spinach",
        ],
      },
    ]
  } else {
    // Standard balanced diet
    mealPlan = [
      {
        meal: "Breakfast",
        examples: [
          "Eggs with oatmeal and berries",
          "Protein pancakes with almond butter",
          "Greek yogurt with granola and honey",
        ],
      },
      {
        meal: "Mid-Morning Snack",
        examples: ["Protein shake", "Apple with almond butter", "Almonds and dried fruit"],
      },
      {
        meal: "Lunch",
        examples: [
          "Grilled chicken with brown rice and broccoli",
          "Turkey sandwich on whole wheat with vegetables",
          "Salmon with sweet potato and green beans",
        ],
      },
      {
        meal: "Pre-Workout",
        examples: [
          "Banana with honey",
          "Rice cakes with jam",
          "Energy bar with coffee",
        ],
      },
      {
        meal: "Post-Workout",
        examples: [
          "Protein shake with fruit",
          "Chicken with white rice",
          "Salmon with rice and vegetables",
        ],
      },
      {
        meal: "Dinner",
        examples: [
          "Lean beef with sweet potato and vegetables",
          "Grilled tilapia with quinoa and asparagus",
          "Turkey meatballs with whole wheat pasta",
        ],
      },
    ]
  }

  return {
    dailyCalories,
    protein,
    carbs,
    fats,
    mealPlan,
  }
}

export function generateLifestyleTips(formData: FormData): LifestyleTips {
  const goal = formData.goal
  const workoutDays = parseInt(formData.workoutDays)

  return {
    sleep: `Aim for 7-9 hours of quality sleep per night. Since you're training ${workoutDays} days a week, proper sleep is crucial for muscle recovery and hormonal balance. Try to maintain a consistent sleep schedule and avoid screens 1 hour before bed.`,
    hydration: `Drink at least 3-4 liters of water daily, more on training days. Add an electrolyte drink during intense sessions. Proper hydration improves performance, recovery, and muscle fullness.`,
    recovery: `Include foam rolling and stretching on rest days. Consider 1-2 sessions of light yoga or mobility work weekly. This reduces muscle soreness and prevents injuries while improving your workout quality.`,
    motivation: `${
      goal === "Lose weight"
        ? "Track your progress through measurements and how clothes fit, not just scale weight. Focus on performance improvements in the gym - this indicates real body composition changes."
        : goal === "Build muscle"
          ? "Take progress photos every 4 weeks. Track your lifts and aim to increase weight or reps regularly. Celebrate strength gains and muscle size improvements."
          : "Monitor energy levels and how you feel in daily life. Consistency beats perfection - focus on showing up and enjoying the process."
    } Join our community for accountability and support!`,
  }
}
