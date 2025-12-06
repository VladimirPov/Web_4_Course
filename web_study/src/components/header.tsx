import Link from "next/link";

export const Header = () => {
  return (
<header className="bg-gray-900 text-white p-4 border-b-2 border-purple-500">
        <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-8">
                <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent">
                    Cool App
                </h1>
                <nav className="flex space-x-4">
                    <a href="/" className="nav-btn">
                        Суммаризация
                    </a>
                    <a href="/summarize" className="nav-btn">
                        Результат
                    </a>
                    <a href="/history" className="nav-btn">
                        История
                    </a>
                </nav>
            </div>
        </div>
    </header>
  );
};