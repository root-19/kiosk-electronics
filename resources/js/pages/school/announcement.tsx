import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

type Announcement = {
  id: number;
  title: string;
  content: string;
  published_at: string | null;
  image_path?: string | null;
};

type Props = {
  announcement?: Announcement[];
};

export default function SchoolAnnouncement({ announcement = [] }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const formatTime = (dateString: string | null | undefined): string => {
    const date = safeParseDate(dateString);
    if (!date) return '';
    return date.toLocaleTimeString();
  };

  const prev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? announcement.length - 1 : prevIndex - 1
    );
  };

  const next = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === announcement.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Swipe support
  let touchStartX = 0;
  let touchEndX = 0;
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.changedTouches[0].screenX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) next();
    if (touchEndX - touchStartX > 50) prev();
  };

  if (announcement.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
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
        <div className="bg-white dark:bg-gray-800 p-12 rounded-2xl shadow-xl max-w-2xl text-center">
          <h2 className="text-5xl font-bold text-gray-700 dark:text-gray-300 mb-6">
            No Announcements
          </h2>
          <p className="text-2xl text-gray-500 dark:text-gray-400">
            There are no announcements available at this time.
          </p>
        </div>
      </div>
    );
  }

  const current = announcement[currentIndex];

  return (
    <>
      <Head title="School Announcements" />
      <div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
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

        {/* Left Arrow */}
        <button
          onClick={prev}
          className="absolute left-6 top-1/2 -translate-y-1/2 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 p-8 rounded-full hover:scale-110 active:scale-95 text-5xl text-white shadow-2xl transition-all duration-200 z-10 min-w-[80px] min-h-[80px] flex items-center justify-center"
        >
          &#8592;
        </button>

        {/* Announcement Card */}
       <div className="relative bg-white dark:bg-gray-800 p-12 rounded-2xl shadow-2xl border-4 border-gray-200 dark:border-gray-700 max-w-5xl w-full">
  {/* Image */}
  {current.image_path && (
    <div className="mb-8 rounded-xl overflow-hidden">
      <img 
        src={`/storage/${current.image_path}`} 
        alt={current.title}
        className="w-full h-[400px] object-cover"
      />
    </div>
  )}

  {/* Title and Content */}
  <h1 className="text-6xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">
    {current.title}
  </h1>
  <p className="text-3xl text-gray-700 dark:text-gray-300 mb-8 whitespace-pre-wrap text-center leading-relaxed">
    {current.content}
  </p>

  {/* Published Date - bottom-left */}
  {current.published_at && (
    <div className="absolute bottom-6 left-6 text-xl text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg">
      📅 Published: {formatDate(current.published_at)}{' '}
      {formatTime(current.published_at)}
    </div>
  )}
</div>


        {/* Right Arrow */}
        <button
          onClick={next}
          className="absolute right-6 top-1/2 -translate-y-1/2 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 p-8 rounded-full hover:scale-110 active:scale-95 text-5xl text-white shadow-2xl transition-all duration-200 z-10 min-w-[80px] min-h-[80px] flex items-center justify-center"
        >
          &#8594;
        </button>

        {/* Pagination Dots */}
        <div className="absolute bottom-8 flex justify-center w-full space-x-4">
          {announcement.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`min-w-[16px] min-h-[16px] w-4 h-4 rounded-full transition-all duration-200 hover:scale-125 ${
                idx === currentIndex
                  ? 'bg-blue-600 dark:bg-blue-400 scale-125 shadow-lg'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
