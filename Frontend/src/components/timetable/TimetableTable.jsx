import { DAYS_OF_WEEK } from '../../utils/constants';

const START_HOUR = 8;
const END_HOUR = 20;
const HOUR_HEIGHT = 60;
const TOTAL_HEIGHT = (END_HOUR - START_HOUR) * HOUR_HEIGHT;

export default function TimetableTable({ sessions, onSessionClick }) {
    const getPosition = (start, end) => {
        const [sH, sM] = start.split(':').map(Number);
        const [eH, eM] = end.split(':').map(Number);
        const startOffset = (sH - START_HOUR) * HOUR_HEIGHT + (sM / 60) * HOUR_HEIGHT;
        const duration = (eH - sH) * 60 + (eM - sM);
        const height = (duration / 60) * HOUR_HEIGHT;
        return { top: `${startOffset}px`, height: `${height}px` };
    };

    const days = [1, 2, 3, 4, 5, 6, 7];

    return (
        <div className="bg-white rounded-xl shadow-card border border-gray-100/80 overflow-x-auto">
            <div className="min-w-[800px] flex">
                {/* Time Sidebar */}
                <div className="w-16 flex-shrink-0 border-r border-gray-100 bg-gray-50/50">
                    <div className="h-11 border-b border-gray-100" />
                    <div className="relative" style={{ height: `${TOTAL_HEIGHT}px` }}>
                        {Array.from({ length: END_HOUR - START_HOUR + 1 }).map((_, i) => (
                            <div key={i} className="absolute w-full text-right pr-2.5 text-[11px] text-gray-400 font-medium -mt-2" style={{ top: `${i * HOUR_HEIGHT}px` }}>
                                {START_HOUR + i}:00
                            </div>
                        ))}
                    </div>
                </div>

                {/* Days Columns */}
                <div className="flex-1 flex">
                    {days.map(day => (
                        <div key={day} className="flex-1 border-r border-gray-50 last:border-r-0 min-w-[120px]">
                            <div className="h-11 bg-gray-50/50 border-b border-gray-100 flex items-center justify-center">
                                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{DAYS_OF_WEEK[day]}</span>
                            </div>
                            <div className="relative w-full" style={{ height: `${TOTAL_HEIGHT}px` }}>
                                {Array.from({ length: END_HOUR - START_HOUR }).map((_, i) => (
                                    <div key={i} className="absolute w-full border-b border-gray-50" style={{ top: `${(i + 1) * HOUR_HEIGHT}px` }} />
                                ))}

                                {sessions
                                    .filter(s => s.day_of_week === day)
                                    .map(session => {
                                        const pos = getPosition(session.start_time, session.end_time);
                                        const isCancelled = session.status === 'cancelled';
                                        return (
                                            <div
                                                key={session.id}
                                                onClick={() => onSessionClick && onSessionClick(session)}
                                                className={`absolute inset-x-1 rounded-lg p-2 text-xs border cursor-pointer transition-all duration-150 z-10 overflow-hidden group
                                                    ${isCancelled
                                                        ? 'bg-red-50 border-red-200/80 text-red-800 opacity-70'
                                                        : 'bg-indigo-50/80 border-indigo-200/60 text-indigo-900 hover:shadow-md hover:bg-indigo-50'
                                                    }`}
                                                style={pos}
                                            >
                                                <div className="font-semibold truncate leading-tight">{session.subject_name || session.subject_id}</div>
                                                <div className="text-[10px] text-gray-500 truncate mt-0.5">{session.room_name || session.room_id}</div>
                                                <div className="text-[10px] text-gray-400 truncate">{session.group_name || session.group_id}</div>
                                                {session.instructor_name && <div className="text-[10px] text-gray-400 truncate mt-0.5">{session.instructor_name}</div>}
                                                {isCancelled && <div className="font-bold text-red-500 text-[10px] mt-0.5 uppercase">Cancelled</div>}
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
