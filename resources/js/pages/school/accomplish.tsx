import { Head } from '@inertiajs/react';
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

export default function SchoolAccomplish({ accomplishments = [] }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showFullDescription, setShowFullDescription] = useState(false);

    const current = accomplishments[currentIndex];
    
    if (!current) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <h2 className="text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                        No Accomplishments
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        There are no accomplishments available at this time.
                    </p>
                </div>
            </div>
        );
    }

    const next = () => {
        setCurrentIndex((prev) => (prev + 1) % accomplishments.length);
    };

    const prev = () => {
        setCurrentIndex((prev) => (prev - 1 + accomplishments.length) % accomplishments.length);
    };

    return (
        <>
            <Head title="School Accomplishments" />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 relative">
                {/* Navigation Buttons */}
                {accomplishments.length > 1 && (
                    <>
                        <button
                            onClick={prev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-200 dark:bg-gray-700 p-6 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 text-4xl shadow-lg z-10"
                        >
                            &#8592;
                        </button>
                        <button
                            onClick={next}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-200 dark:bg-gray-700 p-6 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 text-4xl shadow-lg z-10"
                        >
                            &#8594;
                        </button>
                    </>
                )}

                {/* Main Content */}
                <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    {/* Photos Section */}
                    {current.photos && current.photos.length > 0 && (
                        <div className="h-96 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                            <img
                                src={`/storage/${current.photos[0]}`}
                                alt={current.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="p-8">
                        {/* Type Badge */}
                        <div className="mb-4">
                            <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-lg font-semibold">
                                {current.type}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                            {current.title}
                        </h1>

                        {/* Description */}
                        <p className="text-xl text-gray-700 dark:text-gray-300 mb-6 whitespace-pre-wrap">
                            {current.description}
                        </p>

                        {/* Date */}
                        <p className="text-lg text-gray-500 dark:text-gray-400">
                            {current.created_at}
                        </p>

                        {/* Photo Gallery */}
                        {current.photos && current.photos.length > 1 && (
                            <div className="mt-8 grid grid-cols-2 gap-4">
                                {current.photos.slice(1, 5).map((photo, index) => (
                                    <img
                                        key={index}
                                        src={`/storage/${photo}`}
                                        alt={`${current.title} ${index + 2}`}
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Pagination Dots */}
                {accomplishments.length > 1 && (
                    <div className="absolute bottom-8 flex justify-center w-full space-x-3">
                        {accomplishments.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-4 h-4 rounded-full transition-all ${
                                    idx === currentIndex
                                        ? 'bg-blue-600 dark:bg-blue-400'
                                        : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

