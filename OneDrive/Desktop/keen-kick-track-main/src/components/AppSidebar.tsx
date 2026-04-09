import { LayoutDashboard, Users, Activity, CalendarDays, BarChart3, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Leads", url: "/leads", icon: Users },
  { title: "Activities", url: "/activities", icon: Activity },
  { title: "Calendar", url: "/calendar", icon: CalendarDays },
  { title: "Reports", url: "/reports", icon: BarChart3 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { profile, role, signOut } = useAuth();

  const initials = profile?.display_name
    ? profile.display_name.split(" ").map(n => n[0]).join("")
    : "?";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          {!collapsed && (
            <div className="px-3 py-4 mb-2">
              <h1 className="text-lg font-bold text-sidebar-primary-foreground tracking-tight">FinCRM</h1>
              <p className="text-xs text-sidebar-foreground/60">Sales Intelligence</p>
            </div>
          )}
          {collapsed && (
            <div className="flex items-center justify-center py-4 mb-2">
              <span className="text-lg font-bold text-sidebar-primary-foreground">F</span>
            </div>
          )}
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-[10px] uppercase tracking-widest">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-sidebar-accent/60 text-sidebar-foreground/80"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-3">
            <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-bold text-sidebar-accent-foreground">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{profile?.display_name ?? "User"}</p>
              <p className="text-[10px] text-sidebar-foreground/50 capitalize">{role ?? "rep"}</p>
            </div>
            <Button variant="ghost" size="icon" className="text-sidebar-foreground/50 hover:text-sidebar-foreground" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
