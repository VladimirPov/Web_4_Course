"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Copy, ExternalLink, RefreshCw, Check, Loader2, Video, FileText, Clock, Share2 } from "lucide-react";

export default function Summarize() {
    const [url, setUrl] = useState("");
    const [generatedSummary, setSummary] = useState("");
    const [loading, setLoading] = useState(true);
    const [copySuccess, setCopySuccess] = useState(false);
    const [summaryLength, setSummaryLength] = useState(0);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        fetchLatestSummary();
    }, [searchParams]);

    const fetchLatestSummary = async () => {
        try {
            setLoading(true);
            
            const params = new URLSearchParams(window.location.search);
            const id = params.get("id");
            
            let apiUrl = "http://localhost:8000/api/summaries/latest";
            if (id) {
                apiUrl = `http://localhost:8000/api/summaries/${id}`;
            }
            
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
              setUrl("https://youtu.be/example");
              setSummary("Пожалуйста, введите ссылку на странице суммаризации.");  
            }
            else {
              const data = await response.json();
              setUrl(data.url);
              setSummary(data.summary);
              setSummaryLength(data.summary?.length || 0);
            }
        } catch (error) {
            console.error("Ошибка:", error);
            
            setUrl("https://youtu.be/example");
            setSummary("Не удалось загрузить суммаризацию. Пожалуйста, проверьте ссылку и попробуйте снова.");
        } finally {
            setLoading(false);
        }
    }

    const handleCopySummary = async () => {
        try {
            await navigator.clipboard.writeText(generatedSummary);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Ошибка копирования:', err);
        }
    };

    const handleOpenVideo = () => {
        if (url) {
            window.open(url, '_blank');
        }
    };

    const getReadTime = () => {
        const words = generatedSummary.split(/\s+/).length;
        const readingSpeed = 200; // слов в минуту
        return Math.ceil(words / readingSpeed);
    };

    if (loading) {
        return (
            <div className="min-h-[calc(100dvh-8rem)] w-full flex items-center justify-center">
                <div className="text-center space-y-6">
                    <div className="relative">
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                            <Loader2 className="size-8 animate-spin text-blue-600" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-gray-900">Анализируем видео</h3>
                        <p className="text-gray-600 max-w-sm">
                            ИИ обрабатывает контент и создает краткое содержание...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100dvh-8rem)] w-full bg-gradient-to-b from-gray-50 to-white py-8 px-4">
            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-10 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-100 to-blue-100 px-4 py-2 mb-4">
                        <FileText className="size-4 text-emerald-700" />
                        <span className="text-sm font-medium text-emerald-900">
                            Конспект готов
                        </span>
                    </div>
                    
                    <h1 className="mb-3 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        AI-конспект видео
                    </h1>
                    
                    <p className="mx-auto max-w-2xl text-lg text-gray-600">
                        Искусственный интеллект проанализировал видео и выделил ключевые моменты
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Main Content - Summary */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-2 border-gray-100 shadow-xl overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500" />
                            
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 p-2">
                                            <FileText className="size-6 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl">Краткое содержание</CardTitle>
                                            <CardDescription>
                                                Ключевые идеи и основные моменты видео
                                            </CardDescription>
                                        </div>
                                    </div>
                                    
                                </div>
                            </CardHeader>
                            
                            <CardContent className="pt-0">
                                <div className="prose prose-lg max-w-none">
                                    <div className="rounded-xl border border-gray-200 bg-white p-6">
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                            {generatedSummary}
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
                                <div className="flex flex-col gap-4 sm:flex-row">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <Input
                                                value={url}
                                                onChange={(ev) => setUrl(ev.target.value)}
                                                className="h-12 rounded-xl border-2 border-gray-200 bg-white pl-12 pr-4"
                                                placeholder="Ссылка на видео"
                                                disabled={true}
                                            />
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                                <Video className="size-5 text-gray-400" />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <Button
                                            size="lg"
                                            variant="outline"
                                            className="h-12 rounded-xl border-2"
                                            onClick={handleOpenVideo}
                                            disabled={!url}
                                        >
                                            <ExternalLink className="mr-2 size-4" />
                                            Открыть
                                        </Button>
                                        
                                        <Button
                                            size="lg"
                                            className="h-12 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 text-white"
                                            onClick={handleCopySummary}
                                        >
                                            {copySuccess ? (
                                                <>
                                                    <Check className="mr-2 size-4" />
                                                    Скопировано
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="mr-2 size-4" />
                                                    Копировать
                                                </>
                                            )}
                                        </Button>
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
                                <CardTitle className="text-lg">Статистика</CardTitle>
                            </CardHeader>
                            
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-blue-100 p-2">
                                            <FileText className="size-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Символов</p>
                                            <p className="text-2xl font-bold text-gray-900">{summaryLength}</p>
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
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="mt-10 text-center">
                    <div className="inline-flex items-center gap-4">
                        <Button
                            size="lg"
                            className="rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 px-8 text-white"
                            onClick={() => router.push("/")}
                        >
                            <Video className="mr-2 size-5" />
                            Создать новый конспект
                        </Button>
                        
                        <Button
                            size="lg"
                            variant="outline"
                            className="rounded-xl border-2 px-8"
                            onClick={fetchLatestSummary}
                        >
                            <RefreshCw className="mr-2 size-5" />
                            Обновить
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}