import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2, Calendar, Users } from 'lucide-react';
import { Section } from '@/types';

interface SectionShowProps {
    section: Section;
}

export default function ShowSection({ section }: SectionShowProps) {
    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete section "${section.name}"?`)) {
            router.delete(route('sections.destroy', section.id));
        }
    };

    const handleViewSchedule = () => {
        router.visit(route('sections.schedule', section.id));
    };

    return (
        <>
            <Head title={`Section: ${section.name}`} />
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={route('sections.index')}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Sections
                        </Button>
                    </Link>
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight">{section.name}</h1>
                            <Badge variant={section.is_active ? "default" : "secondary"}>
                                {section.is_active ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground">Section Code: {section.code}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button onClick={handleViewSchedule}>
                            <Calendar className="mr-2 h-4 w-4" />
                            View Schedule
                        </Button>
                        <Link href={route('sections.edit', section.id)}>
                            <Button variant="outline">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                        </Link>
                        <Button variant="outline" onClick={handleDelete} className="text-destructive hover:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Section Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                                <p className="text-lg font-semibold">{section.name}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Code</Label>
                                <p className="text-lg font-semibold">{section.code}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Capacity</Label>
                                <p className="text-lg font-semibold">{section.capacity} students</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                                <Badge variant={section.is_active ? "default" : "secondary"} className="mt-1">
                                    {section.is_active ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                            {section.description && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                                    <p className="text-sm">{section.description}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Schedule Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {section.schedules && section.schedules.length > 0 ? (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Total Classes</span>
                                        <span className="font-semibold">{section.schedules.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Active Classes</span>
                                        <span className="font-semibold">
                                            {section.schedules.filter(s => s.is_active).length}
                                        </span>
                                    </div>
                                    <div className="pt-3">
                                        <Button onClick={handleViewSchedule} className="w-full">
                                            <Calendar className="mr-2 h-4 w-4" />
                                            View Full Schedule
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">No Schedule</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        This section doesn't have any scheduled classes yet.
                                    </p>
                                    <Link href={route('schedules.create', { section_id: section.id })}>
                                        <Button>
                                            <Calendar className="mr-2 h-4 w-4" />
                                            Add Schedule
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {section.schedules && section.schedules.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Classes</CardTitle>
                            <CardDescription>
                                Latest scheduled classes for this section
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {section.schedules.slice(0, 5).map((schedule) => (
                                    <div key={schedule.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div>
                                            <p className="font-medium">{schedule.subject?.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {schedule.professor?.full_name} • {schedule.day_of_week} {schedule.time_slot}
                                            </p>
                                        </div>
                                        <Badge variant={schedule.is_active ? "default" : "secondary"}>
                                            {schedule.is_active ? "Active" : "Inactive"}
                                        </Badge>
                                    </div>
                                ))}
                                {section.schedules.length > 5 && (
                                    <div className="text-center pt-3">
                                        <Button variant="outline" onClick={handleViewSchedule}>
                                            View All {section.schedules.length} Classes
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}

// Add the Label import
import { Label } from '@/components/ui/label';
