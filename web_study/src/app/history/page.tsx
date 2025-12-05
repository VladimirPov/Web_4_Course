"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import Link from "next/link";
import { useEffect, useState } from "react";

interface HistoryItem {
  id: number;
  url: string;
  summary: string;
  created_at: string;
}

export default function History() {
    
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/summaries");
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100dvh-8rem)] items-center justify-center">
        <div className="text-muted-foreground">Загрузка</div>
      </div>
    );
  }

  return (
        <div className="bg-white h-[50rem] flex items-center justify-center p-6">
            <div className="text-center space-y-8 max-w-md">
        <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                История
            </h1>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Пусто
          </div>
          ) : (
        <div className="pt-4">
        <div className="rounded-xl border border-border/60">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-sm font-semibold">Краткое содержание</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((item) => (
                <TableRow key={item.id} className="bg-background">
                  <TableCell className="p-0 align-top">
                    <Link href={`/history/${item.id}`} className="block">
                      <Card className="rounded-none border-0 border-b border-border/40 gap-0 py-0 transition-colors last:border-b-0 hover:bg-muted/40">
                        <CardHeader className="space-y-1 px-4 py-3 pb-1">
                          <CardTitle className="text-sm font-medium">
                            {item.url}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-4 pt-1">
                          <p className="text-sm text-muted-foreground">
                            {item.summary}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        </div>
        )}
    </div>
</div>
    )
}