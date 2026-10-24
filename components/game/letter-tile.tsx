import { cn } from '@/lib/utils'

type LetterTileProps = {
  letter?: string
  onClick?: () => void
  variant?: 'pool' | 'slot' | 'locked' | 'correct' | 'empty'
  size: 'sm' | 'md' | 'lg'
  disabled?: boolean
  label: string
}

const sizeClasses = {
  sm: 'size-9 text-lg sm:size-11 sm:text-xl',
  md: 'size-11 text-xl sm:size-13 sm:text-2xl',
  lg: 'size-13 text-2xl sm:size-16 sm:text-3xl',
}

export function LetterTile({ letter, onClick, variant = 'pool', size, disabled, label }: LetterTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        'font-display flex shrink-0 items-center justify-center rounded-lg font-extrabold uppercase transition-all duration-150 select-none',
        'focus-visible:ring-ring/60 outline-none focus-visible:ring-3',
        sizeClasses[size],
        variant === 'pool' &&
          'bg-tile text-tile-foreground border-tile-edge cursor-pointer border-b-4 shadow-sm hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2',
        variant === 'slot' &&
          'bg-card text-foreground border-primary cursor-pointer border-2 border-b-4 hover:bg-secondary',
        variant === 'locked' && 'bg-primary/15 text-primary border-primary/40 cursor-not-allowed border-2',
        variant === 'correct' && 'bg-success text-success-foreground border-success-edge border-b-4',
        variant === 'empty' && 'bg-muted/60 border-border cursor-default border-2 border-dashed',
        disabled && variant === 'pool' && 'pointer-events-none opacity-0',
      )}
    >
      {letter}
    </button>
  )
}
