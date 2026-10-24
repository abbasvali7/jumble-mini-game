import { ArrowRight, LayoutGrid, RotateCcw, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StarRow } from '@/components/game/star-row'

type LevelCompleteProps = {
  levelId: number
  stars: number
  score: number
  hintsUsed: number
  isFinalLevel: boolean
  onNext: () => void
  onReplay: () => void
  onLevels: () => void
}

export function LevelComplete({
  levelId,
  stars,
  score,
  hintsUsed,
  isFinalLevel,
  onNext,
  onReplay,
  onLevels,
}: LevelCompleteProps) {
  return (
    <div className="bg-card border-border mx-auto flex max-w-md flex-col items-center gap-6 rounded-2xl border-2 border-b-4 p-8 text-center">
      {isFinalLevel && <Trophy className="text-primary size-14" aria-hidden="true" />}
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">Level {levelId}</p>
        <h2 className="font-display text-3xl font-extrabold text-balance sm:text-4xl">
          {isFinalLevel ? 'You are a Grandmaster!' : 'Level Complete!'}
        </h2>
      </div>
      <StarRow count={stars} size="lg" />
      <dl className="grid w-full grid-cols-2 gap-3">
        <div className="bg-secondary rounded-xl p-3">
          <dt className="text-muted-foreground text-xs font-medium">Points earned</dt>
          <dd className="font-display text-primary text-2xl font-extrabold">{score}</dd>
        </div>
        <div className="bg-secondary rounded-xl p-3">
          <dt className="text-muted-foreground text-xs font-medium">Hints used</dt>
          <dd className="font-display text-2xl font-extrabold">{hintsUsed}</dd>
        </div>
      </dl>
      <div className="flex w-full flex-col gap-2">
        {!isFinalLevel && (
          <Button size="lg" onClick={onNext} className="h-12 gap-2 text-base">
            Next level
            <ArrowRight data-icon="inline-end" />
          </Button>
        )}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="lg" onClick={onReplay} className="h-11 gap-2">
            <RotateCcw data-icon="inline-start" />
            Replay
          </Button>
          <Button variant="outline" size="lg" onClick={onLevels} className="h-11 gap-2">
            <LayoutGrid data-icon="inline-start" />
            Levels
          </Button>
        </div>
      </div>
    </div>
  )
}
