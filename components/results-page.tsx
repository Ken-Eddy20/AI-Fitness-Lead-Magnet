"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dumbbell, Salad, Clock, Heart, Download, CheckCircle } from "lucide-react"
import { generatePDF } from "@/app/actions/generate-pdf"
import { type FormData, generateWorkoutPlan, generateNutritionPlan, generateLifestyleTips } from "@/lib/plan-generator"

export default function ResultsPage({ formData }: { formData: FormData }) {
  const [activeTab, setActiveTab] = useState("fitness")
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true)
      // Calculate BMI for PDF generation
      const weightInKg =
        formData.weightUnit === "kg" ? Number.parseFloat(formData.weight) : Number.parseFloat(formData.weight) * 0.453592
      const heightInM =
        formData.heightUnit === "cm"
          ? Number.parseFloat(formData.height) / 100
          : Number.parseFloat(formData.height) * 0.0254
      const bmi = heightInM > 0 ? weightInKg / (heightInM * heightInM) : 0

      // Call server action to generate PDF
      const base64PDF = await generatePDF(formData, bmi)
      
      // Decode base64 and create blob
      const byteCharacters = atob(base64PDF)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: "application/pdf" })
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `fitness-plan-${Date.now()}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }

  // Calculate BMI
  const weightInKg =
    formData.weightUnit === "kg" ? Number.parseFloat(formData.weight) : Number.parseFloat(formData.weight) * 0.453592

  const heightInM =
    formData.heightUnit === "cm"
      ? Number.parseFloat(formData.height) / 100
      : Number.parseFloat(formData.height) * 0.0254

  const bmi = heightInM > 0 ? (weightInKg / (heightInM * heightInM)).toFixed(1) : "N/A"

  // Calculate daily calories based on goal and workout frequency
  const calculateCalories = () => {
    // Base calculation using Harris-Benedict formula
    const age = Number.parseInt(formData.age)
    let bmr = 0

    if (formData.gender === "Male") {
      bmr = 10 * weightInKg + 6.25 * (heightInM * 100) - 5 * age + 5
    } else {
      bmr = 10 * weightInKg + 6.25 * (heightInM * 100) - 5 * age - 161
    }

    // Activity multiplier based on workout frequency
    const workoutDaysNum = Number.parseInt(formData.workoutDays)
    let activityMultiplier = 1.375 // Default for 4-5 days/week in gym
    if (workoutDaysNum <= 2) {
      activityMultiplier = 1.3
    } else if (workoutDaysNum === 3) {
      activityMultiplier = 1.4
    } else if (workoutDaysNum >= 6) {
      activityMultiplier = 1.6
    }

    const tdee = Math.round(bmr * activityMultiplier)

    // Adjust based on goal
    if (formData.goal === "Lose weight") {
      return Math.round(tdee * 0.8) // 20% deficit
    } else if (formData.goal === "Build muscle") {
      return Math.round(tdee * 1.1) // 10% surplus
    } else {
      return tdee // Maintenance
    }
  }

  const dailyCalories = calculateCalories()

  // Calculate macros
  const calculateMacros = () => {
    let protein = 0,
      carbs = 0,
      fats = 0

    if (formData.goal === "Lose weight") {
      protein = Math.round((dailyCalories * 0.4) / 4) // 40% protein
      carbs = Math.round((dailyCalories * 0.3) / 4) // 30% carbs
      fats = Math.round((dailyCalories * 0.3) / 9) // 30% fats
    } else if (formData.goal === "Build muscle") {
      protein = Math.round((dailyCalories * 0.3) / 4) // 30% protein
      carbs = Math.round((dailyCalories * 0.5) / 4) // 50% carbs
      fats = Math.round((dailyCalories * 0.2) / 9) // 20% fats
    } else {
      protein = Math.round((dailyCalories * 0.25) / 4) // 25% protein
      carbs = Math.round((dailyCalories * 0.5) / 4) // 50% carbs
      fats = Math.round((dailyCalories * 0.25) / 9) // 25% fats
    }

    return { protein, carbs, fats }
  }

  const macros = calculateMacros()

  // Generate workout plan based on preferences and days
  const generateWorkoutPlan = () => {
    const days = Number.parseInt(formData.workoutDays)
    const preferences = formData.workoutPreference

    let workoutPlan = []

    if (formData.goal === "Lose weight") {
      if (days <= 3) {
        workoutPlan = [
          {
            day: "Day 1",
            focus: "Full Body + HIIT",
            exercises: ["Squats", "Push-ups", "Rows", "HIIT Intervals (15 min)"],
          },
          {
            day: "Day 2",
            focus: "Cardio + Core",
            exercises: ["Steady State Cardio (30 min)", "Plank Variations", "Russian Twists", "Mountain Climbers"],
          },
          {
            day: "Day 3",
            focus: "Full Body Circuit",
            exercises: ["Lunges", "Dumbbell Press", "Deadlifts", "Burpees", "Jump Rope"],
          },
        ]
      } else {
        workoutPlan = [
          {
            day: "Day 1",
            focus: "Lower Body + HIIT",
            exercises: ["Squats", "Lunges", "Leg Press", "HIIT Intervals (15 min)"],
          },
          {
            day: "Day 2",
            focus: "Upper Body + Core",
            exercises: ["Push-ups", "Rows", "Shoulder Press", "Plank Variations"],
          },
          {
            day: "Day 3",
            focus: "Cardio",
            exercises: ["Steady State Cardio (45 min)", "Stair Climber", "Rowing Machine"],
          },
          {
            day: "Day 4",
            focus: "Full Body Circuit",
            exercises: ["Burpees", "Kettlebell Swings", "Mountain Climbers", "Jump Rope"],
          },
          {
            day: "Day 5",
            focus: "Active Recovery",
            exercises: ["Light Walking (30 min)", "Stretching", "Foam Rolling"],
          },
        ]
      }
    } else if (formData.goal === "Build muscle") {
      if (hasGymAccess) {
        if (days <= 3) {
          workoutPlan = [
            {
              day: "Day 1",
              focus: "Full Body",
              exercises: ["Barbell Squats", "Bench Press", "Bent Over Rows", "Shoulder Press", "Bicep Curls"],
            },
            {
              day: "Day 2",
              focus: "Full Body",
              exercises: ["Deadlifts", "Incline Press", "Pull-ups", "Lateral Raises", "Tricep Extensions"],
            },
            {
              day: "Day 3",
              focus: "Full Body",
              exercises: ["Leg Press", "Dips", "Lat Pulldowns", "Face Pulls", "Leg Curls"],
            },
          ]
        } else {
          workoutPlan = [
            {
              day: "Day 1",
              focus: "Chest & Triceps",
              exercises: ["Bench Press", "Incline Dumbbell Press", "Chest Flyes", "Tricep Pushdowns", "Skull Crushers"],
            },
            {
              day: "Day 2",
              focus: "Back & Biceps",
              exercises: ["Deadlifts", "Pull-ups", "Bent Over Rows", "Bicep Curls", "Hammer Curls"],
            },
            {
              day: "Day 3",
              focus: "Legs",
              exercises: ["Squats", "Leg Press", "Romanian Deadlifts", "Leg Extensions", "Calf Raises"],
            },
            {
              day: "Day 4",
              focus: "Shoulders & Arms",
              exercises: ["Shoulder Press", "Lateral Raises", "Face Pulls", "Tricep Extensions", "Bicep Curls"],
            },
            {
              day: "Day 5",
              focus: "Full Body",
              exercises: ["Deadlifts", "Bench Press", "Pull-ups", "Shoulder Press", "Lunges"],
            },
          ]
        }
      } else {
        workoutPlan = [
          {
            day: "Day 1",
            focus: "Push (Bodyweight)",
            exercises: ["Push-ups (4 sets)", "Pike Push-ups", "Tricep Dips", "Decline Push-ups"],
          },
          {
            day: "Day 2",
            focus: "Pull (Bodyweight)",
            exercises: [
              "Pull-ups/Rows with household items",
              "Superman Holds",
              "Bicep Curls with makeshift weights",
              "Doorway Rows",
            ],
          },
          {
            day: "Day 3",
            focus: "Legs (Bodyweight)",
            exercises: ["Bodyweight Squats (4 sets)", "Lunges", "Glute Bridges", "Calf Raises", "Wall Sits"],
          },
        ]
      }
    } else if (formData.goal === "Get toned") {
      workoutPlan = [
        {
          day: "Day 1",
          focus: "Full Body Toning",
          exercises: ["Circuit: Squats, Push-ups, Rows, Lunges (3 rounds)", "Core Circuit", "Light Cardio (15 min)"],
        },
        {
          day: "Day 2",
          focus: "HIIT & Core",
          exercises: ["HIIT Intervals (20 min)", "Plank Variations", "Russian Twists", "Bicycle Crunches"],
        },
        {
          day: "Day 3",
          focus: "Upper Body Focus",
          exercises: ["Push-ups", "Dumbbell Rows", "Shoulder Press", "Tricep Dips", "Bicep Curls"],
        },
        {
          day: "Day 4",
          focus: "Lower Body Focus",
          exercises: ["Squats", "Lunges", "Glute Bridges", "Calf Raises", "Wall Sits"],
        },
      ]
    }

    // Adjust based on preferences
    if (preferences.includes("Yoga")) {
      workoutPlan.push({
        day: "Recovery Day",
        focus: "Yoga",
        exercises: ["30-minute Yoga Flow", "Stretching", "Meditation"],
      })
    }

    if (preferences.includes("HIIT") && !workoutPlan.some((w) => w.focus.includes("HIIT"))) {
      workoutPlan.push({
        day: "Extra Day",
        focus: "HIIT",
        exercises: ["HIIT Intervals (20 min)", "Burpees", "Mountain Climbers", "Jump Squats"],
      })
    }

    // Limit to the number of days they can work out
    return workoutPlan.slice(0, days)
  }

  const workoutPlan = generateWorkoutPlan()

  // Generate meal plan based on diet restrictions and calories
  const generateMealPlan = () => {
    const meals = Number.parseInt(formData.mealsPerDay)
    const dietType = formData.dietRestriction

    let mealPlan = []

    if (dietType === "Vegan") {
      mealPlan = [
        {
          meal: "Breakfast",
          food: "Tofu Scramble with Vegetables and Whole Grain Toast",
          calories: Math.round(dailyCalories * 0.25),
        },
        {
          meal: "Lunch",
          food: "Quinoa Bowl with Roasted Vegetables and Chickpeas",
          calories: Math.round(dailyCalories * 0.3),
        },
        {
          meal: "Dinner",
          food: "Lentil Pasta with Vegetable Marinara Sauce",
          calories: Math.round(dailyCalories * 0.3),
        },
        { meal: "Snack", food: "Apple with Almond Butter", calories: Math.round(dailyCalories * 0.15) },
      ]
    } else if (dietType === "Vegetarian") {
      mealPlan = [
        {
          meal: "Breakfast",
          food: "Greek Yogurt with Berries and Granola",
          calories: Math.round(dailyCalories * 0.25),
        },
        { meal: "Lunch", food: "Vegetable and Cheese Wrap with Side Salad", calories: Math.round(dailyCalories * 0.3) },
        {
          meal: "Dinner",
          food: "Vegetable Stir Fry with Tofu and Brown Rice",
          calories: Math.round(dailyCalories * 0.3),
        },
        { meal: "Snack", food: "Cottage Cheese with Fruit", calories: Math.round(dailyCalories * 0.15) },
      ]
    } else if (dietType === "Keto") {
      mealPlan = [
        { meal: "Breakfast", food: "Avocado and Bacon Omelette", calories: Math.round(dailyCalories * 0.3) },
        { meal: "Lunch", food: "Chicken Caesar Salad (no croutons)", calories: Math.round(dailyCalories * 0.3) },
        { meal: "Dinner", food: "Salmon with Asparagus and Butter Sauce", calories: Math.round(dailyCalories * 0.3) },
        { meal: "Snack", food: "Cheese and Nuts", calories: Math.round(dailyCalories * 0.1) },
      ]
    } else if (dietType === "Low-carb") {
      mealPlan = [
        {
          meal: "Breakfast",
          food: "Protein Smoothie with Berries and Almond Milk",
          calories: Math.round(dailyCalories * 0.25),
        },
        {
          meal: "Lunch",
          food: "Grilled Chicken Salad with Olive Oil Dressing",
          calories: Math.round(dailyCalories * 0.3),
        },
        { meal: "Dinner", food: "Beef Stir Fry with Vegetables (no rice)", calories: Math.round(dailyCalories * 0.3) },
        { meal: "Snack", food: "Hard-boiled Eggs and Vegetables", calories: Math.round(dailyCalories * 0.15) },
      ]
    } else {
      mealPlan = [
        {
          meal: "Breakfast",
          food: "Oatmeal with Protein Powder and Fruit",
          calories: Math.round(dailyCalories * 0.25),
        },
        {
          meal: "Lunch",
          food: "Turkey and Avocado Sandwich with Side Salad",
          calories: Math.round(dailyCalories * 0.3),
        },
        {
          meal: "Dinner",
          food: "Grilled Chicken with Sweet Potato and Vegetables",
          calories: Math.round(dailyCalories * 0.3),
        },
        { meal: "Snack", food: "Greek Yogurt with Honey and Nuts", calories: Math.round(dailyCalories * 0.15) },
      ]
    }

    // Adjust based on number of meals
    if (meals <= 3) {
      return mealPlan.slice(0, 3)
    } else if (meals >= 5) {
      mealPlan.push({ meal: "Extra Snack", food: "Protein Bar or Shake", calories: Math.round(dailyCalories * 0.1) })
    }

    return mealPlan
  }

  const mealPlan = generateMealPlan()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-card dark:bg-card rounded-2xl shadow-2xl p-6 md:p-10 border border-border"
    >
      <div className="mb-10 text-center">
        <Badge className="mb-4 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
          Your Blueprint Ready
        </Badge>
        <h1 className="text-3xl md:text-4xl font-black mb-3 text-foreground">Your Fitness Blueprint</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Customized training and nutrition plan designed to help you {formData.goal.toLowerCase()} and reach your target
          of {formData.targetWeight} {formData.weightUnit}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Dumbbell className="mr-2 h-5 w-5 text-accent" /> Fitness Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Current Weight:</span>
                <span className="font-medium">
                  {formData.weight} {formData.weightUnit}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Target Weight:</span>
                <span className="font-medium">
                  {formData.targetWeight} {formData.weightUnit}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">BMI:</span>
                <span className="font-medium">{bmi}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Activity Level:</span>
                <span className="font-medium">{formData.activityLevel.split(" ")[0]}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Salad className="mr-2 h-5 w-5 text-accent" /> Nutrition Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Daily Calories:</span>
                <span className="font-medium">{dailyCalories} kcal</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Protein:</span>
                <span className="font-medium">{macros.protein}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Carbs:</span>
                <span className="font-medium">{macros.carbs}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Fats:</span>
                <span className="font-medium">{macros.fats}g</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="mr-2 h-5 w-5 text-emerald-500" /> Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Goal:</span>
                <span className="font-medium">{formData.goal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Target Date:</span>
                <span className="font-medium">
                  {formData.goalDate
                    ? new Date(formData.goalDate).toLocaleDateString()
                    : formData.goalTimeframe || "Not specified"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Workout Days:</span>
                <span className="font-medium">{formData.workoutDays} days/week</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="fitness" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="fitness" className="flex items-center justify-center">
            <Dumbbell className="mr-2 h-4 w-4" /> Fitness Plan
          </TabsTrigger>
          <TabsTrigger value="nutrition" className="flex items-center justify-center">
            <Salad className="mr-2 h-4 w-4" /> Nutrition Plan
          </TabsTrigger>
          <TabsTrigger value="lifestyle" className="flex items-center justify-center">
            <Heart className="mr-2 h-4 w-4" /> Lifestyle Tips
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fitness" className="mt-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Your {formData.workoutDays}-Day Workout Split</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workoutPlan.map((workout, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        {workout.day}: {workout.focus}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {workout.exercises.map((exercise, i) => (
                          <li key={i} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                            <span>{exercise}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Workout Guidelines</h3>
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span>Warm up for 5-10 minutes before each workout</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span>For strength exercises: 3-4 sets of 8-12 reps</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span>Rest 60-90 seconds between sets</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span>Increase weight when you can complete all sets with good form</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span>Cool down and stretch for 5-10 minutes after each workout</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="nutrition" className="mt-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Daily Meal Plan</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mealPlan.map((meal, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{meal.meal}</CardTitle>
                      <CardDescription>{meal.calories} calories</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>{meal.food}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Nutrition Guidelines</h3>
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span>Aim for {dailyCalories} calories per day</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span>Protein target: {macros.protein}g daily (focus on lean sources)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span>Carbs target: {macros.carbs}g daily (prioritize complex carbs)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span>Fats target: {macros.fats}g daily (focus on healthy fats)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span>Drink at least 2-3 liters of water daily</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Meal Prep Tips</h3>
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span>Prep meals 2-3 times per week to save time</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span>Use a food scale to measure portions accurately</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span>Track your food intake with MyFitnessPal or similar app</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span>Allow yourself one "flexible" meal per week for sustainability</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="lifestyle" className="mt-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Sleep & Recovery</h3>
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span>Aim for 7-9 hours of quality sleep each night</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span>Establish a consistent sleep schedule</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span>Take 1-2 complete rest days per week</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span>Consider foam rolling and stretching on rest days</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Daily Movement</h3>
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span>Aim for 8,000-10,000 steps daily</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span>Take movement breaks every hour if you have a desk job</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span>Consider a standing desk or active sitting options</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span>Take the stairs instead of elevators when possible</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Stress Management</h3>
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span>Practice 5-10 minutes of meditation daily</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span>Incorporate deep breathing exercises throughout the day</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span>Spend time in nature when possible</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span>Consider journaling to process thoughts and track progress</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Progress Tracking</h3>
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span>Weigh yourself at the same time 1-2 times per week</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span>Take progress photos every 2-4 weeks</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span>Track workout performance (weights, reps, time)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span>Measure body circumferences monthly (waist, hips, chest, arms)</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>



      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-foreground">Get Your Plan</h2>
        <Button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="flex items-center bg-accent hover:bg-accent/90 text-accent-foreground font-bold shadow-lg hover:shadow-xl transition-all"
        >
          <Download className="mr-2 h-4 w-4" /> {isDownloading ? "Generating PDF..." : "Download PDF"}
        </Button>
      </div>



      <div className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
        <p>Your plan has been sent to {formData.email}</p>
        <p className="mt-1">© {new Date().getFullYear()} Elite Fitness Coaching. All rights reserved.</p>
      </div>
    </motion.div>
  )
}
