import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getToolBySlug, TOOLS } from "@/lib/tools-registry";
import { toolComponents } from "@/lib/tool-components";
import { ToolPageHeader } from "@/components/tools/tool-page-header";
import { ComingSoon } from "@/components/tools/coming-soon";

export function generateStaticParams() {
  return TOOLS.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};

  return {
    title: tool.name, // root layout's title template appends "— Toolbox"
    description: tool.description,
    alternates: { canonical: `/tools/${tool.slug}` },
    openGraph: {
      title: `${tool.name} — Toolbox`,
      description: tool.description,
      url: `/tools/${tool.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.name} — Toolbox`,
      description: tool.description,
    },
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const ToolComponent = toolComponents[tool.slug];

  return (
    <main className="mx-auto max-w-4xl px-5 py-10 sm:px-6">
      <ToolPageHeader tool={tool} />
      {ToolComponent ? <ToolComponent /> : <ComingSoon tool={tool} />}
    </main>
  );
}
