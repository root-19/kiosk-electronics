import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import syllabus from '@/routes/syllabus';
import delegates from '@/routes/delegates';

import learning from '@/routes/learning';

import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
  ClipboardCheck,
  Megaphone,
  Calendar,
  GraduationCap,
  Compass,
  BookOpen,
  Clock,
  Trophy,
  FileText,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: dashboard().url,
  },
];

const sections = [
  { title: 'Program Accomplishment', description: 'Track completed tasks.', icon: ClipboardCheck, href: '/accomplish' },
  { title: 'Announcement', description: 'Stay updated with news.', icon: Megaphone, href: '/announcements' },
  { title: 'Calendar', description: 'View events & schedules.', icon: Calendar, href: '/calendar'},
  { title: 'GradeViewer', description: 'Check your grades.', icon: GraduationCap, href: '/gradeviewer' },
  { title: 'Orientation', description: 'Start with resources.', icon: Compass, href: '/orientation' },
  { title: 'Learning', description: 'Access learning modules.', icon: BookOpen, href: learning.index().url },
  { title: 'Schedule', description: 'See your class timetable.', icon: Clock, href: '/schedule' },
  { title: 'Delegates', description: 'See the ICCAAC Delegates.', icon: Trophy, href: delegates.index().url },
  { title: 'Syllabus', description: 'Review course outlines.', icon: FileText, href: syllabus.index().url },


  // { title: 'Syllabus', description: 'Review course outlines.', icon: FileText, href: syllabus.index().url },
];

export default function Dashboard() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />

      <div className="flex h-full flex-1 flex-col gap-8 p-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sections.map((section) => (
            <Link
              key={section.title}
              href={section.href}
              className="flex flex-col items-center justify-center gap-3 rounded-2xl border bg-white p-8 text-center shadow-md transition hover:scale-105 hover:shadow-lg active:scale-95 dark:bg-gray-900 dark:border-gray-700"
            >
              <section.icon className="h-12 w-12 text-blue-600 dark:text-blue-400" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {section.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {section.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

