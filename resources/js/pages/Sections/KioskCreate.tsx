import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Keyboard, Save, X } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import KioskKeyboard from '@/components/kiosk-keyboard';
import { useState, useRef } from 'react';

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
    {
        title: 'Create Section (Kiosk)',
        href: '/sections/create',
    },
];

export default function KioskCreateSection() {
    const [showKeyboard, setShowKeyboard] = useState(false);
    const [activeField, setActiveField] = useState<'name' | 'code' | 'description' | null>(null);
    const [keyboardValue, setKeyboardValue] = useState('');
    
    const nameRef = useRef<HTMLInputElement>(null);
    const codeRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        code: '',
        description: '',
        capacity: 50,
    });

    const handleInputFocus = (field: 'name' | 'code' | 'description') => {
        setActiveField(field);
        setKeyboardValue(data[field]);
        setShowKeyboard(true);
    };

    const handleKeyboardInput = (value: string) => {
        setKeyboardValue(value);
        setData(activeField!, value);
    };

    const handleKeyboardClose = () => {
        setShowKeyboard(false);
        setActiveField(null);
        setKeyboardValue('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/sections');
    };

    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        // Don't close keyboard on blur for kiosk mode
        e.preventDefault();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Section (Kiosk Mode)" />
            <div className="flex h-full flex-1 flex-col gap-8 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/sections">
                            <Button variant="outline" size="lg" className="h-16 px-8">
                                <ArrowLeft className="mr-2 h-6 w-6" />
                                Back to Sections
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Create Section</h1>
                            <p className="text-xl text-gray-600 mt-2">
                                Add a new academic section (Kiosk Mode)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Form */}
                <div className="flex-1 flex items-center justify-center">
                    <Card className="w-full max-w-4xl shadow-2xl">
                        <CardHeader className="bg-blue-600 text-white rounded-t-lg">
                            <CardTitle className="text-3xl text-center">Section Information</CardTitle>
                            <CardDescription className="text-blue-100 text-center text-lg">
                                Fill in the details for the new section
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-12">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Section Name */}
                                <div className="space-y-4">
                                    <Label htmlFor="name" className="text-2xl font-semibold text-gray-700">
                                        Section Name *
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            ref={nameRef}
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            onFocus={() => handleInputFocus('name')}
                                            onBlur={handleInputBlur}
                                            placeholder="Enter section name (e.g., Computer Science 1A)"
                                            className={`h-16 text-2xl px-6 border-2 ${
                                                errors.name ? 'border-red-500' : 'border-gray-300'
                                            } focus:border-blue-500 focus:ring-4 focus:ring-blue-100`}
                                            readOnly
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="lg"
                                            className="absolute right-2 top-2 h-12 px-4"
                                            onClick={() => handleInputFocus('name')}
                                        >
                                            <Keyboard className="h-6 w-6" />
                                        </Button>
                                    </div>
                                    {errors.name && (
                                        <p className="text-lg text-red-600 font-medium">{errors.name}</p>
                                    )}
                                </div>

                                {/* Section Code */}
                                <div className="space-y-4">
                                    <Label htmlFor="code" className="text-2xl font-semibold text-gray-700">
                                        Section Code *
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            ref={codeRef}
                                            id="code"
                                            type="text"
                                            value={data.code}
                                            onChange={(e) => setData('code', e.target.value)}
                                            onFocus={() => handleInputFocus('code')}
                                            onBlur={handleInputBlur}
                                            placeholder="Enter section code (e.g., CS1A, IT2B)"
                                            className={`h-16 text-2xl px-6 border-2 ${
                                                errors.code ? 'border-red-500' : 'border-gray-300'
                                            } focus:border-blue-500 focus:ring-4 focus:ring-blue-100`}
                                            readOnly
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="lg"
                                            className="absolute right-2 top-2 h-12 px-4"
                                            onClick={() => handleInputFocus('code')}
                                        >
                                            <Keyboard className="h-6 w-6" />
                                        </Button>
                                    </div>
                                    {errors.code && (
                                        <p className="text-lg text-red-600 font-medium">{errors.code}</p>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="space-y-4">
                                    <Label htmlFor="description" className="text-2xl font-semibold text-gray-700">
                                        Description (Optional)
                                    </Label>
                                    <div className="relative">
                                        <Textarea
                                            ref={descriptionRef}
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            onFocus={() => handleInputFocus('description')}
                                            onBlur={handleInputBlur}
                                            placeholder="Enter section description"
                                            className={`h-32 text-xl px-6 border-2 resize-none ${
                                                errors.description ? 'border-red-500' : 'border-gray-300'
                                            } focus:border-blue-500 focus:ring-4 focus:ring-blue-100`}
                                            readOnly
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="lg"
                                            className="absolute right-2 top-2 h-12 px-4"
                                            onClick={() => handleInputFocus('description')}
                                        >
                                            <Keyboard className="h-6 w-6" />
                                        </Button>
                                    </div>
                                    {errors.description && (
                                        <p className="text-lg text-red-600 font-medium">{errors.description}</p>
                                    )}
                                </div>

                                {/* Capacity */}
                                <div className="space-y-4">
                                    <Label htmlFor="capacity" className="text-2xl font-semibold text-gray-700">
                                        Student Capacity
                                    </Label>
                                    <div className="flex items-center gap-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="lg"
                                            className="h-16 w-16 text-3xl"
                                            onClick={() => setData('capacity', Math.max(1, data.capacity - 1))}
                                        >
                                            -
                                        </Button>
                                        <Input
                                            id="capacity"
                                            type="number"
                                            min="1"
                                            max="100"
                                            value={data.capacity}
                                            onChange={(e) => setData('capacity', parseInt(e.target.value) || 1)}
                                            className="h-16 text-3xl text-center border-2 border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="lg"
                                            className="h-16 w-16 text-3xl"
                                            onClick={() => setData('capacity', Math.min(100, data.capacity + 1))}
                                        >
                                            +
                                        </Button>
                                    </div>
                                    {errors.capacity && (
                                        <p className="text-lg text-red-600 font-medium">{errors.capacity}</p>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-center gap-8 pt-8">
                                    <Button 
                                        type="submit" 
                                        disabled={processing}
                                        size="lg"
                                        className="h-20 px-12 text-2xl font-bold bg-green-600 hover:bg-green-700"
                                    >
                                        <Save className="mr-4 h-8 w-8" />
                                        {processing ? 'Creating...' : 'Create Section'}
                                    </Button>
                                    <Link href="/sections">
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            size="lg"
                                            className="h-20 px-12 text-2xl font-bold"
                                        >
                                            <X className="mr-4 h-8 w-8" />
                                            Cancel
                                        </Button>
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Kiosk Keyboard */}
                {showKeyboard && (
                    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-end">
                        <div className="w-full bg-white dark:bg-gray-800 rounded-t-lg overflow-hidden">
                            <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 bg-blue-600">
                                <span className="text-2xl font-bold text-white">
                                    {activeField === 'name' ? 'Section Name' : 
                                     activeField === 'code' ? 'Section Code' : 
                                     'Description'} Input
                                </span>
                                <button 
                                    onClick={handleKeyboardClose} 
                                    className="w-12 h-12 flex items-center justify-center text-3xl font-bold text-white hover:text-red-300 hover:bg-blue-700 rounded-full transition-colors duration-200"
                                    type="button"
                                >
                                    ✕
                                </button>
                            </div>
                            <KioskKeyboard
                                value={keyboardValue}
                                onChange={handleKeyboardInput}
                                onClose={handleKeyboardClose}
                            />
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
