import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Calendar, Clock, Users, BookOpen, User } from 'lucide-react';
import { Schedule, Section, Professor, Subject, BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';

interface SchedulePageProps {
    sections: Section[];
    schedules: {
        data: Schedule[];
        links: any[];
        meta: any;
    };
}

const TIME_SLOTS = [
    '7:30-8:30',
    '8:30-9:30',
    '9:30-10:30',
    '10:30-11:30',
    '11:30-12:30',
    '12:30-1:30',
    '1:30-2:30',
    '2:30-3:30',
    '3:30-4:30',
    '4:30-5:30',
    '5:30-6:30',
    '6:30-7:30',
];

const DAYS_OF_WEEK = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
];

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Schedule',
        href: '/schedule',
    },
];

export default function SchedulePage({ sections, schedules }: SchedulePageProps) {
    const [selectedSection, setSelectedSection] = useState<string>('');
    const [scheduleGrid, setScheduleGrid] = useState<{ [day: string]: { [timeSlot: string]: Schedule | null } }>({});
    const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);

    // Initialize schedule grid
    useEffect(() => {
        const grid: { [day: string]: { [timeSlot: string]: Schedule | null } } = {};
        
        DAYS_OF_WEEK.forEach(day => {
            grid[day.toLowerCase()] = {};
            TIME_SLOTS.forEach(timeSlot => {
                grid[day.toLowerCase()][timeSlot] = null;
            });
        });

        setScheduleGrid(grid);
    }, []);

    // Filter schedules when section changes
    useEffect(() => {
        if (selectedSection) {
            const filtered = schedules.data.filter(schedule => 
                schedule.section_id === parseInt(selectedSection)
            );
            setFilteredSchedules(filtered);

            // Update grid with filtered schedules
            const grid: { [day: string]: { [timeSlot: string]: Schedule | null } } = {};
            
            DAYS_OF_WEEK.forEach(day => {
                grid[day.toLowerCase()] = {};
                TIME_SLOTS.forEach(timeSlot => {
                    grid[day.toLowerCase()][timeSlot] = null;
                });
            });

            filtered.forEach(schedule => {
                if (grid[schedule.day_of_week] && grid[schedule.day_of_week][schedule.time_slot] !== undefined) {
                    grid[schedule.day_of_week][schedule.time_slot] = schedule;
                }
            });

            setScheduleGrid(grid);
        } else {
            setFilteredSchedules([]);
            // Reset grid to empty state
            const grid: { [day: string]: { [timeSlot: string]: Schedule | null } } = {};
            DAYS_OF_WEEK.forEach(day => {
                grid[day.toLowerCase()] = {};
                TIME_SLOTS.forEach(timeSlot => {
                    grid[day.toLowerCase()][timeSlot] = null;
                });
            });
            setScheduleGrid(grid);
        }
    }, [selectedSection, schedules.data]);

    const getTimeSlotColor = (timeSlot: string) => {
        const colors = {
            '7:30-8:30': 'bg-blue-100 border-blue-300',
            '8:30-9:30': 'bg-green-100 border-green-300',
            '9:30-10:30': 'bg-yellow-100 border-yellow-300',
            '10:30-11:30': 'bg-purple-100 border-purple-300',
            '11:30-12:30': 'bg-pink-100 border-pink-300',
            '12:30-1:30': 'bg-indigo-100 border-indigo-300',
            '1:30-2:30': 'bg-orange-100 border-orange-300',
            '2:30-3:30': 'bg-teal-100 border-teal-300',
            '3:30-4:30': 'bg-red-100 border-red-300',
            '4:30-5:30': 'bg-cyan-100 border-cyan-300',
            '5:30-6:30': 'bg-emerald-100 border-emerald-300',
            '6:30-7:30': 'bg-violet-100 border-violet-300',
        };
        return colors[timeSlot as keyof typeof colors] || 'bg-gray-100 border-gray-300';
    };

    const selectedSectionData = sections.find(section => section.id === parseInt(selectedSection));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Schedule" />
            
            <div className="flex h-full flex-1 flex-col gap-8 p-6">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                                    <Calendar className="h-8 w-8 text-blue-600" />
                                    Class Schedule
                                </h1>
                                <p className="mt-2 text-gray-600">
                                    View and manage class schedules for all sections
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Link
                                    href="/schedules"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Plus className="h-4 w-4" />
                                    Manage Schedules
                                </Link>
                                <Link
                                    href="/sections"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <Users className="h-4 w-4" />
                                    Manage Sections
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Section Selector */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Select Section
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Select value={selectedSection} onValueChange={setSelectedSection}>
                                <SelectTrigger className="w-full max-w-md">
                                    <SelectValue placeholder="Choose a section to view schedule" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sections.map((section) => (
                                        <SelectItem key={section.id} value={section.id.toString()}>
                                            {section.name} ({section.code})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>

                    {/* Schedule Grid */}
                    {selectedSection && selectedSectionData && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5" />
                                    Schedule for {selectedSectionData.name} ({selectedSectionData.code})
                                </CardTitle>
                                <p className="text-sm text-gray-600">
                                    Capacity: {selectedSectionData.capacity} students
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr>
                                                <th className="border border-gray-300 p-3 bg-gray-100 font-semibold text-left min-w-[100px]">
                                                    Time
                                                </th>
                                                {DAYS_OF_WEEK.map((day) => (
                                                    <th 
                                                        key={day}
                                                        className="border border-gray-300 p-3 bg-gray-100 font-semibold text-center min-w-[200px]"
                                                    >
                                                        {day}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {TIME_SLOTS.map((timeSlot) => (
                                                <tr key={timeSlot}>
                                                    <td className="border border-gray-300 p-3 bg-gray-50 font-medium text-center">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <Clock className="h-4 w-4 text-gray-500" />
                                                            {timeSlot}
                                                        </div>
                                                    </td>
                                                    {DAYS_OF_WEEK.map((day) => {
                                                        const schedule = scheduleGrid[day.toLowerCase()]?.[timeSlot];
                                                        return (
                                                            <td 
                                                                key={`${day}-${timeSlot}`}
                                                                className="border border-gray-300 p-2 min-h-[80px]"
                                                            >
                                                                {schedule ? (
                                                                    <div className={`p-3 rounded-lg border-2 ${getTimeSlotColor(timeSlot)}`}>
                                                                        <div className="space-y-1">
                                                                            <div className="font-semibold text-sm text-gray-900">
                                                                                {schedule.subject?.name}
                                                                            </div>
                                                                            <div className="text-xs text-gray-700 flex items-center gap-1">
                                                                                <User className="h-3 w-3" />
                                                                                {schedule.professor?.first_name} {schedule.professor?.last_name}
                                                                            </div>
                                                                            {schedule.room && (
                                                                                <div className="text-xs text-gray-600 flex items-center gap-1">
                                                                                    <BookOpen className="h-3 w-3" />
                                                                                    Room {schedule.room}
                                                                                </div>
                                                                            )}
                                                                            <div className="text-xs text-gray-500">
                                                                                {schedule.subject?.code}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="h-16 flex items-center justify-center text-gray-400 text-sm">
                                                                        Free
                                                                    </div>
                                                                )}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* No Section Selected State */}
                    {!selectedSection && (
                        <Card>
                            <CardContent className="py-12">
                                <div className="text-center">
                                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Select a Section
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        Choose a section from the dropdown above to view its class schedule.
                                    </p>
                                    <div className="text-sm text-gray-500">
                                        Available sections: {sections.length}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Quick Stats */}
                    {selectedSection && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Calendar className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-gray-900">
                                                {filteredSchedules.length}
                                            </div>
                                            <div className="text-sm text-gray-600">Total Classes</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <User className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-gray-900">
                                                {new Set(filteredSchedules.map(s => s.professor_id)).size}
                                            </div>
                                            <div className="text-sm text-gray-600">Professors</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <BookOpen className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-gray-900">
                                                {new Set(filteredSchedules.map(s => s.subject_id)).size}
                                            </div>
                                            <div className="text-sm text-gray-600">Subjects</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-orange-100 rounded-lg">
                                            <Clock className="h-5 w-5 text-orange-600" />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-gray-900">
                                                {DAYS_OF_WEEK.filter(day => 
                                                    filteredSchedules.some(s => s.day_of_week === day.toLowerCase())
                                                ).length}
                                            </div>
                                            <div className="text-sm text-gray-600">Active Days</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
            </div>
        </AppLayout>
    );
}