import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function AccomplishIndex() {
  return (
    <AppLayout>
      <Head title="Accomplish" />
      
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Accomplish</h1>
        <p>Track your completed tasks here.</p>
      </div>
    </AppLayout>
  );
}