
import React from 'react';
import { Github, Linkedin, Mail, Twitter, Terminal, Code2, Cpu } from 'lucide-react';

const DevInfo: React.FC = () => {
  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase">
          <Terminal size={14} /> System Architect
        </div>
        <h2 className="text-4xl md:text-5xl font-black tracking-tight">Meet the Developer</h2>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Crafting modern digital experiences with a focus on accessibility, speed, and intelligence for the DIU student community.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="glass rounded-3xl p-8 border dark:border-slate-800 space-y-6">
          <div className="flex items-center gap-6">
            <img 
              src="https://picsum.photos/seed/dev/200/200" 
              alt="Developer" 
              className="w-24 h-24 rounded-2xl object-cover shadow-xl border-4 border-white dark:border-slate-700"
            />
            <div>
              <h3 className="text-2xl font-bold">Your Name Here</h3>
              <p className="text-indigo-600 dark:text-indigo-400 font-medium">Software Engineer @ DIU</p>
              <div className="flex gap-3 mt-3">
                <a href="#" className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:text-indigo-600 transition-colors"><Github size={18} /></a>
                <a href="#" className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:text-indigo-600 transition-colors"><Linkedin size={18} /></a>
                <a href="#" className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:text-indigo-600 transition-colors"><Twitter size={18} /></a>
              </div>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            I build software that matters. This Routine Hub was designed specifically for Section 69_F to solve the headache of missing classes or looking up messy PDF files.
          </p>
          <div className="pt-4 border-t dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Tech Stack Used</h4>
            <div className="flex flex-wrap gap-2">
              {['React 18', 'TypeScript', 'Tailwind CSS', 'Gemini AI', 'Lucide Icons', 'Vite'].map(tech => (
                <span key={tech} className="bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 px-3 py-1 rounded-md text-[10px] font-bold">{tech}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-6 border dark:border-slate-800 flex items-start gap-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl">
              <Code2 size={24} />
            </div>
            <div>
              <h4 className="font-bold mb-1">Clean Architecture</h4>
              <p className="text-xs text-slate-500">Separation of concerns using modern React hooks and functional components.</p>
            </div>
          </div>
          <div className="glass rounded-2xl p-6 border dark:border-slate-800 flex items-start gap-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl">
              <Cpu size={24} />
            </div>
            <div>
              <h4 className="font-bold mb-1">AI Integrated</h4>
              <p className="text-xs text-slate-500">Harnessing Gemini 3.0 Flash for natural language processing of routines.</p>
            </div>
          </div>
          <div className="glass rounded-2xl p-6 border dark:border-slate-800 flex items-start gap-4">
            <div className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-xl">
              <Mail size={24} />
            </div>
            <div>
              <h4 className="font-bold mb-1">Support & Feedback</h4>
              <p className="text-xs text-slate-500">Drop a mail at dev@diu.edu.bd for feature requests or bug reports.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevInfo;
