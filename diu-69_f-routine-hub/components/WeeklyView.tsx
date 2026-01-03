
import React from 'react';
import { ClassSession, DayOfWeek, DAYS } from '../types';
import { Calendar, Flame, Leaf, MapPin, User, Bookmark } from 'lucide-react';

interface WeeklyViewProps {
  classes: ClassSession[];
}

const WeeklyView: React.FC<WeeklyViewProps> = ({ classes }) => {
  const timeSlots = [
    { label: '08:30-10:00', start: '08:30' },
    { label: '10:00-11:30', start: '10:00' },
    { label: '11:30-13:00', start: '11:30' },
    { label: '13:00-14:30', start: '13:00' },
    { label: '14:30-16:00', start: '14:30' }
  ];

  // Calculate Stats
  const dayStats = DAYS.map(day => ({
    day,
    count: classes.filter(c => c.day === day).length
  })).filter(d => d.day !== 'Friday');

  const busiestDay = dayStats.reduce((prev, current) => (prev.count > current.count) ? prev : current, { day: 'N/A', count: 0 });
  const lightestDay = dayStats.reduce((prev, current) => (current.count > 0 && current.count < prev.count) ? current : prev, busiestDay);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#111827] border border-slate-800 rounded-xl p-3 flex flex-col items-center text-center">
          <Calendar size={14} className="text-brand mb-1.5" />
          <p className="text-sm font-black text-white leading-none">{classes.length}</p>
          <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest mt-1">Total Classes</p>
        </div>
        <div className="bg-[#111827] border border-slate-800 rounded-xl p-3 flex flex-col items-center text-center">
          <Flame size={14} className="text-orange-500 mb-1.5" />
          <p className="text-sm font-black text-white leading-none">{busiestDay.day.substring(0,3)}</p>
          <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest mt-1">Busiest Day</p>
        </div>
        <div className="bg-[#111827] border border-slate-800 rounded-xl p-3 flex flex-col items-center text-center">
          <Leaf size={14} className="text-emerald-500 mb-1.5" />
          <p className="text-sm font-black text-white leading-none">{lightestDay.day.substring(0,3)}</p>
          <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest mt-1">Lightest Day</p>
        </div>
      </div>

      {/* Routine Grid Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden overflow-x-auto shadow-2xl scrollbar-hide">
        <table className="w-full text-left border-collapse min-w-[750px]">
          <thead>
            <tr className="bg-slate-900/80">
              <th className="p-4 text-[9px] font-black uppercase text-slate-500 border-r border-slate-800 w-24">Day</th>
              {timeSlots.map(slot => (
                <th key={slot.label} className="p-4 text-[9px] font-black uppercase text-slate-300 border-r border-slate-800 text-center">
                   {slot.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAYS.filter(d => d !== 'Friday').map((day) => (
              <tr key={day} className="border-t border-slate-800">
                <td className="p-4 font-black text-[11px] uppercase tracking-wider text-slate-400 border-r border-slate-800 bg-slate-900/30">
                  {day}
                </td>
                {timeSlots.map(slot => {
                  const sessions = classes.filter(c => c.day === day && c.startTime === slot.start);
                  
                  return (
                    <td key={slot.label} className="p-2 border-r border-slate-800 align-top">
                      <div className="space-y-2">
                        {sessions.length > 0 ? sessions.map(session => (
                          <div key={session.id} className="bg-[#1e293b] border border-slate-700/60 rounded-xl p-2.5 shadow-sm transition-all hover:bg-slate-800 group">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <div className={`w-1.5 h-1.5 rounded-full ${session.type === 'Lab' ? 'bg-emerald-500' : 'bg-brand shadow-sm shadow-brand'}`}></div>
                              <span className="text-[10px] font-black text-slate-100 uppercase truncate">
                                {session.code}({session.subSection || '69_F'})
                              </span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold bg-slate-900/40 px-1.5 py-0.5 rounded border border-slate-800/50">
                                <MapPin size={9} className="text-brand shrink-0" />
                                <span className="truncate">{session.room}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-bold px-1.5">
                                <Bookmark size={9} className="text-slate-600 shrink-0" />
                                <span className="truncate">{session.teacherInitial}</span>
                              </div>
                            </div>
                          </div>
                        )) : (
                          <div className="h-full flex items-center justify-center py-8">
                            <div className="w-4 h-[1px] bg-slate-800 rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center py-4">
         <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.5em]">Academic Performance Dashboard v2.5</p>
      </div>
    </div>
  );
};

export default WeeklyView;
