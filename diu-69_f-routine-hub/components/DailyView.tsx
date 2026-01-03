
import React, { useState, useMemo } from 'react';
import { ClassSession, DayOfWeek, DAYS } from '../types';
import { 
  MapPin, 
  User, 
  Coffee, 
  AlertCircle,
  Hash,
  X,
  Mail,
  MessageSquare,
  GraduationCap
} from 'lucide-react';

interface DailyViewProps {
  classes: ClassSession[];
}

interface TeacherSummary {
  initial: string;
  photo?: string;
  name: string;
}

const format12h = (time24: string): { time: string; period: string } => {
  if (!time24) return { time: '', period: '' };
  const parts = time24.split(':');
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return {
    time: `${displayHours}:${minutes.toString().padStart(2, '0')}`,
    period
  };
};

const DailyView: React.FC<DailyViewProps> = ({ classes }) => {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(() => {
    const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
    return dayName as DayOfWeek;
  });

  const [selectedTeacher, setSelectedTeacher] = useState<TeacherSummary | null>(null);

  const dailyClasses = useMemo(() => {
    return classes
      .filter(c => c.day === selectedDay)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [classes, selectedDay]);

  const dailyTeachers = useMemo(() => {
    const seen = new Set<string>();
    const teachers: TeacherSummary[] = [];
    
    dailyClasses.forEach(cls => {
      if (!seen.has(cls.teacherInitial)) {
        seen.add(cls.teacherInitial);
        teachers.push({
          initial: cls.teacherInitial,
          photo: cls.teacherPhoto,
          name: cls.teacher
        });
      }
    });
    
    return teachers;
  }, [dailyClasses]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Date Selector */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1 px-1">
        {DAYS.map((day) => {
          const isActive = day === selectedDay;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${
                isActive 
                  ? 'bg-brand text-white shadow-lg shadow-brand/20' 
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              {day.substring(0, 3)}
            </button>
          );
        })}
      </div>

      {/* Teacher Status Row */}
      {dailyTeachers.length > 0 && (
        <div className="flex justify-center items-center gap-6 py-4 bg-slate-900/20 dark:bg-slate-900/40 rounded-3xl border border-slate-100 dark:border-slate-800/60">
          {dailyTeachers.map((t) => (
            <button 
              key={t.initial} 
              onClick={() => setSelectedTeacher(t)}
              className="flex flex-col items-center gap-2 group transition-all"
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-brand to-indigo-400 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <img 
                    src={t.photo} 
                    alt={t.initial} 
                    className="w-full h-full rounded-full object-cover bg-slate-800 border-2 border-[#0f172a]"
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#0f172a] rounded-full shadow-sm"></div>
              </div>
              <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 tracking-widest uppercase group-hover:text-brand transition-colors">
                {t.initial}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Teacher Info Modal - Displays FULL name and Photo */}
      {selectedTeacher && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div 
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" 
            onClick={() => setSelectedTeacher(null)}
          />
          <div className="relative w-full max-w-sm bg-[#0f172a] border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-3xl animate-in zoom-in-95 duration-300">
            <div className="h-24 bg-gradient-to-br from-indigo-500 to-brand-dark relative">
               <button 
                onClick={() => setSelectedTeacher(null)}
                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-xl transition-colors"
               >
                 <X size={18} />
               </button>
            </div>
            
            <div className="px-6 pb-8 -mt-12 text-center">
              <div className="inline-block p-1.5 bg-[#0f172a] rounded-full mb-4 shadow-2xl">
                <img 
                  src={selectedTeacher.photo} 
                  alt={selectedTeacher.initial}
                  className="w-20 h-20 rounded-full bg-slate-800 object-cover border-2 border-slate-700"
                />
              </div>
              <h3 className="text-xl font-black text-white">{selectedTeacher.name}</h3>
              <p className="text-brand text-[10px] font-black uppercase tracking-[0.2em] mt-1 flex items-center justify-center gap-2">
                <GraduationCap size={14} /> Faculty Member
              </p>
              <p className="text-slate-500 text-[11px] mt-1 font-bold">Initial: {selectedTeacher.initial}</p>

              <div className="grid grid-cols-2 gap-3 mt-8">
                <a 
                  href={`mailto:${selectedTeacher.initial.toLowerCase()}@diu.edu.bd`}
                  className="flex flex-col items-center gap-2 p-4 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-brand/40 transition-all group"
                >
                  <div className="p-2 bg-brand/10 text-brand rounded-lg group-hover:bg-brand group-hover:text-white transition-colors">
                    <Mail size={18} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">Email</span>
                </a>
                <a 
                   href={`https://wa.me/8801700000000`} // Placeholder
                   target="_blank"
                   rel="noreferrer"
                  className="flex flex-col items-center gap-2 p-4 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all group"
                >
                  <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <MessageSquare size={18} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">WhatsApp</span>
                </a>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800/50">
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.3em]">Academic Personnel Hub</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Routine Timeline */}
      <div className="space-y-6">
        {dailyClasses.length > 0 ? (
          dailyClasses.map((cls, idx) => {
            const start = format12h(cls.startTime);
            const end = format12h(cls.endTime);
            const nextClass = dailyClasses[idx + 1];
            let breakMinutes = 0;
            if (nextClass) {
              const startParts = cls.endTime.split(':');
              const h1 = parseInt(startParts[0], 10);
              const m1 = parseInt(startParts[1], 10);
              
              const nextParts = nextClass.startTime.split(':');
              const h2 = parseInt(nextParts[0], 10);
              const m2 = parseInt(nextParts[1], 10);
              
              breakMinutes = (h2 * 60 + m2) - (h1 * 60 + m1);
            }

            return (
              <React.Fragment key={cls.id}>
                <div className="flex gap-4">
                  <div className="w-20 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 rounded-2xl p-2 shrink-0">
                    <div className="text-center mb-1">
                       <span className="text-[11px] font-black text-slate-900 dark:text-white leading-none block">{start.time}</span>
                       <span className="text-[8px] font-black text-brand uppercase tracking-tighter">{start.period}</span>
                    </div>
                    <div className="w-10 h-px bg-slate-200 dark:bg-slate-800/60 my-1"></div>
                    <div className="text-center mt-1">
                       <span className="text-[11px] font-black text-slate-400 leading-none block">{end.time}</span>
                       <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">{end.period}</span>
                    </div>
                  </div>

                  <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:border-brand/40 transition-colors group">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                         <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                              <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest ${
                                cls.type === 'Lab' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-brand/10 text-brand'
                              }`}>
                                {cls.type || 'Lecture'}
                              </span>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                 {cls.subSection || 'General'}
                              </span>
                            </div>
                         </div>
                         
                         <div className="flex flex-col items-end gap-1">
                            <div className="bg-slate-900 dark:bg-slate-800 text-white px-3 py-1.5 rounded-xl border border-slate-700 shadow-sm flex items-center gap-1.5 group-hover:bg-brand group-hover:border-brand transition-all">
                               <Hash size={10} className="text-slate-500 group-hover:text-white" />
                               <span className="text-[10px] font-black uppercase tracking-widest">{cls.code}</span>
                            </div>
                         </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight group-hover:text-brand transition-colors">
                          {cls.subject}
                        </h3>
                      </div>

                      <div className="flex items-end justify-between pt-3 border-t border-slate-50 dark:border-slate-800/40">
                         <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                               <User size={11} className="text-slate-400" />
                               {/* strictly showing INITIAL here */}
                               <span className="text-[11px] font-black text-brand tracking-[0.2em] uppercase">
                                 {cls.teacherInitial}
                               </span>
                            </div>
                         </div>
                         
                         <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-brand/5 dark:bg-brand/10 rounded-xl border border-brand/10 group-hover:bg-brand group-hover:text-white transition-all">
                            <MapPin size={10} className="text-brand group-hover:text-white" />
                            <span className="text-[10px] font-black uppercase tracking-tighter">{cls.room}</span>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>

                {breakMinutes >= 15 && (
                  <div className="flex gap-4 items-center px-4 py-2">
                    <div className="w-20 flex justify-center">
                      <div className="h-full w-px border-l border-dashed border-slate-300 dark:border-slate-700"></div>
                    </div>
                    <div className="flex-1">
                      <div className="interval-highlight rounded-2xl border-2 border-dashed border-brand/20 dark:border-brand/10 p-4 overflow-hidden relative group">
                        <div className="flex items-center justify-between relative z-10">
                          <div className="flex items-center gap-3">
                            <div className="bg-amber-500/10 p-2 rounded-xl animate-bounce">
                              <Coffee size={18} className="text-amber-500" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600 dark:text-amber-400">Duration Interval</p>
                              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{breakMinutes} Minutes Break</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })
        ) : (
          <div className="py-20 text-center space-y-3 bg-slate-50 dark:bg-slate-900/20 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <AlertCircle size={32} className="mx-auto text-slate-300" />
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No Sessions Scheduled</p>
          </div>
        )}
      </div>

      <footer className="text-center py-6 opacity-30">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Section 69_F Operations Hub</p>
      </footer>
    </div>
  );
};

export default DailyView;
