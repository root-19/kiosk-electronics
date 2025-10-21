import { Head, usePage, Link } from '@inertiajs/react';
import { useState } from 'react';
import KioskKeyboard from '@/Components/kiosk-keyboard'; 

type GradeViewer = {
  id: number;
  id_number: string;
  last_name: string;
  first_name: string;
  middle_name?: string;
  extra_name?: string;
  program: string;
  level: string;
  grade?: string;
  date_validated?: string;
};

export default function Grade() {
  const { props } = usePage<{ grades: GradeViewer[] }>();
  const allGrades = props.grades || [];

  const [search, setSearch] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(false);

  // filter by last name
  const filtered = allGrades.filter((g) =>
    g.last_name.toLowerCase().includes(search.toLowerCase())
  );

  // group by level
  const grouped = filtered.reduce((acc: Record<string, GradeViewer[]>, g) => {
    if (!acc[g.level]) acc[g.level] = [];
    acc[g.level].push(g);
    return acc;
  }, {});

  const handleSearchFocus = () => {
    setShowKeyboard(true);
  };

  const handleKeyboardInput = (value: string) => {
    setSearch(value);
  };

  const handleKeyboardClose = () => {
    setShowKeyboard(false);
  };

  return (
    <>
      <Head title="Grade Records" />
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
              🎓 Grade Records
            </h1>
            
            {/* Empty div for centering the title */}
            <div className="w-32"></div>
          </div>

          {/* Search Input with Kiosk Keyboard */}
          <div className="mb-6 flex justify-center relative">
            <input
              type="text"
              placeholder="🔍 Search by Last Name..."
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
                placeholder="Search by Last Name..."
              />
            )}
          </div>

          {/* Render per Level */}
          {Object.keys(grouped).length > 0 ? (
            Object.keys(grouped).map((level) => (
              <div key={level} className="mb-10">
                <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-300 mb-4">
                  Level {level}
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-2 border-gray-400 dark:border-gray-600 rounded-xl overflow-hidden text-2xl">
                    <thead className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white text-xl">
                      <tr>
                        <th className="py-4 px-6 text-left">ID #</th>
                        <th className="py-4 px-6 text-left">Last Name</th>
                        <th className="py-4 px-6 text-left">First Name</th>
                        <th className="py-4 px-6 text-left">Middle</th>
                        <th className="py-4 px-6 text-left">Extra</th>
                        <th className="py-4 px-6 text-left">Program</th>
                        <th className="py-4 px-6 text-left">Level</th>
                        <th className="py-4 px-6 text-center">Grade</th>
                        <th className="py-4 px-6 text-center">Date Validated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grouped[level].map((g) => (
                        <tr
                          key={g.id}
                          className="border-b border-gray-300 dark:border-gray-600 hover:bg-blue-100 dark:hover:bg-gray-700 transition"
                        >
                          <td className="py-3 px-6">{g.id_number}</td>
                          <td className="py-3 px-6 font-bold">{g.last_name}</td>
                          <td className="py-3 px-6">{g.first_name}</td>
                          <td className="py-3 px-6">{g.middle_name || '-'}</td>
                          <td className="py-3 px-6">{g.extra_name || '-'}</td>
                          <td className="py-3 px-6">{g.program}</td>
                          <td className="py-3 px-6">{g.level}</td>
                          <td className="py-3 px-6 text-center font-semibold text-green-600">
                            {g.grade || '-'}
                          </td>
                          <td className="py-3 px-6 text-center">
                            {g.date_validated
                              ? new Date(g.date_validated).toLocaleDateString()
                              : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-2xl text-gray-500 dark:text-gray-400 mt-10">
              ❌ No records found.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
