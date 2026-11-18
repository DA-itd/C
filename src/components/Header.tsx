import React, { useState } from 'react';
import { ViewMode } from '../types.ts';
import { sound } from '../utils/audio.ts';
import { Sparkles, Compass, LayoutGrid, Search, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  viewMode: ViewMode;
  onToggleViewMode: (mode: ViewMode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenVercelModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onToggleViewMode,
  searchQuery,
  onSearchChange,
  onOpenVercelModal
}) => {
  const [imgLeftError, setImgLeftError] = useState(false);
  const [imgRightError, setImgRightError] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 text-slate-900 border-b-2 border-cyan-500/80 shadow-md backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Logo Left: TecNM */}
        <div className="flex items-center gap-3">
          {!imgLeftError ? (
            <img
              src="https://raw.githubusercontent.com/DA-itd/web/main/LOGO_tecnm.jpg"
              alt="TecNM - Tecnológico Nacional de México"
              className="h-12 sm:h-14 object-contain"
              onError={() => setImgLeftError(true)}
            />
          ) : (
            <div className="h-12 px-3 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold font-rajdhani text-sm tracking-wider">
              TECNM
            </div>
          )}
        </div>

        {/* Center: Institutional Titles */}
        <div className="text-center flex-1 min-w-[240px] px-2">
          <p className="font-rajdhani text-xs sm:text-sm font-bold tracking-widest text-[#7b1034] uppercase">
            Instituto Tecnológico de Durango
          </p>
          <h1 className="font-rajdhani text-xl sm:text-2xl font-bold tracking-wide bg-gradient-to-r from-blue-700 via-cyan-600 to-teal-600 bg-clip-text text-transparent leading-tight">
            Desarrollo Académico
          </h1>
          <p className="text-xs text-slate-600 font-medium">
            Oficina de Servicios Académicos · TecNM
          </p>
        </div>

        {/* Logo Right: ITD & Action Controls */}
        <div className="flex items-center gap-3">
          {!imgRightError ? (
            <img
              src="https://raw.githubusercontent.com/DA-itd/web/main/logo_%20itdurango.png"
              alt="ITD - Instituto Tecnológico de Durango"
              className="h-12 sm:h-14 object-contain"
              onError={() => setImgRightError(true)}
            />
          ) : (
            <div className="h-12 px-3 rounded-lg bg-[#7b1034] text-white flex items-center justify-center font-bold font-rajdhani text-sm tracking-wider">
              ITD
            </div>
          )}

          {/* 3D Mode Switcher Button */}
          <button
            onClick={() => {
              sound.playSelect();
              onToggleViewMode(viewMode === 'space3d' ? 'portal' : 'space3d');
            }}
            className={`hidden md:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold font-rajdhani tracking-wider uppercase transition-all shadow-sm cursor-pointer ${
              viewMode === 'space3d'
                ? 'bg-slate-900 text-cyan-300 hover:bg-slate-800'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500'
            }`}
          >
            {viewMode === 'space3d' ? (
              <>
                <LayoutGrid className="w-4 h-4 text-cyan-400" />
                <span>Vista Portal</span>
              </>
            ) : (
              <>
                <Compass className="w-4 h-4 text-white" />
                <span>Modo 3D</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sub-bar with quick search and status */}
      <div className="bg-slate-100/90 border-t border-slate-200/80 px-4 sm:px-6 py-1.5 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-semibold text-slate-700">Servicios Institucionales Activos</span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline text-slate-500">SGC Norma ISO 9001:2015</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick search filter for modules */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar formato o módulo..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8 pr-3 py-1 rounded-lg bg-white border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 w-44 sm:w-56"
            />
          </div>

          <button
            onClick={() => {
              sound.playHover();
              onOpenVercelModal();
            }}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
          >
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M12 1L24 22H0L12 1Z" />
            </svg>
            <span>Desplegar en Vercel</span>
          </button>
        </div>
      </div>
    </header>
  );
};
