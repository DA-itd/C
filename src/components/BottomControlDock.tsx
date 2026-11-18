import React, { useState, useEffect } from 'react';
import { ViewMode, ColorTheme } from '../types.ts';
import { NODES_DATA } from './ThreeCanvas.tsx';
import { sound } from '../utils/audio.ts';
import { 
  RotateCw, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Compass, 
  LayoutGrid, 
  ArrowLeft,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  HelpCircle
} from 'lucide-react';

interface BottomControlDockProps {
  viewMode: ViewMode;
  onToggleViewMode: (mode: ViewMode) => void;
  colorTheme: ColorTheme;
  onChangeColorTheme: (theme: ColorTheme) => void;
  activeNodeId: string | null;
  onSelectNodeId: (id: string | null) => void;
  isRotating: boolean;
  onToggleRotating: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const BottomControlDock: React.FC<BottomControlDockProps> = ({
  viewMode,
  onToggleViewMode,
  colorTheme,
  onChangeColorTheme,
  activeNodeId,
  onSelectNodeId,
  isRotating,
  onToggleRotating,
  soundEnabled,
  onToggleSound
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'camera' | 'themes' | 'info'>('camera');

  // Keyboard shortcut 'H' to toggle collapsed drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'h' || e.key === 'H') {
        setIsCollapsed((prev) => !prev);
        sound.playHover();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeNode = NODES_DATA.find((n) => n.id === activeNodeId);

  return (
    <div
      className={`fixed z-50 left-1/2 -translate-x-1/2 transition-all duration-300 pointer-events-auto ${
        isCollapsed ? 'bottom-2' : 'bottom-5'
      }`}
      style={{ width: 'min(920px, 94vw)' }}
    >
      {/* Collapse / Expand Toggle Button */}
      <div className="flex justify-center mb-1.5">
        <button
          onClick={() => {
            sound.playHover();
            setIsCollapsed(!isCollapsed);
          }}
          className="px-4 py-1.5 rounded-full bg-slate-900/95 border border-cyan-500/30 text-xs font-medium text-cyan-300 hover:text-white hover:border-cyan-400 shadow-lg flex items-center gap-1.5 transition-all backdrop-blur-md cursor-pointer"
          title="Atajo de teclado: Tecla 'H'"
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>Mostrar Controles 3D [H]</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
              <span>Modo Zen / Ocultar [H]</span>
            </>
          )}
        </button>
      </div>

      {/* Main Dock Container */}
      {!isCollapsed && (
        <div className="bg-slate-950/90 border border-slate-700/60 rounded-2xl p-3 shadow-2xl backdrop-blur-md text-slate-200">
          {/* Active Node Info Banner if selected */}
          {activeNode && (
            <div className="mb-3 px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: activeNode.color }}
                />
                <div>
                  <h4 className="text-sm font-semibold text-white tracking-wide font-rajdhani text-base">
                    {activeNode.title}
                  </h4>
                  <p className="text-xs text-slate-400 max-w-md line-clamp-1">
                    {activeNode.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {activeNode.actionUrl && (
                  <a
                    href={activeNode.actionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sound.playSelect()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 text-xs font-bold font-rajdhani uppercase tracking-wider hover:bg-cyan-400 transition-colors cursor-pointer"
                  >
                    <span>{activeNode.actionText || 'Abrir Módulo'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  onClick={() => {
                    sound.playHover();
                    onSelectNodeId(null);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs transition-colors cursor-pointer"
                >
                  Restablecer
                </button>
              </div>
            </div>
          )}

          {/* Dock Controls Row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Left: View Mode Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sound.playSelect();
                  onToggleViewMode(viewMode === 'space3d' ? 'portal' : 'space3d');
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold font-rajdhani tracking-wider uppercase flex items-center gap-2 border transition-all cursor-pointer ${
                  viewMode === 'space3d'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {viewMode === 'space3d' ? (
                  <>
                    <LayoutGrid className="w-4 h-4 text-cyan-400" />
                    <span>Vista Portal Web</span>
                  </>
                ) : (
                  <>
                    <Compass className="w-4 h-4 text-cyan-400" />
                    <span>Explorador 3D Completo</span>
                  </>
                )}
              </button>

              {/* Subtabs for 3D navigation */}
              {viewMode === 'space3d' && (
                <div className="flex items-center bg-slate-900/90 rounded-xl p-1 border border-slate-800">
                  <button
                    onClick={() => {
                      sound.playHover();
                      setActiveTab('camera');
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      activeTab === 'camera'
                        ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Cámaras
                  </button>
                  <button
                    onClick={() => {
                      sound.playHover();
                      setActiveTab('themes');
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      activeTab === 'themes'
                        ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Iluminación
                  </button>
                </div>
              )}
            </div>

            {/* Middle: Quick Camera Presets or Theme Swatches */}
            <div className="flex flex-wrap items-center gap-1.5">
              {activeTab === 'camera' || viewMode === 'portal' ? (
                <>
                  <button
                    onClick={() => {
                      sound.playSelect();
                      onSelectNodeId(null);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      activeNodeId === null
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    Órbita General
                  </button>
                  {NODES_DATA.map((node) => (
                    <button
                      key={node.id}
                      onClick={() => {
                        sound.playSelect();
                        onSelectNodeId(node.id);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                        activeNodeId === node.id
                          ? 'bg-cyan-500/30 border border-cyan-400 text-cyan-200 font-semibold'
                          : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full inline-block"
                        style={{ backgroundColor: node.color }}
                      />
                      <span>{node.title.replace('Programa de ', '').replace('Reportes y ', '')}</span>
                    </button>
                  ))}
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 mr-1">Paleta de Luces:</span>
                  <button
                    onClick={() => {
                      sound.playSelect();
                      onChangeColorTheme('tecnm');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      colorTheme === 'tecnm'
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    TecNM Azul
                  </button>
                  <button
                    onClick={() => {
                      sound.playSelect();
                      onChangeColorTheme('cyber');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      colorTheme === 'cyber'
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    Cyber Neón
                  </button>
                  <button
                    onClick={() => {
                      sound.playSelect();
                      onChangeColorTheme('gold');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      colorTheme === 'gold'
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    Oro & Granate
                  </button>
                </div>
              )}
            </div>

            {/* Right: Rotation, Audio & Vercel Helper */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  sound.playHover();
                  onToggleRotating();
                }}
                className={`p-2 rounded-xl text-xs border transition-colors cursor-pointer ${
                  isRotating
                    ? 'bg-slate-900 border-slate-700 text-cyan-400'
                    : 'bg-slate-900 border-slate-700 text-slate-500 hover:text-slate-300'
                }`}
                title={isRotating ? 'Pausar rotación automática' : 'Reanudar rotación automática'}
              >
                {isRotating ? <RotateCw className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} /> : <RotateCcw className="w-4 h-4" />}
              </button>

              <button
                onClick={() => {
                  onToggleSound();
                  sound.playHover();
                }}
                className={`p-2 rounded-xl text-xs border transition-colors cursor-pointer ${
                  soundEnabled
                    ? 'bg-slate-900 border-slate-700 text-cyan-400'
                    : 'bg-slate-900 border-slate-700 text-slate-500 hover:text-slate-300'
                }`}
                title={soundEnabled ? 'Silenciar efectos sonoros' : 'Activar efectos sonoros'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
