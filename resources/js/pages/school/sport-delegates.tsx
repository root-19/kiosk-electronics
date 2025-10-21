import React from 'react';
import { Head, router } from '@inertiajs/react';
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
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <Button
                                onClick={() => router.get('/school/delegates')}
                                size="lg"
                                variant="outline"
                                className="text-xl h-16 px-8"
                            >
                                <ArrowLeft className="h-6 w-6 mr-2" />
                                Back to Sports
                            </Button>
                        </div>
                        
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-6 mb-6">
                                <div className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
                                    <Trophy className="h-20 w-20 text-white" />
                                </div>
                                <div className="text-left">
                                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
                                        {sport.name}
                                    </h1>
                                    {sport.description && (
                                        <p className="mt-3 text-2xl text-gray-600">
                                            {sport.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Delegates Section */}
                    <div className="mb-8">
                        <h2 className="text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                            <User className="h-10 w-10 text-blue-600" />
                            Team Delegates
                        </h2>
                        
                        {sport.delegates.length === 0 ? (
                            <Card className="max-w-2xl mx-auto">
                                <CardContent className="py-16">
                                    <div className="text-center">
                                        <User className="h-20 w-20 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                                            No Delegates Yet
                                        </h3>
                                        <p className="text-lg text-gray-600">
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
                                        className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 hover:border-blue-400"
                                    >
                                        <CardHeader className="pb-4">
                                            <div className="aspect-square relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 mb-4 border-4 border-white shadow-lg">
                                                {delegate.image_path ? (
                                                    <img 
                                                        src={`/storage/${delegate.image_path}`} 
                                                        alt={delegate.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                                                        <User className="w-24 h-24 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-3 text-center">
                                            <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                {delegate.name}
                                            </CardTitle>
                                            {delegate.position && (
                                                <div className="inline-block px-4 py-2 bg-blue-100 rounded-lg">
                                                    <p className="text-lg font-semibold text-blue-800">
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
                        <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            <CardContent className="p-8">
                                <div className="flex items-center justify-center gap-4">
                                    <div className="p-4 bg-white/20 rounded-lg">
                                        <User className="h-12 w-12 text-white" />
                                    </div>
                                    <div className="text-center">
                                        <div className="text-6xl font-bold mb-2">
                                            {sport.delegates.length}
                                        </div>
                                        <div className="text-2xl">
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

