import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ActivityStatusBadge, PriorityBadge } from "@/components/StatusBadge";
import { getUserName, getLeadName, getLeadCompany } from "@/lib/mock-data";
import { Activity } from "@/lib/types";
import { Search, Plus } from "lucide-react";
import { useActivities } from "@/contexts/ActivityContext";

export default function Activities() {
  const { activities } = useActivities();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const filtered = activities.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    const matchesType = typeFilter === "all" || a.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <AppLayout title="Activities">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-3 flex-1 w-full sm:w-auto flex-wrap">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search activities..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="missed">Missed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="call">Call</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="demo">Demo</SelectItem>
                <SelectItem value="follow-up">Follow-up</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" /> Add Activity
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Type</TableHead>
                  <TableHead className="hidden md:table-cell">Lead</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Priority</TableHead>
                  <TableHead className="hidden lg:table-cell">Date</TableHead>
                  <TableHead className="hidden lg:table-cell">Assigned To</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((act) => (
                  <TableRow key={act.id} className="cursor-pointer" onClick={() => setSelectedActivity(act)}>
                    <TableCell>
                      <p className="font-medium">{act.title}</p>
                      <p className="text-xs text-muted-foreground md:hidden capitalize">{act.type}</p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell capitalize">{act.type}</TableCell>
                    <TableCell className="hidden md:table-cell">{getLeadName(act.leadId)}</TableCell>
                    <TableCell><ActivityStatusBadge status={act.status} /></TableCell>
                    <TableCell className="hidden lg:table-cell"><PriorityBadge priority={act.priority} /></TableCell>
                    <TableCell className="hidden lg:table-cell text-sm">{new Date(act.dateTime).toLocaleDateString()}</TableCell>
                    <TableCell className="hidden lg:table-cell">{getUserName(act.assignedTo)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Detail Drawer */}
      <Sheet open={!!selectedActivity} onOpenChange={() => setSelectedActivity(null)}>
        <SheetContent>
          {selectedActivity && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedActivity.title}</SheetTitle>
                <SheetDescription>{selectedActivity.description}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="flex gap-2">
                  <ActivityStatusBadge status={selectedActivity.status} />
                  <PriorityBadge priority={selectedActivity.priority} />
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="capitalize font-medium">{selectedActivity.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lead</span>
                    <span className="font-medium">{getLeadName(selectedActivity.leadId)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Company</span>
                    <span className="font-medium">{getLeadCompany(selectedActivity.leadId)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Assigned To</span>
                    <span className="font-medium">{getUserName(selectedActivity.assignedTo)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date & Time</span>
                    <span className="font-medium">{new Date(selectedActivity.dateTime).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </AppLayout>
  );
}
