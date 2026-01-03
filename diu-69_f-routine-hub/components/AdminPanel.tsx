
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { RoutineMetadata, DAYS, DayOfWeek } from '../types';
import { 
  Database, 
  Plus, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Book,
  User,
  MapPin,
  FileEdit,
  Layers,
  Hash,
  Calendar,
  Sparkles,
  Zap,
  Image as ImageIcon
} from 'lucide-react';

interface AdminPanelProps {
  metadata: RoutineMetadata | null;
  onUpdate: () => void;
  onOpenScraper: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ metadata, onUpdate, onOpenScraper }) => {
  const [activeTab, setActiveTab] = useState<'routine' | 'metadata'>('routine');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Routine Form State
  const [routineForm, setRoutineForm] = useState({
    subject: '',
    code: '',
    teacher: '',
    teacher_initial: '',
    teacher_photo: '',
    start_time: '08:30',
    end_time: '10:00',
    room: '',
    day: 'Sunday' as DayOfWeek,
    type: 'Lecture',
    sub_section: '',
    section: metadata?.section || '69_F'
  });

  // Metadata Form State
  const [metaForm, setMetaForm] = useState({
    batch: metadata?.batch || '69',
    section: metadata?.section || 'F',
    version: metadata?.version || '1.0',
    welcome_msg: metadata?.welcomeMsg || 'Routine updated.',
    total_courses: metadata?.totalCourses || 6,
    classes_per_week: metadata?.classesPerWeek || 14
  });

  const handleRoutineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const { error } = await supabase
        .from('routine')
        .insert([routineForm]);

      if (error) throw error;

      setStatus({ type: 'success', message: 'Class added successfully!' });
      setRoutineForm({ 
        ...routineForm, 
        subject: '', 
        code: '', 
        sub_section: routineForm.type === 'Lab' ? routineForm.sub_section : '',
        teacher_photo: ''
      }); 
      onUpdate();
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleMetaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const { error } = await supabase
        .from('metadata')
        .insert([{
          batch: metaForm.batch,
          section: metaForm.section,
          version: metaForm.version,
          welcome_msg: metaForm.welcome_msg,
          total_courses: Number(metaForm.total_courses),
          classes_per_week: Number(metaForm.classes_per_week),
          last_updated: new Date().toISOString()
        }]);

      if (error) throw error;

      setStatus({ type: 'success', message: 'System metadata updated!' });
      onUpdate();
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-slate-900/40 p-6 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Zap size={80} className="text-brand" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="p-4 bg-brand rounded-2xl text-white shadow-lg shadow-brand/20">
              <Database size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Admin Console</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Database Management & AI Control</p>
            </div>
          </div>
          
          <button 
            onClick={onOpenScraper}
            className="flex items-center gap-3 bg-brand/10 hover:bg-brand/20 text-brand px-6 py-4 rounded-2xl border border-brand/20 transition-all group active:scale-95"
          >
            <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest">Launch AI Scraper</span>
          </button>
        </div>
      </div>

      <div className="flex p-1.5 bg-slate-900/60 rounded-2xl border border-slate-800 backdrop-blur-sm">
        <button
          onClick={() => setActiveTab('routine')}
          className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            activeTab === 'routine' ? 'bg-brand text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Manual Entry
        </button>
        <button
          onClick={() => setActiveTab('metadata')}
          className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            activeTab === 'metadata' ? 'bg-brand text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          System Config
        </button>
      </div>

      {status && (
        <div className={`p-4 rounded-2xl border flex items-center gap-3 animate-in slide-in-from-top-2 ${
          status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
        }`}>
          {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <p className="text-xs font-bold">{status.message}</p>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-xl">
        {activeTab === 'routine' ? (
          <form onSubmit={handleRoutineSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Subject Name</label>
                <div className="relative">
                  <Book className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    required
                    value={routineForm.subject}
                    onChange={e => setRoutineForm({...routineForm, subject: e.target.value})}
                    placeholder="e.g. Data Structure"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-brand transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Course Code</label>
                <div className="relative">
                  <FileEdit className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    required
                    value={routineForm.code}
                    onChange={e => setRoutineForm({...routineForm, code: e.target.value})}
                    placeholder="e.g. CSE123"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-brand transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Class Type</label>
                <div className="relative">
                  <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <select 
                    value={routineForm.type}
                    onChange={e => setRoutineForm({...routineForm, type: e.target.value, sub_section: e.target.value === 'Lecture' ? '' : routineForm.sub_section})}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-brand transition-colors appearance-none"
                  >
                    <option value="Lecture">Lecture</option>
                    <option value="Lab">Lab Session</option>
                    <option value="Workshop">Workshop</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase ml-2 transition-colors ${routineForm.type === 'Lab' ? 'text-brand' : 'text-slate-500'}`}>
                  Group / Sub-Section {routineForm.type === 'Lab' && '(Required)'}
                </label>
                <input 
                  value={routineForm.sub_section}
                  onChange={e => setRoutineForm({...routineForm, sub_section: e.target.value.toUpperCase()})}
                  placeholder="e.g. F1, F2 or General"
                  className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-2xl py-4 px-6 text-sm font-bold outline-none transition-all ${
                    routineForm.type === 'Lab' && !routineForm.sub_section 
                    ? 'border-rose-500 animate-pulse' 
                    : 'border-slate-200 dark:border-slate-800 focus:border-brand'
                  }`}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Full Teacher Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    required
                    value={routineForm.teacher}
                    onChange={e => setRoutineForm({...routineForm, teacher: e.target.value})}
                    placeholder="e.g. Dr. John Doe"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-brand transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Teacher Initial</label>
                <input 
                  required
                  value={routineForm.teacher_initial}
                  onChange={e => setRoutineForm({...routineForm, teacher_initial: e.target.value.toUpperCase()})}
                  placeholder="e.g. JDO"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:border-brand transition-colors"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Teacher Photo URL (Optional)</label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    value={routineForm.teacher_photo}
                    onChange={e => setRoutineForm({...routineForm, teacher_photo: e.target.value})}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-brand transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Day</label>
                <select 
                  value={routineForm.day}
                  onChange={e => setRoutineForm({...routineForm, day: e.target.value as DayOfWeek})}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:border-brand transition-colors"
                >
                  {DAYS.map(day => <option key={day} value={day}>{day}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Room No</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    required
                    value={routineForm.room}
                    onChange={e => setRoutineForm({...routineForm, room: e.target.value})}
                    placeholder="e.g. KT-802"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-brand transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Start Time</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    type="time"
                    required
                    value={routineForm.start_time}
                    onChange={e => setRoutineForm({...routineForm, start_time: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-brand transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2">End Time</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    type="time"
                    required
                    value={routineForm.end_time}
                    onChange={e => setRoutineForm({...routineForm, end_time: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-brand transition-colors"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-brand text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-brand/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? <RefreshCw className="animate-spin" /> : <Plus size={20} />}
              Commit Class to Database
            </button>
          </form>
        ) : (
          <form onSubmit={handleMetaSubmit} className="space-y-6">
            {/* Metadata form contents remain identical... */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Batch No</label>
                <input 
                  required
                  value={metaForm.batch}
                  onChange={e => setMetaForm({...metaForm, batch: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:border-brand transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Section</label>
                <input 
                  required
                  value={metaForm.section}
                  onChange={e => setMetaForm({...metaForm, section: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:border-brand transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Total Courses</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                  <input 
                    type="number"
                    required
                    value={metaForm.total_courses}
                    onChange={e => setMetaForm({...metaForm, total_courses: Number(e.target.value)})}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-10 pr-4 text-sm font-bold outline-none focus:border-brand transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Classes/Week</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                  <input 
                    type="number"
                    required
                    value={metaForm.classes_per_week}
                    onChange={e => setMetaForm({...metaForm, classes_per_week: Number(e.target.value)})}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-10 pr-4 text-sm font-bold outline-none focus:border-brand transition-colors"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-2">App Version</label>
              <input 
                required
                value={metaForm.version}
                onChange={e => setMetaForm({...metaForm, version: e.target.value})}
                placeholder="e.g. 9.5 Pro"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:border-brand transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Welcome Message</label>
              <textarea 
                required
                rows={4}
                value={metaForm.welcome_msg}
                onChange={e => setMetaForm({...metaForm, welcome_msg: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:border-brand transition-colors resize-none"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? <RefreshCw className="animate-spin" /> : <Save size={20} />}
              Update System Globals
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
