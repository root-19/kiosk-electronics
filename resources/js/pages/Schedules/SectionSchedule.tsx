import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Calendar } from 'lucide-react';
import { Section, ScheduleGrid } from '@/types';

interface SectionScheduleProps {
    section: Section;
    scheduleGrid: ScheduleGrid;
    daysOfWeek: string[];
    timeSlots: string[];
}

export default function SectionSchedule({ section, scheduleGrid, daysOfWeek, timeSlots }: SectionScheduleProps) {
    const getDayDisplayName = (day: string) => {
        return day.charAt(0).toUpperCase() + day.slice(1);
    };

    const getScheduleInfo = (schedule: any) => {
        if (!schedule) return null;
        return {
            subject: schedule.subject?.name || 'Unknown',
            professor: schedule.professor?.full_name || 'Unknown',
            room: schedule.room || '',
            isActive: schedule.is_active
        };
    };

    return (
        <>
            <Head title={`Schedule: ${section.name}`} />
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={route('sections.show', section.id)}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Section
                        </Button>
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold tracking-tight">{section.name} Schedule</h1>
                        <p className="text-muted-foreground">Section Code: {section.code}</p>
                    </div>
                    <Link href={route('schedules.create', { section_id: section.id })}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Class
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Weekly Schedule
                        </CardTitle>
                        <CardDescription>
                            Complete weekly schedule for {section.name}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="border border-border p-2 text-left font-semibold bg-muted/50">
                                            Time
                                        </th>
                                        {daysOfWeek.map((day) => (
                                            <th key={day} className="border border-border p-2 text-center font-semibold bg-muted/50 min-w-[200px]">
                                                {getDayDisplayName(day)}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {timeSlots.map((timeSlot) => (
                                        <tr key={timeSlot}>
                                            <td className="border border-border p-2 font-medium bg-muted/30">
                                                {timeSlot}
                                            </td>
                                            {daysOfWeek.map((day) => {
                                                const schedule = scheduleGrid[day]?.[timeSlot];
                                                const scheduleInfo = getScheduleInfo(schedule);
                                                
                                                return (
                                                    <td key={`${day}-${timeSlot}`} className="border border-border p-2">
                                                        {scheduleInfo ? (
                                                            <div className={`p-3 rounded-lg border ${scheduleInfo.isActive ? 'bg-primary/10 border-primary/20' : 'bg-muted/50 border-muted'}`}>
                                                                <div className="space-y-1">
                                                                    <p className={`font-semibold text-sm ${scheduleInfo.isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                                                                        {scheduleInfo.subject}
                                                                    </p>
                                                                    <p className="text-xs text-muted-foreground">
                                                                        {scheduleInfo.professor}
                                                                    </p>
                                                                    {scheduleInfo.room && (
                                                                        <p className="text-xs text-muted-foreground">
                                                                            {scheduleInfo.room}
                                                                        </p>
                                                                    )}
                                                                    <Badge 
                                                                        variant={scheduleInfo.isActive ? "default" : "secondary"} 
                                                                        className="text-xs"
                                                                    >
                                                                        {scheduleInfo.isActive ? "Active" : "Inactive"}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="p-3 text-center text-muted-foreground text-sm">
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

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Schedule Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Total Time Slots</span>
                                <span className="font-semibold">{timeSlots.length * daysOfWeek.length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Scheduled Classes</span>
                                <span className="font-semibold">
                                    {Object.values(scheduleGrid).flat().filter(Boolean).length}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Free Time Slots</span>
                                <span className="font-semibold">
                                    {timeSlots.length * daysOfWeek.length - Object.values(scheduleGrid).flat().filter(Boolean).length}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Link href={route('schedules.create', { section_id: section.id })}>
                                <Button className="w-full justify-start">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add New Class
                                </Button>
                            </Link>
                            <Link href={route('sections.show', section.id)}>
                                <Button variant="outline" className="w-full justify-start">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Section Details
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
