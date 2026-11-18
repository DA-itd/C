import React, { useState } from 'react';
import { sound } from '../utils/audio.ts';
import { 
  X, 
  Check, 
  Copy, 
  ExternalLink, 
  Terminal, 
  GitBranch, 
  Globe, 
  Sparkles,
  Zap
} from 'lucide-react';

interface VercelDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VercelDeployModal: React.FC<VercelDeployModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    sound.playHover();
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden my-8">
        {/* Top gradient highlight */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400" />

        {/* Close button */}
        <button
          onClick={() => {
            sound.playHover();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 1L24 22H0L12 1Z" />
            </svg>
          </div>
          <div>
            <h3 className="font-rajdhani text-2xl sm:text-3xl font-bold text-white tracking-wide">
              Guía de Despliegue en Vercel
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Tu portal ITD ya cuenta con archivo <span className="text-cyan-400 font-mono">vercel.json</span> preconfigurado.
            </p>
          </div>
        </div>

        {/* Method 1: Connect GitHub to Vercel (Recommended) */}
        <div className="space-y-4 mb-6">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center gap-2 text-cyan-400 font-rajdhani text-lg font-bold mb-2">
              <GitBranch className="w-5 h-5" />
              <span>Método 1: Importar directamente desde GitHub (Recomendado)</span>
            </div>
            <ol className="text-xs sm:text-sm text-slate-300 space-y-2 pl-5 list-decimal">
              <li>
                Sube o haz commit de este proyecto a tu repositorio en GitHub (por ejemplo <code className="text-cyan-300 font-mono bg-slate-900 px-1 py-0.5 rounded">github.com/DA-itd/C</code>).
              </li>
              <li>
                Entra a <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline font-semibold">vercel.com</a> e inicia sesión con tu cuenta de GitHub.
              </li>
              <li>
                Haz clic en <strong>"Add New..." → "Project"</strong> y selecciona tu repositorio.
              </li>
              <li>
                Vercel detecta automáticamente el framework (<strong>Vite</strong>) y los comandos predefinidos:
                <div className="mt-1.5 p-2.5 rounded-lg bg-slate-900 font-mono text-xs text-slate-300 space-y-1">
                  <div>Build Command: <span className="text-emerald-400">npm run build</span></div>
                  <div>Output Directory: <span className="text-emerald-400">dist</span></div>
                </div>
              </li>
              <li>
                Presiona <strong>"Deploy"</strong>. ¡En menos de 40 segundos tu portal estará disponible en tu dominio <span className="text-cyan-300 font-mono">https://tu-proyecto.vercel.app</span>!
              </li>
            </ol>
          </div>

          {/* Method 2: CLI */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 font-rajdhani text-lg font-bold mb-2">
              <Terminal className="w-5 h-5" />
              <span>Método 2: Despliegue rápido con Vercel CLI</span>
            </div>
            <p className="text-xs text-slate-400 mb-2">
              Si prefieres desplegar desde tu terminal en un solo comando:
            </p>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 font-mono text-xs text-emerald-300 border border-slate-800">
              <code>npx vercel</code>
              <button
                onClick={() => copyText('npx vercel', 'cli')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                {copiedCmd === 'cli' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-xs">Copiar</span>
              </button>
            </div>
          </div>

          {/* vercel.json info */}
          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-slate-300">
            <div className="flex items-center gap-2 font-bold text-cyan-300 mb-1">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Configuración vercel.json incluida</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Ya generamos el archivo <code className="text-cyan-300 font-mono">vercel.json</code> en la raíz del proyecto para habilitar el enrutamiento SPA sin errores 404 al recargar páginas.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between">
          <a
            href="https://vercel.com/new"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playSelect()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-rajdhani font-bold text-sm tracking-wider uppercase transition-colors shadow-lg cursor-pointer"
          >
            <span>Ir a Vercel.com</span>
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-medium transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
