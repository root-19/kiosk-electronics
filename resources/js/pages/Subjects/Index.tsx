import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { PaginationData, Subject } from '@/types';

interface SubjectsIndexProps {
    subjects: PaginationData<Subject>;
}

export default function SubjectsIndex({ subjects }: SubjectsIndexProps) {
    const handleDelete = (subject: Subject) => {
        if (confirm(`Are you sure you want to delete subject "${subject.name}"?`)) {
            router.delete(route('subjects.destroy', subject.id));
        }
    };

    return (
        <>
            <Head title="Subjects" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Subjects</h1>
                        <p className="text-muted-foreground">
                            Manage academic subjects and their details
                        </p>
                    </div>
                    <Link href={route('subjects.create')}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Subject
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {subjects.data.map((subject) => (
                        <Card key={subject.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg">{subject.name}</CardTitle>
                                        <CardDescription>{subject.code}</CardDescription>
                                    </div>
                                    <Badge variant={subject.is_active ? "default" : "secondary"}>
                                        {subject.is_active ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        {subject.description || "No description"}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="font-medium">Units: {subject.units}</span>
                                        {subject.department && (
                                            <span className="text-muted-foreground">
                                                {subject.department}
                                            </span>
                                        )}
                                    </div>
                                    {subject.schedules && (
                                        <p className="text-sm text-muted-foreground">
                                            {subject.schedules.length} scheduled classes
                                        </p>
                                    )}
                                </div>
                                
                                <div className="flex items-center gap-2 mt-4">
                                    <Link href={route('subjects.show', subject.id)}>
                                        <Button variant="outline" size="sm">
                                            <Eye className="mr-1 h-3 w-3" />
                                            View
                                        </Button>
                                    </Link>
                                    <Link href={route('subjects.edit', subject.id)}>
                                        <Button variant="outline" size="sm">
                                            <Edit className="mr-1 h-3 w-3" />
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(subject)}
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

                {subjects.data.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <div className="text-center">
                                <h3 className="text-lg font-semibold">No subjects found</h3>
                                <p className="text-muted-foreground mb-4">
                                    Get started by adding your first subject
                                </p>
                                <Link href={route('subjects.create')}>
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Subject
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {subjects.links && subjects.links.length > 3 && (
                    <div className="flex justify-center">
                        <nav className="flex items-center space-x-2">
                            {subjects.links.map((link, index) => (
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
        </>
    );
}
