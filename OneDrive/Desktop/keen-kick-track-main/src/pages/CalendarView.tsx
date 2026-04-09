import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { activities, getLeadName, getUserName } from "@/lib/mock-data";
import { ActivityStatusBadge } from "@/components/StatusBadge";
import { ChevronLeft, ChevronRight } from "lucide-react";

type View = "day" | "week" | "month";

export default function CalendarView() {
  const [view, setView] = useState<View>("week");
  const baseDate = new Date("2026-04-07");

  const getWeekDates = () => {
    const start = new Date(baseDate);
    start.setDate(start.getDate() - start.getDay() + 1); // Monday
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });
  };

  const weekDates = getWeekDates();
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const getActivitiesForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return activities.filter((a) => a.dateTime.startsWith(dateStr));
  };

  const statusColor: Record<string, string> = {
    planned: "bg-blue-500",
    completed: "bg-emerald-500",
    missed: "bg-red-500",
  };

  return (
    <AppLayout title="Calendar">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {(["day", "week", "month"] as View[]).map((v) => (
              <Button key={v} variant={view === v ? "default" : "outline"} size="sm" onClick={() => setView(v)} className="capitalize">
                {v}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8"><ChevronLeft className="h-4 w-4" /></Button>
            <span className="text-sm font-medium">Apr 6 – 12, 2026</span>
            <Button variant="outline" size="icon" className="h-8 w-8"><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>

        {view === "week" && (
          <div className="grid grid-cols-7 gap-2">
            {weekDates.map((date, i) => {
              const dayActivities = getActivitiesForDate(date);
              const isToday = date.toISOString().split("T")[0] === "2026-04-07";
              return (
                <Card key={i} className={isToday ? "ring-2 ring-primary" : ""}>
                  <CardHeader className="p-3 pb-1">
                    <CardTitle className="text-xs font-medium text-muted-foreground">
                      {dayNames[i]}{" "}
                      <span className={`ml-1 ${isToday ? "text-primary font-bold" : ""}`}>{date.getDate()}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 space-y-1.5">
                    {dayActivities.map((act) => (
                      <div key={act.id} className="flex items-start gap-1.5 p-1.5 rounded bg-muted/50 text-xs">
                        <div className={`h-2 w-2 rounded-full mt-1 shrink-0 ${statusColor[act.status]}`} />
                        <div className="min-w-0">
                          <p className="font-medium truncate">{act.title}</p>
                          <p className="text-muted-foreground truncate">
                            {new Date(act.dateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    ))}
                    {dayActivities.length === 0 && (
                      <p className="text-xs text-muted-foreground/50 text-center py-2">—</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {view === "day" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tuesday, April 7, 2026</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {getActivitiesForDate(baseDate).map((act) => (
                <div key={act.id} className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className={`h-3 w-3 rounded-full shrink-0 ${statusColor[act.status]}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{act.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(act.dateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · {getLeadName(act.leadId)} · {getUserName(act.assignedTo)}
                    </p>
                  </div>
                  <ActivityStatusBadge status={act.status} />
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {view === "month" && (
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground text-center">Month view coming soon — use Week or Day view for now.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
