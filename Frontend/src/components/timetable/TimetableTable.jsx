/**
 * TimetableTable.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * OFPPT Timetable — dual theme (dark translucent / light solid vivid)
 * TRANSPOSED VIEW:
 *   - rows = days
 *   - columns = time
 */

import { useMemo, useEffect, useState } from 'react';
import { buildLayout, computeCardStyle } from './timetableLayout';

// ─── Constants ───────────────────────────────────────────────────────────────

const START_HOUR = 8;
const END_HOUR = 20;
const HOUR_HEIGHT = 72;
const TOTAL_WIDTH = (END_HOUR - START_HOUR) * HOUR_HEIGHT;
const DAYS = [1, 2, 3, 4, 5, 6, 7];
const DAYS_SHORT = { 1: 'Lun', 2: 'Mar', 3: 'Mer', 4: 'Jeu', 5: 'Ven', 6: 'Sam', 7: 'Dim' };
const ROW_HEIGHT = 115;

// ─── Palettes ─────────────────────────────────────────────────────────────────

const PALETTE_DARK = [
  { border: '#00a651', bg: 'rgba(0,166,81,0.13)', text: '#34d675', glow: 'rgba(0,166,81,0.3)' },
  { border: '#3b82f6', bg: 'rgba(59,130,246,0.13)', text: '#7bb5fa', glow: 'rgba(59,130,246,0.3)' },
  { border: '#f59e0b', bg: 'rgba(245,158,11,0.13)', text: '#fbbf24', glow: 'rgba(245,158,11,0.3)' },
  { border: '#a78bfa', bg: 'rgba(167,139,250,0.13)', text: '#c4b5fd', glow: 'rgba(167,139,250,0.3)' },
  { border: '#2dd4bf', bg: 'rgba(45,212,191,0.13)', text: '#5eead4', glow: 'rgba(45,212,191,0.3)' },
  { border: '#f97316', bg: 'rgba(249,115,22,0.13)', text: '#fb923c', glow: 'rgba(249,115,22,0.3)' },
  { border: '#ec4899', bg: 'rgba(236,72,153,0.13)', text: '#f472b6', glow: 'rgba(236,72,153,0.3)' },
  { border: '#38bdf8', bg: 'rgba(56,189,248,0.13)', text: '#7dd3fc', glow: 'rgba(56,189,248,0.3)' },
];

const PALETTE_LIGHT = [
  { solid: '#0f9d58', hover: '#0b8a4d', glow: 'rgba(15,157,88,0.35)' },
  { solid: '#4285f4', hover: '#3367d6', glow: 'rgba(66,133,244,0.35)' },
  { solid: '#e53935', hover: '#c62828', glow: 'rgba(229,57,53,0.35)' },
  { solid: '#8e24aa', hover: '#7b1fa2', glow: 'rgba(142,36,170,0.35)' },
  { solid: '#00897b', hover: '#00796b', glow: 'rgba(0,137,123,0.35)' },
  { solid: '#f57c00', hover: '#e65100', glow: 'rgba(245,124,0,0.35)' },
  { solid: '#d81b60', hover: '#c2185b', glow: 'rgba(216,27,96,0.35)' },
  { solid: '#039be5', hover: '#0288d1', glow: 'rgba(3,155,229,0.35)' },
];

const CANCELLED_DARK = { border: '#ef4444', bg: 'rgba(239,68,68,0.08)', text: '#fca5a5', glow: 'rgba(239,68,68,0.2)' };
const CANCELLED_LIGHT = { solid: '#b91c1c', hover: '#991b1b', glow: 'rgba(185,28,28,0.35)' };

// ─── Stable subject → palette index ──────────────────────────────────────────

const _indexMap = new Map();
let _nextIdx = 0;

function getPaletteIndex(subjectId) {
  if (!_indexMap.has(subjectId)) {
    _indexMap.set(subjectId, _nextIdx % PALETTE_DARK.length);
    _nextIdx++;
  }
  return _indexMap.get(subjectId);
}

// ─── Hook: observe data-theme on <html> ──────────────────────────────────────

function useIsDark() {
  const [isDark, setIsDark] = useState(
    () => document.documentElement.getAttribute('data-theme') !== 'light'
  );
  useEffect(() => {
    const observer = new MutationObserver(() =>
      setIsDark(document.documentElement.getAttribute('data-theme') !== 'light')
    );
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);
  return isDark;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function TimeHeader({ hour, index }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: index * HOUR_HEIGHT,
        top: 0,
        width: HOUR_HEIGHT,
        height: 52,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRight: '1px solid var(--border)',
        pointerEvents: 'none',
      }}
    >
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: 'var(--text-4)',
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: '0.03em',
        }}
      >
        {String(hour).padStart(2, '0')}:00
      </span>
    </div>
  );
}

function DayLabel({ day, isToday }) {
  return (
    <div
      style={{
        height: ROW_HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        background: isToday ? 'rgba(0,150,66,0.08)' : 'var(--bg-elevated)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        left: 0,
        zIndex: 2,
      }}
    >
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          fontFamily: "'JetBrains Mono', monospace",
          color: isToday ? 'var(--accent)' : 'var(--text-3)',
        }}
      >
        {DAYS_SHORT[day]}
      </span>
      {isToday && (
        <div
          style={{
            width: 20,
            height: 2,
            borderRadius: 1,
            background: 'var(--accent)',
            boxShadow: '0 0 6px var(--accent-glow)',
          }}
        />
      )}
    </div>
  );
}

// ─── Session card ─────────────────────────────────────────────────────────────

function SessionCard({ session, cardStyle, onClick, isDark }) {
  const cancelled = session.status === 'cancelled';
  const idx = getPaletteIndex(session.subject_id);
  const h = cardStyle._heightPx;
  const mode = h < 44 ? 'tiny' : h < 76 ? 'compact' : 'normal';

  if (isDark) {
    const c = cancelled ? CANCELLED_DARK : PALETTE_DARK[idx];

    const baseShadow = `inset 0 1px 0 ${c.border}20`;
    const hoverShadow = `0 6px 20px -4px ${c.glow}, inset 0 1px 0 ${c.border}35`;

    const handleEnter = e => {
      e.currentTarget.style.transform = 'scale(1.018)';
      e.currentTarget.style.boxShadow = hoverShadow;
      e.currentTarget.style.zIndex = '20';
    };
    const handleLeave = e => {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.boxShadow = baseShadow;
      e.currentTarget.style.zIndex = '10';
    };

    return (
      <div
        onClick={() => onClick?.(session)}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        style={{
          position: 'absolute',
          top: cardStyle.top,
          height: cardStyle.height,
          left: cardStyle.left,
          width: cardStyle.width,
          boxSizing: 'border-box',
          cursor: 'pointer',
          overflow: 'hidden',
          zIndex: 10,
          borderRadius: 10,
          border: `1px solid ${c.border}35`,
          borderLeft: `3px solid ${c.border}`,
          background: c.bg,
          padding: mode === 'tiny' ? '2px 7px' : mode === 'compact' ? '5px 8px' : '8px 10px',
          boxShadow: baseShadow,
          transition: 'transform 0.13s ease, box-shadow 0.13s ease',
        }}
      >
        <CardContent
          mode={mode}
          session={session}
          textColor={c.text}
          timeBg={`${c.border}18`}
          timeBorder={`${c.border}28`}
          metaColor="var(--text-2)"
          roomColor="var(--text-3)"
          cancelled={cancelled}
          isDark={true}
        />
      </div>
    );
  }

  const c = cancelled ? CANCELLED_LIGHT : PALETTE_LIGHT[idx];

  const baseShadow = `0 1px 3px ${c.glow}, 0 1px 2px rgba(0,0,0,0.1)`;
  const hoverShadow = `0 4px 14px ${c.glow}, 0 2px 6px rgba(0,0,0,0.15)`;

  const handleEnter = e => {
    e.currentTarget.style.transform = 'translateY(-1px)';
    e.currentTarget.style.boxShadow = hoverShadow;
    e.currentTarget.style.background = c.hover;
    e.currentTarget.style.zIndex = '20';
  };
  const handleLeave = e => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = baseShadow;
    e.currentTarget.style.background = c.solid;
    e.currentTarget.style.zIndex = '10';
  };

  return (
    <div
      onClick={() => onClick?.(session)}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        position: 'absolute',
        top: cardStyle.top,
        height: cardStyle.height,
        left: cardStyle.left,
        width: cardStyle.width,
        boxSizing: 'border-box',
        cursor: 'pointer',
        overflow: 'hidden',
        zIndex: 10,
        borderRadius: 10,
        border: 'none',
        borderLeft: `3px solid rgba(255,255,255,0.25)`,
        background: c.solid,
        padding: mode === 'tiny' ? '2px 7px' : mode === 'compact' ? '5px 8px' : '8px 10px',
        boxShadow: baseShadow,
        transition: 'transform 0.13s ease, box-shadow 0.13s ease, background 0.1s ease',
      }}
    >
      <CardContent
        mode={mode}
        session={session}
        textColor="rgba(255,255,255,0.95)"
        timeBg="rgba(255,255,255,0.18)"
        timeBorder="rgba(255,255,255,0.3)"
        metaColor="rgba(255,255,255,0.85)"
        roomColor="rgba(255,255,255,0.75)"
        cancelled={cancelled}
        isDark={false}
      />
    </div>
  );
}

// ─── Shared card content ──────────────────────────────────────────────────────

function CardContent({ mode, session, textColor, timeBg, timeBorder, metaColor, roomColor, cancelled, isDark }) {
  return (
    <>
      {mode === 'tiny' && (
        <div
          style={{
            fontSize: 9,
            fontWeight: 700,
            color: textColor,
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {session.subject_name || session.subject_id}
        </div>
      )}

      {mode === 'compact' && (
        <>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: textColor,
              lineHeight: 1.25,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              marginBottom: 2,
            }}
          >
            {session.subject_name || session.subject_id}
          </div>
          <div
            style={{
              fontSize: 9,
              fontWeight: 600,
              color: textColor,
              opacity: 0.82,
              fontFamily: "'JetBrains Mono',monospace",
              letterSpacing: '0.04em',
            }}
          >
            {session.start_time} – {session.end_time}
          </div>
          {session.room_name && (
            <div
              style={{
                fontSize: 9,
                color: roomColor,
                marginTop: 2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              📍 {session.room_name}
            </div>
          )}
          {cancelled && <CancelBadge isDark={isDark} />}
        </>
      )}

      {mode === 'normal' && (
        <>
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: textColor,
              lineHeight: 1.25,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              marginBottom: 4,
              letterSpacing: '-0.01em',
            }}
          >
            {session.subject_name || session.subject_id}
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 9,
              fontWeight: 600,
              color: textColor,
              opacity: 0.9,
              fontFamily: "'JetBrains Mono',monospace",
              letterSpacing: '0.05em',
              background: timeBg,
              border: `1px solid ${timeBorder}`,
              borderRadius: 4,
              padding: '1px 6px',
              marginBottom: 6,
            }}
          >
            <svg width={8} height={8} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <circle cx="12" cy="12" r="10" />
              <path strokeLinecap="round" d="M12 6v6l4 2" />
            </svg>
            {session.start_time} – {session.end_time}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {session.room_name && <MetaRow icon="📍" value={session.room_name} color={metaColor} />}
            {session.group_name && <MetaRow icon="👥" value={session.group_name} color={metaColor} />}
            {session.instructor_name && <MetaRow icon="🧑‍🏫" value={session.instructor_name} color={metaColor} />}
          </div>

          {cancelled && <CancelBadge isDark={isDark} />}
        </>
      )}
    </>
  );
}

function MetaRow({ icon, value, color }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 10,
        color,
        lineHeight: 1.3,
        overflow: 'hidden',
      }}
    >
      <span style={{ fontSize: 9, flexShrink: 0, opacity: 0.8 }}>{icon}</span>
      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>
        {value}
      </span>
    </div>
  );
}

function CancelBadge({ isDark }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 3,
        marginTop: 5,
        padding: '2px 6px',
        borderRadius: 4,
        background: isDark ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.2)',
        border: `1px solid ${isDark ? 'rgba(239,68,68,0.35)' : 'rgba(255,255,255,0.4)'}`,
        fontSize: 8,
        fontWeight: 800,
        color: isDark ? '#fca5a5' : 'rgba(255,255,255,0.95)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        fontFamily: "'JetBrains Mono',monospace",
      }}
    >
      ✕ ANNULÉ
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function TimetableTable({ sessions = [], onSessionClick }) {
  const isDark = useIsDark();
  const todayDow = new Date().getDay() || 7;

  const layoutByDay = useMemo(() => {
    const map = {};
    for (const day of DAYS) {
      map[day] = buildLayout(sessions.filter(s => s.day_of_week === day));
    }
    return map;
  }, [sessions]);

  const hours = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);

  const getTransposedCardStyle = (item) => {
    const base = computeCardStyle(item, HOUR_HEIGHT, START_HOUR);

    return {
      left: base.top,
      width: base.height,
      top: base.left,
      height: base.width,
      _heightPx: base._heightPx,
    };
  };

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
        fontFamily: "'Sora', sans-serif",
      }}
    >
      <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '82vh' }}>
        <div style={{ minWidth: TOTAL_WIDTH + 56, minHeight: DAYS.length * ROW_HEIGHT + 52 }}>

          {/* ── TOP TIME HEADER ───────────────────────────── */}
          <div
            style={{
              display: 'flex',
              position: 'sticky',
              top: 0,
              zIndex: 4,
              background: 'var(--bg-elevated)',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <div
              style={{
                width: 56,
                flexShrink: 0,
                borderRight: '1px solid var(--border)',
                background: 'var(--bg-elevated)',
              }}
            />
            <div
              style={{
                position: 'relative',
                width: TOTAL_WIDTH,
                height: 52,
                background: 'var(--bg-elevated)',
              }}
            >
              {hours.slice(0, -1).map((h, i) => (
                <TimeHeader key={h} hour={h} index={i} />
              ))}
            </div>
          </div>

          {/* ── DAY ROWS ─────────────────────────────────── */}
          <div>
            {DAYS.map(day => {
              const isToday = todayDow === day;
              const laid = layoutByDay[day];

              return (
                <div
                  key={day}
                  style={{
                    display: 'flex',
                    minHeight: ROW_HEIGHT,
                    borderBottom: '1px solid var(--border)',
                    background:
                      isToday
                        ? isDark
                          ? 'rgba(0,166,81,0.025)'
                          : 'rgba(0,150,66,0.03)'
                        : 'transparent',
                  }}
                >
                  {/* Left day label */}
                  <div
                    style={{
                      width: 56,
                      flexShrink: 0,
                      borderRight: '1px solid var(--border)',
                      background: 'var(--bg-elevated)',
                      position: 'sticky',
                      left: 0,
                      zIndex: 3,
                    }}
                  >
                    <DayLabel day={day} isToday={isToday} />
                  </div>

                  {/* Time row */}
                  <div
                    style={{
                      position: 'relative',
                      width: TOTAL_WIDTH,
                      height: ROW_HEIGHT,
                    }}
                  >
                    {/* Hour vertical lines */}
                    {hours.slice(1).map((h, i) => (
                      <div
                        key={h}
                        style={{
                          position: 'absolute',
                          left: (i + 1) * HOUR_HEIGHT,
                          top: 0,
                          bottom: 0,
                          borderLeft: `1px solid ${isDark ? 'var(--border)' : 'rgba(0,0,0,0.06)'}`,
                          pointerEvents: 'none',
                        }}
                      />
                    ))}

                    {/* Half-hour vertical dashed lines */}
                    {hours.slice(0, -1).map((h, i) => (
                      <div
                        key={`hh-${h}`}
                        style={{
                          position: 'absolute',
                          left: i * HOUR_HEIGHT + HOUR_HEIGHT / 2,
                          top: 0,
                          bottom: 0,
                          borderLeft: `1px dashed ${isDark ? 'rgba(148,163,184,0.07)' : 'rgba(0,0,0,0.04)'}`,
                          pointerEvents: 'none',
                        }}
                      />
                    ))}

                    {/* Session cards */}
                    {laid.map(item => (
                      <SessionCard
                        key={item.session.id}
                        session={item.session}
                        cardStyle={getTransposedCardStyle(item)}
                        onClick={onSessionClick}
                        isDark={isDark}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}