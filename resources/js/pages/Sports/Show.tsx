import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Plus, Trash2, Edit, ImagePlus, Trophy, User } from 'lucide-react';

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

interface SportShowProps {
    sport: Sport & { delegates: Delegate[] };
}

export default function SportShow({ sport }: SportShowProps) {
    const [showAddDelegateDialog, setShowAddDelegateDialog] = useState(false);
    const [editingDelegate, setEditingDelegate] = useState<Delegate | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const delegateForm = useForm({
        sport_id: sport.id.toString(),
        name: '',
        position: '',
        image: null as File | null,
    });

    const handleAddDelegate = (e: React.FormEvent) => {
        e.preventDefault();
        delegateForm.post('/delegates', {
            forceFormData: true,
            onSuccess: () => {
                delegateForm.reset();
                setShowAddDelegateDialog(false);
                setImagePreview(null);
            },
        });
    };

    const handleEditDelegate = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingDelegate) {
            const formData = new FormData();
            formData.append('sport_id', delegateForm.data.sport_id);
            formData.append('name', delegateForm.data.name);
            formData.append('position', delegateForm.data.position);
            if (delegateForm.data.image) {
                formData.append('image', delegateForm.data.image);
            }
            formData.append('_method', 'PUT');

            router.post(`/delegates/${editingDelegate.id}`, formData, {
                onSuccess: () => {
                    delegateForm.reset();
                    setEditingDelegate(null);
                    setShowAddDelegateDialog(false);
                    setImagePreview(null);
                },
            });
        }
    };

    const handleDeleteDelegate = (delegateId: number) => {
        if (confirm('Are you sure you want to delete this delegate?')) {
            router.delete(`/delegates/${delegateId}`);
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

            delegateForm.setData('image', file);
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const openEditDelegateDialog = (delegate: Delegate) => {
        setEditingDelegate(delegate);
        delegateForm.setData({
            sport_id: sport.id.toString(),
            name: delegate.name,
            position: delegate.position || '',
            image: null,
        });
        if (delegate.image_path) {
            setImagePreview(`/storage/${delegate.image_path}`);
        }
        setShowAddDelegateDialog(true);
    };

    const openAddDelegateDialog = () => {
        setEditingDelegate(null);
        delegateForm.reset();
        delegateForm.setData('sport_id', sport.id.toString());
        setImagePreview(null);
        setShowAddDelegateDialog(true);
    };

    return (
        <AppLayout>
            <Head title={`${sport.name} Delegates`} />

            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => router.get('/delegates')}
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-2">
                                <Trophy className="w-8 h-8" />
                                {sport.name}
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                {sport.description || 'No description'}
                            </p>
                        </div>
                    </div>
                    <Dialog open={showAddDelegateDialog} onOpenChange={setShowAddDelegateDialog}>
                        <DialogTrigger asChild>
                            <Button onClick={openAddDelegateDialog}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Delegate
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <form onSubmit={editingDelegate ? handleEditDelegate : handleAddDelegate}>
                                <DialogHeader>
                                    <DialogTitle>
                                        {editingDelegate ? 'Edit Delegate' : 'Add Delegate'}
                                    </DialogTitle>
                                    <DialogDescription>
                                        {editingDelegate 
                                            ? 'Update the delegate details below.'
                                            : `Add a new delegate to ${sport.name}`}
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
                                            setEditingDelegate(null);
                                            delegateForm.reset();
                                            setImagePreview(null);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={delegateForm.processing}>
                                        {delegateForm.processing ? 'Saving...' : editingDelegate ? 'Update' : 'Add Delegate'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {sport.delegates.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <User className="w-16 h-16 text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold mb-2">No Delegates Yet</h3>
                            <p className="text-muted-foreground mb-4">Get started by adding your first delegate</p>
                            <Button onClick={openAddDelegateDialog}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Delegate
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {sport.delegates.map((delegate) => (
                            <Card key={delegate.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="aspect-square relative rounded-lg overflow-hidden bg-muted mb-3">
                                        {delegate.image_path ? (
                                            <img 
                                                src={`/storage/${delegate.image_path}`} 
                                                alt={delegate.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <User className="w-16 h-16 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>
                                    <CardTitle className="text-lg">{delegate.name}</CardTitle>
                                    {delegate.position && (
                                        <CardDescription>{delegate.position}</CardDescription>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    <div className="flex gap-2">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="flex-1"
                                            onClick={() => openEditDelegateDialog(delegate)}
                                        >
                                            <Edit className="w-4 h-4 mr-1" />
                                            Edit
                                        </Button>
                                        <Button 
                                            variant="destructive" 
                                            size="sm"
                                            onClick={() => handleDeleteDelegate(delegate.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

