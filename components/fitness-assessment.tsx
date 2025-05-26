"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import ResultsPage from "./results-page"

const formSchema = z.object({
  weight: z.string().min(1, "Weight is required"),
  weightUnit: z.enum(["kg", "lbs"]),
  height: z.string().min(1, "Height is required"),
  heightUnit: z.enum(["cm", "ft-in"]),
  age: z.string().min(1, "Age is required"),
  gender: z.enum(["Male", "Female", "Other"]),
  goal: z.enum(["Lose weight", "Build muscle", "Maintain", "Get toned", "Improve health"]),
  targetWeight: z.string().min(1, "Target weight is required"),
  goalDate: z.date().optional(),
  goalTimeframe: z.string().optional(),
  workoutPreference: z.array(z.string()).min(1, "Select at least one workout type"),
  workoutDays: z.string().min(1, "Please select number of days"),
  gymAccess: z.enum(["Yes", "No", "Limited Equipment"]),
  activityLevel: z.enum([
    "Sedentary (mostly sitting)",
    "Lightly active (some movement)",
    "Moderately active (walk/workout a few times/week)",
    "Very active (daily exercise/manual labor)",
  ]),
  dietRestriction: z.string().min(1, "Please select a diet option"),
  otherDietDetails: z.string().optional(),
  mealsPerDay: z.string().min(1, "Please select number of meals"),
  biggestStruggle: z.string().min(1, "Please share your biggest struggle"),
  email: z.string().email("Please enter a valid email"),
  wantCoaching: z.boolean().default(false),
})

type FormData = z.infer<typeof formSchema>

const questions = [
  "weight",
  "height",
  "age",
  "gender",
  "goal",
  "targetWeight",
  "goalDate",
  "workoutPreference",
  "workoutDays",
  "gymAccess",
  "activityLevel",
  "dietRestriction",
  "mealsPerDay",
  "biggestStruggle",
  "email",
  "wantCoaching",
]

export default function FitnessAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState<FormData | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weightUnit: "kg",
      heightUnit: "cm",
      workoutPreference: [],
      wantCoaching: false,
    },
  })

  const watchAllFields = watch()

  const handleNext = async () => {
    const currentField = questions[currentQuestion]
    const isValid = await trigger(currentField as any)

    if (isValid) {
      setCurrentQuestion((prev) => Math.min(prev + 1, questions.length - 1))
    }
  }

  const handlePrevious = () => {
    setCurrentQuestion((prev) => Math.max(prev - 1, 0))
  }

  const onSubmit = (data: FormData) => {
    setFormData(data)
    setIsSubmitted(true)
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  if (isSubmitted && formData) {
    return <ResultsPage formData={formData} />
  }

  return (
    <div className="bg-white dark:bg-zinc-950 rounded-xl shadow-xl p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">Elite Fitness Assessment</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-center">
          Get your personalized fitness plan in just a few minutes
        </p>
        <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full mt-6">
          <div
            className="bg-emerald-500 h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-xs text-right mt-1 text-zinc-500 dark:text-zinc-400">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-[300px] flex flex-col"
          >
            {/* Weight Question */}
            {currentQuestion === 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">What's your current weight?</h2>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input type="number" placeholder="Enter your weight" {...register("weight")} className="text-lg" />
                    {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>}
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="kg"
                        value="kg"
                        {...register("weightUnit")}
                        className="hidden"
                        defaultChecked
                      />
                      <Label
                        htmlFor="kg"
                        className={`px-3 py-1 rounded-md cursor-pointer ${
                          watchAllFields.weightUnit === "kg"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                            : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        }`}
                        onClick={() => setValue("weightUnit", "kg")}
                      >
                        kg
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="lbs" value="lbs" {...register("weightUnit")} className="hidden" />
                      <Label
                        htmlFor="lbs"
                        className={`px-3 py-1 rounded-md cursor-pointer ${
                          watchAllFields.weightUnit === "lbs"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                            : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        }`}
                        onClick={() => setValue("weightUnit", "lbs")}
                      >
                        lbs
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Height Question */}
            {currentQuestion === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">What's your height?</h2>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder={watchAllFields.heightUnit === "cm" ? "Enter height in cm" : "Enter height in inches"}
                      {...register("height")}
                      className="text-lg"
                    />
                    {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height.message}</p>}
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="cm"
                        value="cm"
                        {...register("heightUnit")}
                        className="hidden"
                        defaultChecked
                      />
                      <Label
                        htmlFor="cm"
                        className={`px-3 py-1 rounded-md cursor-pointer ${
                          watchAllFields.heightUnit === "cm"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                            : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        }`}
                        onClick={() => setValue("heightUnit", "cm")}
                      >
                        cm
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="ft-in" value="ft-in" {...register("heightUnit")} className="hidden" />
                      <Label
                        htmlFor="ft-in"
                        className={`px-3 py-1 rounded-md cursor-pointer ${
                          watchAllFields.heightUnit === "ft-in"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                            : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        }`}
                        onClick={() => setValue("heightUnit", "ft-in")}
                      >
                        ft-in
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Age Question */}
            {currentQuestion === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">What is your age?</h2>
                <Input type="number" placeholder="Enter your age" {...register("age")} className="text-lg" />
                {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>}
              </div>
            )}

            {/* Gender Question */}
            {currentQuestion === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">What is your gender?</h2>
                <RadioGroup
                  onValueChange={(value) => setValue("gender", value as "Male" | "Female" | "Other")}
                  className="space-y-3"
                >
                  {["Male", "Female", "Other"].map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
              </div>
            )}

            {/* Goal Question */}
            {currentQuestion === 4 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">What is your goal?</h2>
                <RadioGroup onValueChange={(value) => setValue("goal", value as any)} className="space-y-3">
                  {["Lose weight", "Build muscle", "Maintain", "Get toned", "Improve health"].map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
                {errors.goal && <p className="text-red-500 text-sm mt-1">{errors.goal.message}</p>}
              </div>
            )}

            {/* Target Weight Question */}
            {currentQuestion === 5 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">What's your target/goal weight?</h2>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder={`Enter target weight in ${watchAllFields.weightUnit}`}
                      {...register("targetWeight")}
                      className="text-lg"
                    />
                    {errors.targetWeight && <p className="text-red-500 text-sm mt-1">{errors.targetWeight.message}</p>}
                  </div>
                  <div className="w-16 text-center">
                    <span className="text-zinc-500">{watchAllFields.weightUnit}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Goal Date Question */}
            {currentQuestion === 6 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">By when would you like to achieve this goal?</h2>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !watchAllFields.goalDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {watchAllFields.goalDate ? format(watchAllFields.goalDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={watchAllFields.goalDate}
                          onSelect={(date) => setValue("goalDate", date)}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500 mb-2">Or enter a timeframe:</p>
                    <Input
                      placeholder="e.g., '3 months', '6 weeks'"
                      {...register("goalTimeframe")}
                      className="text-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Workout Preference Question */}
            {currentQuestion === 7 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">What type of workouts do you enjoy/prefer?</h2>
                <p className="text-sm text-zinc-500">Select all that apply</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Strength",
                    "Cardio",
                    "HIIT",
                    "Pilates",
                    "Yoga",
                    "Calisthenics",
                    "Home workouts",
                    "Gym workouts",
                    "Mix",
                  ].map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={option}
                        onCheckedChange={(checked) => {
                          const currentPrefs = watchAllFields.workoutPreference || []
                          if (checked) {
                            setValue("workoutPreference", [...currentPrefs, option])
                          } else {
                            setValue(
                              "workoutPreference",
                              currentPrefs.filter((pref) => pref !== option),
                            )
                          }
                        }}
                      />
                      <Label htmlFor={option}>{option}</Label>
                    </div>
                  ))}
                </div>
                {errors.workoutPreference && (
                  <p className="text-red-500 text-sm mt-1">{errors.workoutPreference.message}</p>
                )}
              </div>
            )}

            {/* Workout Days Question */}
            {currentQuestion === 8 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">How many days per week can you realistically work out?</h2>
                <Select onValueChange={(value) => setValue("workoutDays", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select days per week" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        {day} {day === 1 ? "day" : "days"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.workoutDays && <p className="text-red-500 text-sm mt-1">{errors.workoutDays.message}</p>}
              </div>
            )}

            {/* Gym Access Question */}
            {currentQuestion === 9 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Do you have access to a gym or home equipment?</h2>
                <RadioGroup onValueChange={(value) => setValue("gymAccess", value as any)} className="space-y-3">
                  {["Yes", "No", "Limited Equipment"].map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
                {errors.gymAccess && <p className="text-red-500 text-sm mt-1">{errors.gymAccess.message}</p>}
              </div>
            )}

            {/* Activity Level Question */}
            {currentQuestion === 10 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">What is your current activity level?</h2>
                <RadioGroup onValueChange={(value) => setValue("activityLevel", value as any)} className="space-y-3">
                  {[
                    "Sedentary (mostly sitting)",
                    "Lightly active (some movement)",
                    "Moderately active (walk/workout a few times/week)",
                    "Very active (daily exercise/manual labor)",
                  ].map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
                {errors.activityLevel && <p className="text-red-500 text-sm mt-1">{errors.activityLevel.message}</p>}
              </div>
            )}

            {/* Diet Restriction Question */}
            {currentQuestion === 11 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Do you follow a specific diet or have food restrictions?</h2>
                <RadioGroup onValueChange={(value) => setValue("dietRestriction", value)} className="space-y-3">
                  {["Vegan", "Vegetarian", "Keto", "Low-carb", "Halal", "No restrictions", "Other"].map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
                {watchAllFields.dietRestriction === "Other" && (
                  <div className="mt-3">
                    <Textarea
                      placeholder="Please specify your dietary restrictions"
                      {...register("otherDietDetails")}
                    />
                  </div>
                )}
                {errors.dietRestriction && (
                  <p className="text-red-500 text-sm mt-1">{errors.dietRestriction.message}</p>
                )}
              </div>
            )}

            {/* Meals Per Day Question */}
            {currentQuestion === 12 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">How many meals do you eat per day on average?</h2>
                <Select onValueChange={(value) => setValue("mealsPerDay", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select number of meals" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, "7+"].map((meal) => (
                      <SelectItem key={meal.toString()} value={meal.toString()}>
                        {meal} {meal === 1 ? "meal" : "meals"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.mealsPerDay && <p className="text-red-500 text-sm mt-1">{errors.mealsPerDay.message}</p>}
              </div>
            )}

            {/* Biggest Struggle Question */}
            {currentQuestion === 13 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">What's your biggest struggle with fitness or nutrition?</h2>
                <Textarea
                  placeholder="Tell us about your challenges..."
                  {...register("biggestStruggle")}
                  className="min-h-[120px]"
                />
                {errors.biggestStruggle && (
                  <p className="text-red-500 text-sm mt-1">{errors.biggestStruggle.message}</p>
                )}
              </div>
            )}

            {/* Email Question */}
            {currentQuestion === 14 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">What's your email so we can send your plan?</h2>
                <Input type="email" placeholder="Enter your email" {...register("email")} className="text-lg" />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>
            )}

            {/* Coaching Question */}
            {currentQuestion === 15 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">
                  Would you like weekly check-ins from your coach for accountability & progress?
                </h2>
                <div className="flex items-center space-x-4 p-4 border rounded-lg">
                  <Switch
                    id="coaching"
                    checked={watchAllFields.wantCoaching}
                    onCheckedChange={(checked) => setValue("wantCoaching", checked)}
                  />
                  <div>
                    <Label htmlFor="coaching" className="font-medium">
                      Weekly Coach Check-ins
                    </Label>
                    <p className="text-sm text-zinc-500">Get personalized feedback and adjustments to your plan</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>

          {currentQuestion < questions.length - 1 ? (
            <Button
              type="button"
              onClick={handleNext}
              className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center"
            >
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Get My Plan
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
