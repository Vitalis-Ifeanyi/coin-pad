import { RotateCw } from "lucide-react";

export function Spinner({ className = "", label = "Loading" }: { className?: string; label?: string }) {
  return (
    <div className={`flex items-center justify-center gap-2 text-sm text-muted ${className}`} role="status">
      <span className="size-4 animate-spin rounded-full border-2 border-line-strong border-t-fg" />
      {label}
    </div>
  );
}

export function ErrorNotice({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-down/30 bg-down-soft px-4 py-3 text-sm">
      <p className="text-fg">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 rounded-md border border-line-strong bg-surface px-2.5 py-1 font-medium hover:bg-sunken"
        >
          <RotateCw size={13} /> Retry
        </button>
      )}
    </div>
  );
}

export function Bar({ className = "" }: { className?: string }) {
  return <span className={`block animate-pulse rounded bg-sunken ${className}`} />;
}
