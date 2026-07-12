export function Footer() {
  return (
    <footer className="border-t border-border px-5 py-8 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
        <span>© {new Date().getFullYear()} Toolbox — built for people who ship.</span>
        <span className="text-neutral-400 dark:text-neutral-600">No ads. No tracking pixels. Just tools.</span>
      </div>
    </footer>
  );
}
