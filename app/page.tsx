import { HomeView } from "@/components/home/home-view";
import { TOOLS } from "@/lib/tools-registry";

// Server Component: the catalog is static at build time, so it's read here
// and handed to the client component that owns interactive filtering.
export default function HomePage() {
  return <HomeView tools={TOOLS} />;
}
