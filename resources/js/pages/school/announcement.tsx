import { Head } from '@inertiajs/react';
import { useState } from 'react';

type Announcement = {
  id: number;
  title: string;
  content: string;
  published_at: string | null;
};

type Props = {
  announcement?: Announcement[];
};

export default function SchoolAnnouncement({ announcement = [] }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
        <div className="bg-white dark:bg-gray-800 p-12 rounded-xl shadow-lg max-w-2xl text-center">
          <h2 className="text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            No Announcements
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
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
        className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6 relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Left Arrow */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-200 dark:bg-gray-700 p-6 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 text-4xl shadow-lg z-10"
        >
          &#8592;
        </button>

        {/* Announcement Card */}
       <div className="relative bg-white dark:bg-gray-800 p-12 rounded-2xl shadow-xl border max-w-3xl w-full">
  {/* Title and Content */}
  <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-6 text-center">
    {current.title}
  </h1>
  <p className="text-2xl text-gray-700 dark:text-gray-300 mb-6 whitespace-pre-wrap text-center">
    {current.content}
  </p>

  {/* Published Date - bottom-left */}
  {current.published_at && (
    <div className="absolute bottom-6 left-6 text-lg text-gray-500 dark:text-gray-400">
      Published: {new Date(current.published_at).toLocaleDateString()}{' '}
      {new Date(current.published_at).toLocaleTimeString()}
    </div>
  )}
</div>


        {/* Right Arrow */}
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-200 dark:bg-gray-700 p-6 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 text-4xl shadow-lg z-10"
        >
          &#8594;
        </button>

        {/* Pagination Dots */}
        <div className="absolute bottom-8 flex justify-center w-full space-x-3">
          {announcement.map((_, idx) => (
            <span
              key={idx}
              className={`w-4 h-4 rounded-full ${
                idx === currentIndex
                  ? 'bg-blue-600 dark:bg-blue-400'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
