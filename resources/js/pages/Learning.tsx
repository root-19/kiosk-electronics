import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, File, FileText, ArrowRight } from 'lucide-react';

export default function Learning() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    title: '',
    description: '',
    subject: '',
    grade_level: '',
    file: null as File | null,
    category: 'learning' as 'learning' | 'syllabus',
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType?: string) => {
    if (!fileType) return <File className="h-8 w-8 text-blue-500" />;
    if (fileType.includes('word')) return <FileText className="h-8 w-8 text-blue-600" />;
    return <File className="h-8 w-8 text-blue-500" />;
  };

  const handleFileSelect = (file: File) => {
    const allowedTypes = [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      alert('Please select a DOC or DOCX file.');
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
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFileSelect(e.dataTransfer.files[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/syllabus', {
      forceFormData: true,
      onSuccess: () => {
        reset();
        setSelectedFile(null);
      },
    });
  };

  return (
    <AppLayout>
      <Head title="Learning Materials - Upload" />

      <div className="py-12">
        <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Upload Learning Material</h1>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/school/learning" className="inline-flex items-center">
                    View Public Page
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>DOC/DOCX Upload</CardTitle>
                  <CardDescription>Upload Word documents up to 10MB. These will appear on the school Learning page.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Title *</Label>
                        <Input id="title" type="text" value={data.title} onChange={(e) => setData('title', e.target.value)} className="mt-1" required />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                      </div>
                      <div>
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" type="text" value={data.subject} onChange={(e) => setData('subject', e.target.value)} className="mt-1" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="grade_level">Grade Level</Label>
                        <Input id="grade_level" type="text" value={data.grade_level} onChange={(e) => setData('grade_level', e.target.value)} className="mt-1" />
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

                    <div>
                      <Label>File Upload *</Label>
                      <div
                        className={`mt-2 border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                          dragActive ? 'border-blue-500 bg-blue-50' : selectedFile ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <input
                          type="file"
                          accept=".doc,.docx"
                          onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                          className="hidden"
                          id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          {selectedFile ? (
                            <div className="space-y-2">
                              {getFileIcon(selectedFile.type)}
                              <p className="text-sm font-medium text-green-600">{selectedFile.name}</p>
                              <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Upload className="h-8 w-8 mx-auto text-gray-400" />
                              <p className="text-sm text-gray-600">Drag and drop your file here, or click to select</p>
                              <p className="text-xs text-gray-500">DOC, DOCX (max 10MB)</p>
                            </div>
                          )}
                        </label>
                      </div>
                      {errors.file && <p className="text-red-500 text-sm mt-1">{errors.file}</p>}
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          reset();
                          setSelectedFile(null);
                        }}
                      >
                        Clear
                      </Button>
                      <Button type="submit" disabled={processing || !selectedFile} className="bg-blue-600 hover:bg-blue-700">
                        {processing ? 'Uploading...' : 'Upload'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}


