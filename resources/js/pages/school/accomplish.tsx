import { Head, Link } from '@inertiajs/react';
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

    const next = () => {
        setCurrentIndex((prev) => (prev + 1) % accomplishments.length);
    };

    const prev = () => {
        setCurrentIndex((prev) => (prev - 1 + accomplishments.length) % accomplishments.length);
    };

    const current = accomplishments[currentIndex];
    
    if (!current) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
                {/* Back Button */}
                <div className="absolute top-4 left-4 z-20">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 hover:scale-105 active:scale-95 text-lg"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        Back
                    </Link>
                </div>
                <div className="text-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12">
                    <h2 className="text-5xl font-bold text-gray-700 dark:text-gray-300 mb-6">
                        No Accomplishments
                    </h2>
                    <p className="text-2xl text-gray-500 dark:text-gray-400">
                        There are no accomplishments available at this time.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head title="School Accomplishments" />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 relative">
                {/* Back Button */}
                <div className="absolute top-4 left-4 z-20">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 hover:scale-105 active:scale-95 text-lg"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        Back
                    </Link>
                </div>

                {/* Navigation Buttons */}
                {accomplishments.length > 1 && (
                    <>
                        <button
                            onClick={prev}
                            className="absolute left-6 top-1/2 -translate-y-1/2 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 p-8 rounded-full hover:scale-110 active:scale-95 text-5xl text-white shadow-2xl transition-all duration-200 z-10 min-w-[80px] min-h-[80px] flex items-center justify-center"
                        >
                            &#8592;
                        </button>
                        <button
                            onClick={next}
                            className="absolute right-6 top-1/2 -translate-y-1/2 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 p-8 rounded-full hover:scale-110 active:scale-95 text-5xl text-white shadow-2xl transition-all duration-200 z-10 min-w-[80px] min-h-[80px] flex items-center justify-center"
                        >
                            &#8594;
                        </button>
                    </>
                )}

                {/* Main Content */}
                <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                    {/* Photos Section */}
                    {current.photos && current.photos.length > 0 && (
                        <div className="h-[500px] bg-gray-200 dark:bg-gray-700 overflow-hidden">
                            <img
                                src={`/storage/${current.photos[0]}`}
                                alt={current.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="p-10">
                        {/* Type Badge */}
                        <div className="mb-6">
                            <span className="px-6 py-3 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-2xl font-bold">
                                {current.type}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-8">
                            {current.title}
                        </h1>

                        {/* Description */}
                        <p className="text-2xl text-gray-700 dark:text-gray-300 mb-8 whitespace-pre-wrap leading-relaxed">
                            {current.description}
                        </p>

                        {/* Date */}
                        <p className="text-xl text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-6 py-3 rounded-lg inline-block">
                            📅 {current.created_at}
                        </p>

                        {/* Photo Gallery */}
                        {current.photos && current.photos.length > 1 && (
                            <div className="mt-10 grid grid-cols-2 gap-6">
                                {current.photos.slice(1, 5).map((photo, index) => (
                                    <img
                                        key={index}
                                        src={`/storage/${photo}`}
                                        alt={`${current.title} ${index + 2}`}
                                        className="w-full h-64 object-cover rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200"
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Pagination Dots */}
                {accomplishments.length > 1 && (
                    <div className="absolute bottom-8 flex justify-center w-full space-x-4">
                        {accomplishments.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`min-w-[16px] min-h-[16px] w-4 h-4 rounded-full transition-all duration-200 hover:scale-125 ${
                                    idx === currentIndex
                                        ? 'bg-blue-600 dark:bg-blue-400 scale-125 shadow-lg'
                                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

