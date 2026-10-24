import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export function StarRow({ count, size = 'sm' }: { count: number; size?: 'sm' | 'lg' }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${count} of 3 stars`}>
      {[0, 1, 2].map((i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={cn(
            size === 'sm' ? 'size-4' : 'size-12',
            i < count ? 'fill-tile text-tile-edge' : 'text-border fill-transparent',
          )}
        />
      ))}
    </div>
  )
}
