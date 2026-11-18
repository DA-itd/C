import React, { useState } from 'react';
import { ViewMode } from '../types.ts';
import { sound } from '../utils/audio.ts';
import { Compass, LayoutGrid, Search, X } from 'lucide-react';

interface HeaderProps {
  viewMode: ViewMode;
  onToggleViewMode: (mode: ViewMode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onToggleViewMode,
  searchQuery,
  onSearchChange
}) => {
  const [imgLeftError, setImgLeftError] = useState(false);
  const [imgRightError, setImgRightError] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

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

      {/* Sub-bar with status & compact search */}
      <div className="bg-slate-100/90 border-t border-slate-200/80 px-4 sm:px-6 py-1.5 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
          <span className="font-semibold text-slate-700">Servicios Institucionales Activos</span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline text-slate-600 font-medium">Rumbo al SGI Norma ISO 9001:2026</span>
        </div>

        <div className="flex items-center gap-2">
          {searchOpen || searchQuery ? (
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                placeholder="Buscar servicio..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8 pr-7 py-1 rounded-full bg-white border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 w-40 sm:w-52 transition-all"
              />
              <button
                type="button"
                onClick={() => {
                  onSearchChange('');
                  setSearchOpen(false);
                }}
                className="absolute right-2 text-slate-400 hover:text-slate-700 cursor-pointer"
                title="Cerrar búsqueda"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                sound.playHover();
                setSearchOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 hover:bg-white border border-slate-300/80 text-slate-600 hover:text-slate-900 text-xs font-medium transition-colors cursor-pointer"
              title="Buscar módulo o servicio"
            >
              <Search className="w-3.5 h-3.5 text-cyan-600" />
              <span className="hidden sm:inline">Buscar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
