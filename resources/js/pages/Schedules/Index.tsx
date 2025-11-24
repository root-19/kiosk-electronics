import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2 } from 'lucide-react';
import { PaginationData, Schedule, BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';

interface SchedulesIndexProps {
    schedules: PaginationData<Schedule>;
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
];

export default function SchedulesIndex({ schedules }: SchedulesIndexProps) {
    const handleDelete = (schedule: Schedule) => {
        if (confirm(`Are you sure you want to delete this schedule?`)) {
            router.delete(`/schedules/${schedule.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Schedules" />
            <div className="flex h-full flex-1 flex-col gap-8 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Schedules</h1>
                        <p className="text-muted-foreground">
                            Manage class schedules and time slots
                        </p>
                    </div>
                    <Link href="/schedules/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Schedule
                        </Button>
                    </Link>
                </div>

                <div className="space-y-4">
                    {schedules.data.map((schedule) => (
                        <Card key={schedule.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold">
                                                {schedule.subject?.name || 'Unknown Subject'}
                                            </h3>
                                            <Badge variant={schedule.is_active ? "default" : "secondary"}>
                                                {schedule.is_active ? "Active" : "Inactive"}
                                            </Badge>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                                            <div>
                                                <span className="font-medium">Section:</span> {schedule.section?.name} ({schedule.section?.code})
                                            </div>
                                            <div>
                                                <span className="font-medium">Professor:</span> {schedule.professor?.full_name}
                                            </div>
                                            <div>
                                                <span className="font-medium">Time:</span> {schedule.day_of_week} {schedule.time_slot}
                                            </div>
                                        </div>
                                        
                                        {schedule.room && (
                                            <div className="mt-2 text-sm text-muted-foreground">
                                                <span className="font-medium">Room:</span> {schedule.room}
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(schedule)}
                                            className="text-destructive hover:text-destructive"
                                        >
                                            <Trash2 className="mr-1 h-3 w-3" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {schedules.data.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <div className="text-center">
                                <h3 className="text-lg font-semibold">No schedules found</h3>
                                <p className="text-muted-foreground mb-4">
                                    Get started by creating your first schedule
                                </p>
                                <Link href="/schedules/create">
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Schedule
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {schedules.links && schedules.links.length > 3 && (
                    <div className="flex justify-center">
                        <nav className="flex items-center space-x-2">
                            {schedules.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-3 py-2 text-sm rounded-md ${
                                        link.active
                                            ? 'bg-primary text-primary-foreground'
                                            : link.url
                                            ? 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                            : 'text-muted-foreground cursor-not-allowed'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
