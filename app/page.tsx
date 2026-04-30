import { Suspense } from "react"
import FitnessAssessment from "@/components/fitness-assessment"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-10">
        <div className="container max-w-3xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-foreground font-bold text-lg">26</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">ELEVEN26 GYM</h1>
          </div>
        </div>
      </header>

      <div className="container max-w-3xl mx-auto px-4 py-12 md:py-20">
        <Suspense fallback={<LoadingSpinner />}>
          <FitnessAssessment />
        </Suspense>
      </div>
    </main>
  )
}
