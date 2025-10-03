import { Head, router, usePage } from '@inertiajs/react';
import { useState, FormEvent } from 'react';
import AppLayout from '@/layouts/app-layout';
import Swal from 'sweetalert2';

type GradeEntry = {
  id: number;
  id_number: string;
  last_name: string;
  first_name: string;
  middle_name?: string;
  extra_name?: string;
  program?: string;
  level?: string;
  grade?: string;
  date_validated?: string;
};

type PageProps = {
  grades: GradeEntry[];
};

export default function GradeViewer() {
  const { props } = usePage<PageProps>();
  const grades = props.grades || [];

  const [formData, setFormData] = useState({
    id_number: '',
    last_name: '',
    first_name: '',
    middle_name: '',
    extra_name: '',
    program: '',
    level: '',
    date_validated: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingGrades, setEditingGrades] = useState<{[key: number]: string}>({});

  // Function to get grade color based on grade value
  const getGradeColor = (grade: string | undefined): string => {
    if (!grade) return 'text-gray-400';
    
    const gradeNum = parseInt(grade);
    
    if (gradeNum >= 75) {
      return 'text-green-400 font-semibold';
    } else {
      return 'text-red-400 font-semibold';
    }
  };

  // Function to get level color based on level value
  const getLevelColor = (level: string | undefined): string => {
    if (!level) return 'text-gray-400';
    
    const levelNum = parseInt(level);
    
    if (levelNum >= 1 && levelNum <= 3) {
      return 'text-green-400 font-semibold';
    } else if (levelNum >= 4 && levelNum <= 5) {
      return 'text-red-400 font-semibold';
    } else {
      return 'text-gray-400';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Only allow numbers for level
    if (name === 'level') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    router.post('/grade-viewer', formData, {
      onSuccess: () => {
        setFormData({
          id_number: '',
          last_name: '',
          first_name: '',
          middle_name: '',
          extra_name: '',
          program: '',
          level: '',
          date_validated: '',
        });
        setIsLoading(false);
        setShowForm(false);
        
        // Show success alert
        Swal.fire({
          title: 'Success!',
          text: 'Student added successfully!',
          icon: 'success',
          confirmButtonText: 'Done',
          confirmButtonColor: '#10B981',
          background: '#1F2937',
          color: '#F9FAFB'
        });
      },
      onError: (errors) => {
        console.error('Form submission errors:', errors);
        setIsLoading(false);
        
        // Show error alert
        Swal.fire({
          title: 'Error!',
          text: 'Failed to add student. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#EF4444',
          background: '#1F2937',
          color: '#F9FAFB'
        });
      },
    });
  };

  // Handle grade input change in table
  const handleGradeInputChange = (id: number, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setEditingGrades(prev => ({
      ...prev,
      [id]: numericValue
    }));
  };

  // Handle update button click
  const handleUpdateGrade = (id: number) => {
    const gradeValue = editingGrades[id];
    if (gradeValue !== undefined) {
      router.post('/grade-viewer/update-grade', { 
        id, 
        grade: gradeValue 
      }, {
        onSuccess: () => {
          // Remove from editing state after successful update
          setEditingGrades(prev => {
            const newState = { ...prev };
            delete newState[id];
            return newState;
          });
          
          // Show success alert for grade update
          Swal.fire({
            title: 'Grade Updated!',
            text: 'Grade has been updated successfully!',
            icon: 'success',
            confirmButtonText: 'Done',
            confirmButtonColor: '#10B981',
            background: '#1F2937',
            color: '#F9FAFB'
          });
        },
        onError: (errors) => {
          console.error('Update error:', errors);
          
          // Show error alert for grade update
          Swal.fire({
            title: 'Update Failed!',
            text: 'Failed to update grade. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#EF4444',
            background: '#1F2937',
            color: '#F9FAFB'
          });
        }
      });
    }
  };

  // Group grades by level
  const groupedGrades = grades.reduce((acc, grade) => {
    const level = grade.level || 'No Level';
    if (!acc[level]) acc[level] = [];
    acc[level].push(grade);
    return acc;
  }, {} as Record<string, GradeEntry[]>);

  return (
    <AppLayout>
      <Head title="Grade Viewer" />
      <div className="min-h-screen bg-black text-white p-6 space-y-8">
        <h1 className="text-3xl font-bold mb-6 text-white">Grade Viewer</h1>

        {/* Toggle Button */}
        <div className="flex justify-start">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            {showForm ? 'Hide Form' : 'Add Student'}
          </button>
        </div>

        {/* Collapsible Form */}
        {showForm && (
          <div className="flex justify-center">
            <div className="bg-gray-800 p-10 rounded-xl shadow-lg max-w-2xl w-full">
              <h2 className="text-2xl font-bold mb-6 text-white text-center">
                Add Student
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    ID Number
                  </label>
                  <input
                    type="text"
                    name="id_number"
                    value={formData.id_number}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">
                      Middle Name
                    </label>
                    <input
                      type="text"
                      name="middle_name"
                      value={formData.middle_name}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">
                      Extra Name
                    </label>
                    <input
                      type="text"
                      name="extra_name"
                      value={formData.extra_name}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">
                      Program
                    </label>
                    <input
                      type="text"
                      name="program"
                      value={formData.program}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">
                      Level (Numbers only)
                    </label>
                    <input
                      type="text"
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      placeholder="e.g. 1, 2, 3"
                      className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    Date Validated
                  </label>
                  <input
                    type="date"
                    name="date_validated"
                    value={formData.date_validated}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    disabled={isLoading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition"
                >
                  {isLoading ? 'Submitting...' : 'Submit'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tables grouped by level */}
        <div className="space-y-8">
          {Object.keys(groupedGrades).length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-xl">No students found.</p>
            </div>
          ) : (
            Object.entries(groupedGrades).map(([level, levelGrades]) => (
              <div key={level} className="w-full">
                <h2 className={`text-2xl font-bold mb-4 ${getLevelColor(level)}`}>Level {level}</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-gray-800 rounded-xl shadow-md overflow-hidden">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="py-3 px-6 text-left text-white">ID</th>
                        <th className="py-3 px-6 text-left text-white">ID Number</th>
                        <th className="py-3 px-6 text-left text-white">Last Name</th>
                        <th className="py-3 px-6 text-left text-white">First Name</th>
                        <th className="py-3 px-6 text-left text-white">Middle Name</th>
                        <th className="py-3 px-6 text-left text-white">Extra Name</th>
                        <th className="py-3 px-6 text-left text-white">Program</th>
                        <th className="py-3 px-6 text-left text-white">Level</th>
                        <th className="py-3 px-6 text-left text-white">Grade</th>
                        <th className="py-3 px-6 text-left text-white">Date Validated</th>
                        <th className="py-3 px-6 text-left text-white">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {levelGrades.map((g) => (
                        <tr key={g.id} className="border-b border-gray-700">
                          <td className="py-2 px-4 text-white">{g.id}</td>
                          <td className="py-2 px-4 text-white">{g.id_number}</td>
                          <td className="py-2 px-4 text-white">{g.last_name}</td>
                          <td className="py-2 px-4 text-white">{g.first_name}</td>
                          <td className="py-2 px-4 text-white">{g.middle_name || '-'}</td>
                          <td className="py-2 px-4 text-white">{g.extra_name || '-'}</td>
                          <td className="py-2 px-4 text-white">{g.program || '-'}</td>
                          <td className={`py-2 px-4 ${getLevelColor(g.level)}`}>{g.level || '-'}</td>
                          <td className="py-2 px-4">
                            <input
                              type="text"
                              value={editingGrades[g.id] !== undefined ? editingGrades[g.id] : (g.grade || '')}
                              onChange={(e) => handleGradeInputChange(g.id, e.target.value)}
                              className={`w-20 p-1 rounded-md ${getGradeColor(editingGrades[g.id] !== undefined ? editingGrades[g.id] : g.grade)} bg-gray-700 border border-gray-600`}
                              placeholder="Grade"
                            />
                          </td>
                          <td className="py-2 px-4 text-white">{g.date_validated || '-'}</td>
                          <td className="py-2 px-4">
                            <button
                              onClick={() => handleUpdateGrade(g.id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm transition"
                            >
                              Update
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
