/**
 * DownloadSchedule — OFPPT Timetable Export
 * 
 * PDF:  jsPDF + jspdf-autotable  (loaded via CDN in index.html, or imported below)
 * XLSX: SheetJS / xlsx            (imported from npm)
 *
 * Install once in your project:
 *   npm install jspdf jspdf-autotable xlsx
 */

import { useState } from 'react';
import * as XLSX from 'xlsx';

// ── Constants ───────────────────────────────────────────
const DAYS = {1:'Lundi', 2:'Mardi', 3:'Mercredi', 4:'Jeudi', 5:'Vendredi', 6:'Samedi', 7:'Dimanche'};

// OFPPT brand colours (used in PDF headers)
const GREEN  = [0, 104, 55];   // #006837
const RED    = [200, 16, 46];  // #C8102E
const WHITE  = [255, 255, 255];
const DARK   = [15, 25, 35];
const GRAY   = [240, 244, 248];
const BORDER = [200, 210, 220];

// ── Helpers ─────────────────────────────────────────────
function fmt(sessions) {
  return sessions.map(s => ({
    Jour:       DAYS[s.day_of_week] || s.day_of_week,
    'Heure début': s.start_time,
    'Heure fin':   s.end_time,
    Module:        s.subject_name  || s.subject_id  || '—',
    Formateur:     s.instructor_name || s.instructor_id || '—',
    Groupe:        s.group_name    || s.group_id    || '—',
    Salle:         s.room_name     || s.room_id     || '—',
    Statut:        s.status === 'cancelled' ? 'Annulé' : 'Actif',
  }));
}

function dayOrder(a, b) {
  const order = Object.keys(DAYS).map(Number);
  return order.indexOf(a.day_of_week) - order.indexOf(b.day_of_week);
}

// ── EXCEL EXPORT ────────────────────────────────────────
function exportExcel(sessions, title) {
  const sorted = [...sessions].sort(dayOrder);
  const rows   = fmt(sorted);

  const wb = XLSX.utils.book_new();
  wb.Props = { Title: 'OFPPT – Emploi du Temps', Author: 'OFPPT TMS' };

  // ─ Sheet 1: Full list ─
  const ws = XLSX.utils.json_to_sheet(rows);

  // Column widths
  ws['!cols'] = [
    {wch:12}, {wch:14}, {wch:12}, {wch:30},
    {wch:24}, {wch:16}, {wch:16}, {wch:10},
  ];

  // Freeze header row
  ws['!freeze'] = { xSplit:0, ySplit:1 };

  XLSX.utils.book_append_sheet(wb, ws, 'Emploi du Temps');

  // ─ Sheet 2: Per-day breakdown ─
  const dayGroups = {};
  sorted.forEach(s => {
    const d = DAYS[s.day_of_week] || `Jour ${s.day_of_week}`;
    if (!dayGroups[d]) dayGroups[d] = [];
    dayGroups[d].push(s);
  });

  Object.entries(dayGroups).forEach(([day, daySessions]) => {
    const dayRows = fmt(daySessions.sort((a,b) => a.start_time.localeCompare(b.start_time)));
    const ws2 = XLSX.utils.json_to_sheet(dayRows);
    ws2['!cols'] = [{wch:12},{wch:14},{wch:12},{wch:30},{wch:24},{wch:16},{wch:16},{wch:10}];
    XLSX.utils.book_append_sheet(wb, ws2, day.slice(0,3));
  });

  const filename = `OFPPT_${title.replace(/\s+/g,'_')}_${new Date().toISOString().slice(0,10)}.xlsx`;
  XLSX.writeFile(wb, filename);
}

// ── PDF EXPORT ──────────────────────────────────────────
async function exportPDF(sessions, title, subtitle) {
  // Lazy-load jsPDF + autotable at call time (avoids bundle cost if unused)
  let jsPDF, autoTable;
  try {
    const mod = await import('jspdf');
    jsPDF = mod.jsPDF;
    autoTable = (await import('jspdf-autotable')).default;
  } catch {
    alert('Bibliothèque PDF manquante. Installez : npm install jspdf jspdf-autotable');
    return;
  }

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const PW = doc.internal.pageSize.getWidth();
  const PH = doc.internal.pageSize.getHeight();
  const today = new Date().toLocaleDateString('fr-MA', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  const sorted  = [...sessions].sort(dayOrder);
  const rows    = fmt(sorted).map(Object.values);
  const columns = ['Jour','Début','Fin','Module','Formateur','Groupe','Salle','Statut'];

  // ── Header band ──
  doc.setFillColor(...GREEN);
  doc.rect(0, 0, PW * 0.65, 22, 'F');
  doc.setFillColor(...RED);
  doc.rect(PW * 0.65, 0, PW * 0.35, 22, 'F');

  // Logo placeholder — white square with "OP" letters
  doc.setFillColor(...WHITE);
  doc.roundedRect(7, 4, 14, 14, 2, 2, 'F');
  doc.setTextColor(...GREEN);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('OP', 14, 13, { align:'center' });

  // Title
  doc.setTextColor(...WHITE);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('OFPPT', 26, 10);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Office de la Formation Professionnelle et de la Promotion du Travail', 26, 15);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(title.toUpperCase(), 26, 20);

  // Right side: subtitle + date
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(subtitle || 'Emploi du Temps', PW - 8, 10, { align:'right' });
  doc.setFontSize(7);
  doc.text(`Généré le : ${today}`, PW - 8, 16, { align:'right' });
  doc.text(`${sessions.length} séance(s)`, PW - 8, 20, { align:'right' });

  // ── Table ──
  autoTable(doc, {
    startY: 26,
    head: [columns],
    body: rows,
    styles: {
      font: 'helvetica',
      fontSize: 7.5,
      cellPadding: { top:3, right:4, bottom:3, left:4 },
      overflow: 'linebreak',
      lineColor: BORDER,
      lineWidth: 0.3,
      textColor: DARK,
    },
    headStyles: {
      fillColor: DARK,
      textColor: WHITE,
      fontStyle: 'bold',
      fontSize: 7.5,
      halign: 'center',
    },
    alternateRowStyles: {
      fillColor: GRAY,
    },
    columnStyles: {
      0: { fontStyle:'bold', textColor:GREEN, halign:'center', cellWidth:20 },
      1: { halign:'center', cellWidth:18 },
      2: { halign:'center', cellWidth:16 },
      7: { halign:'center', cellWidth:16 },
    },
    // Highlight "Annulé" rows
    didParseCell: (data) => {
      if (data.column.index === 7 && data.cell.raw === 'Annulé') {
        data.cell.styles.textColor = RED;
        data.cell.styles.fontStyle = 'bold';
      }
      if (data.column.index === 0 && data.section === 'body') {
        data.cell.styles.fillColor = [235, 250, 241]; // light green tint
      }
    },
    // Page footer
    didDrawPage: (data) => {
      const pg = doc.internal.getCurrentPageInfo().pageNumber;
      const total = doc.internal.getNumberOfPages();
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(150);
      doc.text('OFPPT — Système de Gestion des Emplois du Temps', 10, PH - 6);
      doc.text(`Page ${pg} / ${total}`, PW - 10, PH - 6, { align:'right' });
      doc.setDrawColor(...BORDER);
      doc.line(10, PH - 9, PW - 10, PH - 9);
    },
    margin: { top:26, left:10, right:10, bottom:14 },
  });

  const filename = `OFPPT_${title.replace(/\s+/g,'_')}_${new Date().toISOString().slice(0,10)}.pdf`;
  doc.save(filename);
}

// ── Component ────────────────────────────────────────────
export default function DownloadSchedule({ sessions = [], title = 'Emploi du Temps', subtitle = '' }) {
  const [loading, setLoading] = useState(null); // 'pdf' | 'xlsx' | null

  const handlePDF = async () => {
    if (!sessions.length) { alert('Aucune séance à exporter.'); return; }
    setLoading('pdf');
    try { await exportPDF(sessions, title, subtitle); }
    finally { setLoading(null); }
  };

  const handleExcel = () => {
    if (!sessions.length) { alert('Aucune séance à exporter.'); return; }
    setLoading('xlsx');
    try { exportExcel(sessions, title); }
    finally { setLoading(null); }
  };

  const Spinner = () => (
    <div style={{ width:13, height:13, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'_oSpin 0.65s linear infinite' }} />
  );

  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, fontFamily:"'Sora', sans-serif" }}>
      {/* Excel button */}
      <button
        onClick={handleExcel}
        disabled={!!loading}
        title="Télécharger en Excel (.xlsx)"
        style={{
          display:'flex', alignItems:'center', gap:6,
          padding:'8px 14px', borderRadius:10, cursor:'pointer',
          background: loading==='xlsx' ? 'rgba(21,128,61,0.18)' : 'rgba(21,128,61,0.12)',
          border:'1px solid rgba(21,128,61,0.25)',
          color:'#22c55e', fontSize:12.5, fontWeight:600,
          transition:'all 0.15s', outline:'none',
          opacity: loading && loading!=='xlsx' ? 0.5 : 1,
        }}
        onMouseEnter={e => { if(!loading){ e.currentTarget.style.background='rgba(21,128,61,0.22)'; e.currentTarget.style.transform='translateY(-1px)'; }}}
        onMouseLeave={e => { e.currentTarget.style.background='rgba(21,128,61,0.12)'; e.currentTarget.style.transform='none'; }}
      >
        {loading==='xlsx' ? <Spinner /> : (
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
        )}
        Excel
      </button>

      {/* PDF button */}
      <button
        onClick={handlePDF}
        disabled={!!loading}
        title="Télécharger en PDF"
        style={{
          display:'flex', alignItems:'center', gap:6,
          padding:'8px 14px', borderRadius:10, cursor:'pointer',
          background: loading==='pdf' ? 'rgba(200,16,46,0.18)' : 'rgba(200,16,46,0.1)',
          border:'1px solid rgba(200,16,46,0.25)',
          color:'#f87171', fontSize:12.5, fontWeight:600,
          transition:'all 0.15s', outline:'none',
          opacity: loading && loading!=='pdf' ? 0.5 : 1,
        }}
        onMouseEnter={e => { if(!loading){ e.currentTarget.style.background='rgba(200,16,46,0.18)'; e.currentTarget.style.transform='translateY(-1px)'; }}}
        onMouseLeave={e => { e.currentTarget.style.background='rgba(200,16,46,0.1)'; e.currentTarget.style.transform='none'; }}
      >
        {loading==='pdf' ? <Spinner /> : (
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <path d="M9 13h2a1 1 0 0 1 0 2H9v-2z"/>
            <path d="M9 17h6"/>
          </svg>
        )}
        PDF
      </button>

      {/* session count badge */}
      {sessions.length > 0 && (
        <span style={{ fontSize:9, fontWeight:700, color:'var(--text-4)', letterSpacing:'0.06em', fontFamily:"'JetBrains Mono', monospace" }}>
          {sessions.length} séance{sessions.length>1?'s':''}
        </span>
      )}
    </div>
  );
}
