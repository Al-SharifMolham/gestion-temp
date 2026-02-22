import { useEffect, useState } from 'react';
import userService from '../../services/userService';

export default function FiltersBar({ filters, onFilterChange }) {
    const [groups, setGroups] = useState([]);
    const [instructors, setInstructors] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [gData, iData] = await Promise.all([
                    userService.getGroups(),
                    userService.getInstructors()
                ]);
                setGroups(gData);
                setInstructors(iData);
            } catch (err) {
                console.error("Failed to load filters data", err);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        onFilterChange({ ...filters, [name]: value });
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-card border border-gray-100/80 mb-6 flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 mr-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                </svg>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Filters</span>
            </div>

            <select name="day_of_week" value={filters.day_of_week || ''} onChange={handleChange} className="input-field w-auto text-sm py-2">
                <option value="">All Days</option>
                <option value="1">Monday</option>
                <option value="2">Tuesday</option>
                <option value="3">Wednesday</option>
                <option value="4">Thursday</option>
                <option value="5">Friday</option>
                <option value="6">Saturday</option>
                <option value="7">Sunday</option>
            </select>

            <select name="group_id" value={filters.group_id || ''} onChange={handleChange} className="input-field w-auto text-sm py-2">
                <option value="">All Groups</option>
                {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>

            <select name="instructor_id" value={filters.instructor_id || ''} onChange={handleChange} className="input-field w-auto text-sm py-2">
                <option value="">All Instructors</option>
                {instructors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
        </div>
    );
}
