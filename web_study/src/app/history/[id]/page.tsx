import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/src/components/ui/button";

type HistoryItemPageProps = {
  params: Promise<{ id: string }>;
};

const mockSummaries: Record<string, { url: string; summary: string }> = {
  "1": {
    url: "https://youtu.be/design-talk",
    summary: "Short recap of the design talk video.",
  },
  "2": {
    url: "https://youtu.be/product-update",
    summary: "Quick notes from the product update clip.",
  },
  "3": {
    url: "https://youtu.be/podcast-ep",
    summary: "One-line summary of the podcast episode.",
  },
};

export default async function HistoryItem({params}: {
  params: Promise<{ id: string }>
}) {
    const { id } = await params
    const detail = mockSummaries[id] ?? {
    url: "https://youtu.be/example",
    summary: "*Summary*.",
    };
    return (
    <div className="flex min-h-[calc(100dvh-8rem)] w-full items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl space-y-6">
        <Button variant="ghost" size="sm" asChild className="gap-2 w-fit">
          <Link href="/history">
            <ArrowLeft className="size-4" aria-hidden />
            Назад
          </Link>
        </Button>

        <p className="rounded-lg border border-dashed border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground sm:text-base">
          <span className="font-semibold text-foreground">URL:</span>
          <br />
          {detail.url}
        </p>
        <p className="rounded-lg border border-border/60 bg-background p-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {detail.summary}
        </p>
      </div>
    </div>
  );
}