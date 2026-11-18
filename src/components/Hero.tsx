import React from 'react';
import { ViewMode } from '../types.ts';
import { sound } from '../utils/audio.ts';
import { Compass, GraduationCap, BookOpen, Layers } from 'lucide-react';

interface HeroProps {
  viewMode: ViewMode;
  onToggleViewMode: (mode: ViewMode) => void;
  onScrollToCards: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  viewMode,
  onToggleViewMode,
  onScrollToCards
}) => {
  return (
    <section className="relative pt-12 pb-8 sm:pt-16 sm:pb-12 text-center px-4 max-w-5xl mx-auto z-10 pointer-events-auto">
      {/* Pill status badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-teal-400/30 bg-teal-500/10 text-teal-300 font-rajdhani text-xs tracking-widest uppercase mb-6 backdrop-blur-sm shadow-sm">
        <span className="w-2 h-2 rounded-full bg-teal-400 inline-block" />
        <span>Servicios en línea disponibles · Periodo Escolar 2026</span>
      </div>

      {/* Main Title */}
      <h2 className="font-rajdhani text-4xl sm:text-6xl font-extrabold tracking-wide text-white leading-tight mb-4">
        Plataforma de <br className="hidden sm:inline" />
        <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
          Acceso a Servicios
        </span>
      </h2>

      {/* Subtitle */}
      <p className="text-slate-300/90 text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-7">
        Acceso centralizado a los sistemas institucionales del Instituto Tecnológico de Durango.
      </p>

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => {
            sound.playSelect();
            onToggleViewMode('space3d');
          }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-rajdhani text-base font-bold tracking-wider uppercase transition-all shadow-lg hover:shadow-cyan-500/25 transform hover:-translate-y-0.5 cursor-pointer"
        >
          <Compass className="w-5 h-5 text-slate-950" />
          <span>Experiencia 3D Inmersiva</span>
        </button>

        <button
          onClick={() => {
            sound.playHover();
            onScrollToCards();
          }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 text-slate-200 hover:text-white border border-slate-700/80 font-rajdhani text-base font-bold tracking-wider uppercase transition-all backdrop-blur-sm cursor-pointer"
        >
          <Layers className="w-5 h-5 text-cyan-400" />
          <span>Explorar Módulos</span>
        </button>
      </div>

      {/* Highlights / Quick specs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mt-10 pt-6 border-t border-slate-800/80">
        <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm text-left">
          <div className="text-[11px] text-slate-400 font-medium">ITD-AC-PO-04-03</div>
          <div className="text-sm font-bold text-cyan-300 font-rajdhani mt-0.5">Coordinación</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm text-left">
          <div className="text-[11px] text-slate-400 font-medium">ITD-AC-PO-04-02</div>
          <div className="text-sm font-bold text-teal-300 font-rajdhani mt-0.5">Tutor Académico</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm text-left">
          <div className="text-[11px] text-slate-400 font-medium">Formación Continua</div>
          <div className="text-sm font-bold text-amber-300 font-rajdhani mt-0.5">Actualización Docente</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/40 border border-emerald-800/40 backdrop-blur-sm text-left">
          <div className="text-[11px] text-slate-400 font-medium">Oficina de Psicología</div>
          <div className="text-sm font-bold text-emerald-300 font-rajdhani mt-0.5">SIAPE-ITD</div>
        </div>
      </div>
    </section>
  );
};
