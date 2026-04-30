"use server";

import PDFDocument from "pdfkit";
import {
  generateWorkoutPlan,
  generateNutritionPlan,
  generateLifestyleTips,
  type FormData,
} from "@/lib/plan-generator";

export async function generatePDF(formData: FormData, bmi: number) {
  try {
    const doc = new PDFDocument();
    const chunks: Buffer[] = [];

    return new Promise<string>((resolve, reject) => {
      doc.on("data", (chunk) => {
        chunks.push(Buffer.from(chunk));
      });

      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(chunks);
        const base64 = pdfBuffer.toString("base64");
        resolve(base64);
      });

      doc.on("error", reject);

      try {

        // Generate plans
        const workoutPlan = generateWorkoutPlan(formData);
        const nutritionPlan = generateNutritionPlan(formData, bmi);
        const lifestyleTips = generateLifestyleTips(formData);

        // Title
        doc.fontSize(28).fillColor("#DC2626").text("ELEVEN26 GYM", { align: "center" });
        doc.fontSize(18).fillColor("#333333").text("Your Custom Fitness Blueprint", { align: "center" });
        doc.fontSize(12)
          .fillColor("#646464")
          .text(`Goal: ${formData.goal.toUpperCase()} | Target: ${formData.targetWeight}${formData.weightUnit}`, {
            align: "center",
          });
        doc.moveDown();

        // Your Statistics Section
        doc.fontSize(16).fillColor("#333333").text("Your Statistics");
        doc.fontSize(11).fillColor("#000000");
        doc.text(`Current Weight: ${formData.weight} ${formData.weightUnit}`);
        doc.text(`Height: ${formData.height} ${formData.heightUnit}`);
        doc.text(`Age: ${formData.age}`);
        doc.text(`Gender: ${formData.gender}`);
        doc.text(`BMI: ${bmi.toFixed(1)}`);
        doc.moveDown();

        // Nutrition Plan Section
        doc.fontSize(16).fillColor("#333333").text("Nutrition Plan");
        doc.fontSize(11).fillColor("#000000");
        doc.text(`Daily Calories: ${nutritionPlan.dailyCalories} kcal`);
        doc.text(`Protein: ${nutritionPlan.protein}g per day`);
        doc.text(`Carbohydrates: ${nutritionPlan.carbs}g per day`);
        doc.text(`Fats: ${nutritionPlan.fats}g per day`);
        doc.text(`Diet Type: ${formData.dietRestriction}`);
        doc.text(`Nutrition Focus: ${formData.dietaryFocus}`);
        doc.moveDown();

        doc.fontSize(12).fillColor("#333333").text("Sample Daily Meal Plan:");
        doc.fontSize(10).fillColor("#000000");
        nutritionPlan.mealPlan.forEach((mealSection) => {
          doc.fillColor("#DC2626").text(`${mealSection.meal}:`, { indent: 10 });
          doc.fillColor("#000000");
          mealSection.examples.slice(0, 2).forEach((example) => {
            doc.text(`• ${example}`, { indent: 20 });
          });
        });
        doc.moveDown();

        // Workout Plan Section
        doc.addPage();
        doc.fontSize(16).fillColor("#333333").text("Workout Plan");
        doc.fontSize(12).fillColor("#000000").text(workoutPlan.title);
        doc.fontSize(10).text(workoutPlan.description);
        doc.moveDown();

        doc.fontSize(11).fillColor("#333333").text("Weekly Schedule:");
        doc.fontSize(10).fillColor("#000000");
        workoutPlan.weekly.slice(0, 6).forEach((day) => {
          doc.fillColor("#DC2626").text(`${day.day} - ${day.focus} (${day.duration})`, { indent: 10 });
          doc.fillColor("#000000");
          day.exercises.slice(0, 3).forEach((exercise) => {
            doc.text(`• ${exercise}`, { indent: 20 });
          });
        });
        doc.moveDown();

        // Lifestyle Tips Section
        doc.addPage();
        doc.fontSize(16).fillColor("#333333").text("Lifestyle Tips for Success");
        doc.moveDown();

        doc.fontSize(11).fillColor("#DC2626").text("Sleep & Recovery:");
        doc.fontSize(10).fillColor("#000000").text(lifestyleTips.sleep);
        doc.moveDown();

        doc.fontSize(11).fillColor("#DC2626").text("Hydration:");
        doc.fontSize(10).fillColor("#000000").text(lifestyleTips.hydration);
        doc.moveDown();

        doc.fontSize(11).fillColor("#DC2626").text("Recovery & Injury Prevention:");
        doc.fontSize(10).fillColor("#000000").text(lifestyleTips.recovery);
        doc.moveDown();

        doc.fontSize(11).fillColor("#DC2626").text("Stay Motivated:");
        doc.fontSize(10).fillColor("#000000").text(lifestyleTips.motivation);

        // Footer
        doc.fontSize(9).fillColor("#646464").text(`Generated for: ${formData.email} | Date: ${new Date().toLocaleDateString()}`, {
          align: "center",
        });

        doc.end();
      } catch (error) {
        doc.end();
        reject(error);
      }
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF");
  }
}
