"use server";

import { jsPDF } from "jspdf";

type FormData = {
  weight: string;
  weightUnit: "kg" | "lbs";
  height: string;
  heightUnit: "cm" | "ft-in";
  age: string;
  gender: "Male" | "Female" | "Other";
  goal: "Lose weight" | "Build muscle" | "Maintain" | "Get toned" | "Improve health";
  targetWeight: string;
  goalDate?: Date;
  goalTimeframe?: string;
  workoutPreference: string[];
  workoutDays: string;
  gymAccess: "Yes" | "No" | "Limited Equipment";
  activityLevel: string;
  dietRestriction: string;
  otherDietDetails?: string;
  mealsPerDay: string;
  biggestStruggle: string;
  email: string;
};

export async function generatePDF(formData: FormData, bmi: number) {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // Title
    doc.setFontSize(24);
    doc.setTextColor(16, 185, 129); // Emerald color
    doc.text("Your Personalized Fitness Plan", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 15;

    // Subtitle
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139); // Slate color
    doc.text(
      `Goal: ${formData.goal} | Target: ${formData.targetWeight}${formData.weightUnit}`,
      pageWidth / 2,
      yPosition,
      { align: "center" }
    );
    yPosition += 12;

    // Fitness Stats Section
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Your Statistics", 20, yPosition);
    yPosition += 8;

    doc.setFontSize(11);
    const statsText = [
      `Current Weight: ${formData.weight} ${formData.weightUnit}`,
      `Height: ${formData.height} ${formData.heightUnit}`,
      `Age: ${formData.age}`,
      `Gender: ${formData.gender}`,
      `BMI: ${bmi.toFixed(1)}`,
      `Activity Level: ${formData.activityLevel}`,
    ];

    statsText.forEach((text) => {
      doc.text(text, 25, yPosition);
      yPosition += 6;
    });

    yPosition += 5;

    // Calculate macros and calories for the PDF
    const weightInKg =
      formData.weightUnit === "kg"
        ? parseFloat(formData.weight)
        : parseFloat(formData.weight) * 0.453592;
    const heightInM =
      formData.heightUnit === "cm"
        ? parseFloat(formData.height) / 100
        : parseFloat(formData.height) * 0.0254;

    let bmr = 0;
    if (formData.gender === "Male") {
      bmr = 10 * weightInKg + 6.25 * (heightInM * 100) - 5 * parseFloat(formData.age) + 5;
    } else {
      bmr = 10 * weightInKg + 6.25 * (heightInM * 100) - 5 * parseFloat(formData.age) - 161;
    }

    let activityMultiplier = 1.2;
    if (formData.activityLevel.includes("Lightly active")) {
      activityMultiplier = 1.375;
    } else if (formData.activityLevel.includes("Moderately active")) {
      activityMultiplier = 1.55;
    } else if (formData.activityLevel.includes("Very active")) {
      activityMultiplier = 1.725;
    }

    const tdee = Math.round(bmr * activityMultiplier);
    let dailyCalories = tdee;

    if (formData.goal === "Lose weight") {
      dailyCalories = Math.round(tdee * 0.8);
    } else if (formData.goal === "Build muscle") {
      dailyCalories = Math.round(tdee * 1.1);
    }

    let protein = 0,
      carbs = 0,
      fats = 0;
    if (formData.goal === "Lose weight") {
      protein = Math.round((dailyCalories * 0.4) / 4);
      carbs = Math.round((dailyCalories * 0.3) / 4);
      fats = Math.round((dailyCalories * 0.3) / 9);
    } else if (formData.goal === "Build muscle") {
      protein = Math.round((dailyCalories * 0.3) / 4);
      carbs = Math.round((dailyCalories * 0.5) / 4);
      fats = Math.round((dailyCalories * 0.2) / 9);
    } else {
      protein = Math.round((dailyCalories * 0.25) / 4);
      carbs = Math.round((dailyCalories * 0.5) / 4);
      fats = Math.round((dailyCalories * 0.25) / 9);
    }

    // Nutrition Plan Section
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Nutrition Plan", 20, yPosition);
    yPosition += 8;

    doc.setFontSize(11);
    const nutritionText = [
      `Daily Calories: ${dailyCalories} kcal`,
      `Protein: ${protein}g per day`,
      `Carbohydrates: ${carbs}g per day`,
      `Fats: ${fats}g per day`,
      `Diet Preference: ${formData.dietRestriction}`,
      `Meals Per Day: ${formData.mealsPerDay}`,
    ];

    nutritionText.forEach((text) => {
      doc.text(text, 25, yPosition);
      yPosition += 6;
    });

    yPosition += 5;

    // Workout Plan Section
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Workout Plan", 20, yPosition);
    yPosition += 8;

    doc.setFontSize(11);
    const workoutText = [
      `Days Per Week: ${formData.workoutDays} days`,
      `Preferred Types: ${formData.workoutPreference.join(", ")}`,
      `Gym Access: ${formData.gymAccess}`,
    ];

    workoutText.forEach((text) => {
      doc.text(text, 25, yPosition);
      yPosition += 6;
    });

    yPosition += 5;

    // Recommendations Section
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Key Recommendations", 20, yPosition);
    yPosition += 8;

    doc.setFontSize(11);
    const recommendations = [
      "• Warm up 5-10 minutes before each workout",
      "• For strength exercises: 3-4 sets of 8-12 reps",
      "• Rest 60-90 seconds between sets",
      "• Aim for 7-9 hours of quality sleep each night",
      "• Drink at least 2-3 liters of water daily",
      "• Take 1-2 complete rest days per week",
    ];

    recommendations.forEach((text) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(text, 25, yPosition);
      yPosition += 6;
    });

    yPosition += 8;

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated for: ${formData.email}`, 20, pageHeight - 15);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, pageHeight - 10);

    // Convert to base64 for transmission
    const pdfData = doc.output("arraybuffer");
    const base64 = Buffer.from(pdfData).toString("base64");
    return base64;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF");
  }
}
