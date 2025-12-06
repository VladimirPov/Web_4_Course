"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"

export default function Summarize() {
    const [url, setUrl] = useState("");
    const [generatedSummary, setSummary] = useState("");
    const [loading, setLoading] = useState(true);
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
        throw new Error("Не удалось загрузить суммаризацию");
      }
      
      const data = await response.json();
      setUrl(data.url);
      setSummary(data.summary);
      
    } catch (error) {
      console.error("Ошибка:", error);
      
      setUrl("https://youtu.be/example");
      setSummary("Не удалось загрузить суммаризацию");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[calc(100dvh-8rem)] w-full items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-2 text-muted-foreground">В работе</p>
        </div>
      </div>
    );
  }
    return (
        <div className="bg-white h-[50rem] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-semibold text-gray-900 mb-2">Результат</h1>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                    <div className="mb-6">
                        <Input
                            value={url}
                            onChange={(ev)=>{
                            setUrl(ev.target.value)
                            }}
                        />
                    </div>
                    <div className="bg-white p-8 border border-gray-100">
                        <p className="text-lg text-gray-600 font-medium">
                            {generatedSummary}
                        </p>
                    </div>
                </div>
            </div>
        </div>
)}