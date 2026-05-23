import { ReportData } from './types';

export function exportToCSV(data: ReportData) {
  const headers = [
    'Fecha Registro',
    'Nombre Tutor',
    'Carrera',
    'Grupo',
    'Fecha Reporte',
    'Semestre/Periodo',
    'Semestre Grupo',
    'Núm. Lista',
    'Nombre(s)',
    'Apellidos',
    'Sexo',
    'Tutoría Grupal',
    'Tutoría Individual',
    'Canalizado',
    'Área 1 - Act. Extraescolares',
    'Área 2 - Ciencias Básicas',
    'Área 3 - Servicios Escolares',
    'Área 4 - Estudios Profesionales',
    'Área 5 - Desarrollo Académico',
    'Área 6 - Otra (check)',
    'Área 6 - Otra (desc)',
    'Calificación',
    'Actividades',
    'Acciones',
    'Observaciones',
  ];

  const escapeCSV = (str: string) => `"${String(str).replace(/"/g, '""')}"`;

  const actividadesStr = data.actividades.filter((a) => a.trim()).join(' | ');
  const accionesStr = data.acciones.filter((a) => a.trim()).join(' | ');
  const today = new Date().toISOString().split('T')[0];

  const rows = data.estudiantes
    .filter((e) => e.nombre.trim() || e.apellidos.trim())
    .map((e, index) => {
      return [
        today,
        data.nombreTutor,
        data.carrera,
        data.grupo,
        data.fecha,
        data.semestre,
        data.semestreGrupo,
        index + 1,
        e.nombre,
        e.apellidos,
        e.sexo,
        e.grupal ? 'Sí' : 'No',
        e.individual ? 'Sí' : 'No',
        e.canalizado ? 'Sí' : 'No',
        e.area1 ? 'Sí' : '',
        e.area2 ? 'Sí' : '',
        e.area3 ? 'Sí' : '',
        e.area4 ? 'Sí' : '',
        e.area5 ? 'Sí' : '',
        e.area6 ? 'Sí' : '',
        e.otraArea.trim(),
        e.calificacion,
        actividadesStr,
        accionesStr,
        data.observaciones,
      ]
        .map(escapeCSV)
        .join(',');
    });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' }); // \uFEFF for Excel UTF-8 BOM
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `Reporte_Tutor_${data.nombreTutor.replace(/\s+/g, '_')}_${data.grupo}_${data.fecha}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
