import React from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, User, ArrowLeft } from 'lucide-react';

interface Sport {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}

interface Delegate {
    id: number;
    sport_id: number;
    name: string;
    position: string | null;
    image_path: string | null;
    created_at: string;
    updated_at: string;
}

interface SportDelegatesProps {
    sport: Sport & { delegates: Delegate[] };
}

export default function SportDelegates({ sport }: SportDelegatesProps) {
    return (
        <>
            <Head title={`${sport.name} - Delegates`} />
            
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 relative">
                {/* Back Button */}
                <div className="absolute top-4 left-4 z-20">
                    <Link
                        href="/school/delegates"
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

                <div className="max-w-7xl mx-auto py-8">
                    {/* Header */}
                    <div className="mb-12">
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-6 mb-6">
                                <div className="p-6 bg-blue-600 dark:bg-blue-700 rounded-2xl">
                                    <Trophy className="h-20 w-20 text-white" />
                                </div>
                                <div className="text-center">
                                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
                                        {sport.name}
                                    </h1>
                                    {sport.description && (
                                        <p className="mt-3 text-2xl text-gray-600 dark:text-gray-400">
                                            {sport.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Delegates Section */}
                    <div className="mb-8">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 flex items-center justify-center gap-3">
                            <User className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                            Team Delegates
                        </h2>
                        
                        {sport.delegates.length === 0 ? (
                            <Card className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
                                <CardContent className="py-16">
                                    <div className="text-center">
                                        <User className="h-20 w-20 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                                        <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                            No Delegates Yet
                                        </h3>
                                        <p className="text-2xl text-gray-600 dark:text-gray-400">
                                            No delegates have been added to this sport yet
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {sport.delegates.map((delegate) => (
                                    <Card 
                                        key={delegate.id} 
                                        className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-4 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 bg-white dark:bg-gray-800 rounded-2xl shadow-xl"
                                    >
                                        <CardHeader className="pb-4">
                                            <div className="aspect-square relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 mb-4 shadow-lg">
                                                {delegate.image_path ? (
                                                    <img 
                                                        src={`/storage/${delegate.image_path}`} 
                                                        alt={delegate.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-blue-50 dark:bg-blue-900/20">
                                                        <User className="w-24 h-24 text-gray-400 dark:text-gray-500" />
                                                    </div>
                                                )}
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-3 text-center">
                                            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {delegate.name}
                                            </CardTitle>
                                            {delegate.position && (
                                                <div className="inline-block px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                    <p className="text-lg font-semibold text-blue-800 dark:text-blue-300">
                                                        {delegate.position}
                                                    </p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Stats */}
                    {sport.delegates.length > 0 && (
                        <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
                            <CardContent className="p-8">
                                <div className="flex items-center justify-center gap-4">
                                    <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                        <User className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="text-center">
                                        <div className="text-6xl font-bold mb-2 text-gray-900 dark:text-white">
                                            {sport.delegates.length}
                                        </div>
                                        <div className="text-2xl text-gray-600 dark:text-gray-400">
                                            {sport.delegates.length === 1 ? 'Delegate' : 'Total Delegates'}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}

