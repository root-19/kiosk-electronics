import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, Calendar, Keyboard } from 'lucide-react';
import { PaginationData, Section, BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';

interface SectionsIndexProps {
    sections: PaginationData<Section>;
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
        title: 'Manage Sections',
        href: '/sections',
    },
];

export default function SectionsIndex({ sections }: SectionsIndexProps) {
    const [selectedSection, setSelectedSection] = useState<Section | null>(null);

    const handleDelete = (section: Section) => {
        if (confirm(`Are you sure you want to delete section "${section.name}"?`)) {
            router.delete(`/sections/${section.id}`);
        }
    };

    const handleViewSchedule = (section: Section) => {
        router.visit(`/sections/${section.id}/schedule`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sections" />
            <div className="flex h-full flex-1 flex-col gap-8 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Sections</h1>
                        <p className="text-muted-foreground">
                            Manage academic sections and their schedules
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/sections/create">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Section
                            </Button>
                        </Link>
                        <Link href="/sections/kiosk/create">
                            <Button variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100">
                                <Keyboard className="mr-2 h-4 w-4" />
                                Kiosk Mode
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {sections.data.map((section) => (
                        <Card key={section.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg">{section.name}</CardTitle>
                                        <CardDescription>{section.code}</CardDescription>
                                    </div>
                                    <Badge variant={section.is_active ? "default" : "secondary"}>
                                        {section.is_active ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        {section.description || "No description"}
                                    </p>
                                    <p className="text-sm font-medium">
                                        Capacity: {section.capacity} students
                                    </p>
                                    {section.schedules && (
                                        <p className="text-sm text-muted-foreground">
                                            {section.schedules.length} scheduled classes
                                        </p>
                                    )}
                                </div>
                                
                                <div className="flex items-center gap-2 mt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleViewSchedule(section)}
                                    >
                                        <Calendar className="mr-1 h-3 w-3" />
                                        Schedule
                                    </Button>
                                    <Link href={`/sections/${section.id}`}>
                                        <Button variant="outline" size="sm">
                                            <Eye className="mr-1 h-3 w-3" />
                                            View
                                        </Button>
                                    </Link>
                                    <Link href={`/sections/${section.id}/edit`}>
                                        <Button variant="outline" size="sm">
                                            <Edit className="mr-1 h-3 w-3" />
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(section)}
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="mr-1 h-3 w-3" />
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {sections.data.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <div className="text-center">
                                <h3 className="text-lg font-semibold">No sections found</h3>
                                <p className="text-muted-foreground mb-4">
                                    Get started by creating your first section
                                </p>
                                <Link href="/sections/create">
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Section
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {sections.links && sections.links.length > 3 && (
                    <div className="flex justify-center">
                        <nav className="flex items-center space-x-2">
                            {sections.links.map((link, index) => (
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
