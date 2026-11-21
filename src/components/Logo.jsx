export function LeafMark({ size = 26, className = '' }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <rect width="64" height="64" rx="14" fill="#262626" stroke="#343434" />
      <path
        d="M48.5 14.5c-13.1.1-24.8 5.3-29.8 14.4-3.9 7.1-1.8 15.2 4.4 18.6 6 3.3 13.4 1 17.2-4.7 3.4-5.2 4.3-12.4 8.2-28.3Z"
        fill="#23855a"
      />
      <path
        d="M19.5 50.5c3.7-10.8 9.9-19.2 19.3-25.1"
        fill="none"
        stroke="#1c1c1c"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}
