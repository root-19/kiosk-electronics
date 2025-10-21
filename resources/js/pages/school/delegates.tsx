import React from 'react';
import { Head, router } from '@inertiajs/react';
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
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <Trophy className="h-16 w-16 text-blue-600" />
                            <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
                                Sports & Delegates
                            </h1>
                        </div>
                        <p className="mt-4 text-2xl text-gray-600">
                            Select a sport to view delegates and team information
                        </p>
                    </div>

                    {/* Sports Grid */}
                    {sports.length === 0 ? (
                        <Card className="max-w-2xl mx-auto">
                            <CardContent className="py-16">
                                <div className="text-center">
                                    <Trophy className="h-20 w-20 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                                        No Sports Available
                                    </h3>
                                    <p className="text-lg text-gray-600">
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
                                    className="group cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 hover:border-blue-400"
                                    onClick={() => handleSportClick(sport.id)}
                                >
                                    <CardHeader className="space-y-4">
                                        <div className="flex items-center justify-center p-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                                            <Trophy className="h-20 w-20 text-white" />
                                        </div>
                                        <CardTitle className="text-3xl text-center font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {sport.name}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {sport.description && (
                                            <p className="text-lg text-gray-600 text-center line-clamp-2">
                                                {sport.description}
                                            </p>
                                        )}
                                        <div className="flex items-center justify-center gap-3 p-4 bg-blue-50 rounded-lg">
                                            <Users className="h-6 w-6 text-blue-600" />
                                            <span className="text-xl font-semibold text-gray-900">
                                                {sport.delegates_count} {sport.delegates_count === 1 ? 'Delegate' : 'Delegates'}
                                            </span>
                                        </div>
                                        <div className="pt-4 text-center">
                                            <span className="text-lg text-blue-600 font-semibold group-hover:underline">
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
                            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                                <CardContent className="p-8">
                                    <div className="flex items-center gap-4">
                                        <div className="p-4 bg-white/20 rounded-lg">
                                            <Trophy className="h-10 w-10 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-5xl font-bold mb-2">{sports.length}</div>
                                            <div className="text-xl">Total Sports</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                                <CardContent className="p-8">
                                    <div className="flex items-center gap-4">
                                        <div className="p-4 bg-white/20 rounded-lg">
                                            <Users className="h-10 w-10 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-5xl font-bold mb-2">
                                                {sports.reduce((sum, sport) => sum + sport.delegates_count, 0)}
                                            </div>
                                            <div className="text-xl">Total Delegates</div>
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

