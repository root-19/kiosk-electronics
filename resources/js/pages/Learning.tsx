import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, File, FileText, Search, X } from 'lucide-react';

interface LearningDoc {
  id: number;
  title: string;
  description?: string;
  subject?: string;
  grade_level?: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

interface Props {
  docs: LearningDoc[];
  [key: string]: any;
}

export default function Learning() {
  const { props } = usePage<Props>();
  const docs = (props.docs || []) as LearningDoc[];
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<LearningDoc | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPreviewUrl, setCurrentPreviewUrl] = useState<string>('');

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

  const filteredDocs = docs.filter((doc) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      doc.title?.toLowerCase().includes(query) ||
      doc.file_name?.toLowerCase().includes(query) ||
      doc.description?.toLowerCase().includes(query) ||
      doc.subject?.toLowerCase().includes(query) ||
      doc.grade_level?.toLowerCase().includes(query)
    );
  });

  const getFileUrl = (doc: LearningDoc) => {
    const fileUrl = encodeURIComponent(`${window.location.origin}/storage/${doc.file_path}`);
    return `https://docs.google.com/gview?url=${fileUrl}&embedded=true`;
  };

  const openPreview = (doc: LearningDoc) => {
    setSelectedDoc(doc);
    setCurrentPreviewUrl(getFileUrl(doc));
    setShowModal(true);
  };

  const getFileExtension = (fileName: string) => {
    return fileName.split('.').pop()?.toUpperCase() || '';
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

  useEffect(() => {
    // Refresh page data after successful upload
    if (!processing && selectedFile === null) {
      // The page will automatically refresh via Inertia
    }
  }, [processing]);

  return (
    <AppLayout>
      <Head title="Learning Materials - Upload" />

      <div className="py-12">
        <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Learning Materials Management</h1>
                <p className="text-gray-600 mt-2">Upload and manage learning materials for students</p>
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

              {/* Public View Section */}
              <div className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Learning Materials Library</CardTitle>
                    <CardDescription>Browse and view all uploaded learning materials</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Search Bar */}
                    <div className="mb-6 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        type="text"
                        placeholder="Search by title, filename, subject, grade level, or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-10"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>

                    {/* Results Count */}
                    {searchQuery && (
                      <div className="mb-4 text-sm text-gray-600">
                        Found {filteredDocs.length} {filteredDocs.length === 1 ? 'result' : 'results'} for "{searchQuery}"
                      </div>
                    )}

                    {/* Documents Grid */}
                    {filteredDocs.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredDocs.map((doc) => (
                          <div
                            key={doc.id}
                            className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow duration-200 hover:border-blue-400 dark:hover:border-blue-500"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <FileText className="h-8 w-8 text-blue-600" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                                    {getFileExtension(doc.file_name)}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(doc.file_size)}</span>
                                </div>
                              </div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                              {doc.title || doc.file_name}
                            </h3>
                            {doc.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">{doc.description}</p>
                            )}
                            {(doc.subject || doc.grade_level) && (
                              <div className="mb-3 space-y-1">
                                {doc.subject && (
                                  <p className="text-xs text-gray-600 dark:text-gray-400">
                                    <span className="font-semibold">Subject:</span> {doc.subject}
                                  </p>
                                )}
                                {doc.grade_level && (
                                  <p className="text-xs text-gray-600 dark:text-gray-400">
                                    <span className="font-semibold">Level:</span> {doc.grade_level}
                                  </p>
                                )}
                              </div>
                            )}
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                              Uploaded: {new Date(doc.created_at).toLocaleDateString()}
                            </p>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => openPreview(doc)}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm"
                              >
                                View
                              </Button>
                              <a
                                href={`/storage/${doc.file_path}`}
                                download={doc.file_name}
                                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded text-sm font-semibold transition-colors"
                              >
                                Download
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                        <p className="text-lg text-gray-500 dark:text-gray-400 mb-2">
                          {searchQuery ? 'No materials found matching your search' : 'No learning materials uploaded yet'}
                        </p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                          {searchQuery ? 'Try adjusting your search terms' : 'Upload your first learning material above'}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
        {showModal && selectedDoc && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 flex-1">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedDoc.title || selectedDoc.file_name}</h2>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <span>{getFileExtension(selectedDoc.file_name)} • {formatFileSize(selectedDoc.file_size)}</span>
                      {selectedDoc.subject && <span>Subject: {selectedDoc.subject}</span>}
                      {selectedDoc.grade_level && <span>Level: {selectedDoc.grade_level}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`/storage/${selectedDoc.file_path}`}
                    download={selectedDoc.file_name}
                    className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    title="Download file"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </a>
                  <button
                    onClick={() => window.open(`/storage/${selectedDoc.file_path}`, '_blank')}
                    className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                    title="Open in new tab"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setSelectedDoc(null);
                    }}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              <div className="flex-1 p-6">
                <iframe
                  src={currentPreviewUrl}
                  className="w-full h-full border-0 rounded-lg"
                  title={selectedDoc.file_name}
                />
              </div>
            </div>
          </div>
        )}
      </AppLayout>
    );
  }


