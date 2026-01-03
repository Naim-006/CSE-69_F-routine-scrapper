
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Crown, Download, BookOpen, X, Phone, Mail, MessageSquare } from 'lucide-react';
import { RoutineMetadata, ClassSession } from '../types';
import { CR_DATA } from '../constants';

interface CourseInfoProps {
  metadata: RoutineMetadata;
  classes: ClassSession[];
}

const CourseInfo: React.FC<CourseInfoProps> = ({ metadata, classes }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCRInfo, setShowCRInfo] = useState(false);

  // Extract unique courses from classes list
  const uniqueCourses = Array.from(new Set(classes.map(c => c.code))).map(code => {
    const cls = classes.find(c => c.code === code);
    return { name: cls?.subject || 'Unknown', code: code };
  });

  return (
    <div className="mb-6 relative">
      <div className="overflow-hidden rounded-2xl bg-[#0f172a] border border-slate-800 shadow-xl transition-all duration-300">
        <div className="w-full flex items-center justify-between p-4 bg-slate-900/40">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-3 text-slate-200 hover:text-white transition-colors flex-1"
          >
            <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-0' : '-rotate-90'}`}>
              <ChevronDown size={20} className="text-brand" />
            </div>
            <span className="text-sm font-bold tracking-tight">Enrolled Courses</span>
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowCRInfo(true);
            }}
            className="flex items-center gap-2 bg-brand/20 px-3 py-1.5 rounded-lg border border-brand/30 hover:bg-brand/30 active:scale-95 transition-all group"
          >
            <Crown size={14} className="text-brand group-hover:rotate-12 transition-transform" />
            <span className="text-[10px] font-black text-brand uppercase tracking-widest">CR</span>
          </button>
        </div>

        {isExpanded && (
          <div className="p-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-1 gap-2 text-[13px]">
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-500 font-medium">Batch</span>
                <span className="text-slate-200 font-bold">{metadata.batch}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-500 font-medium">Section</span>
                <span className="text-slate-200 font-bold">{metadata.section}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-500 font-medium">Total Courses</span>
                <span className="text-slate-200 font-bold">{uniqueCourses.length}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-500 font-medium">Routine Version</span>
                <span className="text-slate-200 font-bold">{metadata.version}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-500 font-medium">Classes per Week</span>
                <span className="text-slate-200 font-bold">{classes.length}</span>
              </div>
            </div>

            <div className="flex items-center justify-between py-2 px-3 bg-slate-900/50 rounded-xl border border-slate-800">
              <span className="text-xs font-medium text-slate-400 italic">Download PDF for {metadata.batch}_{metadata.section}</span>
              <button className="p-2 bg-brand/80 text-white rounded-lg hover:bg-brand transition-colors shadow-lg shadow-brand/20">
                <Download size={16} />
              </button>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-2">Subject Directory</h4>
              {uniqueCourses.map((course, idx) => (
                <div key={idx} className="flex justify-between items-center group bg-slate-900/20 p-2 rounded-lg border border-transparent hover:border-slate-800 transition-all">
                  <span className="text-sm font-semibold text-slate-300 group-hover:text-brand transition-colors truncate max-w-[200px]">{course.name}</span>
                  <span className="text-[11px] font-black text-slate-100 bg-slate-800 px-2 py-0.5 rounded shadow-sm">{course.code}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CR Info Modal */}
      {showCRInfo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div 
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" 
            onClick={() => setShowCRInfo(false)}
          />
          <div className="relative w-full max-w-sm bg-[#0f172a] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            {/* Header / Background Pattern */}
            <div className="h-24 bg-gradient-to-br from-brand to-brand-dark relative">
               <button 
                onClick={() => setShowCRInfo(false)}
                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-xl transition-colors"
               >
                 <X size={18} />
               </button>
            </div>
            
            {/* Profile Section */}
            <div className="px-6 pb-8 -mt-12 text-center">
              <div className="inline-block p-1.5 bg-[#0f172a] rounded-full mb-4">
                <img 
                  src={CR_DATA.photo} 
                  alt={CR_DATA.name}
                  className="w-20 h-20 rounded-full bg-slate-800 object-cover"
                />
              </div>
              <h3 className="text-xl font-black text-white">{CR_DATA.name}</h3>
              <p className="text-brand text-xs font-black uppercase tracking-[0.2em] mt-1">Section Coordinator</p>
              <p className="text-slate-500 text-[11px] mt-1 font-bold">ID: {CR_DATA.id}</p>

              <div className="grid grid-cols-3 gap-3 mt-8">
                <a 
                  href={`tel:${CR_DATA.phone}`}
                  className="flex flex-col items-center gap-2 p-3 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-brand/40 transition-all group"
                >
                  <div className="p-2 bg-brand/10 text-brand rounded-lg group-hover:bg-brand group-hover:text-white transition-colors">
                    <Phone size={18} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">Call</span>
                </a>
                <a 
                  href={CR_DATA.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center gap-2 p-3 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all group"
                >
                  <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <MessageSquare size={18} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">WhatsApp</span>
                </a>
                <a 
                  href={`mailto:${CR_DATA.email}`}
                  className="flex flex-col items-center gap-2 p-3 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-brand-light/40 transition-all group"
                >
                  <div className="p-2 bg-brand-light/10 text-brand-light rounded-lg group-hover:bg-brand-light group-hover:text-white transition-colors">
                    <Mail size={18} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">Email</span>
                </a>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800/50">
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.3em]">Official Contact Personnel</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseInfo;
