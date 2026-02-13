import type { ReactNode, SVGProps } from "react";

export type EntryShapeProps = SVGProps<SVGSVGElement>;

function BaseShape({ className, children, ...props }: EntryShapeProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function FeatureShape(props: EntryShapeProps) {
  return (
    <BaseShape {...props}>
      <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
      <path d="M12 2.5v3" />
      <path d="M12 18.5v3" />
      <path d="M2.5 12h3" />
      <path d="M18.5 12h3" />
    </BaseShape>
  );
}

export function FixShape(props: EntryShapeProps) {
  return (
    <BaseShape {...props}>
      <path d="M5 5l14 14" />
      <path d="M19 5L5 19" />
    </BaseShape>
  );
}

export function RefactorShape(props: EntryShapeProps) {
  return (
    <BaseShape {...props}>
      <rect x="5" y="5" width="10" height="10" />
      <rect x="9" y="9" width="10" height="10" />
    </BaseShape>
  );
}

export function DesignShape(props: EntryShapeProps) {
  return (
    <BaseShape {...props}>
      <rect x="7" y="7" width="10" height="10" transform="rotate(45 12 12)" fill="currentColor" stroke="none" />
    </BaseShape>
  );
}

export function JournalShape(props: EntryShapeProps) {
  return (
    <BaseShape {...props}>
      <path d="M12 4a8 8 0 1 0 0 16" />
      <path d="M12 4a8 8 0 0 1 5.7 2.3" />
    </BaseShape>
  );
}
