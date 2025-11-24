import { Head, usePage, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import KioskKeyboard from '@/components/kiosk-keyboard';

type DocItem = {
  id: number;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  subject?: string;
  grade_level?: string;
  title?: string;
  description?: string;
  created_at: string;
};

export default function SchoolLearning() {
  const { props } = usePage<{ docs: DocItem[] }>();
  // Show all learning materials (PDF, DOC, DOCX)
  const allDocs = (props.docs || []).filter((d) =>
    d.file_type === 'application/pdf' ||
    d.file_type === 'application/msword' ||
    d.file_type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    d.file_name.toLowerCase().endsWith('.pdf') ||
    d.file_name.toLowerCase().endsWith('.doc') ||
    d.file_name.toLowerCase().endsWith('.docx')
  );

  const [search, setSearch] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [selectedFile, setSelectedFile] = useState<DocItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPreviewUrl, setCurrentPreviewUrl] = useState<string>('');
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

  const filtered = allDocs.filter((d) => {
    const q = search.toLowerCase();
    return (
      d.file_name.toLowerCase().includes(q) ||
      (d.title && d.title.toLowerCase().includes(q)) ||
      (d.description && d.description.toLowerCase().includes(q)) ||
      (d.subject && d.subject.toLowerCase().includes(q)) ||
      (d.grade_level && d.grade_level.toLowerCase().includes(q))
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const startIndex = (page - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(startIndex, startIndex + PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleSearchFocus = () => setShowKeyboard(true);
  const handleKeyboardInput = (value: string) => setSearch(value);
  const handleKeyboardClose = () => setShowKeyboard(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileExtension = (fileName: string) => fileName.split('.').pop()?.toUpperCase() || '';

  const getFileUrl = (doc: DocItem) => {
    // For PDF files, use direct URL
    if (doc.file_type === 'application/pdf' || doc.file_name.toLowerCase().endsWith('.pdf')) {
      return `/storage/${doc.file_path}`;
    }
    // For DOC/DOCX files, use Google Docs viewer
    const fileUrl = encodeURIComponent(`${window.location.origin}/storage/${doc.file_path}`);
    return `https://docs.google.com/gview?url=${fileUrl}&embedded=true`;
  };

  const openPreview = (doc: DocItem) => {
    setSelectedFile(doc);
    setIsLoading(true);
    setCurrentPreviewUrl(getFileUrl(doc));
    setShowModal(true);
  };

  return (
    <>
      <Head title="Learning Materials" />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Welcome
            </Link>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">📝 Learning Materials</h1>
            <div className="w-32" />
          </div>

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
              <KioskKeyboard value={search} onChange={handleKeyboardInput} onClose={handleKeyboardClose} />
            )}
          </div>

          {pageItems.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pageItems.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200 hover:border-blue-400 dark:hover:border-blue-500"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">📝</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                            {getFileExtension(doc.file_name)}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">{formatFileSize(doc.file_size)}</span>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{doc.title || doc.file_name}</h3>
                    {doc.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">{doc.description}</p>
                    )}
                    {(doc.subject || doc.grade_level) && (
                      <div className="mb-4 space-y-1">
                        {doc.subject && (
                          <p className="text-sm text-gray-600 dark:text-gray-400"><span className="font-semibold">Subject:</span> {doc.subject}</p>
                        )}
                        {doc.grade_level && (
                          <p className="text-sm text-gray-600 dark:text-gray-400"><span className="font-semibold">Level:</span> {doc.grade_level}</p>
                        )}
                      </div>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Uploaded: {formatDate(doc.created_at)}</p>
                    <button
                      onClick={() => openPreview(doc)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Document
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-center gap-6">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-8 py-4 text-2xl font-bold rounded-2xl border-2 bg-white dark:bg-gray-800 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  ◀ Prev
                </button>
                <div className="text-xl font-semibold text-gray-700 dark:text-gray-300">Page {page} / {totalPages}</div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-8 py-4 text-2xl font-bold rounded-2xl border-2 bg-white dark:bg-gray-800 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Next ▶
                </button>
              </div>

              <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
                Showing {startIndex + 1}-{Math.min(startIndex + PAGE_SIZE, filtered.length)} of {filtered.length} items
                {search && ` matching "${search}"`}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-2xl text-gray-500 dark:text-gray-400 mb-2">No learning materials found</p>
              <p className="text-lg text-gray-400 dark:text-gray-500">Try adjusting your search terms or check back later</p>
            </div>
          )}
        </div>

        {showModal && selectedFile && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-2xl">📝</span>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedFile.title || selectedFile.file_name}</h2>
                    {selectedFile.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{selectedFile.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>{getFileExtension(selectedFile.file_name)} • {formatFileSize(selectedFile.file_size)}</span>
                      {selectedFile.subject && (<span>Subject: {selectedFile.subject}</span>)}
                      {selectedFile.grade_level && (<span>Level: {selectedFile.grade_level}</span>)}
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
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </a>
                  <button
                    onClick={() => window.open(`/storage/${selectedFile.file_path}`, '_blank')}
                    className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                    title="Open in new tab"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
              <div className="flex-1 p-6 bg-gray-100 dark:bg-gray-900">
                {selectedFile.file_type === 'application/pdf' || selectedFile.file_name.toLowerCase().endsWith('.pdf') ? (
                  <div className="w-full h-full">
                    <iframe
                      src={`${currentPreviewUrl}#toolbar=0`}
                      className="w-full h-full border-0 rounded-lg bg-white"
                      title={selectedFile.file_name}
                      style={{ minHeight: '600px' }}
                      onLoad={() => setIsLoading(false)}
                    />
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      If the PDF doesn't display,{' '}
                      <a
                        href={currentPreviewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        click here to open in a new tab
                      </a>
                    </p>
                  </div>
                ) : (
                  <iframe
                    src={currentPreviewUrl}
                    className="w-full h-full border-0 rounded-lg"
                    title={selectedFile.file_name}
                    onLoad={() => setIsLoading(false)}
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


