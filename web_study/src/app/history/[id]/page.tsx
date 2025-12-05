"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { useEffect, useState } from "react";

export default function HistoryItem() {
  const params = useParams();
  const id = params.id as string;
  const [detail, setDetail] = useState<{ url: string; summary: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchDetail(id);
    }
  }, [id]);

  const fetchDetail = async (summaryId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/summaries/${summaryId}`);
      const data = await response.json();
      setDetail({
        url: data.url,
        summary: data.summary,
      });
    } catch (error) {
      console.error("Error", error);
      setDetail({
        url: `http://localhost:8000/api/summaries/${summaryId}`,
        summary: "Ошибка саммаризации",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100dvh-8rem)] items-center justify-center">
        <div className="text-muted-foreground">В работе</div>
      </div>
    );
  }
    
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
          {detail?.url}
        </p>
        <p className="rounded-lg border border-border/60 bg-background p-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {detail?.summary}
        </p>
      </div>
    </div>
  );
}