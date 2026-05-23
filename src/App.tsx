import React, { useState, useEffect } from 'react';
import { Download, Printer, Plus, Trash2, FileText, CheckCircle2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { initialStudent, ReportData, Student } from './types';
import { exportToCSV } from './utils';
import { PrintTemplate } from './components/PrintTemplate';

const initialData: ReportData = {
  nombreTutor: '',
  fecha: new Date().toISOString().split('T')[0],
  semestre: '',
  carrera: '',
  grupo: '',
  semestreGrupo: '',
  estudiantes: [],
  actividades: [],
  acciones: [],
  observaciones: '',
  fechaEntrega: new Date().toISOString().split('T')[0],
  firmaTutor: '',
  firmaCoord: '',
  firmaJefe: '',
};

export default function App() {
  const [data, setData] = useState<ReportData>(initialData);

  // Initialize with one empty student on first load
  useEffect(() => {
    if (data.estudiantes.length === 0) {
      addStudent();
    }
  }, []);

  const handleDataChange = (field: keyof ReportData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const addStudent = () => {
    setData((prev) => ({
      ...prev,
      estudiantes: [...prev.estudiantes, { ...initialStudent, id: uuidv4() }],
    }));
  };

  const updateStudent = (id: string, field: keyof Student, value: any) => {
    setData((prev) => ({
      ...prev,
      estudiantes: prev.estudiantes.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    }));
  };

  const removeStudent = (id: string) => {
    setData((prev) => ({
      ...prev,
      estudiantes: prev.estudiantes.filter((s) => s.id !== id),
    }));
  };

  const addActividad = () => {
    if (data.actividades.length < 10) {
      setData((prev) => ({ ...prev, actividades: [...prev.actividades, ''] }));
    }
  };

  const updateActividad = (index: number, value: string) => {
    setData((prev) => {
      const newActs = [...prev.actividades];
      newActs[index] = value;
      return { ...prev, actividades: newActs };
    });
  };

  const removeActividad = (index: number) => {
    setData((prev) => {
      const newActs = prev.actividades.filter((_, i) => i !== index);
      return { ...prev, actividades: newActs };
    });
  };

  const addAccion = () => {
    if (data.acciones.length < 5) {
      setData((prev) => ({ ...prev, acciones: [...prev.acciones, ''] }));
    }
  };

  const updateAccion = (index: number, value: string) => {
    setData((prev) => {
      const newAccs = [...prev.acciones];
      newAccs[index] = value;
      return { ...prev, acciones: newAccs };
    });
  };

  const removeAccion = (index: number) => {
    setData((prev) => {
      const newAccs = prev.acciones.filter((_, i) => i !== index);
      return { ...prev, acciones: newAccs };
    });
  };

  const handlePrint = async () => {
    // 1. Mostrar diálogo de impresión inmediatamente (o generar el PDF local para que el tutor lo imprima)
    window.print();

    // 2. Enviar los datos en segundo plano al Google Apps Script (si está configurada la URL)
    const scriptUrl = import.meta.env.VITE_APPS_SCRIPT_URL;
    if (scriptUrl && scriptUrl !== 'URL_DE_TU_APPS_SCRIPT') {
      try {
        await fetch(scriptUrl, {
          method: 'POST',
          // Usamos 'text/plain' para evitar la solicitud preflight OPTIONS (CORS) en Google Apps Script
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify(data),
        });
        console.log('Datos enviados correctamente al administrador en segundo plano.');
      } catch (error) {
        console.error('Error al sincronizar con Drive/Sheets:', error);
      }
    } else {
      console.warn('Sincronización deshabilitada: Falta VITE_APPS_SCRIPT_URL en .env');
    }
  };

  const handleExportCSV = () => {
    exportToCSV(data);
  };

  // Derive totals purely for the UI real-time feedback
  const validStudents = data.estudiantes.filter(
    (e) => e.nombre.trim() !== '' || e.apellidos.trim() !== ''
  );
  let nH = 0, nM = 0, avg = 0;
  let sum = 0, count = 0;
  validStudents.forEach((e) => {
    if (e.sexo === 'H') nH++;
    if (e.sexo === 'M') nM++;
    const v = parseFloat(e.calificacion);
    if (!isNaN(v)) {
      sum += v;
      count++;
    }
  });
  if (count > 0) avg = sum / count;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* 
        ========================================================================
        FORM VIEW (HIDDEN ON PRINT)
        ========================================================================
      */}
      <div className="print:hidden pb-32">
        {/* Header */}
        <header className="bg-white border-b-4 border-[#003087] sticky top-0 z-50 shadow-sm px-6 py-4 flex items-center gap-6">
          <div className="flex-1 text-center">
            <h1 className="text-[#003087] font-bold text-lg md:text-xl uppercase tracking-wide">
              Reporte de Tutor Académico
            </h1>
            <p className="text-slate-500 font-mono text-xs mt-1">
              ITD-AC-PO-04-02 Rev.1 · SPA Standalone
            </p>
          </div>
        </header>

        <main className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-6">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3 text-sm text-[#003087]">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Entorno Limpio y Seguro (Sin Servidor)</p>
              <p>
                Esta aplicación procesa todo de manera local en su navegador. Para conservar sus datos, 
                utilice el botón <b>Descargar Datos (CSV)</b> que le permitirá analizar estadísticas en Excel, 
                y el botón <b>Generar PDF</b> para archivar el formato oficial (ITD).
              </p>
            </div>
          </div>

          {/* Datos Generales */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-[#003087] to-[#1a4090] px-5 py-3 text-white font-semibold text-sm uppercase tracking-wider flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C8102E]"></div>
              Datos Generales
            </div>
            <div className="p-5 md:p-7 grid grid-cols-1 md:grid-cols-4 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[#003087] uppercase mb-1.5">Nombre del Tutor *</label>
                <input
                  type="text"
                  value={data.nombreTutor}
                  onChange={(e) => handleDataChange('nombreTutor', e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003087]/20 focus:border-[#003087] uppercase text-sm"
                  placeholder="NOMBRE COMPLETO"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#003087] uppercase mb-1.5">Fecha *</label>
                <input
                  type="date"
                  value={data.fecha}
                  onChange={(e) => handleDataChange('fecha', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003087]/20 focus:border-[#003087] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#003087] uppercase mb-1.5">Semestre / Periodo</label>
                <select
                  value={data.semestre}
                  onChange={(e) => handleDataChange('semestre', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003087]/20 focus:border-[#003087] text-sm bg-white"
                >
                  <option value="">-- Seleccione --</option>
                  <option value={`ENE-JUN ${new Date().getFullYear()}`}>ENE-JUN {new Date().getFullYear()}</option>
                  <option value={`AGO-DIC ${new Date().getFullYear()}`}>AGO-DIC {new Date().getFullYear()}</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[#003087] uppercase mb-1.5">Carrera *</label>
                <select
                  value={data.carrera}
                  onChange={(e) => handleDataChange('carrera', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003087]/20 focus:border-[#003087] text-sm bg-white"
                >
                  <option value="">-- Seleccione carrera --</option>
                  <option value="ARQUITECTURA">ARQUITECTURA</option>
                  <option value="INGENIERÍA BIOQUÍMICA">INGENIERÍA BIOQUÍMICA</option>
                  <option value="INGENIERÍA BIOMÉDICA">INGENIERÍA BIOMÉDICA</option>
                  <option value="INGENIERÍA CIVIL">INGENIERÍA CIVIL</option>
                  <option value="INGENIERÍA ELÉCTRICA">INGENIERÍA ELÉCTRICA</option>
                  <option value="INGENIERÍA ELECTRÓNICA">INGENIERÍA ELECTRÓNICA</option>
                  <option value="INGENIERÍA EN GESTIÓN EMPRESARIAL">INGENIERÍA EN GESTIÓN EMPRESARIAL</option>
                  <option value="INGENIERÍA EN INTELIGENCIA ARTIFICIAL">INGENIERÍA EN INTELIGENCIA ARTIFICIAL</option>
                  <option value="INGENIERÍA EN SEMICONDUCTORES">INGENIERÍA EN SEMICONDUCTORES</option>
                  <option value="INGENIERÍA EN SISTEMAS COMPUTACIONALES">INGENIERÍA EN SISTEMAS COMPUTACIONALES</option>
                  <option value="INGENIERÍA INDUSTRIAL">INGENIERÍA INDUSTRIAL</option>
                  <option value="INGENIERÍA INFORMÁTICA">INGENIERÍA INFORMÁTICA</option>
                  <option value="INGENIERÍA LOGÍSTICA">INGENIERÍA LOGÍSTICA</option>
                  <option value="INGENIERÍA MECÁNICA">INGENIERÍA MECÁNICA</option>
                  <option value="INGENIERÍA MECATRÓNICA">INGENIERÍA MECATRÓNICA</option>
                  <option value="INGENIERÍA QUÍMICA">INGENIERÍA QUÍMICA</option>
                  <option value="LICENCIATURA EN ADMINISTRACIÓN">LICENCIATURA EN ADMINISTRACIÓN</option>
                  <option value="TECNOLOGÍAS DE LA INFORMACIÓN">TECNOLOGÍAS DE LA INFORMACIÓN</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#003087] uppercase mb-1.5">Grupo *</label>
                <input
                  type="text"
                  value={data.grupo}
                  onChange={(e) => handleDataChange('grupo', e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003087]/20 focus:border-[#003087] uppercase text-sm"
                  placeholder="Ej: 3A"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#003087] uppercase mb-1.5">Semestre Grupo</label>
                <select
                  value={data.semestreGrupo}
                  onChange={(e) => handleDataChange('semestreGrupo', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003087]/20 focus:border-[#003087] text-sm bg-white"
                >
                  <option value="">-- Seleccione --</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((s) => (
                    <option key={s} value={`${s} Semestre`}>{s} Semestre</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Estudiantes */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-[#003087] to-[#1a4090] px-5 py-3 text-white font-semibold text-sm uppercase tracking-wider flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C8102E]"></div>
                Lista de Estudiantes
              </div>
              <div className="text-xs font-normal opacity-80 bg-white/10 px-2 py-0.5 rounded">
                H: {nH} | M: {nM} | Promedio: {avg > 0 ? avg.toFixed(1) : '-'}
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse min-w-[1200px]">
                <thead>
                  <tr>
                    <th rowSpan={2} className="bg-[#003087] text-white p-2 border border-white/10 text-center w-10 text-xs">#</th>
                    <th rowSpan={2} className="bg-[#003087] text-white p-2 border border-white/10 min-w-[150px] text-xs">Nombre(s)</th>
                    <th rowSpan={2} className="bg-[#003087] text-white p-2 border border-white/10 min-w-[150px] text-xs">Apellidos</th>
                    <th rowSpan={2} className="bg-[#1a4090] text-white p-2 border border-white/10 text-center text-xs">Sexo</th>
                    <th colSpan={2} className="bg-[#1a4090] text-white p-2 border border-white/10 text-center text-xs">Tutoría</th>
                    <th rowSpan={2} className="bg-[#1a4090] text-white p-2 border border-white/10 text-center text-xs">Canalizado</th>
                    <th colSpan={6} className="bg-[#7d2035] text-white p-1 border border-white/10 text-center text-[10px] uppercase tracking-wider">Áreas de Canalización</th>
                    <th rowSpan={2} className="bg-[#1a4090] text-white p-2 border border-white/10 text-xs min-w-[120px]">Otra (Texto)</th>
                    <th rowSpan={2} className="bg-[#1a4090] text-white p-2 border border-white/10 text-center text-xs w-20">Calif.</th>
                    <th rowSpan={2} className="bg-white border-b border-slate-200"></th>
                  </tr>
                  <tr>
                    <th className="bg-[#1a4090] text-white p-1 border border-white/10 text-center text-xs" title="Grupal">TG</th>
                    <th className="bg-[#1a4090] text-white p-1 border border-white/10 text-center text-xs" title="Individual">TI</th>
                    <th className="bg-[#8b243b] text-white p-1 border border-white/10 text-center text-xs" title="Act. Extraescolares">1</th>
                    <th className="bg-[#8b243b] text-white p-1 border border-white/10 text-center text-xs" title="Ciencias Básicas">2</th>
                    <th className="bg-[#8b243b] text-white p-1 border border-white/10 text-center text-xs" title="Servicios Escolares">3</th>
                    <th className="bg-[#8b243b] text-white p-1 border border-white/10 text-center text-xs" title="Estudios Profesionales">4</th>
                    <th className="bg-[#8b243b] text-white p-1 border border-white/10 text-center text-xs" title="Desarrollo Académico">5</th>
                    <th className="bg-[#8b243b] text-white p-1 border border-white/10 text-center text-xs" title="Otra">6</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data.estudiantes.map((est, index) => (
                    <tr key={est.id} className="hover:bg-blue-50/50 transition-colors group">
                      <td className="p-2 text-center text-slate-400 font-mono text-xs">{index + 1}</td>
                      <td className="p-1.5">
                        <input
                          type="text"
                          value={est.nombre}
                          onChange={(e) => updateStudent(est.id, 'nombre', e.target.value.toUpperCase())}
                          className="w-full bg-transparent border-b border-transparent focus:border-[#003087] focus:bg-white px-2 py-1 outline-none uppercase text-xs transition-colors"
                          placeholder="Nombre(s)"
                        />
                      </td>
                      <td className="p-1.5">
                        <input
                          type="text"
                          value={est.apellidos}
                          onChange={(e) => updateStudent(est.id, 'apellidos', e.target.value.toUpperCase())}
                          className="w-full bg-transparent border-b border-transparent focus:border-[#003087] focus:bg-white px-2 py-1 outline-none uppercase text-xs transition-colors"
                          placeholder="Apellidos"
                        />
                      </td>
                      <td className="p-1.5 text-center">
                        <select
                          value={est.sexo}
                          onChange={(e) => updateStudent(est.id, 'sexo', e.target.value)}
                          className="bg-transparent border-b border-slate-300 focus:border-[#003087] outline-none text-xs text-center p-1 w-full"
                        >
                          <option value="">-</option>
                          <option value="H">H</option>
                          <option value="M">M</option>
                        </select>
                      </td>
                      <td className="p-1.5 text-center px-3">
                        <input type="checkbox" checked={est.grupal} onChange={(e) => updateStudent(est.id, 'grupal', e.target.checked)} className="w-3.5 h-3.5 accent-[#003087] cursor-pointer" />
                      </td>
                      <td className="p-1.5 text-center px-3">
                        <input type="checkbox" checked={est.individual} onChange={(e) => updateStudent(est.id, 'individual', e.target.checked)} className="w-3.5 h-3.5 accent-[#003087] cursor-pointer" />
                      </td>
                      <td className="p-1.5 text-center px-3">
                        <input type="checkbox" checked={est.canalizado} onChange={(e) => updateStudent(est.id, 'canalizado', e.target.checked)} className="w-3.5 h-3.5 accent-[#003087] cursor-pointer" />
                      </td>
                      <td className="p-1.5 text-center px-2">
                        <input type="checkbox" checked={est.area1} onChange={(e) => updateStudent(est.id, 'area1', e.target.checked)} className="w-3.5 h-3.5 accent-[#C8102E] cursor-pointer" />
                      </td>
                      <td className="p-1.5 text-center px-2">
                        <input type="checkbox" checked={est.area2} onChange={(e) => updateStudent(est.id, 'area2', e.target.checked)} className="w-3.5 h-3.5 accent-[#C8102E] cursor-pointer" />
                      </td>
                      <td className="p-1.5 text-center px-2">
                        <input type="checkbox" checked={est.area3} onChange={(e) => updateStudent(est.id, 'area3', e.target.checked)} className="w-3.5 h-3.5 accent-[#C8102E] cursor-pointer" />
                      </td>
                      <td className="p-1.5 text-center px-2">
                        <input type="checkbox" checked={est.area4} onChange={(e) => updateStudent(est.id, 'area4', e.target.checked)} className="w-3.5 h-3.5 accent-[#C8102E] cursor-pointer" />
                      </td>
                      <td className="p-1.5 text-center px-2">
                        <input type="checkbox" checked={est.area5} onChange={(e) => updateStudent(est.id, 'area5', e.target.checked)} className="w-3.5 h-3.5 accent-[#C8102E] cursor-pointer" />
                      </td>
                      <td className="p-1.5 text-center px-2">
                        <input type="checkbox" checked={est.area6} onChange={(e) => updateStudent(est.id, 'area6', e.target.checked)} className="w-3.5 h-3.5 accent-[#C8102E] cursor-pointer" />
                      </td>
                      <td className="p-1.5">
                        <input
                          type="text"
                          value={est.otraArea}
                          onChange={(e) => updateStudent(est.id, 'otraArea', e.target.value.toUpperCase())}
                          className="w-full bg-transparent border-b border-transparent focus:border-[#003087] focus:bg-white px-2 py-1 outline-none uppercase text-[10px] transition-colors"
                          placeholder="Especifique..."
                        />
                      </td>
                      <td className="p-1.5">
                        <input
                          type="text"
                          value={est.calificacion}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                            updateStudent(est.id, 'calificacion', val.slice(0, 5));
                          }}
                          className="w-full bg-transparent border-b border-slate-300 focus:border-[#003087] font-mono text-center font-bold text-[#1a7f5a] focus:bg-white px-2 py-1 outline-none text-xs transition-colors"
                          placeholder="—"
                        />
                      </td>
                      <td className="p-1.5 text-center w-10">
                        <button
                          onClick={() => removeStudent(est.id)}
                          className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="bg-slate-50 border-t border-slate-200 p-3">
              <button
                onClick={addStudent}
                className="text-sm font-medium text-[#003087] border border-dashed border-[#003087]/40 hover:bg-blue-50 px-4 py-1.5 rounded-md flex items-center transition-colors"
              >
                <Plus className="w-4 h-4 mr-1" />
                Agregar Estudiante
              </button>
            </div>
          </section>

          {/* Actividades y Acciones */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
               <div className="bg-gradient-to-r from-[#003087] to-[#1a4090] px-5 py-3 text-white font-semibold text-sm uppercase tracking-wider flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C8102E]"></div>
                  Actividades Adicionales
                </div>
                <div className="text-xs font-normal opacity-80">{data.actividades.length} / 10</div>
              </div>
              <div className="p-5 flex-1 space-y-3">
                {data.actividades.map((act, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="w-6 h-6 flex items-center justify-center bg-blue-100 text-[#003087] rounded-full text-xs font-bold shrink-0">{index + 1}</span>
                    <input
                      type="text"
                      value={act}
                      onChange={(e) => updateActividad(index, e.target.value.toUpperCase())}
                      className="flex-1 border-b border-slate-300 focus:border-[#003087] py-1.5 px-2 outline-none uppercase text-sm"
                      placeholder="Describa la actividad..."
                    />
                    <button onClick={() => removeActividad(index)} className="text-slate-400 hover:text-red-500 shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {data.actividades.length < 10 && (
                  <button onClick={addActividad} className="text-sm text-[#003087] font-medium flex items-center mt-4 border border-dashed border-slate-300 rounded px-3 py-1.5 hover:bg-slate-50">
                    <Plus className="w-4 h-4 mr-1" /> Añadir Actividad
                  </button>
                )}
              </div>
            </section>

            <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
               <div className="bg-gradient-to-r from-[#003087] to-[#1a4090] px-5 py-3 text-white font-semibold text-sm uppercase tracking-wider flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C8102E]"></div>
                  Acciones de Mayor Impacto
                </div>
                <div className="text-xs font-normal opacity-80">{data.acciones.length} / 5</div>
              </div>
              <div className="p-5 flex-1 space-y-3">
                {data.acciones.map((acc, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="w-6 h-6 flex items-center justify-center bg-blue-100 text-[#003087] rounded-full text-xs font-bold shrink-0">{index + 1}</span>
                    <input
                      type="text"
                      value={acc}
                      onChange={(e) => updateAccion(index, e.target.value.toUpperCase())}
                      className="flex-1 border-b border-slate-300 focus:border-[#003087] py-1.5 px-2 outline-none uppercase text-sm"
                      placeholder="Describa la acción..."
                    />
                    <button onClick={() => removeAccion(index)} className="text-slate-400 hover:text-red-500 shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {data.acciones.length < 5 && (
                  <button onClick={addAccion} className="text-sm text-[#003087] font-medium flex items-center mt-4 border border-dashed border-slate-300 rounded px-3 py-1.5 hover:bg-slate-50">
                    <Plus className="w-4 h-4 mr-1" /> Añadir Acción
                  </button>
                )}
              </div>
            </section>
          </div>

          {/* Observaciones y Cierre */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-[#003087] to-[#1a4090] px-5 py-3 text-white font-semibold text-sm uppercase tracking-wider flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C8102E]"></div>
              Observaciones y Cierre
            </div>
            <div className="p-5 md:p-7 space-y-6">
              <div>
                <label className="block text-xs font-bold text-[#003087] uppercase mb-1.5">Observaciones Generales</label>
                <textarea
                  value={data.observaciones}
                  onChange={(e) => handleDataChange('observaciones', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087]/20 focus:border-[#003087] min-h-[100px] text-sm"
                  placeholder="Anote aquí las observaciones generales del periodo..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#003087] uppercase mb-1.5">Fecha de Entrega</label>
                <input
                  type="date"
                  value={data.fechaEntrega}
                  onChange={(e) => handleDataChange('fechaEntrega', e.target.value)}
                  className="w-full max-w-[250px] px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003087]/20 focus:border-[#003087] text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
                <div className="text-center">
                  <div className="font-bold text-xs text-[#003087] uppercase mb-1">Nombre del Tutor</div>
                  <input
                    type="text"
                    value={data.firmaTutor}
                    onChange={(e) => handleDataChange('firmaTutor', e.target.value.toUpperCase())}
                    className="w-full border-b-2 border-slate-300 focus:border-[#003087] px-2 py-1 text-center outline-none uppercase text-sm mb-2"
                    placeholder="NOMBRE FIRMANTE"
                  />
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Firma del Tutor</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-xs text-[#003087] uppercase mb-1">Coordinador de Tutoría</div>
                  <input
                    type="text"
                    value={data.firmaCoord}
                    onChange={(e) => handleDataChange('firmaCoord', e.target.value.toUpperCase())}
                    className="w-full border-b-2 border-slate-300 focus:border-[#003087] px-2 py-1 text-center outline-none uppercase text-sm mb-2"
                    placeholder="NOMBRE FIRMANTE"
                  />
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Firma del Coordinador</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-xs text-[#003087] uppercase mb-1">Jefe de Departamento</div>
                  <input
                    type="text"
                    value={data.firmaJefe}
                    onChange={(e) => handleDataChange('firmaJefe', e.target.value.toUpperCase())}
                    className="w-full border-b-2 border-slate-300 focus:border-[#003087] px-2 py-1 text-center outline-none uppercase text-sm mb-2"
                    placeholder="NOMBRE FIRMANTE"
                  />
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Firma del Jefe Depto.</div>
                </div>
              </div>
            </div>
          </section>

        </main>

        {/* Floating Actions Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] p-4 z-50">
           <div className="max-w-[1400px] mx-auto flex flex-wrap justify-between items-center gap-4">
              <div className="text-xs text-slate-500 hidden sm:block">
                Capturados: <span className="font-bold text-[#003087]">{validStudents.length}</span> estudiantes
              </div>
              <div className="flex w-full sm:w-auto gap-3">
                <button
                  onClick={handleExportCSV}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white text-[#1a7f5a] border-2 border-[#1a7f5a] hover:bg-[#1a7f5a]/5 px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Descargar (CSV)
                </button>
                <button
                  onClick={handlePrint}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-[#003087] to-[#1a4090] text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all hover:shadow-lg hover:shadow-blue-900/20"
                >
                  <Printer className="w-4 h-4" />
                  Generar PDF
                </button>
              </div>
           </div>
        </div>
      </div>

      {/* 
        ========================================================================
        PRINT VIEW (VISIBLE ONLY ON PRINT)
        ========================================================================
      */}
      <div className="hidden print:block h-screen w-full">
        <PrintTemplate data={data} />
      </div>
    </div>
  );
}
