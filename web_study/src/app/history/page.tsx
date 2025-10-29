import { Button } from "@/src/components/ui/button";

export default function History() {
    return (
        <div className="bg-white h-[50rem] flex items-center justify-center p-6">
            <div className="text-center space-y-8 max-w-md">
        <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                History Page
            </h1>
            <p className="text-lg text-gray-600 font-medium">
                Incredible stories...
            </p>
        </div>

        <div className="pt-4">
            <Button className="bg-black text-white px-8 py-4 rounded-xl font-semibold text-lg 
                          hover:bg-gray-800 active:bg-gray-900 
                          transform hover:scale-105 active:scale-95 
                          transition-all duration-200 
                          shadow-lg hover:shadow-xl
                          focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
                History button
            </Button>
        </div>

        <div className="pt-8">
            <div className="w-24 h-1 bg-gradient-to-r from-gray-200 to-gray-300 mx-auto rounded-full"></div>
        </div>
    </div>
</div>
    )
}