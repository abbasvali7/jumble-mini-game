'use client'

import { useCallback, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LevelSelect } from '@/components/game/level-select'
import { PuzzleBoard } from '@/components/game/puzzle-board'
import { LevelComplete } from '@/components/game/level-complete'
import { LEVELS, starsFor, wordPoints } from '@/lib/levels'

type Screen = 'levels' | 'playing' | 'complete'

export function WordJumbleGame() {
  const [screen, setScreen] = useState<Screen>('levels')
  const [levelIndex, setLevelIndex] = useState(0)
  const [wordIndex, setWordIndex] = useState(0)
  const [levelScore, setLevelScore] = useState(0)
  const [levelHints, setLevelHints] = useState(0)
  const [round, setRound] = useState(0)
  const [unlocked, setUnlocked] = useState(0)
  const [bestStars, setBestStars] = useState<Record<number, number>>({})
  const [bestScores, setBestScores] = useState<Record<number, number>>({})

  const level = LEVELS[levelIndex]
  const puzzle = level.puzzles[wordIndex]
  const totalScore = Object.values(bestScores).reduce((a, b) => a + b, 0)

  const startLevel = (index: number) => {
    setLevelIndex(index)
    setWordIndex(0)
    setLevelScore(0)
    setLevelHints(0)
    setRound((r) => r + 1)
    setScreen('playing')
  }

  const handleSolved = useCallback(
    (hintsUsed: number) => {
      setLevelScore((s) => s + wordPoints(puzzle.word, hintsUsed))
      setLevelHints((h) => h + hintsUsed)
    },
    [puzzle.word],
  )

  const handleNext = useCallback(() => {
    if (wordIndex < level.puzzles.length - 1) {
      setWordIndex((i) => i + 1)
      return
    }
    const stars = starsFor(levelHints)
    setBestStars((prev) => ({ ...prev, [level.id]: Math.max(prev[level.id] ?? 0, stars) }))
    setBestScores((prev) => ({ ...prev, [level.id]: Math.max(prev[level.id] ?? 0, levelScore) }))
    setUnlocked((u) => Math.max(u, Math.min(levelIndex + 1, LEVELS.length - 1)))
    setScreen('complete')
  }, [wordIndex, level, levelHints, levelScore, levelIndex])

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-4xl flex-col px-4 py-8 sm:py-12">
      {screen === 'levels' && (
        <LevelSelect unlocked={unlocked} stars={bestStars} totalScore={totalScore} onSelect={startLevel} />
      )}

      {screen === 'playing' && (
        <div className="flex flex-col gap-8">
          <header className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <Button variant="ghost" size="lg" onClick={() => setScreen('levels')} className="h-10 gap-2">
                <ArrowLeft data-icon="inline-start" />
                Levels
              </Button>
              <div className="text-center">
                <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                  {level.difficulty}
                </p>
                <h1 className="font-display text-xl font-extrabold sm:text-2xl">
                  Level {level.id}: {level.name}
                </h1>
              </div>
              <p className="bg-card border-border rounded-full border px-3 py-1.5 text-sm font-bold">
                <span className="sr-only">Score: </span>
                <span className="text-primary">{levelScore}</span> pts
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="flex flex-1 gap-1.5"
                role="progressbar"
                aria-label="Level progress"
                aria-valuemin={0}
                aria-valuemax={level.puzzles.length}
                aria-valuenow={wordIndex}
              >
                {level.puzzles.map((_, i) => (
                  <span
                    key={i}
                    className={
                      i < wordIndex
                        ? 'bg-success h-2 flex-1 rounded-full'
                        : i === wordIndex
                          ? 'bg-primary h-2 flex-1 rounded-full'
                          : 'bg-border h-2 flex-1 rounded-full'
                    }
                  />
                ))}
              </div>
              <span className="text-muted-foreground text-sm font-medium whitespace-nowrap">
                Word {wordIndex + 1}/{level.puzzles.length}
              </span>
            </div>
          </header>

          <PuzzleBoard
            key={`${round}-${wordIndex}`}
            puzzle={puzzle}
            onSolved={handleSolved}
            onNext={handleNext}
            isLastWord={wordIndex === level.puzzles.length - 1}
          />

          <p className="text-muted-foreground hidden text-center text-xs sm:block">
            Tip: type letters on your keyboard, Backspace to undo, Enter to continue.
          </p>
        </div>
      )}

      {screen === 'complete' && (
        <div className="flex flex-1 items-center justify-center">
          <LevelComplete
            levelId={level.id}
            stars={starsFor(levelHints)}
            score={levelScore}
            hintsUsed={levelHints}
            isFinalLevel={levelIndex === LEVELS.length - 1}
            onNext={() => startLevel(levelIndex + 1)}
            onReplay={() => startLevel(levelIndex)}
            onLevels={() => setScreen('levels')}
          />
        </div>
      )}
    </main>
  )
}
