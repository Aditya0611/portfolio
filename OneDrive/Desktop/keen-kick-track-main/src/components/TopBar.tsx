import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

export function TopBar({ title }: { title: string }) {
  return (
    <header className="h-14 border-b bg-card flex items-center gap-4 px-4 shrink-0">
      <SidebarTrigger className="text-muted-foreground" />
      <h2 className="text-lg font-semibold text-foreground hidden sm:block">{title}</h2>
      <div className="flex-1" />
      <div className="relative hidden md:block w-64">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search..." className="pl-8 h-9 bg-muted/50 border-0" />
      </div>
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-4 w-4" />
        <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">3</Badge>
      </Button>
    </header>
  );
}
