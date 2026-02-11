import { useState, Suspense, lazy } from "react"
const Dithering = lazy(() =>
  import("@paper-design/shaders-react").then((mod) => ({ default: mod.Dithering }))
)
export function CTASection() {
  const [isHovered, setIsHovered] = useState(false)

  const handleScrollToCards = (e: React.MouseEvent) => {
    e.preventDefault()
    const target = document.getElementById("chapters")
    if (target) {
      target.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section
      className="w-full min-h-screen relative flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Suspense fallback={<div className="absolute inset-0 bg-surface-alt/20" />}>
        <div className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-multiply">
          <Dithering
            colorBack="#00000000"
            colorFront="#34D25c"
            shape="warp"
            type="4x4"
            speed={isHovered ? 0.6 : 0.2}
            className="size-full"
            minPixelRatio={1}
          />
        </div>
      </Suspense>
      <div className="relative z-10 px-6 max-w-4xl mx-auto text-center flex flex-col items-center">

            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-accent/10 bg-accent/5 px-4 py-1.5 text-sm font-medium text-accent backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              2nd March 2026
            </div>
            <h2 className="font-sans text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight text-text mb-8 leading-[1.05]">
              Prompt Engineering
              <br />
              <span className="text-text-secondary">Workshop</span>
            </h2>

            <p className="text-text-secondary text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
              Master the art of prompting Claude — from basic structure to advanced techniques.
              Hands-on exercises with live API calls, powered by your own key.
            </p>
            <button
              onClick={handleScrollToCards}
              className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-black px-12 text-base font-medium text-white transition-all duration-300 hover:bg-neutral-800 hover:scale-105 active:scale-95 hover:ring-4 hover:ring-black/20"
            >
              <span className="relative z-10">Start Learning</span>
            </button>
      </div>
    </section>
  )
}
