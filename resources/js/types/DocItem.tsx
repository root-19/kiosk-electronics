import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';


export interface DocItem {

      id: number;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  subject?: string;
  grade_level?: string;
  created_at: string;
  updated_at: string;

}