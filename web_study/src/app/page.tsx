"use client";

import { useEffect, useState } from "react";
import { Loader2, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";

interface Task {
  id: string;
  url: string;
  status: 'processing' | 'completed' | 'failed';
  summaryId?: number;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!activeTaskId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/summarize?taskId=${activeTaskId}`);
        if (!res.ok) return;

        const data = await res.json();

        if (data.status === "completed" && data.summary_id) {
          setTasks(prev => prev.map(task => 
            task.id === activeTaskId 
              ? { ...task, status: 'completed', summaryId: data.summary_id }
              : task
          ));
          setActiveTaskId(null);
          clearInterval(interval);
          setTimeout(() => router.push(`/summarize?id=${data.summary_id}`), 500);
        } else if (data.status === "failed") {
          setTasks(prev => prev.map(task => 
            task.id === activeTaskId ? { ...task, status: 'failed' } : task
          ));
          setActiveTaskId(null);
          clearInterval(interval);
        }
      } catch (error) {
        console.error(error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [activeTaskId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) throw new Error("Ошибка");

      const data = await res.json();
      const newTask: Task = {
        id: data.taskId,
        url: url.substring(0, 50) + (url.length > 50 ? "..." : ""),
        status: 'processing'
      };
      
      setTasks(prev => [newTask, ...prev.slice(0, 4)]);
      setActiveTaskId(data.taskId);
      setUrl("");
    } catch (error) {
      console.error(error);
    }
  };

  const isLoading = activeTaskId !== null;

  const StatusIcon = ({ status }: { status: Task['status'] }) => {
    switch (status) {
      case 'processing': return <Loader2 className="size-4 animate-spin text-blue-500" />;
      case 'completed': return <Check className="size-4 text-green-500" />;
      case 'failed': return <X className="size-4 text-red-500" />;
    }
  };

  return (
    <div className="flex min-h-[calc(100dvh-8rem)] w-full items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-6">
        <Card className={isLoading ? "opacity-60" : ""}>
          <CardHeader>
            <CardTitle>Суммаризация видео</CardTitle>
            <p className="text-sm text-muted-foreground">
              Вставьте URL-ссылку на видео (например, YouTube)
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <form className="flex flex-col gap-4 sm:flex-row" onSubmit={handleSubmit}>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="h-11 flex-1"
                disabled={isLoading}
                required
              />
              <Button type="submit" className="h-11 sm:w-auto" disabled={!url.trim() || isLoading}>
                {isLoading ? "Обработка..." : "Суммаризовать"}
              </Button>
            </form>
            
            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                <span>Обработка видео...</span>
              </div>
            )}
          </CardContent>
        </Card>

        {tasks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Последние задачи</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-2 rounded hover:bg-muted">
                    <div className="flex items-center gap-2">
                      <StatusIcon status={task.status} />
                      <span className="text-sm truncate">{task.url}</span>
                    </div>
                    
                    {task.status === 'completed' && task.summaryId && (
                      <Button size="sm" variant="ghost" onClick={() => router.push(`/summarize?id=${task.summaryId}`)}>
                        Посмотреть
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              
              {tasks.length >= 5 && (
                <p className="text-xs text-muted-foreground mt-2">Показаны последние 5 задач</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}