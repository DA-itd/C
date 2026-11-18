import React, { useState } from 'react';
import { sound } from '../utils/audio.ts';
import { 
  X, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  FileText, 
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';

interface ModulePreviewModalProps {
  module: {
    title: string;
    code: string;
    description: string;
    url: string;
    category: string;
    isRestricted?: boolean;
  } | null;
  onClose: () => void;
}

export const ModulePreviewModal: React.FC<ModulePreviewModalProps> = ({
  module,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  if (!module) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(module.url);
    setCopied(true);
    sound.playHover();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500" />

        {/* Close Button */}
        <button
          onClick={() => {
            sound.playHover();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              {module.code}
            </span>
            <h3 className="font-rajdhani text-2xl font-bold text-white tracking-wide mt-1">
              {module.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-300 text-sm leading-relaxed mb-6">
          {module.description}
        </p>

        {/* Instruction block */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 mb-6 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Requisitos de Acceso Institucional:</span>
          </div>
          <ul className="text-xs text-slate-400 space-y-1.5 pl-6 list-disc">
            <li>Ingresar con tu correo institucional (@itdurango.edu.mx).</li>
            <li>Asegúrate de contar con tus listas de tutorados actualizadas.</li>
            <li>En caso de dudas, contacta al Coordinador de Tutorías de tu departamento.</li>
          </ul>
        </div>

        {/* URL Display */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400 mb-6 overflow-hidden">
          <span className="truncate flex-1">{module.url}</span>
          <button
            onClick={handleCopyLink}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            title="Copiar enlace directo"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <a
            href={module.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playSelect()}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-rajdhani text-base font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
          >
            <span>Abrir en nueva pestaña</span>
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-medium transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
