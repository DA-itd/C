import React from 'react';
import { sound } from '../utils/audio.ts';
import {
  GraduationCap,
  FileText,
  Users,
  BarChart3,
  BookOpen,
  ArrowRight,
  Lock,
  Compass,
  Award,
  FileCheck,
  UserCheck,
  HeartHandshake,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

interface CardsSectionProps {
  searchQuery: string;
  onFocus3DNode: (nodeId: string) => void;
}

export const CardsSection: React.FC<CardsSectionProps> = ({
  searchQuery,
  onFocus3DNode
}) => {
  const query = searchQuery.toLowerCase().trim();

  const matchesSearch = (text: string) => {
    if (!query) return true;
    return text.toLowerCase().includes(query);
  };

  const showTutorias =
    matchesSearch('tutoría') ||
    matchesSearch('tutor') ||
    matchesSearch('coordinador') ||
    matchesSearch('04-03') ||
    matchesSearch('04-02') ||
    matchesSearch('estadísticas');

  const showActualizacion =
    matchesSearch('actualización') ||
    matchesSearch('docente') ||
    matchesSearch('cursos') ||
    matchesSearch('constancias') ||
    matchesSearch('formación');

  const showSiape =
    matchesSearch('siape') ||
    matchesSearch('psicológica') ||
    matchesSearch('psicología') ||
    matchesSearch('atención') ||
    matchesSearch('estudiantil');

  return (
    <section
      id="cards-section"
      className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 relative z-20 pointer-events-auto space-y-6"
    >
      {/* FILA SUPERIOR: 2 TARJETAS PRINCIPALES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TARJETA 1: PROGRAMA DE TUTORÍAS */}
        {showTutorias && (
          <div className="rounded-3xl p-6 sm:p-7 bg-slate-900/80 border border-cyan-500/25 backdrop-blur-md shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-cyan-400/50 glow-card flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500" />

            <div>
              {/* Header visual */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3.5">
                  <div className="w-13 h-13 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-500/10">
                    <GraduationCap className="w-7 h-7 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-rajdhani text-2xl font-bold text-white tracking-wide leading-tight">
                      Programa de Tutorías
                    </h3>
                    <span className="text-xs text-cyan-300/80 font-medium">
                      Seguimiento académico ITD
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      sound.playSelect();
                      onFocus3DNode('tutorias');
                    }}
                    className="px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1 hover:bg-cyan-900 transition-colors cursor-pointer"
                    title="Explorar en 3D"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>3D</span>
                  </button>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold font-rajdhani tracking-wider uppercase bg-teal-500/15 text-teal-300 border border-teal-500/30">
                    Activo
                  </span>
                </div>
              </div>

              {/* Lista de enlaces directos (sin ventana intermedia) */}
              <div className="flex flex-col gap-2.5">
                {/* Módulo 1: Coordinador */}
                <a
                  href="https://da-itd.github.io/C/ITD-AC-PO-04-03-app.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sound.playSelect()}
                  className="group w-full text-left flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/65 border border-cyan-500/15 hover:border-cyan-400/50 hover:bg-cyan-950/35 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/25 text-cyan-400 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-rajdhani text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        Coordinador de Tutoría
                      </div>
                      <span className="inline-block text-[11px] font-mono text-cyan-300/80 bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-500/20 mt-0.5">
                        ITD-AC-PO-04-03
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all" />
                </a>

                {/* Módulo 2: Tutor */}
                <a
                  href="https://da-itd.github.io/C/tutor.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sound.playSelect()}
                  className="group w-full text-left flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/65 border border-teal-500/15 hover:border-teal-400/50 hover:bg-teal-950/30 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/25 text-teal-400 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-slate-950 transition-colors">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-rajdhani text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                        Tutor Académico
                      </div>
                      <span className="inline-block text-[11px] font-mono text-teal-300/80 bg-teal-950/60 px-2 py-0.5 rounded-md border border-teal-500/20 mt-0.5">
                        ITD-AC-PO-04-02
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-300 group-hover:translate-x-1 transition-all" />
                </a>

                {/* Módulo 3: Estadísticas */}
                <a
                  href="https://da-itd.github.io/C/reportes.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sound.playSelect()}
                  className="group w-full text-left flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/65 border border-amber-500/20 hover:border-amber-400/50 hover:bg-amber-950/20 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-rajdhani text-base font-bold text-white group-hover:text-amber-300 transition-colors flex items-center gap-2">
                        <span>Reporte Estadísticas</span>
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                      <span className="inline-block text-[11px] text-amber-300/80 mt-0.5">
                        Acceso restringido
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-300 group-hover:translate-x-1 transition-all" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* TARJETA 2: ACTUALIZACIÓN DOCENTE */}
        {showActualizacion && (
          <div className="rounded-3xl p-6 sm:p-7 bg-slate-900/80 border border-blue-500/25 backdrop-blur-md shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-blue-400/50 glow-card flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-400 to-amber-400" />

            <div>
              {/* Header visual */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3.5">
                  <div className="w-13 h-13 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-300 shadow-lg shadow-blue-500/10">
                    <BookOpen className="w-7 h-7 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-rajdhani text-2xl font-bold text-white tracking-wide leading-tight">
                      Actualización Docente
                    </h3>
                    <span className="text-xs text-blue-300/80 font-medium">
                      Formación continua TecNM
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      sound.playSelect();
                      onFocus3DNode('actualizacion');
                    }}
                    className="px-2.5 py-1 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-300 text-xs font-semibold flex items-center gap-1 hover:bg-blue-900 transition-colors cursor-pointer"
                    title="Explorar en 3D"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>3D</span>
                  </button>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold font-rajdhani tracking-wider uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    Cursos
                  </span>
                </div>
              </div>

              {/* Tiles visuales minimalistas */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-blue-500/15 flex flex-col items-center justify-center text-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="font-rajdhani text-sm font-bold text-white tracking-wide">
                    Cursos
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-amber-500/15 flex flex-col items-center justify-center text-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <span className="font-rajdhani text-sm font-bold text-white tracking-wide">
                    Constancias
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-emerald-500/15 flex flex-col items-center justify-center text-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <span className="font-rajdhani text-sm font-bold text-white tracking-wide">
                    Registro
                  </span>
                </div>
              </div>
            </div>

            {/* Botón principal de acceso directo a act-doc-itd.vercel.app */}
            <a
              href="https://act-doc-itd.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playSelect()}
              className="inline-flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 hover:from-blue-500 hover:via-indigo-500 hover:to-amber-400 text-slate-950 font-rajdhani text-lg font-bold tracking-wider uppercase transition-all shadow-xl hover:shadow-blue-500/25 group cursor-pointer"
            >
              <span>Acceder al sistema</span>
              <ArrowRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1.5 transition-transform" />
            </a>
          </div>
        )}
      </div>

      {/* FILA INFERIOR: TARJETA SIAPE-ITD */}
      {showSiape && (
        <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-slate-900/90 via-[#0e1f19]/90 to-slate-900/90 border border-emerald-500/30 backdrop-blur-md shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-emerald-400/60 hover:shadow-emerald-500/15">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#8eb695] via-emerald-400 to-[#4a6b53]" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
              <div className="w-16 h-16 rounded-2xl bg-[#8eb695]/20 border border-[#8eb695]/40 flex items-center justify-center text-emerald-300 shadow-lg shadow-emerald-500/10 flex-shrink-0">
                <HeartHandshake className="w-8 h-8 text-[#9ec7a5]" />
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                  <h3 className="font-rajdhani text-2xl sm:text-3xl font-bold text-white tracking-wide">
                    SIAPE-ITD
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold font-rajdhani tracking-wider uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    Oficina de Psicología
                  </span>
                  <button
                    onClick={() => {
                      sound.playSelect();
                      onFocus3DNode('siape');
                    }}
                    className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1 hover:bg-emerald-900 transition-colors cursor-pointer"
                    title="Explorar SIAPE-ITD en 3D"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>3D</span>
                  </button>
                </div>

                <p className="text-sm sm:text-base text-emerald-100/80 font-medium">
                  Sistema Integral de Atención Psicológica Estudiantil
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3">
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-300 bg-slate-950/60 px-3 py-1 rounded-full border border-emerald-500/20">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Espacio seguro · Google Auth
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3 flex-shrink-0">
              <a
                href="https://siape-itd.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playSelect()}
                className="w-full md:w-auto inline-flex items-center justify-center gap-3 py-4 px-8 rounded-2xl bg-gradient-to-r from-[#8eb695] to-emerald-400 hover:from-[#9fc9a6] hover:to-emerald-300 text-slate-950 font-rajdhani text-lg font-bold tracking-wider uppercase transition-all shadow-xl hover:shadow-emerald-500/25 group cursor-pointer"
              >
                <span>Ingresar a SIAPE-ITD</span>
                <ExternalLink className="w-5 h-5 text-slate-950 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Aviso sin resultados */}
      {!showTutorias && !showActualizacion && !showSiape && (
        <div className="text-center py-12 bg-slate-900/60 rounded-3xl border border-slate-800">
          <p className="text-slate-400 text-base">
            No se encontraron módulos coincidentes con "
            <span className="text-cyan-400">{searchQuery}</span>".
          </p>
        </div>
      )}
    </section>
  );
};
