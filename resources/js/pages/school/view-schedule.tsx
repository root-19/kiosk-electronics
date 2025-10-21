import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Users, BookOpen, User, MapPin, Filter, Grid, List } from 'lucide-react';
import { Schedule, Section, Professor, Subject } from '@/types';

interface ViewScheduleProps {
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

export default function ViewSchedule({ sections, schedules }: ViewScheduleProps) {
    const [selectedSection, setSelectedSection] = useState<string>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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
        if (selectedSection === 'all') {
            setFilteredSchedules(schedules.data);
        } else {
            const filtered = schedules.data.filter(schedule => 
                schedule.section_id === parseInt(selectedSection)
            );
            setFilteredSchedules(filtered);
        }

        // Update grid with filtered schedules
        const grid: { [day: string]: { [timeSlot: string]: Schedule | null } } = {};
        
        DAYS_OF_WEEK.forEach(day => {
            grid[day.toLowerCase()] = {};
            TIME_SLOTS.forEach(timeSlot => {
                grid[day.toLowerCase()][timeSlot] = null;
            });
        });

        const schedulesToShow = selectedSection === 'all' ? schedules.data : schedules.data.filter(s => s.section_id === parseInt(selectedSection));
        
        schedulesToShow.forEach(schedule => {
            if (grid[schedule.day_of_week] && grid[schedule.day_of_week][schedule.time_slot] !== undefined) {
                grid[schedule.day_of_week][schedule.time_slot] = schedule;
            }
        });

        setScheduleGrid(grid);
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
        <>
            <Head title="View All Schedules" />
            
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                                    <Calendar className="h-10 w-10 text-blue-600" />
                                    All Class Schedules
                                </h1>
                                <p className="mt-2 text-xl text-gray-600">
                                    View and browse all class schedules across all sections
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                                    onClick={() => setViewMode('grid')}
                                    className="flex items-center gap-2"
                                >
                                    <Grid className="h-4 w-4" />
                                    Grid View
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'default' : 'outline'}
                                    onClick={() => setViewMode('list')}
                                    className="flex items-center gap-2"
                                >
                                    <List className="h-4 w-4" />
                                    List View
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Debug Info */}
                    {/* <Card className="mb-6 bg-yellow-50 border-yellow-200">
                        <CardHeader>
                            <CardTitle className="text-yellow-800">Debug Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-yellow-700">
                                <p>Sections Count: {sections?.length || 0}</p>
                                <p>Schedules Count: {schedules?.data?.length || 0}</p>
                                <p>Total Schedules: {schedules?.meta?.total || 0}</p>
                                <p>Current Page: {schedules?.meta?.current_page || 0}</p>
                                {schedules?.data && schedules.data.length > 0 && (
                                    <div>
                                        <p>First Schedule:</p>
                                        <pre className="text-xs bg-white p-2 rounded mt-2">
                                            {JSON.stringify(schedules.data[0], null, 2)}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card> */}

                    {/* Filters */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Filter className="h-5 w-5" />
                                Filter Schedules
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-gray-500" />
                                    <Label htmlFor="section-filter" className="text-lg font-medium">Section:</Label>
                                </div>
                                <Select value={selectedSection} onValueChange={setSelectedSection}>
                                    <SelectTrigger className="w-64 h-12 text-lg">
                                        <SelectValue placeholder="Choose a section" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Sections</SelectItem>
                                        {sections.map((section) => (
                                            <SelectItem key={section.id} value={section.id.toString()}>
                                                {section.name} ({section.code})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {selectedSection !== 'all' && selectedSectionData && (
                                    <div className="text-lg text-gray-600">
                                        <span className="font-medium">Capacity:</span> {selectedSectionData.capacity} students
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Grid View */}
                    {viewMode === 'grid' && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5" />
                                    {selectedSection === 'all' ? 'All Schedules' : `Schedule for ${selectedSectionData?.name}`}
                                </CardTitle>
                                <p className="text-sm text-gray-600">
                                    {selectedSection === 'all' 
                                        ? `Showing ${filteredSchedules.length} classes across all sections`
                                        : `Showing ${filteredSchedules.length} classes for ${selectedSectionData?.name}`
                                    }
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr>
                                                <th className="border border-gray-300 p-4 bg-gray-100 font-semibold text-left min-w-[120px] text-lg">
                                                    Time
                                                </th>
                                                {DAYS_OF_WEEK.map((day) => (
                                                    <th 
                                                        key={day}
                                                        className="border border-gray-300 p-4 bg-gray-100 font-semibold text-center min-w-[250px] text-lg"
                                                    >
                                                        {day}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {TIME_SLOTS.map((timeSlot) => (
                                                <tr key={timeSlot}>
                                                    <td className="border border-gray-300 p-4 bg-gray-50 font-medium text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Clock className="h-5 w-5 text-gray-500" />
                                                            <span className="text-lg">{timeSlot}</span>
                                                        </div>
                                                    </td>
                                                    {DAYS_OF_WEEK.map((day) => {
                                                        const schedule = scheduleGrid[day.toLowerCase()]?.[timeSlot];
                                                        return (
                                                            <td 
                                                                key={`${day}-${timeSlot}`}
                                                                className="border border-gray-300 p-3 min-h-[100px]"
                                                            >
                                                                {schedule ? (
                                                                    <div className={`p-4 rounded-lg border-2 ${getTimeSlotColor(timeSlot)} h-full`}>
                                                                        <div className="space-y-2">
                                                                            <div className="font-bold text-lg text-gray-900">
                                                                                {schedule.subject?.name}
                                                                            </div>
                                                                            <div className="text-sm text-gray-700 flex items-center gap-1">
                                                                                <User className="h-4 w-4" />
                                                                                {schedule.professor?.first_name} {schedule.professor?.last_name}
                                                                            </div>
                                                                            <div className="text-sm text-gray-600 flex items-center gap-1">
                                                                                <Users className="h-4 w-4" />
                                                                                {schedule.section?.name}
                                                                            </div>
                                                                            {schedule.room && (
                                                                                <div className="text-sm text-gray-600 flex items-center gap-1">
                                                                                    <MapPin className="h-4 w-4" />
                                                                                    Room {schedule.room}
                                                                                </div>
                                                                            )}
                                                                            <div className="text-xs text-gray-500">
                                                                                {schedule.subject?.code}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="h-20 flex items-center justify-center text-gray-400 text-lg">
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

                    {/* List View */}
                    {viewMode === 'list' && (
                        <div className="space-y-4">
                            {filteredSchedules.map((schedule) => (
                                <Card key={schedule.id} className="hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-4 mb-3">
                                                    <Badge variant="outline" className="text-lg px-3 py-1">
                                                        {schedule.day_of_week.charAt(0).toUpperCase() + schedule.day_of_week.slice(1)}
                                                    </Badge>
                                                    <Badge variant="secondary" className="text-lg px-3 py-1">
                                                        {schedule.time_slot}
                                                    </Badge>
                                                    {schedule.room && (
                                                        <Badge variant="outline" className="text-lg px-3 py-1">
                                                            Room {schedule.room}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <BookOpen className="h-5 w-5 text-blue-600" />
                                                        <div>
                                                            <div className="font-semibold text-lg">{schedule.subject?.name}</div>
                                                            <div className="text-sm text-gray-600">{schedule.subject?.code}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-5 w-5 text-green-600" />
                                                        <div>
                                                            <div className="font-semibold text-lg">
                                                                {schedule.professor?.first_name} {schedule.professor?.last_name}
                                                            </div>
                                                            <div className="text-sm text-gray-600">Professor</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Users className="h-5 w-5 text-purple-600" />
                                                        <div>
                                                            <div className="font-semibold text-lg">{schedule.section?.name}</div>
                                                            <div className="text-sm text-gray-600">{schedule.section?.code}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-5 w-5 text-orange-600" />
                                                        <div>
                                                            <div className="font-semibold text-lg">
                                                                {schedule.room || 'TBA'}
                                                            </div>
                                                            <div className="text-sm text-gray-600">Location</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            {filteredSchedules.length === 0 && (
                                <Card>
                                    <CardContent className="py-12">
                                        <div className="text-center">
                                            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                No Schedules Found
                                            </h3>
                                            <p className="text-gray-600">
                                                {selectedSection === 'all' 
                                                    ? 'No schedules have been created yet.'
                                                    : 'No schedules found for the selected section.'
                                                }
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-blue-100 rounded-lg">
                                        <Calendar className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-gray-900">
                                            {filteredSchedules.length}
                                        </div>
                                        <div className="text-sm text-gray-600">Total Classes</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-green-100 rounded-lg">
                                        <User className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-gray-900">
                                            {new Set(filteredSchedules.map(s => s.professor_id)).size}
                                        </div>
                                        <div className="text-sm text-gray-600">Professors</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-purple-100 rounded-lg">
                                        <BookOpen className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-gray-900">
                                            {new Set(filteredSchedules.map(s => s.subject_id)).size}
                                        </div>
                                        <div className="text-sm text-gray-600">Subjects</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-orange-100 rounded-lg">
                                        <Clock className="h-6 w-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-gray-900">
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
                </div>
            </div>
        </>
    );
}
