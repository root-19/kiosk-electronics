import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar, Clock, Users, BookOpen, User, Edit, Trash2, Eye } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Section {
    id: number;
    name: string;
    grade_level: string;
    description?: string;
    full_name: string;
}

interface Professor {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    employee_id: string;
    department?: string;
    specialization?: string;
    full_name: string;
}

interface Subject {
    id: number;
    code: string;
    name: string;
    description?: string;
    units: number;
    grade_level: string;
    full_name: string;
}

interface Schedule {
    id: number;
    section_id: number;
    professor_id: number;
    subject_id: number;
    day_of_week: string;
    time_slot: string;
    start_time: string;
    end_time: string;
    room?: string;
    is_active: boolean;
    section: Section;
    professor: Professor;
    subject: Subject;
}

interface ScheduleProps {
    schedules: Schedule[];
    sections: Section[];
    professors: Professor[];
    subjects: Subject[];
    timeSlots: string[];
    daysOfWeek: { [key: string]: string };
}

export default function Schedule({ schedules, sections, professors, subjects, timeSlots, daysOfWeek }: ScheduleProps) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
    const [selectedSection, setSelectedSection] = useState<number | null>(null);
    const [selectedDay, setSelectedDay] = useState<string>('');

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        section_id: '',
        professor_id: '',
        subject_id: '',
        day_of_week: '',
        time_slot: '',
        start_time: '',
        end_time: '',
        room: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingSchedule) {
            put(`/schedules/${editingSchedule.id}`, {
                onSuccess: () => {
                    reset();
                    setEditingSchedule(null);
                    setIsCreateDialogOpen(false);
                }
            });
        } else {
            post('/schedules', {
                onSuccess: () => {
                    reset();
                    setIsCreateDialogOpen(false);
                }
            });
        }
    };

    const handleEdit = (schedule: Schedule) => {
        setData({
            section_id: schedule.section_id.toString(),
            professor_id: schedule.professor_id.toString(),
            subject_id: schedule.subject_id.toString(),
            day_of_week: schedule.day_of_week,
            time_slot: schedule.time_slot,
            start_time: schedule.start_time,
            end_time: schedule.end_time,
            room: schedule.room || '',
        });
        setEditingSchedule(schedule);
        setIsCreateDialogOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this schedule?')) {
            destroy(`/schedules/${id}`);
        }
    };

    const handleTimeSlotChange = (timeSlot: string) => {
        const [start, end] = timeSlot.split('-');
        setData({
            ...data,
            time_slot: timeSlot,
            start_time: start.trim(),
            end_time: end.trim(),
        });
    };

    // Group schedules by day for display
    const groupedSchedules = schedules.reduce((acc, schedule) => {
        if (!acc[schedule.day_of_week]) {
            acc[schedule.day_of_week] = [];
        }
        acc[schedule.day_of_week].push(schedule);
        return acc;
    }, {} as Record<string, Schedule[]>);

    // Filter schedules based on selected section and day
    const filteredSchedules = schedules.filter(schedule => {
        if (selectedSection && schedule.section_id !== selectedSection) return false;
        if (selectedDay && schedule.day_of_week !== selectedDay) return false;
        return true;
    });

    const resetForm = () => {
        reset();
        setEditingSchedule(null);
        setIsCreateDialogOpen(false);
    };

    return (
        <>
            <Head title="Schedule Management" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                        <Calendar className="h-6 w-6" />
                                        Schedule Management
                                    </h2>
                                    <p className="text-gray-600 mt-1">
                                        Manage class schedules, sections, professors, and subjects
                                    </p>
                                </div>
                                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button onClick={resetForm} className="flex items-center gap-2">
                                            <Plus className="h-4 w-4" />
                                            Add Schedule
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                        <DialogHeader>
                                            <DialogTitle>
                                                {editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}
                                            </DialogTitle>
                                            <DialogDescription>
                                                {editingSchedule 
                                                    ? 'Update the schedule information below.'
                                                    : 'Fill in the details to create a new schedule entry.'
                                                }
                                            </DialogDescription>
                                        </DialogHeader>
                                        
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="section_id">Section</Label>
                                                    <Select 
                                                        value={data.section_id} 
                                                        onValueChange={(value) => setData('section_id', value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select section" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {sections.map((section) => (
                                                                <SelectItem key={section.id} value={section.id.toString()}>
                                                                    {section.full_name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.section_id && (
                                                        <p className="text-sm text-red-600">{errors.section_id}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="professor_id">Professor</Label>
                                                    <Select 
                                                        value={data.professor_id} 
                                                        onValueChange={(value) => setData('professor_id', value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select professor" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {professors.map((professor) => (
                                                                <SelectItem key={professor.id} value={professor.id.toString()}>
                                                                    {professor.full_name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.professor_id && (
                                                        <p className="text-sm text-red-600">{errors.professor_id}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="subject_id">Subject</Label>
                                                    <Select 
                                                        value={data.subject_id} 
                                                        onValueChange={(value) => setData('subject_id', value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select subject" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {subjects.map((subject) => (
                                                                <SelectItem key={subject.id} value={subject.id.toString()}>
                                                                    {subject.full_name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.subject_id && (
                                                        <p className="text-sm text-red-600">{errors.subject_id}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="day_of_week">Day of Week</Label>
                                                    <Select 
                                                        value={data.day_of_week} 
                                                        onValueChange={(value) => setData('day_of_week', value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select day" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {Object.entries(daysOfWeek).map(([key, value]) => (
                                                                <SelectItem key={key} value={key}>
                                                                    {value}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.day_of_week && (
                                                        <p className="text-sm text-red-600">{errors.day_of_week}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="time_slot">Time Slot</Label>
                                                    <Select 
                                                        value={data.time_slot} 
                                                        onValueChange={handleTimeSlotChange}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select time slot" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {timeSlots.map((slot) => (
                                                                <SelectItem key={slot} value={slot}>
                                                                    {slot}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.time_slot && (
                                                        <p className="text-sm text-red-600">{errors.time_slot}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="room">Room (Optional)</Label>
                                                    <Input
                                                        id="room"
                                                        type="text"
                                                        value={data.room}
                                                        onChange={(e) => setData('room', e.target.value)}
                                                        placeholder="e.g., Room 101"
                                                    />
                                                    {errors.room && (
                                                        <p className="text-sm text-red-600">{errors.room}</p>
                                                    )}
                                                </div>
                                            </div>

                                            {errors.conflict && (
                                                <Alert>
                                                    <AlertDescription className="text-red-600">
                                                        {(errors as any).conflict}
                                                    </AlertDescription>
                                                </Alert>
                                            )}

                                            <DialogFooter>
                                                <Button type="button" variant="outline" onClick={resetForm}>
                                                    Cancel
                                                </Button>
                                                <Button type="submit" disabled={processing}>
                                                    {editingSchedule ? 'Update' : 'Create'} Schedule
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            {/* Filters */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <div className="flex gap-4 items-center">
                                    <div className="flex-1">
                                        <Label htmlFor="section_filter">Filter by Section</Label>
                                        <Select value={selectedSection?.toString() || ''} onValueChange={(value) => setSelectedSection(value ? parseInt(value) : null)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="All sections" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">All sections</SelectItem>
                                                {sections.map((section) => (
                                                    <SelectItem key={section.id} value={section.id.toString()}>
                                                        {section.full_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex-1">
                                        <Label htmlFor="day_filter">Filter by Day</Label>
                                        <Select value={selectedDay} onValueChange={setSelectedDay}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="All days" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">All days</SelectItem>
                                                {Object.entries(daysOfWeek).map(([key, value]) => (
                                                    <SelectItem key={key} value={key}>
                                                        {value}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* Schedule Display */}
                            <div className="w-full">
                                <div className="flex space-x-1 mb-4">
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md">Weekly View</button>
                                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md">List View</button>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="grid grid-cols-7 gap-4">
                                        {Object.entries(daysOfWeek).map(([dayKey, dayName]) => (
                                            <Card key={dayKey} className="min-h-[400px]">
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-sm font-medium text-center">
                                                        {dayName}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-2">
                                                    {timeSlots.map((timeSlot) => {
                                                        const schedule = filteredSchedules.find(
                                                            s => s.day_of_week === dayKey && s.time_slot === timeSlot
                                                        );
                                                        
                                                        return (
                                                            <div key={timeSlot} className="text-xs border-b pb-1">
                                                                <div className="font-medium text-gray-600 mb-1">
                                                                    {timeSlot}
                                                                </div>
                                                                {schedule ? (
                                                                    <div className="bg-blue-50 p-2 rounded border-l-2 border-blue-500">
                                                                        <div className="font-medium text-blue-900">
                                                                            {schedule.subject.name}
                                                                        </div>
                                                                        <div className="text-blue-700">
                                                                            {schedule.professor.full_name}
                                                                        </div>
                                                                        <div className="text-blue-600">
                                                                            {schedule.section.name}
                                                                        </div>
                                                                        {schedule.room && (
                                                                            <div className="text-blue-600">
                                                                                {schedule.room}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <div className="text-gray-400 italic">
                                                                        Free
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}