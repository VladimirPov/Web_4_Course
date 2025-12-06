"use client";

import { useEffect, useState } from "react";
import { Loader2, Check, X, Link, Clock, Zap, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";

interface Task {
  id: string;
  url: string;
  status: 'processing' | 'completed' | 'failed';
  summaryId?: number;
  timestamp?: string;
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
      status: 'processing',
      timestamp: new Date().toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'Europe/Moscow'
      })
    };
      
      setTasks(prev => [newTask, ...prev.slice(0, 4)]);
      setActiveTaskId(data.taskId);
      setUrl("");
    } catch (error) {
      console.error(error);
    }
  };

  const isLoading = activeTaskId !== null;

  const StatusBadge = ({ status }: { status: Task['status'] }) => {
    const config = {
      processing: { 
        label: 'Обработка', 
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <Loader2 className="size-3 animate-spin" />
      },
      completed: { 
        label: 'Готово', 
        className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        icon: <Check className="size-3" />
      },
      failed: { 
        label: 'Ошибка', 
        className: 'bg-red-100 text-red-800 border-red-200',
        icon: <X className="size-3" />
      }
    };
  };

  return (
    <div className="min-h-[calc(100dvh-8rem)] w-full px-4 py-8 md:py-12">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2">
            <Sparkles className="size-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              AI-суммаризация видео
            </span>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Суммаризация видео
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Вставьте ссылку на YouTube видео и получите краткое содержание с помощью искусственного интеллекта
          </p>
        </div>

        <Card className="relative overflow-hidden border-2 border-transparent bg-gradient-to-br from-white to-gray-50 shadow-lg transition-all duration-300 hover:shadow-xl">
          <div className="absolute right-0 top-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
          
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 p-2">
                <Link className="size-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Вставьте ссылку на видео</CardTitle>
                <CardDescription>
                  Поддерживаются ссылки на YouTube
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="relative space-y-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="flex-1">
                  <div className="relative">
                    <Input
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="h-14 rounded-xl border-2 border-gray-200 bg-white pl-12 text-base shadow-sm transition-all hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      disabled={isLoading}
                      required
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Link className="size-5 text-gray-400" />
                    </div>
                  </div>
                </div>
                
                <Button 
                  size="lg"
                  className="h-14 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 text-base font-semibold text-white shadow-lg transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-xl active:scale-[0.98]"
                  disabled={!url.trim() || isLoading}
                  type="submit"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 size-5 animate-spin" />
                      Обработка...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 size-5" />
                      Получить конспект
                    </>
                  )}
                </Button>
              </div>
            </form>

            {isLoading && (
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-blue-100 p-2">
                      <Loader2 className="size-5 animate-spin text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-900">Видео обрабатывается</p>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="flex items-center gap-2 text-sm text-blue-700">
                      <Clock className="size-4" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {tasks.length > 0 && (
          <Card className="border-2 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Clock className="size-5 text-gray-500" />
                  История задач
                </CardTitle>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="group flex items-center justify-between rounded-lg border border-gray-100 p-4 transition-all hover:border-blue-200 hover:bg-blue-50/50"
                  >
                    <div className="flex flex-1 items-center gap-4 overflow-hidden">
                      <div className="flex-shrink-0">
                        <div className={`rounded-full p-2 ${
                          task.status === 'processing' ? 'bg-blue-100' :
                          task.status === 'completed' ? 'bg-emerald-100' :
                          'bg-red-100'
                        }`}>
                          {task.status === 'processing' && <Loader2 className="size-4 animate-spin text-blue-600" />}
                          {task.status === 'completed' && <Check className="size-4 text-emerald-600" />}
                          {task.status === 'failed' && <X className="size-4 text-red-600" />}
                        </div>
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate font-medium text-gray-900">
                            {task.url}
                          </p>
                        </div>
                        {task.timestamp && (
                          <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="size-3" />
                            {task.timestamp}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {task.status === 'completed' && task.summaryId && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="ml-4 hidden transition-all group-hover:flex"
                        onClick={() => router.push(`/summarize?id=${task.summaryId}`)}
                      >
                        Открыть
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              
              {tasks.length >= 5 && (
                <div className="mt-6 rounded-lg border border-amber-100 bg-amber-50/50 p-4">
                  <div className="flex items-center gap-2 text-sm text-amber-800">
                    <Clock className="size-4" />
                    <span>Показаны последние 5 задач. Полная история доступна в профиле.</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}