import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import { Section } from '@/types';

interface EditSectionProps {
    section: Section;
}

export default function EditSection({ section }: EditSectionProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: section.name,
        code: section.code,
        description: section.description || '',
        capacity: section.capacity,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('sections.update', section.id));
    };

    return (
        <>
            <Head title={`Edit Section: ${section.name}`} />
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={route('sections.show', section.id)}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Section
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Edit Section</h1>
                        <p className="text-muted-foreground">
                            Update section information
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Section Information</CardTitle>
                        <CardDescription>
                            Update the details for this section
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Section Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g., Grade 7-A, STEM-11"
                                        className={errors.name ? 'border-destructive' : ''}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">{errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="code">Section Code</Label>
                                    <Input
                                        id="code"
                                        type="text"
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                        placeholder="e.g., G7A, STEM11"
                                        className={errors.code ? 'border-destructive' : ''}
                                    />
                                    {errors.code && (
                                        <p className="text-sm text-destructive">{errors.code}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Optional description of the section..."
                                    rows={3}
                                    className={errors.description ? 'border-destructive' : ''}
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">{errors.description}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="capacity">Capacity</Label>
                                <Input
                                    id="capacity"
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={data.capacity}
                                    onChange={(e) => setData('capacity', parseInt(e.target.value))}
                                    className={errors.capacity ? 'border-destructive' : ''}
                                />
                                {errors.capacity && (
                                    <p className="text-sm text-destructive">{errors.capacity}</p>
                                )}
                            </div>

                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Updating...' : 'Update Section'}
                                </Button>
                                <Link href={route('sections.show', section.id)}>
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
