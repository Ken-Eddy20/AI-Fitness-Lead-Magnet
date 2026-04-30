"use server";

import { jsPDF } from "jspdf";
import {
  generateWorkoutPlan,
  generateNutritionPlan,
  generateLifestyleTips,
  type FormData,
} from "@/lib/plan-generator";

export async function generatePDF(formData: FormData, bmi: number) {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // Generate plans
    const workoutPlan = generateWorkoutPlan(formData);
    const nutritionPlan = generateNutritionPlan(formData, bmi);
    const lifestyleTips = generateLifestyleTips(formData);

    const addNewPageIfNeeded = (requiredSpace: number) => {
      if (yPosition + requiredSpace > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }
    };

    // Title
    doc.setFontSize(28);
    doc.setTextColor(220, 38, 38); // Red from Eleven26
    doc.text("ELEVEN26 GYM", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 12;

    doc.setFontSize(18);
    doc.setTextColor(51, 51, 51);
    doc.text("Your Custom Fitness Blueprint", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;

    // Subtitle
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Goal: ${formData.goal.toUpperCase()} | Target: ${formData.targetWeight}${formData.weightUnit}`,
      pageWidth / 2,
      yPosition,
      { align: "center" }
    );
    yPosition += 15;

    // Your Statistics Section
    doc.setFontSize(16);
    doc.setTextColor(51, 51, 51);
    doc.text("Your Statistics", 20, yPosition);
    yPosition += 10;

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    const statsText = [
      `Current Weight: ${formData.weight} ${formData.weightUnit}`,
      `Height: ${formData.height} ${formData.heightUnit}`,
      `Age: ${formData.age}`,
      `Gender: ${formData.gender}`,
      `BMI: ${bmi.toFixed(1)}`,
    ];

    statsText.forEach((text) => {
      doc.text(text, 25, yPosition);
      yPosition += 6;
    });

    yPosition += 8;

    // Nutrition Plan Section
    addNewPageIfNeeded(60);
    doc.setFontSize(16);
    doc.setTextColor(51, 51, 51);
    doc.text("Nutrition Plan", 20, yPosition);
    yPosition += 10;

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    const nutritionText = [
      `Daily Calories: ${nutritionPlan.dailyCalories} kcal`,
      `Protein: ${nutritionPlan.protein}g per day`,
      `Carbohydrates: ${nutritionPlan.carbs}g per day`,
      `Fats: ${nutritionPlan.fats}g per day`,
      `Diet Type: ${formData.dietRestriction}`,
      `Nutrition Focus: ${formData.dietaryFocus}`,
    ];

    nutritionText.forEach((text) => {
      doc.text(text, 25, yPosition);
      yPosition += 6;
    });

    yPosition += 6;

    doc.setFontSize(12);
    doc.setTextColor(51, 51, 51);
    doc.text("Sample Daily Meal Plan:", 25, yPosition);
    yPosition += 6;

    doc.setFontSize(10);
    nutritionPlan.mealPlan.forEach((mealSection) => {
      addNewPageIfNeeded(20);
      doc.setTextColor(220, 38, 38);
      doc.text(`${mealSection.meal}:`, 30, yPosition);
      yPosition += 5;

      doc.setTextColor(0, 0, 0);
      mealSection.examples.slice(0, 2).forEach((example) => {
        doc.text(`• ${example}`, 35, yPosition);
        yPosition += 5;
      });
      yPosition += 2;
    });

    yPosition += 6;

    // Workout Plan Section
    addNewPageIfNeeded(80);
    doc.setFontSize(16);
    doc.setTextColor(51, 51, 51);
    doc.text("Workout Plan", 20, yPosition);
    yPosition += 10;

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(workoutPlan.title, 25, yPosition);
    yPosition += 6;

    doc.setFontSize(10);
    doc.text(workoutPlan.description, 25, yPosition, { maxWidth: 160 });
    yPosition += 12;

    // Weekly schedule
    doc.setFontSize(11);
    doc.setTextColor(51, 51, 51);
    doc.text("Weekly Schedule:", 25, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    workoutPlan.weekly.slice(0, 6).forEach((day) => {
      addNewPageIfNeeded(30);
      doc.setTextColor(220, 38, 38);
      doc.text(`${day.day} - ${day.focus} (${day.duration})`, 30, yPosition);
      yPosition += 6;

      doc.setTextColor(0, 0, 0);
      day.exercises.slice(0, 3).forEach((exercise) => {
        doc.text(`• ${exercise}`, 35, yPosition);
        yPosition += 4;
      });
      yPosition += 2;
    });

    yPosition += 6;

    // Lifestyle Tips Section
    addNewPageIfNeeded(60);
    doc.setFontSize(16);
    doc.setTextColor(51, 51, 51);
    doc.text("Lifestyle Tips for Success", 20, yPosition);
    yPosition += 12;

    doc.setFontSize(11);
    doc.setTextColor(220, 38, 38);
    doc.text("Sleep & Recovery:", 25, yPosition);
    yPosition += 6;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const sleepLines = doc.splitTextToSize(lifestyleTips.sleep, 160);
    sleepLines.forEach((line: string) => {
      addNewPageIfNeeded(10);
      doc.text(line, 30, yPosition);
      yPosition += 5;
    });

    yPosition += 6;

    doc.setFontSize(11);
    doc.setTextColor(220, 38, 38);
    doc.text("Hydration:", 25, yPosition);
    yPosition += 6;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const hydrationLines = doc.splitTextToSize(lifestyleTips.hydration, 160);
    hydrationLines.forEach((line: string) => {
      addNewPageIfNeeded(10);
      doc.text(line, 30, yPosition);
      yPosition += 5;
    });

    yPosition += 6;

    doc.setFontSize(11);
    doc.setTextColor(220, 38, 38);
    doc.text("Recovery & Injury Prevention:", 25, yPosition);
    yPosition += 6;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const recoveryLines = doc.splitTextToSize(lifestyleTips.recovery, 160);
    recoveryLines.forEach((line: string) => {
      addNewPageIfNeeded(10);
      doc.text(line, 30, yPosition);
      yPosition += 5;
    });

    yPosition += 6;

    doc.setFontSize(11);
    doc.setTextColor(220, 38, 38);
    doc.text("Stay Motivated:", 25, yPosition);
    yPosition += 6;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const motivationLines = doc.splitTextToSize(lifestyleTips.motivation, 160);
    motivationLines.forEach((line: string) => {
      addNewPageIfNeeded(10);
      doc.text(line, 30, yPosition);
      yPosition += 5;
    });

    // Footer
    yPosition += 15;
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated for: ${formData.email}`, 20, pageHeight - 10);
    doc.text(`Date: ${new Date().toLocaleDateString()} | Eleven26 Gym`, pageWidth - 100, pageHeight - 10);

    // Convert to base64 for transmission
    const pdfData = doc.output("arraybuffer");
    const base64 = Buffer.from(pdfData).toString("base64");
    return base64;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF");
  }
}
