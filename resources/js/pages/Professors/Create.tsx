import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
        title: 'Professors',
        href: '/professors',
    },
    {
        title: 'Create Professor',
        href: '/professors/create',
    },
];

export default function CreateProfessor() {
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        employee_id: '',
        department: '',
        phone: '',
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/professors');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Professor" />
            <div className="flex h-full flex-1 flex-col gap-8 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/professors">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Professors
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Create Professor</h1>
                            <p className="text-muted-foreground">
                                Add a new faculty member
                            </p>
                        </div>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Professor Information</CardTitle>
                        <CardDescription>
                            Enter the details for the new professor
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="first_name">First Name</Label>
                                    <Input
                                        id="first_name"
                                        type="text"
                                        value={data.first_name}
                                        onChange={(e) => setData('first_name', e.target.value)}
                                        placeholder="e.g., Juan"
                                        className={errors.first_name ? 'border-destructive' : ''}
                                        required
                                    />
                                    {errors.first_name && (
                                        <p className="text-sm text-destructive">{errors.first_name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="last_name">Last Name</Label>
                                    <Input
                                        id="last_name"
                                        type="text"
                                        value={data.last_name}
                                        onChange={(e) => setData('last_name', e.target.value)}
                                        placeholder="e.g., Dela Cruz"
                                        className={errors.last_name ? 'border-destructive' : ''}
                                        required
                                    />
                                    {errors.last_name && (
                                        <p className="text-sm text-destructive">{errors.last_name}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="e.g., juan.delacruz@example.com"
                                        className={errors.email ? 'border-destructive' : ''}
                                        required
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-destructive">{errors.email}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="employee_id">Employee ID</Label>
                                    <Input
                                        id="employee_id"
                                        type="text"
                                        value={data.employee_id}
                                        onChange={(e) => setData('employee_id', e.target.value)}
                                        placeholder="e.g., EMP-001"
                                        className={errors.employee_id ? 'border-destructive' : ''}
                                        required
                                    />
                                    {errors.employee_id && (
                                        <p className="text-sm text-destructive">{errors.employee_id}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="department">Department</Label>
                                    <Input
                                        id="department"
                                        type="text"
                                        value={data.department}
                                        onChange={(e) => setData('department', e.target.value)}
                                        placeholder="e.g., Computer Science"
                                        className={errors.department ? 'border-destructive' : ''}
                                    />
                                    {errors.department && (
                                        <p className="text-sm text-destructive">{errors.department}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="e.g., +63 912 345 6789"
                                        className={errors.phone ? 'border-destructive' : ''}
                                    />
                                    {errors.phone && (
                                        <p className="text-sm text-destructive">{errors.phone}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating...' : 'Create Professor'}
                                </Button>
                                <Link href="/professors">
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

