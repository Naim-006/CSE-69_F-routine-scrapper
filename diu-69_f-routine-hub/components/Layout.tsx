
import React, { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  Home,
  CalendarRange,
  Info,
  LayoutGrid,
  WifiOff
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: 'daily' | 'weekly' | 'info';
  setActiveView: (view: 'daily' | 'weekly' | 'info') => void;
  section: string;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView, theme, toggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const navItems = [
    { id: 'daily', label: 'Today', icon: Home },
    { id: 'weekly', label: 'Weekly', icon: CalendarRange },
    { id: 'info', label: 'About', icon: Info },
  ];

  return (
    <div className="flex flex-col min-h-screen">

      {/* Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 px-6 py-4 flex items-center justify-between ${scrolled
            ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800'
            : 'bg-transparent'
          }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white shadow-lg shadow-brand/20">
            <LayoutGrid size={18} />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">DIU Routine</h1>
            <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1.5">
              Section 69_F
              {!isOnline && (
                <span className="flex items-center gap-1 text-amber-500 font-black uppercase text-[8px] bg-amber-500/10 px-1.5 py-0.5 rounded">
                  <WifiOff size={8} /> Offline
                </span>
              )}
            </p>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </header>

      {/* Content Area */}
      <main className="flex-1 px-4 py-6 pb-24 max-w-2xl mx-auto w-full">
        {children}
      </main>

      {/* Mobile Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 px-6 pb-6 pt-3 flex items-center justify-around z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.4)]">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id as any)}
            className={`flex flex-col items-center gap-1 transition-all ${activeView === item.id ? 'text-brand' : 'text-slate-400 dark:text-slate-500'
              }`}
          >
            <item.icon size={22} strokeWidth={activeView === item.id ? 2.5 : 2} />
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default Layout;
