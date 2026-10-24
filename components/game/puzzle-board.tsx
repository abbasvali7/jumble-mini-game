'use client'

import { useCallback, useEffect, useState } from 'react'
import { ArrowRight, Delete, Lightbulb, Shuffle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LetterTile } from '@/components/game/letter-tile'
import { scramble, type Puzzle, type Tile } from '@/lib/levels'
import { cn } from '@/lib/utils'

type PuzzleBoardProps = {
  puzzle: Puzzle
  onSolved: (hintsUsed: number) => void
  onNext: () => void
  isLastWord: boolean
}

export function PuzzleBoard({ puzzle, onSolved, onNext, isLastWord }: PuzzleBoardProps) {
  const { word } = puzzle
  const [pool, setPool] = useState<Tile[]>(() => scramble(word))
  const [slots, setSlots] = useState<(number | null)[]>(() => Array(word.length).fill(null))
  const [locked, setLocked] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [status, setStatus] = useState<'playing' | 'wrong' | 'solved'>('playing')

  const letterOf = useCallback((id: number) => word[id], [word])
  const usedIds = new Set(slots.filter((s): s is number => s !== null))

  const size = word.length <= 5 ? 'lg' : word.length <= 9 ? 'md' : 'sm'

  const evaluate = useCallback(
    (next: (number | null)[], hints: number) => {
      if (next.some((s) => s === null)) return
      const guess = next.map((id) => letterOf(id as number)).join('')
      if (guess === word) {
        setStatus('solved')
        onSolved(hints)
      } else {
        setStatus('wrong')
        setTimeout(() => {
          setSlots((current) => current.map((s, i) => (i < locked ? s : null)))
          setStatus('playing')
        }, 650)
      }
    },
    [letterOf, word, onSolved, locked],
  )

  const placeTile = useCallback(
    (tileId: number) => {
      if (status !== 'playing' || usedIds.has(tileId)) return
      const index = slots.indexOf(null)
      if (index === -1) return
      const next = [...slots]
      next[index] = tileId
      setSlots(next)
      evaluate(next, hintsUsed)
    },
    [status, usedIds, slots, evaluate, hintsUsed],
  )

  const removeAt = useCallback(
    (index: number) => {
      if (status !== 'playing' || index < locked || slots[index] === null) return
      const next = [...slots]
      next[index] = null
      setSlots(next)
    },
    [status, locked, slots],
  )

  const removeLast = useCallback(() => {
    for (let i = slots.length - 1; i >= locked; i--) {
      if (slots[i] !== null) return removeAt(i)
    }
  }, [slots, locked, removeAt])

  const clearAll = () => {
    if (status !== 'playing') return
    setSlots((current) => current.map((s, i) => (i < locked ? s : null)))
  }

  const shufflePool = () => {
    setPool((current) => {
      const copy = [...current]
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[copy[i], copy[j]] = [copy[j], copy[i]]
      }
      return copy
    })
  }

  const useHint = () => {
    if (status !== 'playing' || locked >= word.length - 1) return
    const target = word[locked]
    const next: (number | null)[] = slots.map((s, i) => (i < locked ? s : null))
    const taken = new Set(next.filter((s): s is number => s !== null))
    const tile = pool.find((t) => t.letter === target && !taken.has(t.id))
    if (!tile) return
    next[locked] = tile.id
    const hints = hintsUsed + 1
    setSlots(next)
    setLocked(locked + 1)
    setHintsUsed(hints)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (status === 'solved' && e.key === 'Enter') {
        e.preventDefault()
        onNext()
        return
      }
      if (e.key === 'Backspace') {
        e.preventDefault()
        removeLast()
        return
      }
      const key = e.key.toUpperCase()
      if (/^[A-Z]$/.test(key)) {
        const tile = pool.find((t) => t.letter === key && !usedIds.has(t.id))
        if (tile) placeTile(tile.id)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [status, pool, usedIds, placeTile, removeLast, onNext])

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="bg-card border-border flex max-w-md items-start gap-3 rounded-xl border px-4 py-3 text-pretty">
        <Lightbulb className="text-primary mt-0.5 size-5 shrink-0" aria-hidden="true" />
        <p className="text-foreground text-base leading-relaxed">
          <span className="sr-only">Clue: </span>
          {puzzle.hint}
        </p>
      </div>

      <section aria-label="Your answer" className="flex w-full flex-col items-center gap-3">
        <div
          className={cn('flex flex-wrap justify-center gap-1.5 sm:gap-2', status === 'wrong' && 'animate-shake')}
        >
          {slots.map((tileId, i) => (
            <LetterTile
              key={i}
              size={size}
              letter={tileId !== null ? letterOf(tileId) : undefined}
              variant={
                status === 'solved' ? 'correct' : tileId === null ? 'empty' : i < locked ? 'locked' : 'slot'
              }
              onClick={() => removeAt(i)}
              disabled={tileId === null}
              label={tileId !== null ? `Remove letter ${letterOf(tileId)}` : `Empty slot ${i + 1}`}
            />
          ))}
        </div>
        <p aria-live="polite" className="h-6 text-sm font-medium">
          {status === 'wrong' && <span className="text-destructive">Not quite — try again!</span>}
          {status === 'solved' && <span className="text-success">Brilliant! You got it.</span>}
        </p>
      </section>

      <section aria-label="Scrambled letters" className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
        {pool.map((tile) => (
          <LetterTile
            key={tile.id}
            size={size}
            letter={tile.letter}
            variant="pool"
            disabled={usedIds.has(tile.id) || status !== 'playing'}
            onClick={() => placeTile(tile.id)}
            label={`Letter ${tile.letter}`}
          />
        ))}
      </section>

      {status === 'solved' ? (
        <Button size="lg" onClick={onNext} className="h-12 gap-2 px-6 text-base">
          {isLastWord ? 'Finish level' : 'Next word'}
          <ArrowRight data-icon="inline-end" />
        </Button>
      ) : (
        <div className="flex flex-wrap justify-center gap-2">
          <Button variant="outline" size="lg" onClick={shufflePool} className="h-11 gap-2 px-4">
            <Shuffle data-icon="inline-start" />
            Shuffle
          </Button>
          <Button variant="outline" size="lg" onClick={clearAll} className="h-11 gap-2 px-4">
            <Delete data-icon="inline-start" />
            Clear
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={useHint}
            disabled={locked >= word.length - 1}
            className="h-11 gap-2 px-4"
          >
            <Lightbulb data-icon="inline-start" />
            Hint
            <span className="text-muted-foreground text-xs">(-15)</span>
          </Button>
        </div>
      )}
    </div>
  )
}
