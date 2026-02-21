import { DAYS_OF_WEEK } from '../../utils/constants';

// Constants for grid calculation
const START_HOUR = 8;
const END_HOUR = 20;
const HOUR_HEIGHT = 60; // px
const TOTAL_HEIGHT = (END_HOUR - START_HOUR) * HOUR_HEIGHT;

export default function TimetableTable({ sessions, onSessionClick, onDelete, role }) {
    // Helper to calculate position
    const getPosition = (start, end) => {
        const [sH, sM] = start.split(':').map(Number);
        const [eH, eM] = end.split(':').map(Number);

        const startOffset = (sH - START_HOUR) * HOUR_HEIGHT + (sM / 60) * HOUR_HEIGHT;
        const duration = ((eH - sH) * 60 + (eM - sM));
        const height = (duration / 60) * HOUR_HEIGHT;

        return { top: `${startOffset}px`, height: `${height}px` };
    };

    // Filter days columns
    // Assuming we always show Mon-Sun or filtered. 
    // If backend filters by day, we might only show that day?
    // Let's show all 7 days for the "Weekly Grid" feel, unless filtered day is specific.
    // If sessions are empty for a day, it's just empty.
    const days = [1, 2, 3, 4, 5, 6, 7];

    return (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-x-auto">
            <div className="min-w-[800px] flex">
                {/* Time Sidebar */}
                <div className="w-16 flex-shrink-0 border-r border-gray-100 bg-gray-50">
                    <div className="h-10 border-b border-gray-200"></div> {/* Header spacer */}
                    <div className="relative" style={{ height: `${TOTAL_HEIGHT}px` }}>
                        {Array.from({ length: END_HOUR - START_HOUR + 1 }).map((_, i) => (
                            <div key={i} className="absolute w-full text-right pr-2 text-xs text-gray-400 -mt-2.5" style={{ top: `${i * HOUR_HEIGHT}px` }}>
                                {START_HOUR + i}:00
                            </div>
                        ))}
                    </div>
                </div>

                {/* Days Columns */}
                <div className="flex-1 flex">
                    {days.map(day => (
                        <div key={day} className="flex-1 border-r border-gray-100 last:border-r-0 min-w-[120px]">
                            {/* Header */}
                            <div className="h-10 bg-gray-50 border-b border-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
                                {DAYS_OF_WEEK[day]}
                            </div>

                            {/* Grid Body */}
                            <div className="relative w-full bg-white" style={{ height: `${TOTAL_HEIGHT}px` }}>
                                {/* Horizontal Guidelines */}
                                {Array.from({ length: END_HOUR - START_HOUR }).map((_, i) => (
                                    <div key={i} className="absolute w-full border-b border-gray-50" style={{ top: `${(i + 1) * HOUR_HEIGHT}px` }}></div>
                                ))}

                                {/* Sessions */}
                                {sessions
                                    .filter(s => s.day_of_week === day)
                                    .map(session => {
                                        const pos = getPosition(session.start_time, session.end_time);
                                        return (
                                            <div
                                                key={session.id}
                                                onClick={() => onSessionClick && onSessionClick(session)}
                                                className={`absolute inset-x-1 rounded-md p-2 text-xs border cursor-pointer hover:shadow-md transition-all z-10 overflow-hidden
                                                    ${session.status === 'cancelled'
                                                        ? 'bg-red-50 border-red-200 text-red-800 opacity-80'
                                                        : 'bg-blue-50 border-blue-200 text-blue-900'}
                                                `}
                                                style={pos}
                                            >
                                                <div className="font-bold truncate">{session.subject_name || session.subject_id}</div>
                                                <div className="text-gray-600 truncate">{session.room_name || session.room_id}</div>
                                                <div className="text-gray-500 truncate">{session.group_name || session.group_id}</div>
                                                {session.instructor_name && <div className="text-gray-500 truncate text-[10px] pb-1">({session.instructor_name})</div>}
                                                {session.status === 'cancelled' && <div className="font-bold text-red-600">CANCELLED</div>}

                                                {/* Actions bubble? */}
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
