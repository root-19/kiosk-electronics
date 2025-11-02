import React from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Users } from 'lucide-react';

interface Sport {
    id: number;
    name: string;
    description: string | null;
    delegates_count: number;
    created_at: string;
    updated_at: string;
}

interface DelegatesProps {
    sports: Sport[];
}

export default function Delegates({ sports }: DelegatesProps) {
    const handleSportClick = (sportId: number) => {
        router.get(`/school/sports/${sportId}`);
    };

    return (
        <>
            <Head title="Sports & Delegates" />
            
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

                <div className="max-w-7xl mx-auto py-8">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <Trophy className="h-16 w-16 text-blue-600 dark:text-blue-400" />
                            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
                                Sports & Delegates
                            </h1>
                        </div>
                        <p className="mt-4 text-2xl text-gray-600 dark:text-gray-400">
                            Select a sport to view delegates and team information
                        </p>
                    </div>

                    {/* Sports Grid */}
                    {sports.length === 0 ? (
                        <Card className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
                            <CardContent className="py-16">
                                <div className="text-center">
                                    <Trophy className="h-20 w-20 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                                    <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                        No Sports Available
                                    </h3>
                                    <p className="text-2xl text-gray-600 dark:text-gray-400">
                                        Check back later for sports information
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {sports.map((sport) => (
                                <Card 
                                    key={sport.id} 
                                    className="group cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-4 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 bg-white dark:bg-gray-800 rounded-2xl shadow-xl"
                                    onClick={() => handleSportClick(sport.id)}
                                >
                                    <CardHeader className="space-y-4">
                                        <div className="flex items-center justify-center p-6 bg-blue-600 dark:bg-blue-700 rounded-xl">
                                            <Trophy className="h-20 w-20 text-white" />
                                        </div>
                                        <CardTitle className="text-3xl text-center font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {sport.name}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {sport.description && (
                                            <p className="text-xl text-gray-600 dark:text-gray-400 text-center line-clamp-2">
                                                {sport.description}
                                            </p>
                                        )}
                                        <div className="flex items-center justify-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                            <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                            <span className="text-2xl font-semibold text-gray-900 dark:text-white">
                                                {sport.delegates_count} {sport.delegates_count === 1 ? 'Delegate' : 'Delegates'}
                                            </span>
                                        </div>
                                        <div className="pt-4 text-center">
                                            <span className="text-xl text-blue-600 dark:text-blue-400 font-semibold group-hover:underline">
                                                Tap to View Details →
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Stats */}
                    {sports.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                            <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
                                <CardContent className="p-8">
                                    <div className="flex items-center gap-4">
                                        <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                            <Trophy className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <div className="text-5xl font-bold mb-2 text-gray-900 dark:text-white">{sports.length}</div>
                                            <div className="text-xl text-gray-600 dark:text-gray-400">Total Sports</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
                                <CardContent className="p-8">
                                    <div className="flex items-center gap-4">
                                        <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                            <Users className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <div className="text-5xl font-bold mb-2 text-gray-900 dark:text-white">
                                                {sports.reduce((sum, sport) => sum + sport.delegates_count, 0)}
                                            </div>
                                            <div className="text-xl text-gray-600 dark:text-gray-400">Total Delegates</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

