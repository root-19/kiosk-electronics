import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '@/layouts/app-layout';

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

export default function Calendar({ events = [] }: Props) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        event_type: 'general' as CalendarEvent['event_type'],
    });

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

    const handleDateClick = (date: Date) => {
        const dateStr = formatDateForComparison(date);
        setSelectedDate(dateStr);
        setShowForm(true);
    };

    const formatDateForComparison = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDate) return;

        router.post(
            '/calendar/events',
            {
                ...formData,
                event_date: selectedDate,
            },
            {
                onSuccess: () => {
                    setShowForm(false);
                    setFormData({ title: '', description: '', event_type: 'general' });
                    setSelectedDate(null);
                },
            }
        );
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setFormData({ title: '', description: '', event_type: 'general' });
        setSelectedDate(null);
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
        <AppLayout>
            <Head title="Calendar Management" />
            <div className="bg-gray-50 dark:bg-gray-900 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
                        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                            Calendar Management
                        </h1>

                        {/* Month Navigation */}
                        <div className="flex items-center justify-between mb-6">
                            <button
                                onClick={() => navigateMonth(-1)}
                                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-8 py-4 rounded-xl text-3xl font-bold text-gray-800 dark:text-white transition-all duration-200 shadow-lg hover:scale-105"
                            >
                                ← Prev
                            </button>

                            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                                {currentDate.toLocaleDateString('en-US', {
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </h2>

                            <button
                                onClick={() => navigateMonth(1)}
                                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-8 py-4 rounded-xl text-3xl font-bold text-gray-800 dark:text-white transition-all duration-200 shadow-lg hover:scale-105"
                            >
                                Next →
                            </button>
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-2">
                            {/* Day Headers */}
                            {daysOfWeek.map((day) => (
                                <div
                                    key={day}
                                    className="text-center font-bold text-xl py-4 text-gray-700 dark:text-gray-300"
                                >
                                    {day}
                                </div>
                            ))}

                            {/* Calendar Days */}
                            {days.map((date, index) => {
                                if (!date) {
                                    return <div key={`empty-${index}`} className="h-32" />;
                                }

                                const dateStr = formatDateForComparison(date);
                                const dayEvents = eventsMap.get(dateStr) || [];
                                const isToday = formatDateForComparison(new Date()) === dateStr;

                                return (
                                    <button
                                        key={`day-${date.getDate()}`}
                                        onClick={() => handleDateClick(date)}
                                        className={`h-32 border-2 rounded-xl p-2 relative transition-all duration-200 hover:scale-105 ${
                                            isToday
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
                                        }`}
                                    >
                                        <div
                                            className={`text-2xl font-bold mb-2 ${
                                                isToday
                                                    ? 'text-blue-600 dark:text-blue-400'
                                                    : 'text-gray-900 dark:text-white'
                                            }`}
                                        >
                                            {date.getDate()}
                                        </div>
                                        <div className="space-y-1">
                                            {dayEvents.slice(0, 2).map((event) => (
                                                <div
                                                    key={event.id}
                                                    className={`${getEventColor(
                                                        event.event_type
                                                    )} text-white text-xs px-2 py-1 rounded truncate`}
                                                >
                                                    {event.title}
                                                </div>
                                            ))}
                                            {dayEvents.length > 2 && (
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    +{dayEvents.length - 2} more
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Events List */}
                    {events.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                Upcoming Events
                            </h2>
                            <div className="space-y-4">
                                {events.map((event) => (
                                    <div
                                        key={event.id}
                                        className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`w-6 h-6 rounded ${getEventColor(
                                                    event.event_type
                                                )}`}
                                            />
                                            <div className="flex-1">
                                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                                    {event.title}
                                                </h3>
                                                {event.description && (
                                                    <p className="text-lg text-gray-600 dark:text-gray-300">
                                                        {event.description}
                                                    </p>
                                                )}
                                                <p className="text-xl text-gray-500 dark:text-gray-400 mt-2">
                                                    {new Date(event.event_date).toLocaleDateString(
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

                {/* Modal Form */}
                <AnimatePresence>
                    {showForm && selectedDate && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6"
                            onClick={handleCloseForm}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            >
                                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                                    Add Event
                                </h2>
                                <p className="text-2xl text-gray-600 dark:text-gray-400 mb-8">
                                    {new Date(selectedDate).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                            Title *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={(e) =>
                                                setFormData({ ...formData, title: e.target.value })
                                            }
                                            className="w-full px-6 py-4 text-xl border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            placeholder="Enter event title"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                            Description
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    description: e.target.value,
                                                })
                                            }
                                            rows={4}
                                            className="w-full px-6 py-4 text-xl border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                                            placeholder="Enter event description"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                            Event Type *
                                        </label>
                                        <select
                                            required
                                            value={formData.event_type}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    event_type: e.target.value as CalendarEvent['event_type'],
                                                })
                                            }
                                            className="w-full px-6 py-4 text-xl border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="general">General</option>
                                            <option value="holiday">Holiday</option>
                                            <option value="academic">Academic</option>
                                            <option value="sports">Sports</option>
                                        </select>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={handleCloseForm}
                                            className="flex-1 px-8 py-5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl text-2xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-8 py-5 bg-blue-600 text-white rounded-xl text-2xl font-bold hover:bg-blue-700 transition-all duration-200"
                                        >
                                            Save Event
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </AppLayout>
    );
}

