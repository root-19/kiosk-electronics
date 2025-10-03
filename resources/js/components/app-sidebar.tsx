import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, ClipboardCheck, Megaphone, Calendar, GraduationCap, Compass, Clock, FileText } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
    { title: 'Accomplish', href: '/accomplish', icon: ClipboardCheck },
    { title: 'Announcement', href: '/announcements', icon: Megaphone },
    { title: 'Calendar', href: '/calendar', icon: Calendar },
    { title: 'Grade', href: '/grades', icon: GraduationCap },
    { title: 'Orientation', href: '/orientation', icon: Compass },
    { title: 'Learning', href: '/learning', icon: BookOpen },
    { title: 'Schedule', href: '/schedule', icon: Clock },
    { title: 'Syllabus', href: '/syllabus', icon: FileText },
];


export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
