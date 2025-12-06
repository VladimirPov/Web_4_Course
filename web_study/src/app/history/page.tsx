"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { 
  History as HistoryIcon, 
  Calendar, 
  Clock, 
  ExternalLink, 
  FileText, 
  Search, 
  Filter, 
  RefreshCw, 
  Loader2,
  ChevronRight,
  Video,
  Hash,
  AlertCircle
} from "lucide-react";

interface HistoryItem {
  id: number;
  url: string;
  summary: string;
  created_at: string;
}

export default function History() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8000/api/summaries");
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} мин назад`;
    if (diffHours < 24) return `${diffHours} ч назад`;
    if (diffDays < 7) return `${diffDays} дн назад`;
    return formatDate(dateString);
  };

  const getSummaryPreview = (summary: string) => {
    return summary.length > 120 ? summary.substring(0, 120) + "..." : summary;
  };

  const filteredHistory = history.filter(item =>
    item.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h3 className="text-2xl font-semibold text-gray-900">Загружаем историю</h3>
            <p className="text-gray-600 max-w-sm">
              Получаем список всех созданных конспектов...
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
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-2 mb-4">
                <HistoryIcon className="size-4 text-amber-700" />
                <span className="text-sm font-medium text-amber-900">
                  Вся история конспектов
                </span>
              </div>
              
              <h1 className="mb-3 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                История запросов
              </h1>
              
              <p className="text-lg text-gray-600 max-w-3xl">
                Все созданные AI-конспекты в одном месте. Нажмите на любой элемент для просмотра деталей.
              </p>
            </div>
            
            <Button
              variant="outline"
              className="h-12 rounded-xl border-2 gap-2 px-6"
              onClick={fetchHistory}
            >
              <RefreshCw className="size-4" />
              Обновить
            </Button>
          </div>
        </div>

        {/* Main Content */}
        {filteredHistory.length === 0 ? (
          <Card className="border-2 border-dashed border-gray-200 bg-gradient-to-br from-gray-50 to-white">
            <CardContent className="py-16 text-center">
              <div className="inline-flex items-center justify-center size-16 rounded-full bg-amber-100 mb-6">
                <AlertCircle className="size-8 text-amber-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                {searchTerm ? "Ничего не найдено" : "История пуста"}
              </h3>
              <p className="text-gray-600 max-w-sm mx-auto mb-6">
                {searchTerm 
                  ? "Попробуйте изменить поисковый запрос"
                  : "Создайте свой первый AI-конспект видео"}
              </p>
              {!searchTerm && (
                <Link href="/">
                  <Button size="lg" className="rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-8">
                    <Video className="mr-2 size-5" />
                    Создать конспект
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            

            {/* History Table */}
            <Card className="border-2 border-gray-100 shadow-lg overflow-hidden">
              <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 p-2">
                      <HistoryIcon className="size-6 text-white" />
                    </div>
                    <div>
                      <CardDescription>
                        Все созданные конспекты отсортированы по дате
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="font-semibold text-gray-700">
                        Видео
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Конспект
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Дата создания
                      </TableHead>
                      <TableHead className="w-20 font-semibold text-gray-700">
                        Действия
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHistory.map((item) => (
                      <TableRow 
                        key={item.id} 
                        className="group border-b border-gray-100 hover:bg-blue-50/50 transition-colors"
                      >
                        
                        <TableCell className="align-middle">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="rounded bg-red-100 p-1">
                                <Video className="size-3.5 text-red-600" />
                              </div>
                              <p className="font-medium text-gray-900 truncate max-w-[300px]">
                                {item.url}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Clock className="size-3" />
                              <span>{getTimeAgo(item.created_at)}</span>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell className="align-middle">
                          <p className="text-gray-700 line-clamp-2 max-w-[400px]">
                            {getSummaryPreview(item.summary)}
                          </p>
                        </TableCell>
                        
                        <TableCell className="align-middle">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Calendar className="size-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-900">
                                {formatDate(item.created_at)}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell className="align-middle">
                          <Link href={`/history/${item.id}`}>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity rounded-lg gap-1"
                            >
                              Открыть
                              <ChevronRight className="size-3.5" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Pagination/Info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-blue-500"></div>
                <span>Показано {filteredHistory.length} записей</span>
              </div>
              
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" className="gap-2" onClick={fetchHistory}>
                  <RefreshCw className="size-3.5" />
                  Обновить список
                </Button>
                
                <Link href="/">
                  <Button size="sm" className="gap-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white">
                    <Video className="size-3.5" />
                    Новый конспект
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}