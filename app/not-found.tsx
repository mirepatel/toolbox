import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col items-center gap-3 px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Tool not found</h1>
      <p className="text-sm text-muted-foreground">
        That one isn&apos;t in the catalog. It might have moved, or it hasn&apos;t been built yet.
      </p>
      <Link href="/" className="mt-2 text-sm text-accent underline underline-offset-2">
        Back to all tools
      </Link>
    </main>
  );
}
