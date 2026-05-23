import React from 'react';
import { ReportData } from '../types';

interface PrintTemplateProps {
  data: ReportData;
}

export const PrintTemplate: React.FC<PrintTemplateProps> = ({ data }) => {
  let totH = 0,
    totM = 0,
    totTG = 0,
    totTI = 0,
    totCanal = 0,
    totA1 = 0,
    totA2 = 0,
    totA3 = 0,
    totA4 = 0,
    totA5 = 0,
    totA6 = 0;
  let sumCalif = 0,
    nCalif = 0;

  const validStudents = data.estudiantes.filter(
    (e) => e.nombre.trim() !== '' || e.apellidos.trim() !== ''
  );

  validStudents.forEach((e) => {
    if (e.sexo === 'H') totH++;
    if (e.sexo === 'M') totM++;
    if (e.grupal) totTG++;
    if (e.individual) totTI++;
    if (e.canalizado) totCanal++;
    if (e.area1) totA1++;
    if (e.area2) totA2++;
    if (e.area3) totA3++;
    if (e.area4) totA4++;
    if (e.area5) totA5++;
    if (e.area6) totA6++;
    const v = parseFloat(e.calificacion);
    if (!isNaN(v)) {
      sumCalif += v;
      nCalif++;
    }
  });

  const promCalif = nCalif > 0 ? (sumCalif / nCalif).toFixed(1) : '—';

  return (
    <div className="print-container text-black font-sans bg-white p-8">
      <style>
        {`
          @media print {
            @page { size: letter landscape; margin: 10mm; }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .print-hidden { display: none !important; }
          }
          .itd-table { width: 100%; border-collapse: collapse; margin-bottom: 8px; font-size: 8pt; }
          .itd-table th, .itd-table td { border: 1px solid #111; padding: 3px 5px; vertical-align: middle; }
          .itd-table th { background-color: #003087 !important; color: white !important; font-weight: bold; text-align: center; }
          .itd-table th.sub-th { background-color: #1a4090 !important; font-size: 7.5pt; }
          .itd-title { background-color: #003087 !important; color: white !important; font-weight: bold; padding: 4px 8px; font-size: 9pt; margin-top: 12px; margin-bottom: 4px; }
        `}
      </style>

      <h2 className="text-center font-bold text-lg mb-2">INSTITUTO TECNOLÓGICO DE DURANGO</h2>

      <table className="itd-table">
        <tbody>
          <tr>
            <td colSpan={4} className="font-bold">Código: ITD-AC-PO-04-02</td>
            <td colSpan={7} className="text-center">
              <span className="font-bold text-sm block">Formato de Reporte de Tutor Académico</span>
              <span className="text-xs">ISO 9001:2015: 8.5.1 · 8.7 · 9.1.1 · 9.1.3</span>
            </td>
            <td colSpan={4} className="font-bold">Revisión: 1</td>
          </tr>
          <tr>
            <td colSpan={5}><b>Tutor:</b> {data.nombreTutor}</td>
            <td colSpan={3}><b>Fecha:</b> {data.fecha}</td>
            <td colSpan={4}><b>Semestre:</b> {data.semestre}</td>
            <td colSpan={3}><b>Carrera:</b> {data.carrera} &nbsp;|&nbsp; <b>Grupo:</b> {data.grupo}</td>
          </tr>
          
          <tr>
            <th rowSpan={2}>#</th>
            <th rowSpan={2}>Nombre(s)</th>
            <th rowSpan={2}>Apellidos</th>
            <th rowSpan={2} className="sub-th">Sexo</th>
            <th colSpan={2} className="sub-th">Tutoría</th>
            <th rowSpan={2} className="sub-th">Canal.</th>
            <th colSpan={6} className="sub-th">Áreas</th>
            <th rowSpan={2} className="sub-th">Otras Áreas</th>
            <th rowSpan={2} className="sub-th">Calif.</th>
          </tr>
          <tr>
            <th className="sub-th">TG</th>
            <th className="sub-th">TI</th>
            <th className="sub-th">1</th>
            <th className="sub-th">2</th>
            <th className="sub-th">3</th>
            <th className="sub-th">4</th>
            <th className="sub-th">5</th>
            <th className="sub-th">6</th>
          </tr>

          {validStudents.map((e, i) => (
            <tr key={e.id}>
              <td className="text-center">{i + 1}</td>
              <td className="uppercase">{e.nombre}</td>
              <td className="uppercase">{e.apellidos}</td>
              <td className="text-center font-bold">{e.sexo}</td>
              <td className="text-center">{e.grupal ? '✓' : ''}</td>
              <td className="text-center">{e.individual ? '✓' : ''}</td>
              <td className="text-center">{e.canalizado ? '✓' : ''}</td>
              <td className="text-center">{e.area1 ? '✓' : ''}</td>
              <td className="text-center">{e.area2 ? '✓' : ''}</td>
              <td className="text-center">{e.area3 ? '✓' : ''}</td>
              <td className="text-center">{e.area4 ? '✓' : ''}</td>
              <td className="text-center">{e.area5 ? '✓' : ''}</td>
              <td className="text-center">{e.area6 ? '✓' : ''}</td>
              <td className="text-[7pt] uppercase max-w-[100px] truncate">{e.otraArea}</td>
              <td className="text-center font-bold">{e.calificacion}</td>
            </tr>
          ))}
          
          {/* Totals Row */}
           <tr>
              <td colSpan={3} className="text-right font-bold">TOTALES</td>
              <td className="text-center font-bold text-[7pt]">H:{totH} M:{totM}</td>
              <td className="text-center font-bold">{totTG}</td>
              <td className="text-center font-bold">{totTI}</td>
              <td className="text-center font-bold">{totCanal}</td>
              <td className="text-center font-bold">{totA1}</td>
              <td className="text-center font-bold">{totA2}</td>
              <td className="text-center font-bold">{totA3}</td>
              <td className="text-center font-bold">{totA4}</td>
              <td className="text-center font-bold">{totA5}</td>
              <td className="text-center font-bold">{totA6}</td>
              <td></td>
              <td className="text-center font-bold">{promCalif}</td>
            </tr>
        </tbody>
      </table>

      <div className="grid grid-cols-2 gap-4">
        <div>
           <div className="itd-title">Actividades adicionales más importantes del semestre</div>
           <table className="itd-table">
            <tbody>
              {data.actividades.map((act, i) => (
                act.trim() && (
                  <tr key={i}>
                    <td className="w-6 text-center">{i + 1}</td>
                    <td className="uppercase">{act}</td>
                  </tr>
                )
              ))}
              {data.actividades.filter(a => a.trim()).length === 0 && (
                <tr><td className="text-center italic text-gray-500 py-1" colSpan={2}>Ninguna registrada</td></tr>
              )}
            </tbody>
           </table>
        </div>
        <div>
           <div className="itd-title">Acciones de mayor impacto (competencias)</div>
           <table className="itd-table">
            <tbody>
              {data.acciones.map((acc, i) => (
                acc.trim() && (
                   <tr key={i}>
                    <td className="w-6 text-center">{i + 1}</td>
                    <td className="uppercase">{acc}</td>
                  </tr>
                )
              ))}
               {data.acciones.filter(a => a.trim()).length === 0 && (
                <tr><td className="text-center italic text-gray-500 py-1" colSpan={2}>Ninguna registrada</td></tr>
              )}
            </tbody>
           </table>
        </div>
      </div>

      <div className="itd-title">Observaciones Generales</div>
      <table className="itd-table">
        <tbody>
          <tr>
            <td className="min-h-[40px] align-top p-2">{data.observaciones || <span className="text-white/0">.</span>}</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-2 text-xs">
        <b>Fecha de entrega:</b> {data.fechaEntrega}
      </div>

      <table className="w-full mt-10 border-none">
        <tbody>
          <tr>
            <td className="w-1/3 text-center border-none align-bottom px-4">
              <div className="border-t border-black pt-1">
                <div className="font-bold uppercase text-[9pt]">{data.firmaTutor}</div>
                <div className="text-[7.5pt]">Nombre y Firma del Tutor</div>
              </div>
            </td>
            <td className="w-1/3 text-center border-none align-bottom px-4">
               <div className="border-t border-black pt-1">
                <div className="font-bold uppercase text-[9pt]">{data.firmaCoord}</div>
                <div className="text-[7.5pt]">Coordinador de Tutoría</div>
              </div>
            </td>
            <td className="w-1/3 text-center border-none align-bottom px-4">
               <div className="border-t border-black pt-1">
                <div className="font-bold uppercase text-[9pt]">{data.firmaJefe}</div>
                <div className="text-[7.5pt]">Jefe de Departamento</div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

    </div>
  );
};
