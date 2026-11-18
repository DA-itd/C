import React from 'react';
import { ExternalLink, ShieldCheck, Heart } from 'lucide-react';
import { sound } from '../utils/audio.ts';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-cyan-500/15 py-8 px-4 sm:px-6 bg-slate-950/85 backdrop-blur-md relative z-20 text-xs text-slate-400 mt-auto pointer-events-auto">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <p className="text-slate-300">
            © 2026 Aplicación desarrollada en la{' '}
            <strong className="text-white font-semibold">
              Coordinación de Actualización Docente
            </strong>
          </p>
          <p className="text-slate-400 mt-0.5">
            Instituto Tecnológico de Durango ·{' '}
            <span className="text-cyan-400 font-medium">Alejandro Calderón Rentería</span>
          </p>
          <p className="text-slate-500 text-[11px] mt-0.5">
            Todos los derechos reservados · Rumbo al SGI Norma ISO 9001:2026 · TecNM
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
          <a
            href="https://www.itdurango.edu.mx/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playHover()}
            className="text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Portal Oficial ITD</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <span className="text-slate-700">|</span>
          <a
            href="https://www.tecnm.mx/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playHover()}
            className="text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>TecNM</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <span className="text-slate-700">|</span>
          <span className="text-slate-500">
            Experiencia 3D con Three.js
          </span>
        </div>
      </div>
    </footer>
  );
};
