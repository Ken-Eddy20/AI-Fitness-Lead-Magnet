import { Suspense } from "react"
import FitnessAssessment from "@/components/fitness-assessment"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800">
      <div className="container max-w-3xl mx-auto px-4 py-8 md:py-16">
        <Suspense fallback={<LoadingSpinner />}>
          <FitnessAssessment />
        </Suspense>
      </div>
    </main>
  )
}
