import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Accomplishment {
    id: number;
    title: string;
    description: string;
    type: string;
    photos: string[];
    created_at: string;
}

interface Props {
    accomplishments: Accomplishment[];
}

export default function Accomplish({ accomplishments = [] }: Props) {
    const [showForm, setShowForm] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        type: 'academic',
        photos: [] as File[],
    });

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setData('photos', Array.from(e.target.files));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('type', data.type);
        
        data.photos.forEach((photo) => {
            formData.append('photos[]', photo);
        });

        post('/accomplish', {
            forceFormData: true,
            onSuccess: () => {
                setShowForm(false);
                reset();
            },
        });
    };

    const accomplishmentTypes = [
        { value: 'academic', label: 'Academic' },
        { value: 'sports', label: 'Sports' },
        { value: 'cultural', label: 'Cultural' },
        { value: 'community', label: 'Community Service' },
        { value: 'other', label: 'Other' },
    ];

    return (
        <AppLayout>
            <Head title="Accomplishments" />
            
            <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-5xl font-bold">Accomplishments</h1>
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-12 py-6 bg-blue-600 text-white rounded-xl text-2xl font-bold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:scale-105"
                    >
                        + Add Accomplishment
                    </button>
                </div>

                {/* Accomplishments Grid - Kiosk Style */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {accomplishments.map((accomplishment) => (
                        <div
                            key={accomplishment.id}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
                        >
                            {/* Photos */}
                            {accomplishment.photos.length > 0 && (
                                <div className="h-80 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                    <img
                                        src={`/storage/${accomplishment.photos[0]}`}
                                        alt={accomplishment.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            
                            <div className="p-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-6 py-3 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xl font-bold">
                                        {accomplishment.type}
                                    </span>
                                </div>
                                <h3 className="text-3xl font-bold mb-4">{accomplishment.title}</h3>
                                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 line-clamp-4">
                                    {accomplishment.description}
                                </p>
                                <p className="text-xl text-gray-500 dark:text-gray-500">
                                    {accomplishment.created_at}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {accomplishments.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 dark:text-gray-400 text-3xl">
                            No accomplishments yet. Add one to get started!
                        </p>
                    </div>
                )}

                {/* Add Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-8">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-12">
                            <h2 className="text-4xl font-bold mb-8">Add New Accomplishment</h2>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-2xl font-bold mb-4">Title *</label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="w-full px-6 py-4 text-xl border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                        required
                                    />
                                    {errors.title && <p className="text-red-500 text-lg mt-2">{errors.title}</p>}
                                </div>

                                <div>
                                    <label className="block text-2xl font-bold mb-4">Type *</label>
                                    <select
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                        className="w-full px-6 py-4 text-xl border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                        required
                                    >
                                        {accomplishmentTypes.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-2xl font-bold mb-4">Description *</label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={6}
                                        className="w-full px-6 py-4 text-xl border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                                        required
                                    />
                                    {errors.description && <p className="text-red-500 text-lg mt-2">{errors.description}</p>}
                                </div>

                                <div>
                                    <label className="block text-2xl font-bold mb-4">Photos (Multiple allowed)</label>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        className="w-full px-6 py-4 text-xl border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                    {errors.photos && <p className="text-red-500 text-lg mt-2">{errors.photos}</p>}
                                </div>

                                <div className="flex gap-6 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="flex-1 px-8 py-6 border-2 rounded-xl text-2xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 px-8 py-6 bg-blue-600 text-white rounded-xl text-2xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                    >
                                        {processing ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
