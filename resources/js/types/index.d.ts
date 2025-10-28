import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Section {
    id: number;
    name: string;
    code: string;
    description?: string;
    capacity: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    full_name?: string;
    schedules?: Schedule[];
}

export interface Professor {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    employee_id: string;
    department?: string;
    phone?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    full_name?: string;
    schedules?: Schedule[];
}

export interface Subject {
    id: number;
    code: string;
    name: string;
    description?: string;
    units: number;
    department?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    full_name?: string;
    schedules?: Schedule[];
}

export interface Schedule {
    id: number;
    section_id: number;
    professor_id: number;
    subject_id: number;
    day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    time_slot: string;
    room?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    section?: Section;
    professor?: Professor;
    subject?: Subject;
}

export interface ScheduleGrid {
    [day: string]: {
        [timeSlot: string]: Schedule | null;
    };
}

export interface CalendarEvent {
    id: number;
    title: string;
    description?: string;
    event_date: string;
    event_type: 'holiday' | 'academic' | 'sports' | 'general';
    created_at?: string;
    updated_at?: string;
}

export interface Accomplishment {
    id: number;
    title: string;
    description: string;
    type: string;
    photos: string[];
    created_at: string;
}

export interface PaginationData<T> {
    data: T[];
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        per_page: number;
        to: number;
        total: number;
    };
}
