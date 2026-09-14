export default function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" fill="var(--accent)" />
      <rect x="5.5" y="16" width="5" height="10" rx="1.5" fill="var(--accent-foreground)" />
      <rect x="13.5" y="10" width="5" height="16" rx="1.5" fill="var(--accent-foreground)" />
      <rect x="21.5" y="4" width="5" height="22" rx="1.5" fill="var(--accent-foreground)" />
    </svg>
  );
}
