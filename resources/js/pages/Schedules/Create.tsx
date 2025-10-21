import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { Section, Professor, Subject, BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';

interface CreateScheduleProps {
    sections: Section[];
    professors: Professor[];
    subjects: Subject[];
    timeSlots: string[];
    daysOfWeek: string[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Schedule',
        href: '/schedule',
    },
    {
        title: 'Manage Schedules',
        href: '/schedules',
    },
    {
        title: 'Create Schedule',
        href: '/schedules/create',
    },
];

export default function CreateSchedule({ sections, professors, subjects, timeSlots, daysOfWeek }: CreateScheduleProps) {
    const { data, setData, post, processing, errors } = useForm({
        section_id: '',
        professor_id: '',
        subject_id: '',
        day_of_week: '',
        time_slot: '',
        room: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/schedules');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Schedule" />
            <div className="flex h-full flex-1 flex-col gap-8 p-6">
                <div className="flex items-center gap-4">
                    <Link href="/schedules">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Schedules
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Create Schedule</h1>
                        <p className="text-muted-foreground">
                            Add a new class schedule
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Schedule Information</CardTitle>
                        <CardDescription>
                            Enter the details for the new schedule
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="section_id">Section</Label>
                                    <Select value={data.section_id} onValueChange={(value) => setData('section_id', value)}>
                                        <SelectTrigger className={errors.section_id ? 'border-destructive' : ''}>
                                            <SelectValue placeholder="Select a section" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sections.map((section) => (
                                                <SelectItem key={section.id} value={section.id.toString()}>
                                                    {section.name} ({section.code})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.section_id && (
                                        <p className="text-sm text-destructive">{errors.section_id}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="professor_id">Professor</Label>
                                    <Select value={data.professor_id} onValueChange={(value) => setData('professor_id', value)}>
                                        <SelectTrigger className={errors.professor_id ? 'border-destructive' : ''}>
                                            <SelectValue placeholder="Select a professor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {professors.map((professor) => (
                                                <SelectItem key={professor.id} value={professor.id.toString()}>
                                                    {professor.full_name} - {professor.employee_id}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.professor_id && (
                                        <p className="text-sm text-destructive">{errors.professor_id}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subject_id">Subject</Label>
                                <Select value={data.subject_id} onValueChange={(value) => setData('subject_id', value)}>
                                    <SelectTrigger className={errors.subject_id ? 'border-destructive' : ''}>
                                        <SelectValue placeholder="Select a subject" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {subjects.map((subject) => (
                                            <SelectItem key={subject.id} value={subject.id.toString()}>
                                                {subject.name} ({subject.code}) - {subject.units} units
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.subject_id && (
                                    <p className="text-sm text-destructive">{errors.subject_id}</p>
                                )}
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="day_of_week">Day of Week</Label>
                                    <Select value={data.day_of_week} onValueChange={(value) => setData('day_of_week', value)}>
                                        <SelectTrigger className={errors.day_of_week ? 'border-destructive' : ''}>
                                            <SelectValue placeholder="Select day" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {daysOfWeek.map((day) => (
                                                <SelectItem key={day} value={day}>
                                                    {day.charAt(0).toUpperCase() + day.slice(1)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.day_of_week && (
                                        <p className="text-sm text-destructive">{errors.day_of_week}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="time_slot">Time Slot</Label>
                                    <Select value={data.time_slot} onValueChange={(value) => setData('time_slot', value)}>
                                        <SelectTrigger className={errors.time_slot ? 'border-destructive' : ''}>
                                            <SelectValue placeholder="Select time" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {timeSlots.map((timeSlot) => (
                                                <SelectItem key={timeSlot} value={timeSlot}>
                                                    {timeSlot}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.time_slot && (
                                        <p className="text-sm text-destructive">{errors.time_slot}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="room">Room (Optional)</Label>
                                    <Input
                                        id="room"
                                        type="text"
                                        value={data.room}
                                        onChange={(e) => setData('room', e.target.value)}
                                        placeholder="e.g., Room 101, Lab 2"
                                        className={errors.room ? 'border-destructive' : ''}
                                    />
                                    {errors.room && (
                                        <p className="text-sm text-destructive">{errors.room}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating...' : 'Create Schedule'}
                                </Button>
                                <Link href="/schedules">
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
