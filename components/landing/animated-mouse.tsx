export function AnimatedMouse() {
  return (
    <div className="animate-bounce">
      <svg
        width="24"
        height="36"
        viewBox="0 0 24 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[hsl(var(--chart-1))]"
      >
        <rect x="1" y="1" width="22" height="34" rx="11" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="12" cy="12" r="2" fill="currentColor" className="animate-pulse" />
      </svg>
    </div>
  )
}
