import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Download, Trash2, Eye, EyeOff, FileText, File } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { syllabus } from '@/routes';

interface SyllabusFile {
    id: number;
    title: string;
    description: string | null;
    file_name: string;
    file_path: string;
    file_type: string;
    file_size: number;
    subject: string | null;
    grade_level: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface SyllabusProps {
    syllabi: SyllabusFile[];
}

export default function Syllabus({ syllabi }: SyllabusProps) {
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        subject: '',
        grade_level: '',
        file: null as File | null,
    });

    const handleFileSelect = (file: File) => {
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!allowedTypes.includes(file.type)) {
            alert('Please select a PDF or DOC/DOCX file.');
            return;
        }

        if (file.size > maxSize) {
            alert('File size must be less than 10MB.');
            return;
        }

        setSelectedFile(file);
        setData('file', file);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(syllabus.store().url, {
            onSuccess: () => {
                reset();
                setSelectedFile(null);
                setShowUploadForm(false);
            },
        });
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (fileType: string) => {
        if (fileType.includes('pdf')) {
            return <FileText className="h-8 w-8 text-red-500" />;
        }
        return <File className="h-8 w-8 text-blue-500" />;
    };

    return (
        <AppLayout>
            <Head title="Syllabus" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-3xl font-bold text-gray-900">Syllabus Management</h1>
                                <Button 
                                    onClick={() => setShowUploadForm(!showUploadForm)}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload Syllabus
                                </Button>
                            </div>

                            {showUploadForm && (
                                <Card className="mb-6">
                                    <CardHeader>
                                        <CardTitle>Upload New Syllabus</CardTitle>
                                        <CardDescription>
                                            Upload PDF or DOC/DOCX files (max 10MB)
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="title">Title *</Label>
                                                    <Input
                                                        id="title"
                                                        type="text"
                                                        value={data.title}
                                                        onChange={(e) => setData('title', e.target.value)}
                                                        className="mt-1"
                                                        required
                                                    />
                                                    {errors.title && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <Label htmlFor="subject">Subject</Label>
                                                    <Input
                                                        id="subject"
                                                        type="text"
                                                        value={data.subject}
                                                        onChange={(e) => setData('subject', e.target.value)}
                                                        className="mt-1"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <Label htmlFor="description">Description</Label>
                                                <textarea
                                                    id="description"
                                                    value={data.description}
                                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                                                    className="mt-1 flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                    rows={3}
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="grade_level">Grade Level</Label>
                                                    <Select value={data.grade_level} onValueChange={(value) => setData('grade_level', value)}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select grade level" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Elementary">Elementary</SelectItem>
                                                            <SelectItem value="Middle School">Middle School</SelectItem>
                                                            <SelectItem value="High School">High School</SelectItem>
                                                            <SelectItem value="College">College</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <div>
                                                <Label>File Upload *</Label>
                                                <div
                                                    className={`mt-2 border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                                                        dragActive 
                                                            ? 'border-blue-500 bg-blue-50' 
                                                            : selectedFile 
                                                                ? 'border-green-500 bg-green-50' 
                                                                : 'border-gray-300 hover:border-gray-400'
                                                    }`}
                                                    onDragEnter={handleDrag}
                                                    onDragLeave={handleDrag}
                                                    onDragOver={handleDrag}
                                                    onDrop={handleDrop}
                                                >
                                                    <input
                                                        type="file"
                                                        accept=".pdf,.doc,.docx"
                                                        onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                                                        className="hidden"
                                                        id="file-upload"
                                                    />
                                                    <label htmlFor="file-upload" className="cursor-pointer">
                                                        {selectedFile ? (
                                                            <div className="space-y-2">
                                                                {getFileIcon(selectedFile.type)}
                                                                <p className="text-sm font-medium text-green-600">
                                                                    {selectedFile.name}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    {formatFileSize(selectedFile.size)}
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-2">
                                                                <Upload className="h-8 w-8 mx-auto text-gray-400" />
                                                                <p className="text-sm text-gray-600">
                                                                    Drag and drop your file here, or click to select
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    PDF, DOC, DOCX (max 10MB)
                                                                </p>
                                                            </div>
                                                        )}
                                                    </label>
                                                </div>
                                                {errors.file && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.file}</p>
                                                )}
                                            </div>

                                            <div className="flex justify-end space-x-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setShowUploadForm(false);
                                                        reset();
                                                        setSelectedFile(null);
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    disabled={processing || !selectedFile}
                                                    className="bg-blue-600 hover:bg-blue-700"
                                                >
                                                    {processing ? 'Uploading...' : 'Upload Syllabus'}
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {syllabi.map((syllabus) => (
                                    <Card key={syllabus.id} className="hover:shadow-lg transition-shadow">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center space-x-2">
                                                    {getFileIcon(syllabus.file_type)}
                                                    <div>
                                                        <CardTitle className="text-lg">{syllabus.title}</CardTitle>
                                                        {syllabus.subject && (
                                                            <Badge variant="secondary" className="mt-1">
                                                                {syllabus.subject}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                                <Badge variant={syllabus.is_active ? "default" : "secondary"}>
                                                    {syllabus.is_active ? "Active" : "Inactive"}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            {syllabus.description && (
                                                <p className="text-sm text-gray-600 mb-3">
                                                    {syllabus.description}
                                                </p>
                                            )}
                                            
                                            <div className="space-y-2 text-sm text-gray-500">
                                                <p><strong>File:</strong> {syllabus.file_name}</p>
                                                <p><strong>Size:</strong> {formatFileSize(syllabus.file_size)}</p>
                                                {syllabus.grade_level && (
                                                    <p><strong>Level:</strong> {syllabus.grade_level}</p>
                                                )}
                                                <p><strong>Uploaded:</strong> {new Date(syllabus.created_at).toLocaleDateString()}</p>
                                            </div>

                                            <div className="flex justify-between items-center mt-4 pt-3 border-t">
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <a href={`/syllabus/${syllabus.id}/download`}>
                                                        <Download className="h-4 w-4 mr-1" />
                                                        Download
                                                    </a>
                                                </Button>
                                                
                                                <div className="flex space-x-1">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            // Toggle active status
                                                            window.location.href = `/syllabus/${syllabus.id}/toggle`;
                                                        }}
                                                    >
                                                        {syllabus.is_active ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            if (confirm('Are you sure you want to delete this syllabus?')) {
                                                                window.location.href = `/syllabus/${syllabus.id}`;
                                                            }
                                                        }}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {syllabi.length === 0 && (
                                <div className="text-center py-12">
                                    <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No syllabus files</h3>
                                    <p className="text-gray-500 mb-4">Get started by uploading your first syllabus file.</p>
                                    <Button 
                                        onClick={() => setShowUploadForm(true)}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        <Upload className="h-4 w-4 mr-2" />
                                        Upload Syllabus
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
