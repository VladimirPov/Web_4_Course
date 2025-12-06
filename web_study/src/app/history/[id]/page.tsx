"use client";

import Link from "next/link";
import { ArrowLeft, Copy, ExternalLink, FileText, Video, Calendar, Clock, Loader2, Check, Share2, RefreshCw } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { useEffect, useState } from "react";

interface HistoryDetail {
  url: string;
  summary: string;
  created_at?: string;
  id?: number;
}

export default function HistoryItem() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [detail, setDetail] = useState<HistoryDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (id) {
      fetchDetail(id);
    }
  }, [id]);

  const fetchDetail = async (summaryId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/api/summaries/${summaryId}`);
      const data = await response.json();
      setDetail({
        url: data.url,
        summary: data.summary,
        created_at: data.created_at,
        id: data.id
      });
    } catch (error) {
      console.error("Error", error);
      setDetail({
        url: `ID: ${summaryId}`,
        summary: "Не удалось загрузить конспект. Пожалуйста, проверьте подключение и попробуйте снова.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySummary = async () => {
    if (!detail?.summary) return;
    
    try {
      await navigator.clipboard.writeText(detail.summary);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Ошибка копирования:', err);
    }
  };

  const handleOpenVideo = () => {
    if (detail?.url && detail.url.startsWith('http')) {
      window.open(detail.url, '_blank');
    }
  };

  const getReadTime = () => {
    if (!detail?.summary) return 0;
    const words = detail.summary.split(/\s+/).length;
    const readingSpeed = 200; // слов в минуту
    return Math.ceil(words / readingSpeed);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Дата не указана";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100dvh-8rem)] w-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Loader2 className="size-10 animate-spin text-blue-600" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold text-gray-900">Загружаем конспект</h3>
            <p className="text-gray-600 max-w-sm">
              Получаем детальную информацию о выбранном конспекте...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100dvh-8rem)] w-full bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
            <div className="space-y-4">
              <Button 
                variant="ghost" 
                size="sm" 
                asChild 
                className="gap-2 w-fit hover:bg-gray-100 rounded-lg"
              >
                <Link href="/history">
                  <ArrowLeft className="size-4" />
                  Назад к истории
                </Link>
              </Button>
              
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-2 mb-4">
                  <FileText className="size-4 text-purple-700" />
                  <span className="text-sm font-medium text-purple-900">
                    Детальный просмотр конспекта
                  </span>
                </div>
                
                <h1 className="mb-3 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                  Конспект{" "}
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    #{detail?.id || id}
                  </span>
                </h1>
                
                <p className="text-lg text-gray-600 max-w-3xl">
                  Полная версия AI-конспекта с детальной информацией
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="h-12 rounded-xl border-2 gap-2 px-6"
                onClick={() => fetchDetail(id)}
              >
                <RefreshCw className="size-4" />
                Обновить
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content - Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary Card */}
            <Card className="border-2 border-gray-100 shadow-xl overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500" />
              
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 p-2">
                      <FileText className="size-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Полный конспект</CardTitle>
                      <CardDescription>
                        Детальное содержание видео
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {detail?.summary}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Video URL Card */}
            <Card className="border-2 border-gray-100">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-red-100 p-2">
                    <Video className="size-5 text-red-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Исходное видео</CardTitle>
                    <CardDescription>
                      Ссылка на оригинальное видео
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex-shrink-0 rounded bg-red-100 p-2">
                          <Video className="size-4 text-red-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {detail?.url}
                          </p>
                          <p className="text-xs text-gray-500">
                            Оригинальный источник
                          </p>
                        </div>
                      </div>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="ml-4 flex-shrink-0 gap-2"
                        onClick={handleOpenVideo}
                        disabled={!detail?.url?.startsWith('http')}
                      >
                        <ExternalLink className="size-4" />
                        Открыть
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <Calendar className="size-4" />
                        Дата создания
                      </div>
                      <p className="font-medium text-gray-900">
                        {formatDate(detail?.created_at)}
                      </p>
                    </div>
                    
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <FileText className="size-4" />
                        Идентификатор
                      </div>
                      <p className="font-medium text-gray-900 font-mono">
                        #{detail?.id || id}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Stats & Actions */}
          <div className="space-y-6">
            {/* Stats Card */}
            <Card className="border-2 border-gray-100 bg-gradient-to-b from-white to-gray-50">
              <CardHeader>
                <CardTitle className="text-lg">Статистика конспекта</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-100 p-2">
                      <FileText className="size-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Символов</p>
                      <p className="text-2xl font-bold text-gray-900">{detail?.summary?.length || 0}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-emerald-100 p-2">
                      <Clock className="size-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Время чтения</p>
                      <p className="text-2xl font-bold text-gray-900">{getReadTime()} мин</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-purple-100 p-2">
                      <Calendar className="size-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Слов</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {detail?.summary ? detail.summary.split(/\s+/).length : 0}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
          <Link href="/history">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="size-4" />
              Вернуться к истории
            </Button>
          </Link>
          
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => fetchDetail(id)}
            >
              <RefreshCw className="size-4" />
              Обновить
            </Button>
            
            <Link href="/">
              <Button className="gap-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white">
                <Video className="size-4" />
                Новый конспект
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}