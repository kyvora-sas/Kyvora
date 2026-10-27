export function GithubIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.24c3-.34 6-1.53 6-6.76a5.5 5.5 0 0 0-1.5-3.78c.15-.38.65-1.8-.15-3.72 0 0-1.2-.38-3.9 1.45a13.38 13.38 0 0 0-7 0c-2.7-1.83-3.9-1.45-3.9-1.45-.8 1.92-.3 3.34-.15 3.72A5.5 5.5 0 0 0 4 11.24c0 5.22 3 6.42 6 6.76-.8.2-1.4.8-1.6 2.22-.2.1-.8.3-2.3-.6-1-.7-1.8-2.6-1.8-2.6-.5-.9-1.6-1.1-1.6-1.1-.9-.1-.1.3-.1.3.6.4 1.2 1.8 1.2 1.8.7 1.6 2.4 2.1 2.4 2.1.8.1 1.7-.1 2.2-.2v3" />
    </svg>
  );
}

export function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
