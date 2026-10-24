import { Lock } from 'lucide-react'
import { LEVELS } from '@/lib/levels'
import { StarRow } from '@/components/game/star-row'
import { cn } from '@/lib/utils'

type LevelSelectProps = {
  unlocked: number
  stars: Record<number, number>
  totalScore: number
  onSelect: (index: number) => void
}

export function LevelSelect({ unlocked, stars, totalScore, onSelect }: LevelSelectProps) {
  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col items-center gap-4 text-center">
        <div className="flex gap-1.5" aria-hidden="true">
          {'JUMBLE'.split('').map((l, i) => (
            <span
              key={i}
              className={cn(
                'bg-tile text-tile-foreground border-tile-edge font-display flex size-11 items-center justify-center rounded-lg border-b-4 text-2xl font-extrabold sm:size-14 sm:text-3xl',
                i % 2 === 0 ? '-rotate-6' : 'rotate-3',
              )}
            >
              {l}
            </span>
          ))}
        </div>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
          Word Jumble
        </h1>
        <p className="text-muted-foreground max-w-sm text-pretty leading-relaxed">
          Unscramble the letters to find the hidden word. Each level gets longer and trickier.
        </p>
        <p className="bg-card border-border rounded-full border px-4 py-1.5 text-sm font-semibold">
          Total score: <span className="text-primary">{totalScore}</span>
        </p>
      </header>

      <nav aria-label="Levels">
        <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {LEVELS.map((level, i) => {
            const isLocked = i > unlocked
            const earned = stars[level.id] ?? 0
            return (
              <li key={level.id}>
                <button
                  type="button"
                  disabled={isLocked}
                  onClick={() => onSelect(i)}
                  className={cn(
                    'focus-visible:ring-ring/60 flex w-full flex-col items-center gap-2 rounded-xl border-2 border-b-4 p-4 text-center transition-all outline-none focus-visible:ring-3',
                    isLocked
                      ? 'bg-muted/50 border-border text-muted-foreground cursor-not-allowed'
                      : 'bg-card border-border hover:border-primary cursor-pointer hover:-translate-y-0.5',
                  )}
                >
                  <span className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                    {level.difficulty}
                  </span>
                  <span className="font-display flex h-10 items-center text-3xl font-extrabold">
                    {isLocked ? <Lock className="size-6" aria-label="Locked" /> : level.id}
                  </span>
                  <span className="text-sm leading-tight font-medium">{level.name}</span>
                  <StarRow count={earned} size="sm" />
                </button>
              </li>
            )
          })}
        </ol>
      </nav>
    </div>
  )
}
