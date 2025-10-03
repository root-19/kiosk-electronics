import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, usePage } from "@inertiajs/react";

export type NavItem = {
  title: string;
  href: string | { url: string };
  icon?: React.ComponentType<any>;
};

export function NavMain({ items = [] }: { items: NavItem[] }) {
  const page = usePage();

  return (
    <SidebarGroup className="px-2 py-0">
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const href = typeof item.href === "string" ? item.href : item.href.url;
          const isActive = page.url.startsWith(href);

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
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
    </SidebarGroup>
  );
}
