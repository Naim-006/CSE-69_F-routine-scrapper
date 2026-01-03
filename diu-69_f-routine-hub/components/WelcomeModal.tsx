
import React from 'react';
import { X, PartyPopper, ArrowRight } from 'lucide-react';

interface WelcomeModalProps {
  version: string;
  message: string;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ version, message, onClose }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-sm bg-[#0f172a] border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-3xl animate-in zoom-in-95 duration-500">
        {/* Animated Gradient Header */}
        <div className="h-32 bg-gradient-to-br from-brand via-indigo-500 to-purple-600 flex items-center justify-center relative">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,#fff,transparent)]" />
          <PartyPopper size={48} className="text-white animate-bounce" />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 text-white rounded-full hover:bg-black/40 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 text-center space-y-6">
          <div className="space-y-2">
            <div className="inline-block px-3 py-1 bg-brand/10 border border-brand/20 rounded-full">
              <span className="text-[10px] font-black text-brand uppercase tracking-widest">Update v{version}</span>
            </div>
            <h2 className="text-2xl font-black text-white">Routine Updated!</h2>
            <p className="text-slate-400 text-sm leading-relaxed px-2">
              {message}
            </p>
          </div>

          <button 
            onClick={onClose}
            className="w-full bg-brand text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 group transition-all hover:bg-brand-dark shadow-xl shadow-brand/20"
          >
            Got it <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
