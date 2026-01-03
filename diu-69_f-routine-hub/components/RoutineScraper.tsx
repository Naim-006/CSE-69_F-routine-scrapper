
import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { supabase } from '../lib/supabase';
import { 
  Sparkles, 
  Upload, 
  FileText, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Terminal,
  BrainCircuit,
  Database
} from 'lucide-react';

interface RoutineScraperProps {
  onComplete: () => void;
}

const RoutineScraper: React.FC<RoutineScraperProps> = ({ onComplete }) => {
  const [inputMode, setInputMode] = useState<'text' | 'image'>('text');
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleAIScrape = async () => {
    if (!inputText && inputMode === 'text') return;
    
    setIsProcessing(true);
    setStatus(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const prompt = `Extract university class routine data from the following text. 
      Return an ARRAY of objects with these exact keys:
      - subject (string)
      - code (string, e.g. CSE123)
      - teacher (string, full name)
      - teacher_initial (string, e.g. ABC)
      - start_time (string, HH:mm format, 24h)
      - end_time (string, HH:mm format, 24h)
      - room (string, e.g. KT-802)
      - day (string, e.g. Sunday)
      - type (string, "Lecture" or "Lab")
      - section (string, e.g. 69_F)
      - sub_section (string, if Lab then F1/F2, else null)

      TEXT TO PARSE:
      ${inputText}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                subject: { type: Type.STRING },
                code: { type: Type.STRING },
                teacher: { type: Type.STRING },
                teacher_initial: { type: Type.STRING },
                start_time: { type: Type.STRING },
                end_time: { type: Type.STRING },
                room: { type: Type.STRING },
                day: { type: Type.STRING },
                type: { type: Type.STRING },
                section: { type: Type.STRING },
                sub_section: { type: Type.STRING, nullable: true },
              },
              required: ['subject', 'code', 'teacher', 'teacher_initial', 'start_time', 'end_time', 'room', 'day', 'section']
            }
          }
        }
      });

      const extractedData = JSON.parse(response.text || '[]');
      
      if (extractedData.length === 0) {
        throw new Error("No classes found in the provided text.");
      }

      // Batch insert to Supabase
      const { error } = await supabase
        .from('routine')
        .insert(extractedData);

      if (error) throw error;

      setStatus({ 
        type: 'success', 
        message: `Successfully parsed and saved ${extractedData.length} classes!` 
      });
      
      setTimeout(onComplete, 2000);

    } catch (err: any) {
      console.error("Scraper Error:", err);
      setStatus({ 
        type: 'error', 
        message: err.message || "Failed to process routine. Check input format." 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-xl mx-auto">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-brand/10 text-brand px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
          <BrainCircuit size={14} /> AI Powered
        </div>
        <h2 className="text-3xl font-black text-white">Smart Scraper</h2>
        <p className="text-slate-500 text-sm">Paste your routine text or PDF content and let Gemini handle the rest.</p>
      </div>

      <div className="bg-[#0f172a] border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
        {/* Animated Background Element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 blur-3xl rounded-full -mr-16 -mt-16" />
        
        <div className="space-y-6 relative z-10">
          <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800">
            <button 
              onClick={() => setInputMode('text')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${inputMode === 'text' ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-slate-500'}`}
            >
              <FileText size={14} /> Text Input
            </button>
            <button 
              disabled // Future feature
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-700 cursor-not-allowed"
            >
              <Upload size={14} /> Upload Image
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-2 flex items-center gap-2">
              Routine Data Input <Sparkles size={10} className="text-brand" />
            </label>
            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste routine text here... (e.g. Sunday 8:30-10:00 PHY102 KT-219 AAR)"
              className="w-full h-48 bg-slate-950 border border-slate-800 rounded-3xl p-6 text-sm font-medium text-slate-300 outline-none focus:border-brand transition-all resize-none shadow-inner"
            />
          </div>

          {status && (
            <div className={`p-4 rounded-2xl border flex items-center gap-3 animate-in slide-in-from-top-2 ${
              status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
            }`}>
              {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <p className="text-[11px] font-bold">{status.message}</p>
            </div>
          )}

          <button 
            onClick={handleAIScrape}
            disabled={isProcessing || !inputText}
            className="w-full bg-brand text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-brand/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 group"
          >
            {isProcessing ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>AI Thinking...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
                <span>Process & Save</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-slate-900/40 p-6 rounded-3xl border border-dashed border-slate-800 text-center space-y-2">
         <div className="flex justify-center gap-2 mb-2">
            <Database size={16} className="text-slate-700" />
            <Terminal size={16} className="text-slate-700" />
         </div>
         <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-relaxed">
           Data is processed via Gemini 3 Flash. Ensure days and times are clearly visible for best results.
         </p>
      </div>
    </div>
  );
};

export default RoutineScraper;
