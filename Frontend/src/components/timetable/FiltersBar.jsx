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
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-wrap gap-4 items-center">
            <h3 className="text-sm font-semibold text-gray-700 mr-2">Filters:</h3>

            <select
                name="day_of_week"
                value={filters.day_of_week || ''}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="">All Days</option>
                <option value="1">Monday</option>
                <option value="2">Tuesday</option>
                <option value="3">Wednesday</option>
                <option value="4">Thursday</option>
                <option value="5">Friday</option>
                <option value="6">Saturday</option>
                <option value="7">Sunday</option>
            </select>

            <select
                name="group_id"
                value={filters.group_id || ''}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="">All Groups</option>
                {groups.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                ))}
            </select>

            <select
                name="instructor_id"
                value={filters.instructor_id || ''}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="">All Instructors</option>
                {instructors.map(i => (
                    <option key={i.id} value={i.id}>{i.name}</option>
                ))}
            </select>
        </div>
    );
}
