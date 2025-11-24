import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Subjects',
        href: '/subjects',
    },
    {
        title: 'Create Subject',
        href: '/subjects/create',
    },
];

export default function CreateSubject() {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
        name: '',
        description: '',
        units: 3,
        department: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/subjects');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Subject" />
            <div className="flex h-full flex-1 flex-col gap-8 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/subjects">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Subjects
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Create Subject</h1>
                            <p className="text-muted-foreground">
                                Add a new academic subject
                            </p>
                        </div>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Subject Information</CardTitle>
                        <CardDescription>
                            Enter the details for the new subject
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="code">Subject Code</Label>
                                    <Input
                                        id="code"
                                        type="text"
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                        placeholder="e.g., CS101, MATH101"
                                        className={errors.code ? 'border-destructive' : ''}
                                        required
                                    />
                                    {errors.code && (
                                        <p className="text-sm text-destructive">{errors.code}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name">Subject Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g., Introduction to Computer Science"
                                        className={errors.name ? 'border-destructive' : ''}
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">{errors.name}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Optional description of the subject..."
                                    rows={3}
                                    className={errors.description ? 'border-destructive' : ''}
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">{errors.description}</p>
                                )}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="units">Units</Label>
                                    <Input
                                        id="units"
                                        type="number"
                                        min="1"
                                        max="6"
                                        value={data.units}
                                        onChange={(e) => setData('units', parseInt(e.target.value) || 3)}
                                        className={errors.units ? 'border-destructive' : ''}
                                        required
                                    />
                                    {errors.units && (
                                        <p className="text-sm text-destructive">{errors.units}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="department">Department</Label>
                                    <Input
                                        id="department"
                                        type="text"
                                        value={data.department}
                                        onChange={(e) => setData('department', e.target.value)}
                                        placeholder="e.g., Computer Science, Mathematics"
                                        className={errors.department ? 'border-destructive' : ''}
                                    />
                                    {errors.department && (
                                        <p className="text-sm text-destructive">{errors.department}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating...' : 'Create Subject'}
                                </Button>
                                <Link href="/subjects">
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

