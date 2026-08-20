export function RouteArrow({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 16" aria-hidden="true">
      <path d="M1 8h36M30 1l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
