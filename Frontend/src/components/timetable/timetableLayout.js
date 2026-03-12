/**
 * timetableLayout.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Pure layout engine for the OFPPT Timetable.
 * Completely decoupled from React — easy to unit-test independently.
 *
 * Exported functions
 * ──────────────────
 *  toMinutes(time)          "08:30" → 510
 *  doOverlap(a, b)          true if two sessions share any time
 *  buildLayout(sessions)    returns LayoutItem[] with colIndex / colTotal
 *  computeCardStyle(item, hourHeight, startHour)
 *                           returns { top, height, left, width } in px/%
 */

// ─── Time helpers ────────────────────────────────────────────────────────────

/**
 * Convert "HH:MM" string to integer minutes since midnight.
 * @param {string} time  e.g. "08:30"
 * @returns {number}
 */
export function toMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Format minutes back to "HH:MM".
 * @param {number} minutes
 * @returns {string}
 */
export function fromMinutes(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Return duration in minutes between two "HH:MM" strings.
 * @param {string} start
 * @param {string} end
 * @returns {number}
 */
export function durationMinutes(start, end) {
  return toMinutes(end) - toMinutes(start);
}

// ─── Overlap detection ───────────────────────────────────────────────────────

/**
 * True when two sessions share at least one minute.
 * Touching edges (end of A == start of B) are NOT considered overlapping.
 *
 * @param {{ start_time: string, end_time: string }} a
 * @param {{ start_time: string, end_time: string }} b
 * @returns {boolean}
 */
export function doOverlap(a, b) {
  return toMinutes(a.start_time) < toMinutes(b.end_time) &&
         toMinutes(b.start_time) < toMinutes(a.end_time);
}

// ─── Layout algorithm ────────────────────────────────────────────────────────

/**
 * @typedef {Object} LayoutItem
 * @property {Object}  session   — original session object
 * @property {number}  colIndex  — 0-based horizontal slot within overlap group
 * @property {number}  colTotal  — total slots in this overlap group
 */

/**
 * Assign colIndex + colTotal to every session so overlapping sessions
 * sit side-by-side instead of stacking.
 *
 * Algorithm
 * ─────────
 * 1. Sort by start_time ascending (stable).
 * 2. Build "connected overlap components" with BFS.
 *    Two sessions A,B are in the same component if they overlap directly
 *    OR transitively through another session.
 * 3. Within each component greedily assign the lowest available lane:
 *    scan lanes left-to-right, pick the first whose last end_time ≤
 *    this session's start_time.
 * 4. colTotal for every session in a component = number of lanes used.
 *
 * This mirrors how Google Calendar / Outlook lay out concurrent events.
 *
 * @param {Object[]} sessions  Array of session objects (any day)
 * @returns {LayoutItem[]}
 */
export function buildLayout(sessions) {
  if (!sessions || sessions.length === 0) return [];

  // 1. Sort by start time (stable sort preserves original order for ties)
  const sorted = [...sessions].sort(
    (a, b) => toMinutes(a.start_time) - toMinutes(b.start_time)
  );

  const n = sorted.length;
  const visited = new Array(n).fill(false);
  const layout  = sorted.map(session => ({ session, colIndex: 0, colTotal: 1 }));

  // 2. BFS to find connected overlap components
  for (let i = 0; i < n; i++) {
    if (visited[i]) continue;

    // Collect all transitively overlapping sessions
    const component = [i];
    visited[i] = true;
    const queue = [i];

    while (queue.length > 0) {
      const cur = queue.shift();
      for (let j = 0; j < n; j++) {
        if (!visited[j] && doOverlap(sorted[cur], sorted[j])) {
          visited[j] = true;
          component.push(j);
          queue.push(j);
        }
      }
    }

    // 3. Greedy lane assignment within component
    //    laneEndTimes[k] = end time (minutes) of the last session placed in lane k
    const laneEndTimes = [];

    for (const idx of component) {
      const s        = sorted[idx];
      const startMin = toMinutes(s.start_time);
      const endMin   = toMinutes(s.end_time);

      // Find first lane whose last occupant has already ended
      let lane = laneEndTimes.findIndex(endTime => endTime <= startMin);

      if (lane === -1) {
        // No free lane — open a new one
        lane = laneEndTimes.length;
        laneEndTimes.push(endMin);
      } else {
        laneEndTimes[lane] = endMin;
      }

      layout[idx].colIndex = lane;
    }

    // 4. Propagate colTotal = lanes used in this component
    const totalLanes = laneEndTimes.length;
    for (const idx of component) {
      layout[idx].colTotal = totalLanes;
    }
  }

  return layout;
}

// ─── CSS geometry ────────────────────────────────────────────────────────────

const CARD_GAP_PX   = 4;   // gap between side-by-side cards
const CARD_INSET_PX = 4;   // left/right inset from the day column edge

/**
 * Given a LayoutItem, return CSS values for absolute positioning.
 *
 * @param {LayoutItem} item
 * @param {number}     hourHeight   px per hour (e.g. 64)
 * @param {number}     startHour    first hour shown (e.g. 8)
 * @returns {{ top: string, height: string, left: string, width: string }}
 */
export function computeCardStyle(item, hourHeight, startHour) {
  const { session, colIndex, colTotal } = item;

  const startMin  = toMinutes(session.start_time);
  const endMin    = toMinutes(session.end_time);
  const startHourMin = startHour * 60;

  const topPx    = ((startMin - startHourMin) / 60) * hourHeight;
  const heightPx = ((endMin - startMin)       / 60) * hourHeight;

  // Horizontal geometry:
  //   total usable width = 100% - 2*INSET - (colTotal-1)*GAP
  //   each card width    = usable / colTotal
  //   left offset        = INSET + colIndex * (cardWidth + GAP)
  const totalGap     = (colTotal - 1) * CARD_GAP_PX;
  const usablePct    = `(100% - ${2 * CARD_INSET_PX + totalGap}px)`;
  const cardWidth    = `calc(${usablePct} / ${colTotal})`;
  const leftOffset   = colIndex === 0
    ? `${CARD_INSET_PX}px`
    : `calc(${CARD_INSET_PX}px + ${colIndex} * (${usablePct} / ${colTotal} + ${CARD_GAP_PX}px))`;

  return {
    top:    `${topPx}px`,
    height: `${Math.max(heightPx, 20)}px`,  // never collapse to 0
    left:   leftOffset,
    width:  cardWidth,
    _heightPx: heightPx,  // raw px for compact/normal branching in the component
  };
}