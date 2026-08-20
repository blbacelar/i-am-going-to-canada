type CredentialBadgeProps = {
  label: string;
  value: string;
};

export function CredentialBadge({ label, value }: CredentialBadgeProps) {
  return (
    <span className="credential-badge">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 2.75 2.05 1.45 2.5-.12.77 2.38 2.1 1.37-.9 2.34.9 2.34-2.1 1.37-.77 2.38-2.5-.12L12 17.45 9.95 18.9l-2.5-.12-.77-2.38-2.1-1.37.9-2.34-.9-2.34 2.1-1.37.77-2.38 2.5.12L12 2.75Z" />
        <path d="m9.2 11.8 1.7 1.7 4-4" />
      </svg>
      <span>{label} #{value}</span>
    </span>
  );
}
