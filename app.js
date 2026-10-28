const API_URL = 'https://script.google.com/macros/s/AKfycbxps_2Byv8u2wwZZz9xP4WnvAGdoEOuHimFii8XOj9LxgxJrOJ1fVZ5oZlMzMt3-UjDDg/exec'; 

let uidCounter   = 0;
let _docentes    = [];

document.addEventListener('DOMContentLoaded', () => {
  initListas();

  const hoy = new Date().toISOString().split('T')[0];
  document.getElementById('fecha').value        = hoy;
  document.getElementById('fechaEntrega').value = hoy;

  const anio = new Date().getFullYear();
  const sel  = document.getElementById('semestre');
  sel.innerHTML = `
    <option value="">-- Seleccione --</option>
    <option value="ENE-JUN ${anio}">ENE-JUN ${anio}</option>
    <option value="AGO-DIC ${anio}">AGO-DIC ${anio}</option>
  `;

  cargarDocentesJSONP();
  actualizarTotales();
});

function cargarDocentesJSONP() {
  const callbackName = 'docentesCallback_' + Math.round(100000 * Math.random());
  window[callbackName] = function(data) {
    if (data && data.docentes) _docentes = data.docentes;
    if (script.parentNode) script.parentNode.removeChild(script);
    delete window[callbackName];
  };
  const script = document.createElement('script');
  script.src = API_URL + '?action=docentes&callback=' + callbackName + '&t=' + new Date().getTime();
  document.body.appendChild(script);
}

function sinAcentos(str) { return str.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }

function filtrarDocentes(query, targetListId) {
  targetListId = targetListId || 'listaDocentes';
  const lista = document.getElementById(targetListId);
  if (!lista) return;
  if (!query || query.length < 2) { lista.style.display = 'none'; return; }
  const q = sinAcentos(query.toUpperCase());
  const matches = _docentes.filter(d => sinAcentos(d.toUpperCase()).includes(q)).slice(0, 8);
  if (matches.length === 0) { lista.style.display = 'none'; return; }
  const inputMap = { 'listaDocentes':'nombreTutor', 'listaFirmaTutor':'firmaTutor', 'listaFirmaCoord':'firmaCoord', 'listaFirmaJefe':'firmaJefe' };
  const inputId = inputMap[targetListId] || 'nombreTutor';
  lista.innerHTML = matches.map(d => 
    `<div onclick="seleccionarDocente('${d.replace(/'/g,"\\'")}','${inputId}','${targetListId}')" style="padding:9px 14px; cursor:pointer; font-size:13px; border-bottom:1px solid #f0f0f0;" onmouseover="this.style.background='#f0f4ff'" onmouseout="this.style.background='#fff'">${d}</div>`
  ).join('');
  lista.style.display = 'block';
}

function seleccionarDocente(nombre, inputId, listId) {
  document.getElementById(inputId).value = nombre;
  document.getElementById(listId).style.display = 'none';
  if (inputId === 'nombreTutor') document.getElementById('firmaTutor').value = nombre;
}

// ══════════════════
//  AGREGAR FILA
// ══════════════════
function agregarFila(scroll) {
  uidCounter++;
  const uid = uidCounter;
  const tbody = document.getElementById('cuerpoTabla');
  const num = tbody.rows.length + 1;

  const tr = document.createElement('tr');
  tr.id = `row-${uid}`; tr.dataset.uid = uid;
  
  tr.innerHTML = `
    <td class="num-cell">${num}</td>
    <td class="td-nombre"><input type="text" class="td-input" id="n-${uid}" placeholder="Nombre(s)" style="text-transform:uppercase" oninput="this.value=this.value.toUpperCase();onCampoChange(${uid})" onblur="validarFila(${uid})"></td>
    <td class="td-apell"><input type="text" class="td-input" id="a-${uid}" placeholder="Apellidos" style="text-transform:uppercase" oninput="this.value=this.value.toUpperCase();onCampoChange(${uid})" onblur="validarFila(${uid})"></td>
    <td style="text-align:center;"><select id="sx-${uid}" class="td-input" style="border:none; border-bottom:1.5px solid var(--borde); background:transparent; font-family:'IBM Plex Sans',sans-serif; font-size:11px; width:100%; text-align:center; cursor:pointer; outline:none; padding:3px 2px;"><option value="">*</option><option value="H">H</option><option value="M">M</option></select></td>
    <td><input type="checkbox" id="tg-${uid}" onchange="actualizarTotales()"></td>
    <td><input type="checkbox" id="ti-${uid}" onchange="actualizarTotales()"></td>
    <td><input type="checkbox" id="ca-${uid}" onchange="actualizarTotales()"></td>
    <td><input type="checkbox" id="a1-${uid}" onchange="actualizarTotales()"></td>
    <td><input type="checkbox" id="a2-${uid}" onchange="actualizarTotales()"></td>
    <td><input type="checkbox" id="a3-${uid}" onchange="actualizarTotales()"></td>
    <td><input type="checkbox" id="a4-${uid}" onchange="actualizarTotales()"></td>
    <td><input type="checkbox" id="a5-${uid}" onchange="actualizarTotales()"></td>
    <td><input type="checkbox" id="a6-${uid}" onchange="actualizarTotales()"></td>
    <td class="td-calif"><input type="text" class="td-input" id="cf-${uid}" placeholder="—" maxlength="1" oninput="validarCalificacionInput(this, ${uid})" onblur="validarCalif(${uid})"><span class="tip-error">0 a 4</span></td>
    <td><select id="st-${uid}" onchange="actualizarTotales()" style="border:none; border-bottom:1.5px solid var(--borde); background:transparent; font-family:'IBM Plex Sans',sans-serif; font-size:11px; width:100%; text-align:center; cursor:pointer; outline:none; padding:3px 2px;"><option value="">—</option><option value="PASÓ" style="color:var(--verde); font-weight:bold;">PASÓ</option><option value="REPROBÓ" style="color:var(--rojo); font-weight:bold;">REPROBÓ</option><option value="DESERTÓ" style="color:#666; font-weight:bold;">DESERTÓ</option></select></td>
    <td class="td-otra"><input type="text" class="td-input" id="oa-${uid}" placeholder="Especifique" style="text-transform:uppercase" oninput="this.value=this.value.toUpperCase()"></td>
    <td><input type="text" class="td-input" id="t1-${uid}" placeholder="*" maxlength="1" style="text-align:center; padding:2px;" oninput="validarTutoriaInput(this)"></td>
    <td><button class="btn-del-row" onclick="eliminarFila(${uid})">✕</button></td>
  `;
  tbody.appendChild(tr); actualizarNumeracion();
  if (scroll) { tr.scrollIntoView({ behavior: 'smooth', block: 'center' }); document.getElementById(`n-${uid}`).focus(); }
}

// ── VALIDACIONES ESTRICTAS ──
function validarCalificacionInput(input, uid) {
  input.value = input.value.replace(/[^0-9]/g, '');
  const val = parseInt(input.value, 10);
  if (input.value !== '' && (val < 0 || val > 4)) {
    input.value = '';
    input.classList.add('error-field');
    setTimeout(() => input.classList.remove('error-field'), 1000);
  } else {
    input.classList.remove('error-field');
  }
  evaluarCalificacion(uid);
}

function validarTutoriaInput(input) {
  input.value = input.value.replace(/[^0-9]/g, '');
  const val = parseInt(input.value, 10);
  if (input.value !== '' && val !== 1 && val !== 2) {
    input.value = '';
    input.classList.add('error-field');
    setTimeout(() => input.classList.remove('error-field'), 1000);
  } else {
    input.classList.remove('error-field');
  }
}

function evaluarCalificacion(uid) {
  const cf = document.getElementById(`cf-${uid}`);
  const st = document.getElementById(`st-${uid}`);
  if (!cf || !st) return;
  const val = parseInt(cf.value, 10);
  if (!isNaN(val)) {
    if (val >= 1 && val <= 4) st.value = 'PASÓ';
    else if (val === 0) st.value = 'REPROBÓ';
  } else { 
    if (st.value === 'PASÓ' || st.value === 'REPROBÓ') st.value = ''; 
  }
  actualizarTotales();
}

function eliminarFila(uid) { if (document.querySelectorAll('#cuerpoTabla tr').length <= 1) return; document.getElementById(`row-${uid}`)?.remove(); actualizarNumeracion(); actualizarTotales(); }
function actualizarNumeracion() { document.querySelectorAll('#cuerpoTabla tr').forEach((tr, i) => { tr.querySelector('.num-cell').textContent = i + 1; }); document.getElementById('contadorEst').textContent = `${document.querySelectorAll('#cuerpoTabla tr').length} registros`; }

function onCampoChange(uid) { const cf = document.getElementById(`cf-${uid}`); if (cf && cf.value.trim()) cf.classList.remove('error-field'); }

function validarFila(uid) { 
  const n = document.getElementById(`n-${uid}`)?.value.trim() || ''; 
  const a = document.getElementById(`a-${uid}`)?.value.trim() || ''; 
  const cf = document.getElementById(`cf-${uid}`); 
  if (!cf) return; 
  if ((n || a) && !cf.value.trim()) cf.classList.add('error-field'); 
  else cf.classList.remove('error-field'); 
}

function validarCalif(uid) { validarFila(uid); actualizarTotales(); }

function actualizarTotales() {
  let tg=0,ti=0,ca=0,a1=0,a2=0,a3=0,a4=0,a5=0,a6=0, suma=0, nCalif=0, cntH=0, cntM=0, pas=0, rep=0, des=0;
  document.querySelectorAll('#cuerpoTabla tr').forEach(tr => {
    const uid = tr.dataset.uid; if (!uid) return;
    if (document.getElementById(`tg-${uid}`)?.checked) tg++; if (document.getElementById(`ti-${uid}`)?.checked) ti++; if (document.getElementById(`ca-${uid}`)?.checked) ca++;
    if (document.getElementById(`a1-${uid}`)?.checked) a1++; if (document.getElementById(`a2-${uid}`)?.checked) a2++; if (document.getElementById(`a3-${uid}`)?.checked) a3++; if (document.getElementById(`a4-${uid}`)?.checked) a4++; if (document.getElementById(`a5-${uid}`)?.checked) a5++; if (document.getElementById(`a6-${uid}`)?.checked) a6++;
    const n = document.getElementById(`n-${uid}`)?.value.trim() || ''; const v = parseFloat(document.getElementById(`cf-${uid}`)?.value); if (n && !isNaN(v)) { suma += v; nCalif++; }
    const sx = document.getElementById(`sx-${uid}`)?.value || ''; if (sx === 'H') cntH++; if (sx === 'M') cntM++;
    const st = document.getElementById(`st-${uid}`)?.value || ''; if (st === 'PASÓ') pas++; if (st === 'REPROBÓ') rep++; if (st === 'DESERTÓ') des++;
  });
  
  document.getElementById('tot-h').textContent = cntH; document.getElementById('tot-m').textContent = cntM;
  document.getElementById('tot-tg').textContent = tg; document.getElementById('tot-ti').textContent = ti; document.getElementById('tot-canal').textContent = ca;
  document.getElementById('tot-a1').textContent = a1; document.getElementById('tot-a2').textContent = a2; document.getElementById('tot-a3').textContent = a3; document.getElementById('tot-a4').textContent = a4; document.getElementById('tot-a5').textContent = a5; document.getElementById('tot-a6').textContent = a6;
  document.getElementById('tot-prom').textContent = nCalif > 0 ? (suma/nCalif).toFixed(1) : '—';
  document.getElementById('tot-pas').textContent = pas; document.getElementById('tot-rep').textContent = rep; document.getElementById('tot-des').textContent = des;
}

function recolectarDatos() {
  const estudiantes = [];
  document.querySelectorAll('#cuerpoTabla tr').forEach(tr => {
    const uid = tr.dataset.uid; if (!uid) return;
    estudiantes.push({
      nombre: document.getElementById(`n-${uid}`)?.value || '', apellidos: document.getElementById(`a-${uid}`)?.value || '',
      sexo: document.getElementById(`sx-${uid}`)?.value || '',
      grupal: document.getElementById(`tg-${uid}`)?.checked, individual: document.getElementById(`ti-${uid}`)?.checked, canalizado: document.getElementById(`ca-${uid}`)?.checked,
      area1: document.getElementById(`a1-${uid}`)?.checked, area2: document.getElementById(`a2-${uid}`)?.checked, area3: document.getElementById(`a3-${uid}`)?.checked, area4: document.getElementById(`a4-${uid}`)?.checked, area5: document.getElementById(`a5-${uid}`)?.checked, area6: document.getElementById(`a6-${uid}`)?.checked,
      calificacion: document.getElementById(`cf-${uid}`)?.value || '', estatus: document.getElementById(`st-${uid}`)?.value || '', otraArea: document.getElementById(`oa-${uid}`)?.value || '',
      t1: document.getElementById(`t1-${uid}`)?.value || ''
    });
  });
  const actividades = []; document.querySelectorAll('#actividades .lista-item input[type="text"]').forEach(el => { if (el.value.trim()) actividades.push(el.value.trim()); });
  const acciones = []; document.querySelectorAll('#acciones .lista-item input[type="text"]').forEach(el => { if (el.value.trim()) acciones.push(el.value.trim()); });
  return {
    folio: document.getElementById('folioActual').value || '',
    nombreTutor: document.getElementById('nombreTutor').value, carrera: document.getElementById('carrera').value, grupo: document.getElementById('grupo').value, fecha: document.getElementById('fecha').value, semestre: document.getElementById('semestre').value, semestreGrupo: document.getElementById('semestreGrupo').value, estudiantes, actividades, acciones, observaciones: document.getElementById('observaciones').value, fechaEntrega: document.getElementById('fechaEntrega').value, firmaTutor: document.getElementById('firmaTutor').value, firmaCoord: document.getElementById('firmaCoord').value, firmaJefe: document.getElementById('firmaJefe').value
  };
}

function validarTodo(datos) {
  if (!datos.nombreTutor || !datos.carrera || !datos.grupo || !datos.fecha) { mostrarError('Complete los datos generales obligatorios.'); return false; }
  let hayAlguno = false; let primerError = null;
  
  document.querySelectorAll('#cuerpoTabla tr').forEach(tr => {
    const uid = tr.dataset.uid; if (!uid) return;
    const nombre = document.getElementById(`n-${uid}`)?.value.trim()  || '';
    const apell  = document.getElementById(`a-${uid}`)?.value.trim()  || '';
    const calif  = document.getElementById(`cf-${uid}`);
    const califVal = calif?.value.trim() || '';
    const sexo   = document.getElementById(`sx-${uid}`)?.value || '';
    const t1     = document.getElementById(`t1-${uid}`)?.value.trim() || '';

    if (!nombre && !apell && !califVal) return;
    hayAlguno = true;

    if (!nombre && !primerError) { primerError = { msg: `Fila ${tr.querySelector('.num-cell').textContent}: falta el Nombre.`, el: document.getElementById(`n-${uid}`) }; document.getElementById(`n-${uid}`)?.classList.add('error-field'); }
    if (!apell && !primerError) { primerError = { msg: `Fila ${tr.querySelector('.num-cell').textContent}: faltan los Apellidos.`, el: document.getElementById(`a-${uid}`) }; document.getElementById(`a-${uid}`)?.classList.add('error-field'); }
    if (!califVal && !primerError) { calif?.classList.add('error-field'); primerError = { msg: `Fila ${tr.querySelector('.num-cell').textContent}: falta la Calificación.`, el: calif }; } 
    else if (califVal) {
      const numC = parseInt(califVal, 10);
      if ((numC < 0 || numC > 4) && !primerError) { primerError = { msg: `Fila ${tr.querySelector('.num-cell').textContent}: Calificación debe ser de 0 a 4.`, el: calif }; calif?.classList.add('error-field'); }
    }
    if (!sexo && !primerError) { primerError = { msg: `Fila ${tr.querySelector('.num-cell').textContent}: seleccione el Sexo (H/M).`, el: document.getElementById(`sx-${uid}`) }; document.getElementById(`sx-${uid}`)?.classList.add('error-field'); }
    if (!t1 && !primerError) { primerError = { msg: `Fila ${tr.querySelector('.num-cell').textContent}: debe anotar la(s) Tutoría(s).`, el: document.getElementById(`t1-${uid}`) }; document.getElementById(`t1-${uid}`)?.classList.add('error-field'); } 
    else if (t1 && (t1 !== '1' && t1 !== '2') && !primerError) { primerError = { msg: `Fila ${tr.querySelector('.num-cell').textContent}: Tutoría solo permite 1 o 2.`, el: document.getElementById(`t1-${uid}`) }; document.getElementById(`t1-${uid}`)?.classList.add('error-field'); }
  });

  if (!hayAlguno) { mostrarError('Capture al menos un estudiante.'); return false; }
  if (primerError) { mostrarError(primerError.msg); primerError.el?.scrollIntoView({ behavior: 'smooth', block: 'center' }); primerError.el?.focus(); return false; }
  return true;
}

let _yaGuardado = false; let _datosGuardados = null; function _datosCambiaron(datos) { if (!_datosGuardados) return true; return JSON.stringify(datos) !== JSON.stringify(_datosGuardados); }

function guardarReporte() {
  ocultarError(); document.querySelectorAll('.error-field').forEach(el => el.classList.remove('error-field'));
  const datos = recolectarDatos(); if (!validarTodo(datos)) return;
  const folioActual = document.getElementById('folioActual').value || null;
  if (_yaGuardado && !folioActual && !_datosCambiaron(datos)) { document.getElementById('overlaySuccess').classList.add('active'); return; }
  document.getElementById('loadingTitulo').textContent = folioActual ? 'Actualizando...' : 'Guardando...';
  document.getElementById('overlayLoading').classList.add('active');
  const accion = folioActual ? 'actualizar' : 'crear';
  
  fetch(API_URL, { method: 'POST', mode: 'cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ accion, datos, folio: folioActual }) })
  .then(r => r.json()).then(res => {
    document.getElementById('overlayLoading').classList.remove('active');
    if (res.success) {
      _yaGuardado = true; _datosGuardados = JSON.parse(JSON.stringify(datos));
      if (res.folio) { document.getElementById('folioActual').value = res.folio; document.getElementById('versionActual').value = res.version || 1; if (res.idReporte) document.getElementById('idReporteActual').value = res.idReporte; _mostrarBadgeEdicion(res.folio, res.version || 1); }
      document.getElementById('overlaySuccess').classList.add('active');
    } else { mostrarError('Error: ' + (res.error || res.mensaje || '')); }
  }).catch(err => { document.getElementById('overlayLoading').classList.remove('active'); mostrarError('Error de conexión: ' + err.message); });
}

function llenarPlantillaExcel() {
  ocultarError(); document.querySelectorAll('.error-field').forEach(el => el.classList.remove('error-field'));
  const datos = recolectarDatos(); if (!validarTodo(datos)) return;
  const folioActual = document.getElementById('folioActual').value || null; const esEdicion = !!folioActual;
  
  datos.html = generarHTMLPreview(datos);

  document.getElementById('loadingTitulo').textContent = esEdicion ? 'Actualizando reporte...' : 'Procesando...';
  document.getElementById('loadingMsg').innerHTML = `<strong>Una vez generado el PDF:</strong><br>1. Imprima el documento.<br>2. Complete las firmas correspondientes.<br>3. Entregue a la Coordinación de Tutorías en Desarrollo Académico.`;
  document.getElementById('overlayLoading').classList.add('active'); document.getElementById('btnExcel').disabled = true;
  const accion = esEdicion ? 'actualizar' : 'crear';
  
  fetch(API_URL, { method: 'POST', mode: 'cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ accion, datos, folio: folioActual }) })
  .then(r => r.json()).then(res => {
    if (!res.success) {
      document.getElementById('overlayLoading').classList.remove('active'); document.getElementById('btnExcel').disabled = false;
      if (res.warning === 'duplicado') { if (confirm(`⚠️ Ya existe un reporte (${res.existente.folio}). ¿Abrirlo?`)) _cargarPorFolio(res.existente.folio); return; }
      mostrarError('Error al guardar: ' + (res.error || res.mensaje || '')); return;
    }
    
    document.getElementById('folioActual').value = res.folio; document.getElementById('versionActual').value = res.version; document.getElementById('idReporteActual').value = res.idReporte || '';
    
    fetch(API_URL, { method: 'POST', mode: 'cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ accion: 'generarPDF', datos, html: datos.html, folio: res.folio, version: res.version }) })
    .then(r => r.json()).then(resPDF => {
      document.getElementById('overlayLoading').classList.remove('active'); document.getElementById('btnExcel').disabled = false;
      if (!resPDF.success) { mostrarError('Error al generar PDF: ' + (resPDF.error||'')); return; }
      
      document.getElementById('folioMostrar').textContent = res.folio;
      document.getElementById('excelLink').href = resPDF.pdf1Url;
      document.getElementById('excelLink').setAttribute('download', 'Reporte_Tutor_' + res.folio + '.pdf');
      document.getElementById('overlayExcel').classList.add('active'); _mostrarBadgeEdicion(res.folio, res.version);
    }).catch(err => { document.getElementById('overlayLoading').classList.remove('active'); document.getElementById('btnExcel').disabled = false; mostrarError('Error al generar PDF: ' + err.message); });
  }).catch(err => { document.getElementById('overlayLoading').classList.remove('active'); document.getElementById('btnExcel').disabled = false; mostrarError('Error al guardar: ' + err.message); });
}

// ══════════════════════════════════════════════════════════════════
//  GENERACIÓN DEL PDF
// ══════════════════════════════════════════════════════════════════
function generarHTMLPreview(d) {
  const logo1 = 'https://raw.githubusercontent.com/DA-itd/web/main/LOGO_tecnm.jpg';
  const logoSGI = 'https://raw.githubusercontent.com/DA-itd/web/main/logo%20sgi.png';

  let estudiantesValidos = d.estudiantes.filter(e => e.nombre.trim() || e.apellidos.trim());
  let totalPaginas = Math.ceil(estudiantesValidos.length / 15) || 1; 
  let htmlPaginas = '';

  let totTG=0,totTI=0,totCanal=0,totA1=0,totA2=0,totA3=0,totA4=0,totA5=0,totA6=0, sumCalif=0, nCalif=0;
  estudiantesValidos.forEach(e => {
    if (e.grupal) totTG++; if (e.individual) totTI++; if (e.canalizado) totCanal++;
    if (e.area1) totA1++; if (e.area2) totA2++; if (e.area3) totA3++; if (e.area4) totA4++; if (e.area5) totA5++; if (e.area6) totA6++;
    const v = parseFloat(e.calificacion); if (!isNaN(v)) { sumCalif += v; nCalif++; }
  });

  for (let p = 0; p < totalPaginas; p++) {
      let esUltimaPagina = (p === totalPaginas - 1);
      let estudiantesPagina = estudiantesValidos.slice(p * 15, (p + 1) * 15); 

      let filas = '';
      for (let i = 0; i < 15; i++) { 
          const e = estudiantesPagina[i];
          if (!e) {
              filas += `<tr><td style="text-align:center; padding:2px;">${p*15 + i + 1}</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>`;
          } else {
              filas += `<tr>
                  <td style="text-align:center; font-weight:bold; padding:2px;">${p*15 + i + 1}</td>
                  <td style="text-align:center; padding:2px; font-size:7.5pt;">${e.nombre} ${e.apellidos}</td>
                  <td style="text-align:center; padding:2px;">${e.grupal ? 'X' : ''}</td>
                  <td style="text-align:center; padding:2px;">${e.individual ? 'X' : ''}</td>
                  <td style="text-align:center; padding:2px;">${e.canalizado ? 'X' : ''}</td>
                  <td style="text-align:center; padding:2px;">${e.area1 ? 'X' : ''}</td>
                  <td style="text-align:center; padding:2px;">${e.area2 ? 'X' : ''}</td>
                  <td style="text-align:center; padding:2px;">${e.area3 ? 'X' : ''}</td>
                  <td style="text-align:center; padding:2px;">${e.area4 ? 'X' : ''}</td>
                  <td style="text-align:center; padding:2px;">${e.area5 ? 'X' : ''}</td>
                  <td style="text-align:center; padding:2px;">${e.area6 ? 'X' : ''}</td>
                  <td style="text-align:center; padding:2px; font-size:7pt;">${e.otraArea || ''}</td>
                  <td style="text-align:center; padding:2px; font-size:7pt;">${e.t1 || ''}</td>
                  <td style="text-align:center; font-weight:bold; padding:2px;">${e.calificacion || ''}</td>
              </tr>`;
          }
      }

      let extrasHTML = '';
      if (esUltimaPagina) {
          let activs = '';
          for (let i = 0; i < 10; i++) {
              const act = d.actividades[i] || '';
              activs += `<tr><td style="width:20px; text-align:center; font-weight:bold; padding:1px;">${i+1}</td><td style="padding:1px; font-size:7.5pt;">${act}</td></tr>`;
          }
          let accs = '';
          for (let i = 0; i < 5; i++) {
              const acc = d.acciones[i] || '';
              accs += `<tr><td style="width:20px; text-align:center; font-weight:bold; padding:1px;">${i+1}</td><td style="padding:1px; font-size:7.5pt;">${acc}</td></tr>`;
          }

          extrasHTML = `
          <div class="sub-block">
              <div class="sub-title">Anotar las 10 actividades adicionales más importantes realizadas en el semestre</div>
              <table class="sub-table">${activs}</table>
          </div>
          <div class="sub-block">
              <div class="sub-title">Anotar las acciones de mayor impacto para alcanzar las competencias</div>
              <table class="sub-table">${accs}</table>
          </div>
          <div class="sub-block">
              <div style="border: 1px solid #000; padding: 3px; font-size: 7.5pt; min-height: 20px;">
                  <b>Observaciones:</b> ${d.observaciones}
              </div>
          </div>
          <div style="font-size: 8pt; margin: 5px 0; display: flex; justify-content: space-between;">
              <div><b>Fecha de entrega de este reporte:</b> ${d.fechaEntrega}</div>
              <div style="font-size: 7pt;"><b>Folio:</b> ${d.folio || ''}</div>
          </div>
          
          <table class="firmas-table">
              <tr>
                  <td style="width: 33%;">
                      <div style="border-top: 1px solid #000; width: 80%; margin: 0 auto; padding-top: 4px;">
                          <b>${d.firmaTutor}</b><br>Nombre y firma del Tutor
                      </div>
                  </td>
                  <td style="width: 33%;">
                      <div style="border-top: 1px solid #000; width: 80%; margin: 0 auto; padding-top: 4px;">
                          <b>${d.firmaCoord}</b><br>Nombre y firma del Coordinador de Tutoría del Departamento
                      </div>
                  </td>
                  <td style="width: 33%;">
                      <div style="border-top: 1px solid #000; width: 80%; margin: 0 auto; padding-top: 4px;">
                          <b>${d.firmaJefe}</b><br>Nombre y firma del Jefe de Departamento Académico
                      </div>
                  </td>
              </tr>
          </table>
          `;
      }

      htmlPaginas += `
      <div class="page">
          <div class="content-wrapper">
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 5px; border: 1px solid #000;">
                <tr>
                  <td style="width: 20%; text-align: center; vertical-align: middle; padding: 0; border-right: 1px solid #000;">
                    <div style="border-bottom: 1px solid #000; padding: 4px 0;">
                      <img src="${logo1}" alt="TecNM" style="height:30px;object-fit:contain">
                    </div>
                    <div style="padding: 4px 0; font-size:9pt; font-weight:bold;">
                      ITD-AC-PO-04-02
                    </div>
                  </td>
                  <td style="width: 60%; text-align:center; padding: 4px; vertical-align:middle;">
                      <div style="font-size:12pt; font-weight:bold;">INSTITUTO TECNOLÓGICO DE DURANGO</div>
                      <div style="font-size:9pt;">Reporte de Tutor Académico</div>
                      <div style="font-size:7pt;">Referencia a la Norma ISO 9001:2015, ISO 14001:2015, ISO 45001:2018, ISO 50001:2018</div>
                  </td>
                  <td style="width: 20%; text-align: center; vertical-align: middle; padding: 0; border-left: 1px solid #000;">
                    <div style="border-bottom: 1px solid #000; padding: 4px 0;">
                      <img src="${logoSGI}" alt="SGI" style="height:40px;object-fit:contain">
                    </div>
                    <div style="padding: 4px 0; font-size:8.5pt; font-weight:bold;">
                      Revisión: 1
                    </div>
                  </td>
                </tr>
              </table>

              <table class="info-table">
                <tr>
                  <td colspan="2" style="width: 70%;"><b>Nombre del Tutor:</b> ${d.nombreTutor}</td>
                  <td colspan="1" style="width: 30%;"><b>Fecha:</b> ${d.fecha}</td>
                </tr>
                <tr>
                  <td colspan="2"><b>Carrera:</b> ${d.carrera}</td>
                  <td colspan="1"><b>Grupo:</b> ${d.grupo}</td>
                </tr>
              </table>

              <table class="main-table">
                <thead>
                  <tr>
                    <th rowspan="2" style="width: 20px;">No.</th>
                    <th rowspan="2" style="width: 140px;">Lista de Estudiantes</th>
                    <th colspan="2" style="width: 80px;">Para cada Estudiante marque si fue atendido en el semestre mediante tutoría grupal, individual o ambas</th>
                    <th rowspan="2" style="width: 50px;">Indicar si el Estudiante fue canalizado en el semestre</th>
                    <th colspan="6">ÁREAS DE CANALIZACIÓN<br>(Marque la o las áreas a las que fue canalizado)<br>1. Actividades Extraescolares.<br>2. Ciencias Básicas.<br>3. Servicios Escolares.<br>4. Estudios Profesionales.<br>5. Desarrollo Académico.<br>6. Otra.</th>
                    <th rowspan="2" style="width: 50px;">Anotar el nombre de otras áreas de canalización</th>
                    <th rowspan="2" style="width: 50px;">Anotar Tutorías</th>
                    <th rowspan="2" style="width: 50px;">Calificación</th>
                  </tr>
                  <tr>
                    <th style="width: 40px;">Tutoría<br>Grupal</th>
                    <th style="width: 40px;">Tutoría<br>Individual</th>
                    <th style="width: 20px;">1</th><th style="width: 20px;">2</th><th style="width: 20px;">3</th>
                    <th style="width: 20px;">4</th><th style="width: 20px;">5</th><th style="width: 20px;">6</th>
                  </tr>
                </thead>
                <tbody>
                  ${filas}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="2" style="text-align:center; font-weight:bold; background:#f0f0f0;">T O T A L E S</td>
                    <td style="text-align:center; font-weight:bold;">${totTG}</td>
                    <td style="text-align:center; font-weight:bold;">${totTI}</td>
                    <td style="text-align:center; font-weight:bold;">${totCanal}</td>
                    <td style="text-align:center; font-weight:bold;">${totA1}</td>
                    <td style="text-align:center; font-weight:bold;">${totA2}</td>
                    <td style="text-align:center; font-weight:bold;">${totA3}</td>
                    <td style="text-align:center; font-weight:bold;">${totA4}</td>
                    <td style="text-align:center; font-weight:bold;">${totA5}</td>
                    <td style="text-align:center; font-weight:bold;">${totA6}</td>
                    <td></td>
                    <td></td>
                    <td style="text-align:center; font-weight:bold;">${nCalif > 0 ? (sumCalif/nCalif).toFixed(1) : '—'}</td>
                  </tr>
                </tfoot>
              </table>

              <table style="width: 100%; border-collapse: collapse; margin-bottom: 5px; font-size: 7pt;">
                <tr>
                  <td style="border: 1px solid #000; padding: 3px; vertical-align: top;">
                    <b>Instructivo de llenado:</b> Anote los datos correspondientes en los apartados del encabezado.<br>
                    • Este reporte deberá ser llenado por el Tutor.<br>
                    • Deberá ser entregado al Coordinador de Tutoría del Departamento Académico.
                  </td>
                </tr>
              </table>

              ${extrasHTML}
          </div>

          <div class="footer-bar">
              <table style="width: 100%; border-collapse: collapse; table-layout: fixed;">
                  <tr>
                      <td style="width: 30%; text-align: left; font-size: 7pt; padding: 5px;">INSTITUTO TECNOLÓGICO DE DURANGO</td>
                      <td style="width: 50%; text-align: center; font-size: 6.5pt; padding: 5px;">Toda copia en papel es un "documento no controlado" a excepción del original</td>
                      <td style="width: 20%; text-align: right; font-size: 7pt; padding: 5px;">Página ${p + 1}</td>
                  </tr>
              </table>
          </div>
      </div>
      `;

      if (!esUltimaPagina) { htmlPaginas += `<div style="page-break-after: always;"></div>`; }
  }

  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
  <style>
    @page { size: letter portrait; margin: 10mm; }
    body { font-family: Arial, sans-serif; font-size: 8pt; color: #000; margin: 0; padding: 0; }
    .page { page-break-inside: avoid; position: relative; min-height: 257mm; display: flex; flex-direction: column; }
    .content-wrapper { flex: 1; padding-bottom: 20px; }
    .iso-hdr { width:100%; border-collapse:collapse; margin-bottom:5px; text-align:center; border:1px solid #000; }
    .iso-hdr td { border-top: 1px solid #000; border-bottom: 1px solid #000; vertical-align:middle; }
    .info-table { width: 100%; border-collapse: collapse; margin-bottom: 5px; }
    .info-table td { border: 1px solid #000; padding: 3px 5px; font-size: 8pt; }
    .main-table { width: 100%; border-collapse: collapse; margin-bottom: 5px; }
    .main-table th, .main-table td { border: 1px solid #000; }
    .main-table th { background-color: #e0e0e0; text-align: center; font-size: 6.5pt; padding: 2px; }
    .sub-block { margin-bottom: 5px; page-break-inside: avoid; }
    .sub-title { background: #e0e0e0; border: 1px solid #000; border-bottom: none; font-weight: bold; font-size: 7.5pt; padding: 2px; }
    .sub-table { width: 100%; border-collapse: collapse; }
    .sub-table td { border: 1px solid #000; padding: 1px 3px; }
    .firmas-table { width: 100%; border-collapse: collapse; margin-top: 15px; text-align: center; page-break-inside: avoid; }
    .firmas-table td { padding: 20px 5px 0 5px; font-size: 7.5pt; border: none; }
    .footer-bar { background-color: #6b1a2e !important; color: #ffffff !important; padding: 0; font-size: 7pt; font-weight: bold; font-family: Arial, sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; position: absolute; bottom: 0; left: 0; right: 0; width: 100%; height: 22px; }
    .footer-bar table { border-collapse: collapse; margin: 0; height: 100%; }
    .footer-bar td { border: none; padding: 4px 8px; vertical-align: middle; white-space: nowrap; overflow: hidden; }
  </style></head><body>
  ${htmlPaginas}
  </body></html>`;
}

// ══════════════════════════════════════════════════════════════════
//  FUNCIONES DE UI Y BUSQUEDA
// ══════════════════════════════════════════════════════════════════

function _mostrarBadgeEdicion(folio, version) { document.getElementById('badgeFolio').textContent = folio; document.getElementById('badgeVersion').textContent = 'V' + version; document.getElementById('badgeEdicion').style.display = 'flex'; }
function _ocultarBadgeEdicion() { document.getElementById('badgeEdicion').style.display = 'none'; }
function cancelarEdicion() { if (!confirm('¿Cancelar edición?')) return; document.getElementById('folioActual').value = ''; document.getElementById('versionActual').value = ''; document.getElementById('idReporteActual').value = ''; _ocultarBadgeEdicion(); _limpiarSinConfirmar(); }

function abrirBuscar() { document.getElementById('overlayBuscar').classList.add('active'); document.getElementById('buscarFolio').focus(); }
function cerrarBuscar() { document.getElementById('overlayBuscar').classList.remove('active'); ['buscarFolio','buscarTutor','buscarGrupo','buscarFecha'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; }); }

function ejecutarBusqueda() {
  const folio = document.getElementById('buscarFolio').value.trim(); if (folio) { _cargarPorFolio(folio); return; }
  const tutor = document.getElementById('buscarTutor').value.trim(); const grupo = document.getElementById('buscarGrupo').value.trim(); const fecha = document.getElementById('buscarFecha').value;
  if (!tutor && !grupo && !fecha) { mostrarError('Ingrese un folio, o al menos Tutor, Grupo o Fecha.'); return; }

  document.getElementById('overlayLoading').classList.add('active'); document.getElementById('loadingTitulo').textContent = 'Buscando...'; document.getElementById('loadingMsg').textContent = 'Espere por favor.';

  fetch(API_URL, { method: 'POST', mode: 'cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ accion: 'buscar', nombreTutor: tutor, grupo, fecha }) })
  .then(r => r.json()).then(res => {
    document.getElementById('overlayLoading').classList.remove('active'); 
    if (!res.success || !res.datos) { mostrarError('No se encontró ningún reporte con esos datos.'); return; }
    _cargarDatosEnFormulario(res.datos); cerrarBuscar(); _mostrarBadgeEdicion(res.datos.folio, res.datos.version); ocultarError();
  }).catch(err => { document.getElementById('overlayLoading').classList.remove('active'); mostrarError('Error de conexión: ' + err.message); });
}

function _cargarPorFolio(folio) {
  document.getElementById('overlayLoading').classList.add('active'); document.getElementById('loadingTitulo').textContent = 'Cargando ' + folio + '...'; document.getElementById('loadingMsg').textContent = 'Espere por favor.';

  fetch(API_URL, { method: 'POST', mode: 'cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ accion: 'buscar', folio }) })
  .then(r => r.json()).then(res => {
    document.getElementById('overlayLoading').classList.remove('active'); 
    if (!res.success || !res.datos) { mostrarError('No se pudo cargar el reporte: ' + (res.error || 'Datos no encontrados')); return; }
    _cargarDatosEnFormulario(res.datos); cerrarBuscar(); _mostrarBadgeEdicion(res.datos.folio, res.datos.version); ocultarError();
  }).catch(err => { document.getElementById('overlayLoading').classList.remove('active'); mostrarError('Error de conexión: ' + err.message); });
}

function _cargarDatosEnFormulario(datos, opts) {
  opts = opts || {}; document.getElementById('cuerpoTabla').innerHTML = ''; uidCounter = 0; initListas();
  document.getElementById('nombreTutor').value = datos.nombreTutor || ''; document.getElementById('carrera').value = datos.carrera || ''; document.getElementById('grupo').value = datos.grupo || ''; document.getElementById('fecha').value = datos.fecha || ''; document.getElementById('semestre').value = datos.semestre || ''; document.getElementById('semestreGrupo').value = datos.semestreGrupo || ''; document.getElementById('observaciones').value = datos.observaciones || ''; document.getElementById('fechaEntrega').value = datos.fechaEntrega || ''; document.getElementById('firmaTutor').value = datos.firmaTutor || ''; document.getElementById('firmaCoord').value = datos.firmaCoord || ''; document.getElementById('firmaJefe').value = datos.firmaJefe || '';
  (datos.estudiantes || []).forEach(est => {
    agregarFila(false); const uid = uidCounter;
    document.getElementById(`n-${uid}`).value = est.nombre || ''; document.getElementById(`a-${uid}`).value = est.apellidos || ''; document.getElementById(`sx-${uid}`).value = est.sexo || ''; document.getElementById(`tg-${uid}`).checked = !!est.grupal; document.getElementById(`ti-${uid}`).checked = !!est.individual; document.getElementById(`ca-${uid}`).checked = !!est.canalizado; document.getElementById(`a1-${uid}`).checked = !!est.area1; document.getElementById(`a2-${uid}`).checked = !!est.area2; document.getElementById(`a3-${uid}`).checked = !!est.area3; document.getElementById(`a4-${uid}`).checked = !!est.area4; document.getElementById(`a5-${uid}`).checked = !!est.area5; document.getElementById(`a6-${uid}`).checked = !!est.area6; document.getElementById(`oa-${uid}`).value = est.otraArea || ''; document.getElementById(`cf-${uid}`).value = est.calificacion || ''; document.getElementById(`st-${uid}`).value = est.estatus || ''; document.getElementById(`t1-${uid}`).value = est.t1 || '';
  });
  (datos.actividades || []).forEach(a => { agregarActividad(); document.getElementById(`act${_numAct}`).value = a; });
  (datos.acciones || []).forEach(a => { agregarAccion(); document.getElementById(`acc${_numAcc}`).value = a; });
  if (!opts.newReport && datos.folio) { document.getElementById('folioActual').value = datos.folio; document.getElementById('versionActual').value = datos.version || 1; document.getElementById('idReporteActual').value = datos.idReporte || ''; }
  else { document.getElementById('folioActual').value = ''; document.getElementById('versionActual').value = ''; document.getElementById('idReporteActual').value = ''; _ocultarBadgeEdicion(); }
  actualizarNumeracion(); actualizarTotales(); actualizarContadorListas(); window.scrollTo({ top:0, behavior:'smooth' });
}

function limpiarFormulario() { if (!confirm('¿Desea limpiar todo el formulario?')) return; _limpiarSinConfirmar(); }
function _limpiarSinConfirmar() {
  ['nombreTutor','carrera','grupo','semestre','semestreGrupo','observaciones','firmaTutor','firmaCoord','firmaJefe'].forEach(id => { const el = document.getElementById(id); if (el) { el.value = ''; el.classList.remove('error-field'); } });
  const hoy = new Date().toISOString().split('T')[0]; document.getElementById('fecha').value = hoy; document.getElementById('fechaEntrega').value = hoy; document.getElementById('cuerpoTabla').innerHTML = ''; uidCounter = 0; document.getElementById('folioActual').value = ''; document.getElementById('versionActual').value = ''; document.getElementById('idReporteActual').value = ''; _ocultarBadgeEdicion(); initListas(); actualizarTotales(); actualizarContadorListas(); ocultarError(); window.scrollTo({ top: 0, behavior: 'smooth' });
}
function cerrarSuccess() { document.getElementById('overlaySuccess').classList.remove('active'); _yaGuardado = false; _datosGuardados = null; limpiarFormulario(); }
function regresarACorregir() { document.getElementById('overlaySuccess').classList.remove('active'); _yaGuardado = false; window.scrollTo({ top: 0, behavior: 'smooth' }); }
function mostrarError(msg) { const b = document.getElementById('errorBanner'); b.style.background = ''; b.style.borderColor = ''; b.style.color = ''; document.getElementById('errorMsg').textContent = msg; b.classList.add('active'); b.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
function ocultarError() { document.getElementById('errorBanner').classList.remove('active'); }
function mostrarInfo(msg) { const b = document.getElementById('errorBanner'); b.style.background = '#e8f0fe'; b.style.borderColor = '#003087'; b.style.color = '#003087'; document.getElementById('errorMsg').textContent = msg; b.classList.add('active'); setTimeout(() => { b.style.background = ''; b.style.borderColor = ''; b.style.color = ''; }, 6000); }
function cerrarOverlayExcel() { document.getElementById('overlayExcel').classList.remove('active'); }

let _numAct = 0; let _numAcc = 0;
function initListas() { document.getElementById('actividades').innerHTML = ''; document.getElementById('acciones').innerHTML = ''; _numAct = 0; _numAcc = 0; actualizarContadorListas(); }
function agregarActividad() { if (_numAct >= 10) { mostrarError('Máximo 10 actividades.'); return; } _numAct++; const div = document.createElement('div'); div.className = 'lista-item'; div.id = `act-item-${_numAct}`; div.innerHTML = `<div class="lista-num">${_numAct}</div><input type="text" id="act${_numAct}" style="text-transform:uppercase" oninput="this.value=this.value.toUpperCase()" placeholder="Actividad ${_numAct}..."><button class="btn-del-row" onclick="eliminarActividad(${_numAct})" title="Eliminar">✕</button>`; document.getElementById('actividades').appendChild(div); document.getElementById(`act${_numAct}`).focus(); actualizarContadorListas(); }
function eliminarActividad(n) { document.getElementById(`act-item-${n}`)?.remove(); document.querySelectorAll('#actividades .lista-item').forEach((el, i) => { el.querySelector('.lista-num').textContent = i + 1; }); actualizarContadorListas(); }
function agregarAccion() { if (_numAcc >= 5) { mostrarError('Máximo 5 acciones.'); return; } _numAcc++; const div = document.createElement('div'); div.className = 'lista-item'; div.id = `acc-item-${_numAcc}`; div.innerHTML = `<div class="lista-num">${_numAcc}</div><input type="text" id="acc${_numAcc}" style="text-transform:uppercase" oninput="this.value=this.value.toUpperCase()" placeholder="Acción ${_numAcc}..."><button class="btn-del-row" onclick="eliminarAccion(${_numAcc})" title="Eliminar">✕</button>`; document.getElementById('acciones').appendChild(div); document.getElementById(`acc${_numAcc}`).focus(); actualizarContadorListas(); }
function eliminarAccion(n) { document.getElementById(`acc-item-${n}`)?.remove(); document.querySelectorAll('#acciones .lista-item').forEach((el, i) => { el.querySelector('.lista-num').textContent = i + 1; }); actualizarContadorListas(); }
function actualizarContadorListas() { _numAct = document.querySelectorAll('#actividades .lista-item').length; _numAcc = document.querySelectorAll('#acciones .lista-item').length; document.getElementById('cntAct').textContent = `${_numAct} / 10`; document.getElementById('cntAcc').textContent = `${_numAcc} / 5`; const btnAct = document.querySelector('button[onclick="agregarActividad()"]'); const btnAcc = document.querySelector('button[onclick="agregarAccion()"]'); if (btnAct) btnAct.style.display = _numAct >= 10 ? 'none' : 'inline-flex'; if (btnAcc) btnAcc.style.display = _numAcc >= 5 ? 'none' : 'inline-flex'; }