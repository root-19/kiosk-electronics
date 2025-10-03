import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import KioskKeyboard from '@/components/kiosk-keyboard';

type Announcement = {
  id: number;
  title: string;
  content: string;
  published_at: string | null;
};

export default function Announcements({ announcements = [] }: { announcements: Announcement[] }) {
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [activeField, setActiveField] = useState<'title' | 'content' | null>(null);
  const [showForm, setShowForm] = useState(false);

  const form = useForm({
    title: '',
    content: '',
    published_at: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.post('/announcements', {
      onSuccess: () => {
        form.reset();
        setShowForm(false);
        setShowKeyboard(false);
        setActiveField(null);
      },
    });
  };

  const handleFieldFocus = (field: 'title' | 'content') => {
    setActiveField(field);
    setShowKeyboard(true);
  };

  const handleKeyboardInput = (value: string) => {
    if (activeField) form.setData(activeField, value);
  };

  const handleKeyboardClose = () => {
    setShowKeyboard(false);
    setActiveField(null);
  };

  return (
    <AppLayout>
      <Head title="Announcements" />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📢 Announcements</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
          >
            {showForm ? 'Cancel' : 'Add Announcement'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-md max-w-2xl mx-auto mb-6 space-y-4"
          >
            <div>
              <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Title
              </label>
              <input
                type="text"
                placeholder="Enter announcement title"
                value={form.data.title}
                onClick={() => handleFieldFocus('title')}
                onFocus={() => handleFieldFocus('title')}
                readOnly
                className="w-full p-3 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Content
              </label>
              <textarea
                placeholder="Enter announcement content"
                value={form.data.content}
                onClick={() => handleFieldFocus('content')}
                onFocus={() => handleFieldFocus('content')}
                readOnly
                rows={5}
                className="w-full p-3 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer resize-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Publish Date (Optional)
              </label>
              <input
                type="datetime-local"
                value={form.data.published_at}
                onChange={e => form.setData('published_at', e.target.value)}
                className="w-full p-3 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={form.processing}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md"
            >
              {form.processing ? 'Publishing...' : 'Publish Announcement'}
            </button>
          </form>
        )}

        {/* Announcements Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-md shadow-md">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-left">
                <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-200">Title</th>
                <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-200">Content</th>
                <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-200">Publish Date</th>
              </tr>
            </thead>
            <tbody>
              {announcements.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-gray-500 dark:text-gray-400">
                    No announcements yet.
                  </td>
                </tr>
              ) : (
                announcements.map(item => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-4 py-2">{item.title}</td>
                    <td className="px-4 py-2">{item.content}</td>
                    <td className="px-4 py-2">
                      {item.published_at ? new Date(item.published_at).toLocaleString() : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Kiosk Keyboard */}
        {showKeyboard && (
          <div className="fixed inset-0 bg-black/50 z-[9999] flex items-end">
            <div className="w-full bg-white dark:bg-gray-800 rounded-t-lg overflow-hidden">
              <div className="p-3 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {activeField === 'title' ? 'Title' : 'Content'} Input
                </span>
                <button 
                  onClick={handleKeyboardClose} 
                  className="w-10 h-10 flex items-center justify-center text-2xl font-bold text-gray-600 dark:text-gray-300 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                  type="button"
                >
                  ✕
                </button>
              </div>
              <KioskKeyboard
                value={activeField ? form.data[activeField] : ''}
                onChange={handleKeyboardInput}
                onClose={handleKeyboardClose}
              />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
