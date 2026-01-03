
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import DailyView from './components/DailyView';
import WeeklyView from './components/WeeklyView';
import DevInfo from './components/DevInfo';
import CourseInfo from './components/CourseInfo';
import WelcomeModal from './components/WelcomeModal';
import { supabase } from './lib/supabase';
import { ClassSession, RoutineMetadata } from './types';
import { Loader2, Database, AlertTriangle, CloudOff } from 'lucide-react';

const STORAGE_KEYS = {
  ROUTINE: 'diu_routine_cache',
  METADATA: 'diu_metadata_cache',
  VERSION: 'diu_last_version'
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'daily' | 'weekly' | 'info'>('daily');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('routine_theme');
    return (saved as 'light' | 'dark') || 'dark';
  });
  
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [metadata, setMetadata] = useState<RoutineMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [errorState, setErrorState] = useState<{title: string, msg: string} | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('routine_theme', theme);
  }, [theme]);

  // Load cached data immediately for zero-wait UI
  useEffect(() => {
    const cachedRoutine = localStorage.getItem(STORAGE_KEYS.ROUTINE);
    const cachedMeta = localStorage.getItem(STORAGE_KEYS.METADATA);

    if (cachedRoutine) {
      setClasses(JSON.parse(cachedRoutine));
      setIsLoading(false);
    }
    if (cachedMeta) {
      setMetadata(JSON.parse(cachedMeta));
    }
  }, []);

  const fetchData = useCallback(async (isInitial = false) => {
    if (!navigator.onLine) {
      if (isInitial && !localStorage.getItem(STORAGE_KEYS.ROUTINE)) {
        setErrorState({
          title: "Offline",
          msg: "No cached data found and you are currently offline."
        });
        setIsLoading(false);
      }
      return;
    }

    if (isInitial) setIsLoading(true);
    else setIsSyncing(true);
    
    setErrorState(null);

    try {
      // 1. Fetch Metadata
      const { data: metaData, error: metaErr } = await supabase
        .from('metadata')
        .select('*')
        .order('id', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (metaErr) throw metaErr;

      if (metaData) {
        const formattedMeta: RoutineMetadata = {
          batch: metaData.batch || '69',
          section: metaData.section || 'F',
          totalCourses: metaData.total_courses || 0,
          version: metaData.version || '1.0',
          classesPerWeek: metaData.classes_per_week || 0,
          lastUpdated: metaData.last_updated ? new Date(metaData.last_updated).toLocaleDateString() : 'N/A',
          welcomeMsg: metaData.welcome_msg || 'Routine Hub is ready.'
        };
        
        setMetadata(formattedMeta);
        localStorage.setItem(STORAGE_KEYS.METADATA, JSON.stringify(formattedMeta));

        const lastSeenVersion = localStorage.getItem(STORAGE_KEYS.VERSION);
        if (lastSeenVersion && lastSeenVersion !== formattedMeta.version) {
          setShowWelcome(true);
        }
        localStorage.setItem(STORAGE_KEYS.VERSION, formattedMeta.version);
      }

      // 2. Fetch Routine
      const { data: routineData, error: routineErr } = await supabase
        .from('routine')
        .select('*');

      if (routineErr) throw routineErr;

      if (routineData) {
        const formattedRoutine: ClassSession[] = routineData.map((r: any) => ({
          id: String(r.id),
          subject: r.subject,
          code: r.code,
          teacher: r.teacher,
          teacherInitial: r.teacher_initial,
          teacherPhoto: r.teacher_photo || `https://api.dicebear.com/7.x/initials/svg?seed=${r.teacher_initial || r.teacher}`,
          startTime: r.start_time?.substring(0, 5) || '00:00',
          endTime: r.end_time?.substring(0, 5) || '00:00',
          room: r.room,
          day: r.day,
          section: r.section,
          subSection: r.sub_section,
          type: r.type,
          credits: r.credits
        }));
        
        setClasses(formattedRoutine);
        localStorage.setItem(STORAGE_KEYS.ROUTINE, JSON.stringify(formattedRoutine));
      }
    } catch (err: any) {
      console.error("Sync failed:", err);
      // Don't show error if we have cached data, just fail silently
      if (!localStorage.getItem(STORAGE_KEYS.ROUTINE)) {
        setErrorState({
          title: "Connection Error",
          msg: "Failed to load routine data from server."
        });
      }
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchData(true);
    
    // Auto sync when coming back online
    window.addEventListener('online', () => fetchData());
    return () => window.removeEventListener('online', () => fetchData());
  }, [fetchData]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-brand animate-spin" />
          <Database className="w-6 h-6 text-brand absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.4em] animate-pulse">Initializing Hub...</p>
      </div>
    );
  }

  if (errorState) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-rose-500/10 p-8 rounded-[2.5rem] border border-rose-500/20 max-w-sm w-full space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-rose-500/20 rounded-2xl flex items-center justify-center mx-auto">
            <CloudOff className="w-8 h-8 text-rose-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-white tracking-tight">{errorState.title}</h2>
            <p className="text-slate-400 text-xs leading-relaxed">{errorState.msg}</p>
          </div>
          <button 
            onClick={() => fetchData(true)}
            className="w-full py-4 bg-brand text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-brand/20 active:scale-95 transition-all"
          >
            Reconnect System
          </button>
        </div>
      </div>
    );
  }

  return (
    <Layout 
      activeView={activeView as any} 
      setActiveView={setActiveView as any}
      section={metadata?.section || 'F'}
      theme={theme}
      toggleTheme={toggleTheme}
    >
      <div className="pb-10 relative">
        {isSyncing && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 bg-brand/10 border border-brand/20 rounded-full animate-in fade-in slide-in-from-top-1">
             <RefreshCw size={10} className="text-brand animate-spin" />
             <span className="text-[8px] font-black text-brand uppercase tracking-widest">Syncing...</span>
          </div>
        )}

        {metadata && <CourseInfo metadata={metadata} classes={classes} />}

        {activeView === 'daily' && <DailyView classes={classes} />}
        {activeView === 'weekly' && <WeeklyView classes={classes} />}
        {activeView === 'info' && <DevInfo />}
      </div>

      {showWelcome && metadata && (
        <WelcomeModal 
          version={metadata.version} 
          message={metadata.welcomeMsg || "The academic schedule has been synchronized with the latest updates."} 
          onClose={() => setShowWelcome(false)} 
        />
      )}
    </Layout>
  );
};

// Re-using local import for sync icon
const RefreshCw = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
);

export default App;
