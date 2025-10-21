import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Trophy, Plus, Trash2, Edit, Users, ImagePlus, Image as ImageIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Sport {
    id: number;
    name: string;
    description: string | null;
    delegates_count: number;
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
    sport?: Sport;
}

interface DelegatesProps {
    sports: Sport[];
}

export default function Delegates({ sports }: DelegatesProps) {
    const [showAddSportDialog, setShowAddSportDialog] = useState(false);
    const [showAddDelegateDialog, setShowAddDelegateDialog] = useState(false);
    const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
    const [editingSport, setEditingSport] = useState<Sport | null>(null);
    const [delegates, setDelegates] = useState<Delegate[]>([]);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const sportForm = useForm({
        name: '',
        description: '',
    });

    const delegateForm = useForm({
        sport_id: '',
        name: '',
        position: '',
        image: null as File | null,
    });

    const handleAddSport = (e: React.FormEvent) => {
        e.preventDefault();
        sportForm.post('/sports', {
            onSuccess: () => {
                sportForm.reset();
                setShowAddSportDialog(false);
            },
        });
    };

    const handleEditSport = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingSport) {
            sportForm.put(`/sports/${editingSport.id}`, {
                onSuccess: () => {
                    sportForm.reset();
                    setEditingSport(null);
                    setShowAddSportDialog(false);
                },
            });
        }
    };

    const handleDeleteSport = (sportId: number) => {
        if (confirm('Are you sure you want to delete this sport? This will also delete all delegates associated with it.')) {
            router.delete(`/sports/${sportId}`);
        }
    };

    const handleAddDelegate = (e: React.FormEvent) => {
        e.preventDefault();
        delegateForm.post('/delegates', {
            onSuccess: () => {
                delegateForm.reset();
                setShowAddDelegateDialog(false);
                setSelectedImage(null);
                setImagePreview(null);
                // Refresh delegates for the selected sport
                if (selectedSport) {
                    loadDelegates(selectedSport.id);
                }
            },
        });
    };

    const handleDeleteDelegate = (delegateId: number) => {
        if (confirm('Are you sure you want to delete this delegate?')) {
            router.delete(`/delegates/${delegateId}`, {
                onSuccess: () => {
                    if (selectedSport) {
                        loadDelegates(selectedSport.id);
                    }
                },
            });
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
            const maxSize = 5 * 1024 * 1024; // 5MB

            if (!allowedTypes.includes(file.type)) {
                alert('Please select a valid image file (JPEG, PNG, JPG, or GIF).');
                return;
            }

            if (file.size > maxSize) {
                alert('Image size must be less than 5MB.');
                return;
            }

            setSelectedImage(file);
            delegateForm.setData('image', file);
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const loadDelegates = async (sportId: number) => {
        // This would typically fetch from an API endpoint
        // For now, we'll use a simple fetch approach
        try {
            const response = await fetch(`/api/sports/${sportId}/delegates`);
            const data = await response.json();
            setDelegates(data);
        } catch (error) {
            console.error('Error loading delegates:', error);
        }
    };

    const openEditSportDialog = (sport: Sport) => {
        setEditingSport(sport);
        sportForm.setData({
            name: sport.name,
            description: sport.description || '',
        });
        setShowAddSportDialog(true);
    };

    const openAddSportDialog = () => {
        setEditingSport(null);
        sportForm.reset();
        setShowAddSportDialog(true);
    };

    const openAddDelegateDialog = (sport: Sport) => {
        setSelectedSport(sport);
        delegateForm.setData('sport_id', sport.id.toString());
        setShowAddDelegateDialog(true);
    };

    const viewDelegates = (sport: Sport) => {
        router.get(`/sports/${sport.id}`);
    };

    return (
        <AppLayout>
            <Head title="Delegates" />

            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Trophy className="w-8 h-8" />
                            Sports Delegates
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Manage sports and their delegates
                        </p>
                    </div>
                    <Dialog open={showAddSportDialog} onOpenChange={setShowAddSportDialog}>
                        <DialogTrigger asChild>
                            <Button onClick={openAddSportDialog}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Sport
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <form onSubmit={editingSport ? handleEditSport : handleAddSport}>
                                <DialogHeader>
                                    <DialogTitle>
                                        {editingSport ? 'Edit Sport' : 'Add New Sport'}
                                    </DialogTitle>
                                    <DialogDescription>
                                        {editingSport 
                                            ? 'Update the sport details below.'
                                            : 'Enter the details for the new sport.'}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Sport Name *</Label>
                                        <Input
                                            id="name"
                                            value={sportForm.data.name}
                                            onChange={(e) => sportForm.setData('name', e.target.value)}
                                            placeholder="e.g., Basketball, Volleyball"
                                            required
                                        />
                                        {sportForm.errors.name && (
                                            <p className="text-sm text-red-500">{sportForm.errors.name}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={sportForm.data.description}
                                            onChange={(e) => sportForm.setData('description', e.target.value)}
                                            placeholder="Brief description of the sport"
                                            rows={3}
                                        />
                                        {sportForm.errors.description && (
                                            <p className="text-sm text-red-500">{sportForm.errors.description}</p>
                                        )}
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setShowAddSportDialog(false);
                                            setEditingSport(null);
                                            sportForm.reset();
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={sportForm.processing}>
                                        {sportForm.processing ? 'Saving...' : editingSport ? 'Update' : 'Add Sport'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {sports.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <Trophy className="w-16 h-16 text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold mb-2">No Sports Yet</h3>
                            <p className="text-muted-foreground mb-4">Get started by adding your first sport</p>
                            <Button onClick={openAddSportDialog}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Sport
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sports.map((sport) => (
                            <Card key={sport.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="flex items-center gap-2">
                                                <Trophy className="w-5 h-5 text-primary" />
                                                {sport.name}
                                            </CardTitle>
                                            <CardDescription className="mt-2">
                                                {sport.description || 'No description'}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Users className="w-4 h-4" />
                                            <span>{sport.delegates_count} Delegate{sport.delegates_count !== 1 ? 's' : ''}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="flex-1"
                                                onClick={() => viewDelegates(sport)}
                                            >
                                                <Users className="w-4 h-4 mr-1" />
                                                View Delegates
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => openAddDelegateDialog(sport)}
                                            >
                                                <ImagePlus className="w-4 h-4" />
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => openEditSportDialog(sport)}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button 
                                                variant="destructive" 
                                                size="sm"
                                                onClick={() => handleDeleteSport(sport.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Add Delegate Dialog */}
                <Dialog open={showAddDelegateDialog} onOpenChange={setShowAddDelegateDialog}>
                    <DialogContent className="max-w-md">
                        <form onSubmit={handleAddDelegate}>
                            <DialogHeader>
                                <DialogTitle>Add Delegate</DialogTitle>
                                <DialogDescription>
                                    Add a new delegate to {selectedSport?.name}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="delegate-name">Name *</Label>
                                    <Input
                                        id="delegate-name"
                                        value={delegateForm.data.name}
                                        onChange={(e) => delegateForm.setData('name', e.target.value)}
                                        placeholder="Enter delegate name"
                                        required
                                    />
                                    {delegateForm.errors.name && (
                                        <p className="text-sm text-red-500">{delegateForm.errors.name}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="position">Position/Role</Label>
                                    <Input
                                        id="position"
                                        value={delegateForm.data.position}
                                        onChange={(e) => delegateForm.setData('position', e.target.value)}
                                        placeholder="e.g., Team Captain, Player"
                                    />
                                    {delegateForm.errors.position && (
                                        <p className="text-sm text-red-500">{delegateForm.errors.position}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="image">Delegate Photo</Label>
                                    <div className="space-y-2">
                                        <Input
                                            id="image"
                                            type="file"
                                            accept="image/jpeg,image/png,image/jpg,image/gif"
                                            onChange={handleImageSelect}
                                        />
                                        {delegateForm.errors.image && (
                                            <p className="text-sm text-red-500">{delegateForm.errors.image}</p>
                                        )}
                                        {imagePreview && (
                                            <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                                                <img 
                                                    src={imagePreview} 
                                                    alt="Preview" 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowAddDelegateDialog(false);
                                        delegateForm.reset();
                                        setSelectedImage(null);
                                        setImagePreview(null);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={delegateForm.processing}>
                                    {delegateForm.processing ? 'Adding...' : 'Add Delegate'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}

    