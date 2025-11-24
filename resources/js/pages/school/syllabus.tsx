import { Head, usePage, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import KioskKeyboard from '@/components/kiosk-keyboard';

type Syllabus = {
  id: number;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  subject?: string;
  grade_level?: string;
  created_at: string;
};

export default function SchoolSyllabus() {
  const { props } = usePage<{ syllabi: Syllabus[] }>();
  const allSyllabi = props.syllabi || [];

  const [search, setSearch] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [selectedFile, setSelectedFile] = useState<Syllabus | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const [currentPreviewUrl, setCurrentPreviewUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const PAGE_SIZE = 9;
  const [page, setPage] = useState(1);

  // Safe date parsing function
  const safeParseDate = (dateString: string | null | undefined): Date | null => {
    if (!dateString || typeof dateString !== 'string') return null;
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) return null;
    return date;
  };

  const formatDate = (dateString: string | null | undefined): string => {
    const date = safeParseDate(dateString);
    if (!date) return 'N/A';
    return date.toLocaleDateString();
  };

  // Filter syllabi by file name and only show DOC/PDF files
  const filtered = allSyllabi.filter((s) => {
    const isDocOrPdf = s.file_type === 'application/pdf' || 
                      s.file_type === 'application/msword' || 
                      s.file_type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    
    const matchesSearch = s.file_name.toLowerCase().includes(search.toLowerCase()) ||
                         (s.subject && s.subject.toLowerCase().includes(search.toLowerCase())) ||
                         (s.grade_level && s.grade_level.toLowerCase().includes(search.toLowerCase()));
    
    return isDocOrPdf && matchesSearch;
  });

  // Pagination helpers
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const startIndex = (page - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(startIndex, startIndex + PAGE_SIZE);

  // Keep page in range and reset on search/filter changes
  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [totalPages]);
  
  useEffect(() => {
    setPage(1);
  }, [search]);

  // Auto-open first available document (prefer PDF) on load
  // Do not auto-open previews; user will pick a file to view from the grid

  const handleSearchFocus = () => {
    setShowKeyboard(true);
  };

  const handleKeyboardInput = (value: string) => {
    setSearch(value);
  };

  

  const handleKeyboardClose = () => {
    setShowKeyboard(false);
  };

  const handleViewFile = (syllabus: Syllabus) => {
    debugFileUrl(syllabus);
    setSelectedFile(syllabus);
    setPreviewError(false);
    setIsLoading(true);
    setCurrentPreviewUrl(getFileUrl(syllabus));
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFile(null);
    setPreviewError(false);
    setIsLoading(false);
    setCurrentPreviewUrl('');
  };

  const handlePreviewError = () => {
    if (selectedFile && !previewError) {
      setPreviewError(true);
      setIsLoading(false);
      // Try alternative preview method
      if (selectedFile.file_type === 'application/msword' || selectedFile.file_type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setCurrentPreviewUrl(getAlternativePreviewUrl(selectedFile));
      }
    }
  };

  const handlePreviewLoad = () => {
    setIsLoading(false);
    setPreviewError(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType === 'application/pdf') {
      return '📄'; // PDF icon
    } else if (fileType === 'application/msword' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return '📝'; // DOC icon
    }
    return '📁'; // Default file icon
  };

  const getFileExtension = (fileName: string) => {
    return fileName.split('.').pop()?.toUpperCase() || '';
  };

  const getFileUrl = (syllabus: Syllabus) => {
    if (syllabus.file_type === 'application/msword' || syllabus.file_type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // Use Google Docs Viewer for Word documents
      const fileUrl = encodeURIComponent(`${window.location.origin}/storage/${syllabus.file_path}`);
      return `https://docs.google.com/gview?url=${fileUrl}&embedded=true`;
    }
    return `/storage/${syllabus.file_path}`;
  };

  // Alternative preview methods for DOCX files
  const getAlternativePreviewUrl = (syllabus: Syllabus) => {
    const fileUrl = encodeURIComponent(`${window.location.origin}/storage/${syllabus.file_path}`);
    return `https://view.officeapps.live.com/op/embed.aspx?src=${fileUrl}`;
  };

  // Debug function to check file URLs
  const debugFileUrl = (syllabus: Syllabus) => {
    console.log('File path:', syllabus.file_path);
    console.log('File type:', syllabus.file_type);
    console.log('Full URL:', getFileUrl(syllabus));
  };

  return (
    <>
      <Head title="Syllabus Documents" />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8">
          {/* Header with Back Button */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg transition-colors duration-200"
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
              Back to Welcome
            </Link>
            
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
              📚 Syllabus Documents
            </h1>
            
            {/* Empty div for centering the title */}
            <div className="w-32"></div>
          </div>

          {/* Search Input with Kiosk Keyboard */}
          <div className="mb-6 flex justify-center relative">
            <input
              type="text"
              placeholder="🔍 Search by filename, subject, or grade level..."
              value={search}
              onFocus={handleSearchFocus}
              readOnly
              className="w-full max-w-md px-6 py-4 text-xl border rounded-xl shadow-md focus:outline-none focus:ring-4 focus:ring-blue-400 dark:bg-gray-700 dark:text-white cursor-pointer"
            />
            
            {showKeyboard && (
              <KioskKeyboard
                value={search}
                onChange={handleKeyboardInput}
                onClose={handleKeyboardClose}
              />
            )}
          </div>

          {/* File Type Filter Info */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-4 px-6 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <span className="text-blue-600 dark:text-blue-300 font-semibold">📄 PDF</span>
              <span className="text-blue-600 dark:text-blue-300 font-semibold">📝 DOC/DOCX</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">Showing only document files</span>
            </div>
          </div>

          {/* Grid - Paginated (thumbnails/cards) */}
          {pageItems.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pageItems.map((syllabus) => (
                  <div
                    key={syllabus.id}
                    className="bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200 hover:border-blue-400 dark:hover:border-blue-500"
                  >
                      {/* File Icon and Type */}
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl">{getFileIcon(syllabus.file_type)}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                              {getFileExtension(syllabus.file_name)}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {formatFileSize(syllabus.file_size)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* File Name */}
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {syllabus.file_name}
                      </h3>

                      {/* Subject and Grade Level */}
                      {(syllabus.subject || syllabus.grade_level) && (
                        <div className="mb-4 space-y-1">
                          {syllabus.subject && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-semibold">Subject:</span> {syllabus.subject}
                            </p>
                          )}
                          {syllabus.grade_level && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-semibold">Level:</span> {syllabus.grade_level}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Upload Date */}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                        Uploaded: {formatDate(syllabus.created_at)}
                      </p>

                      {/* View Button */}
                      <button
                        onClick={() => handleViewFile(syllabus)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        View Document
                      </button>
                    </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-4">
                  <button
                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                    disabled={page === 1}
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2 ${
                      page === 1
                        ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
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
                    Previous
                  </button>
                  
                  <span className="px-4 py-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Page {page} of {totalPages}
                  </span>
                  
                  <button
                    onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={page === totalPages}
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2 ${
                      page === totalPages
                        ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    Next
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              )}

              {/* Hint: tap a card to preview the file */}
              <div className="mt-6 text-center text-gray-500 dark:text-gray-400">Tap a document card above to preview</div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-2xl text-gray-500 dark:text-gray-400 mb-2">
                No syllabus documents found
              </p>
              <p className="text-lg text-gray-400 dark:text-gray-500">
                Try adjusting your search terms or check back later
              </p>
            </div>
          )}

          {/* Total Count */}
          {filtered.length > 0 && (
            <div className="mt-8 text-center">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Showing {startIndex + 1}-{Math.min(startIndex + PAGE_SIZE, filtered.length)} of {filtered.length} document{filtered.length !== 1 ? 's' : ''}
                {search && ` matching "${search}"`}
              </p>
            </div>
          )}
        </div>

        {/* File Viewer Modal */}
        {showModal && selectedFile && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-2xl">{getFileIcon(selectedFile.file_type)}</span>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedFile.file_name}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>{getFileExtension(selectedFile.file_name)} • {formatFileSize(selectedFile.file_size)}</span>
                      {selectedFile.subject && (
                        <span>Subject: {selectedFile.subject}</span>
                      )}
                      {selectedFile.grade_level && (
                        <span>Level: {selectedFile.grade_level}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`/storage/${selectedFile.file_path}`}
                    download={selectedFile.file_name}
                    className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    title="Download file"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </a>
                  <button
                    onClick={() => window.open(`/storage/${selectedFile.file_path}`, '_blank')}
                    className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                    title="Open in new tab"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* File Content */}
              <div className="flex-1 p-6 relative">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg z-10">
                    <div className="flex flex-col items-center gap-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                      <p className="text-gray-600 dark:text-gray-400">Loading preview...</p>
                    </div>
                  </div>
                )}
                
                {previewError && selectedFile?.file_type !== 'application/pdf' ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <div className="text-6xl mb-4">📄</div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Preview Not Available
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-center max-w-md">
                      The document preview is not available. You can download the file to view it.
                    </p>
                    <div className="flex gap-3">
                      <a
                        href={`/storage/${selectedFile.file_path}`}
                        download={selectedFile.file_name}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download File
                      </a>
                      <button
                        onClick={() => window.open(`/storage/${selectedFile.file_path}`, '_blank')}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Open in New Tab
                      </button>
                    </div>
                  </div>
                ) : (
                  <iframe
                    src={currentPreviewUrl || getFileUrl(selectedFile)}
                    className="w-full h-full border-0 rounded-lg"
                    title={selectedFile.file_name}
                    onError={handlePreviewError}
                    onLoad={handlePreviewLoad}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
