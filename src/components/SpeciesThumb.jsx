import { Flower2, Leaf } from 'lucide-react'

export function SpeciesThumb({ species, size = 'md', className = '' }) {
  const isInvasive = species.status === 'Invasive'
  const Icon = isInvasive ? Leaf : Flower2

  const sizes = {
    sm: 'h-9 w-9 rounded-md',
    md: 'h-11 w-11 rounded-md',
    lg: 'h-16 w-16 rounded-lg',
    xl: 'h-28 w-full rounded-t-lg',
  }

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden border ${
        isInvasive
          ? 'border-inv-high/20 bg-inv-high/[0.07] text-inv-high/80'
          : 'border-native/20 bg-native/[0.07] text-native/80'
      } ${sizes[size]} ${className}`}
      aria-label={`${species.commonName} image placeholder`}
    >
      <span
        className="absolute inset-x-0 bottom-0 h-1/2 border-t border-current opacity-[0.06]"
        aria-hidden="true"
      />
      <Icon
        size={size === 'xl' ? 36 : size === 'lg' ? 24 : size === 'sm' ? 15 : 18}
        strokeWidth={1.4}
      />
      {size === 'xl' && (
        <span className="mono absolute bottom-2.5 left-3 text-[9px] text-current/60">
          {species.scientificName.split(' ')[0].toLowerCase()}.jpg
        </span>
      )}
    </div>
  )
}
