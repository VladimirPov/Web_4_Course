"use client"

import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { useState } from "react"

export default function Summarize() {
    const [url, setUrl] = useState("")
    return (
        <div className="bg-white h-[50rem] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-semibold text-gray-900 mb-2">Summarize Page</h1>
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

                    <Button 
                        className="w-full bg-black text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-800 active:bg-gray-900 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:outline-none"
                    >
                        Summarize
                    </Button>
                </div>
            </div>
        </div>
)}