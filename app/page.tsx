import { Suspense } from "react"
import Image from "next/image"
import FitnessAssessment from "@/components/fitness-assessment"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-10 py-4">
        <div className="container max-w-3xl mx-auto px-4 flex items-center justify-center">
          <Image
            src="/eleven26-logo.png"
            alt="Eleven26 Gym"
            width={280}
            height={100}
            priority
            className="h-16 w-auto"
          />
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
