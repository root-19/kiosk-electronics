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
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid,
     ClipboardCheck, Megaphone, Calendar,
      GraduationCap, Compass, Clock, FileText, 
      Users, UserCheck, BookMarked, CalendarDays, Trophy
    } from 'lucide-react';
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
    { title: 'Delegates', href: '/delegates', icon: Trophy },

];

const scheduleNavItems: NavItem[] = [
    { title: 'Sections', href: '/sections', icon: Users },
    { title: 'Professors', href: '/professors', icon: UserCheck },
    { title: 'Subjects', href: '/subjects', icon: BookMarked },
    { title: 'Schedules', href: '/schedules', icon: CalendarDays },
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
                <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel>Schedule Management</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {scheduleNavItems.map((item) => {
                                const href = typeof item.href === "string" ? item.href : item.href.url;
                                
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            tooltip={{ children: item.title }}
                                        >
                                            <Link href={href} prefetch>
                                                {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
