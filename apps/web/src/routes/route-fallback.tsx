export function RouteFallback() {
  return (
    <main
      id="main-content"
      className="flex min-h-[50vh] items-center justify-center px-6"
      aria-busy="true"
      aria-label="Loading page"
    >
      <p className="text-sm font-medium text-[var(--km-muted)]">Loading…</p>
    </main>
  );
}
