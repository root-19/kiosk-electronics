import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

interface CalendarEvent {
    id: number;
    title: string;
    description?: string;
    event_date: string;
    event_type: 'holiday' | 'academic' | 'sports' | 'general';
}

interface Props {
    events: CalendarEvent[];
}

export default function SchoolCalendar({ events = [] }: Props) {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Convert events array to a map for easy lookup
    const eventsMap = new Map<string, CalendarEvent[]>();
    events.forEach((event) => {
        const date = event.event_date;
        if (!eventsMap.has(date)) {
            eventsMap.set(date, []);
        }
        eventsMap.get(date)!.push(event);
    });

    const navigateMonth = (direction: number) => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1)
        );
    };

    const formatDateForComparison = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const getDaysInMonth = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add all days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }

        return { days, daysOfWeek };
    };

    const { days, daysOfWeek } = getDaysInMonth();

    const getEventColor = (eventType: string) => {
        switch (eventType) {
            case 'holiday':
                return 'bg-red-500';
            case 'academic':
                return 'bg-blue-500';
            case 'sports':
                return 'bg-green-500';
            case 'general':
                return 'bg-purple-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <>
            <Head title="School Calendar" />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header with Back Button */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
                        {/* Back Button */}
                        <div className="mb-4">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 hover:scale-105 active:scale-95 text-lg"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                                Back
                            </Link>
                        </div>

                        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                            📅 School Calendar
                        </h1>

                        {/* Month Navigation */}
                        <div className="flex items-center justify-between mb-8">
                            <button
                                onClick={() => navigateMonth(-1)}
                                className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 px-10 py-6 rounded-2xl text-4xl font-bold text-white transition-all duration-200 shadow-xl hover:scale-110 active:scale-95 min-h-[80px] min-w-[150px] flex items-center justify-center"
                            >
                                ← Prev
                            </button>

                            <h2 className="text-5xl font-bold text-gray-900 dark:text-white text-center px-6">
                                {currentDate.toLocaleDateString('en-US', {
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </h2>

                            <button
                                onClick={() => navigateMonth(1)}
                                className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 px-10 py-6 rounded-2xl text-4xl font-bold text-white transition-all duration-200 shadow-xl hover:scale-110 active:scale-95 min-h-[80px] min-w-[150px] flex items-center justify-center"
                            >
                                Next →
                            </button>
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-3">
                            {/* Day Headers */}
                            {daysOfWeek.map((day) => (
                                <div
                                    key={day}
                                    className="text-center font-bold text-2xl py-5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl"
                                >
                                    {day}
                                </div>
                            ))}

                            {/* Calendar Days - VIEW ONLY, no click functionality */}
                            {days.map((date, index) => {
                                if (!date) {
                                    return <div key={`empty-${index}`} className="h-40" />;
                                }

                                const dateStr = formatDateForComparison(date);
                                const dayEvents = eventsMap.get(dateStr) || [];
                                const isToday = formatDateForComparison(new Date()) === dateStr;

                                return (
                                    <div
                                        key={`day-${date.getDate()}`}
                                        className={`h-40 border-4 rounded-2xl p-3 relative transition-all duration-200 ${
                                            isToday
                                                ? 'border-blue-600 bg-blue-100 dark:bg-blue-900/30 shadow-xl scale-105'
                                                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:shadow-lg'
                                        }`}
                                    >
                                        <div
                                            className={`text-3xl font-bold mb-2 ${
                                                isToday
                                                    ? 'text-blue-700 dark:text-blue-300'
                                                    : 'text-gray-900 dark:text-white'
                                            }`}
                                        >
                                            {date.getDate()}
                                        </div>
                                        <div className="space-y-1.5 overflow-hidden">
                                            {dayEvents.slice(0, 2).map((event) => (
                                                <div
                                                    key={event.id}
                                                    className={`${getEventColor(
                                                        event.event_type
                                                    )} text-white text-sm font-semibold px-2 py-1.5 rounded-lg truncate shadow-md`}
                                                >
                                                    {event.title}
                                                </div>
                                            ))}
                                            {dayEvents.length > 2 && (
                                                <div className="text-sm font-bold text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                                                    +{dayEvents.length - 2} more
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Events List */}
                    {events.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                                📋 Upcoming Events
                            </h2>
                            <div className="space-y-5">
                                {events.map((event) => (
                                    <div
                                        key={event.id}
                                        className="border-4 border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:shadow-xl transition-all duration-200 hover:scale-[1.02] bg-gray-50 dark:bg-gray-700/50"
                                    >
                                        <div className="flex items-start gap-5">
                                            <div
                                                className={`w-8 h-8 rounded-lg ${getEventColor(
                                                    event.event_type
                                                )} shadow-md flex-shrink-0`}
                                            />
                                            <div className="flex-1">
                                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                                                    {event.title}
                                                </h3>
                                                {event.description && (
                                                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
                                                        {event.description}
                                                    </p>
                                                )}
                                                <p className="text-2xl font-semibold text-gray-700 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg inline-block">
                                                    📅 {new Date(event.event_date).toLocaleDateString(
                                                        'en-US',
                                                        {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        }
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
