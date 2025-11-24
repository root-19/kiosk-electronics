import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2 } from 'lucide-react';
import { PaginationData, Professor, BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';

interface ProfessorsIndexProps {
    professors: PaginationData<Professor>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Professors',
        href: '/professors',
    },
];

export default function ProfessorsIndex({ professors }: ProfessorsIndexProps) {
    const handleDelete = (professor: Professor) => {
        if (confirm(`Are you sure you want to delete professor "${professor.full_name}"?`)) {
            router.delete(`/professors/${professor.id}`);
        }
    };

    const handleAddProfessor = () => {
        router.get('/professors/create');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'f' || e.key === 'F') {
            e.preventDefault();
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Professors" />
            <div className="flex h-full flex-1 flex-col gap-8 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Professors</h1>
                        <p className="text-muted-foreground">
                            Manage faculty members and their information
                        </p>
                    </div>
                    <Button onClick={handleAddProfessor} onKeyDown={handleKeyDown}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Professor
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {professors.data.map((professor) => (
                        <Card key={professor.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg">{professor.full_name}</CardTitle>
                                        <CardDescription>{professor.employee_id}</CardDescription>
                                    </div>
                                    <Badge variant={professor.is_active ? "default" : "secondary"}>
                                        {professor.is_active ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        {professor.email}
                                    </p>
                                    <p className="text-sm font-medium">
                                        Department: {professor.department || 'Not specified'}
                                    </p>
                                    {professor.phone && (
                                        <p className="text-sm text-muted-foreground">
                                            Phone: {professor.phone}
                                        </p>
                                    )}
                                    {professor.schedules && (
                                        <p className="text-sm text-muted-foreground">
                                            {professor.schedules.length} scheduled classes
                                        </p>
                                    )}
                                </div>
                                
                                <div className="flex items-center gap-2 mt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(professor)}
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

                {professors.data.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <div className="text-center">
                                <h3 className="text-lg font-semibold">No professors found</h3>
                                <p className="text-muted-foreground mb-4">
                                    Get started by adding your first professor
                                </p>
                                <Button onClick={handleAddProfessor} onKeyDown={handleKeyDown}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Professor
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {professors.links && professors.links.length > 3 && (
                    <div className="flex justify-center">
                        <nav className="flex items-center space-x-2">
                            {professors.links.map((link, index) => (
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
