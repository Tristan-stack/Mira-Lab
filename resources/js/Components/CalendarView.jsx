import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const CalendarView = ({ tasks: initialTasks }) => {
    const [tasks, setTasks] = useState(initialTasks);

    useEffect(() => {
        setTasks(initialTasks);
    }, [initialTasks]);

    useEffect(() => {
        console.log('Tâches reçues dans CalendarView:', tasks);
    }, [tasks]);

    const events = tasks.map(task => ({
        title: task.name,
        start: new Date(task.start_date),
        end: new Date(task.end_date),
    }));

    return (
        <div className="p-4">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
            />
        </div>
    );
};

export default CalendarView;