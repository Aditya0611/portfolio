import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { activities, leads, getUserName, getLeadName } from "@/lib/mock-data";
import { ActivityStatusBadge, PriorityBadge } from "@/components/StatusBadge";
import { Activity, CalendarCheck, Clock, DollarSign, Phone, Mail, Monitor, Users, ArrowUpRight } from "lucide-react";

const today = "2026-04-07";

export default function Dashboard() {
  const todayActivities = activities.filter((a) => a.dateTime.startsWith(today));
  const completedToday = todayActivities.filter((a) => a.status === "completed").length;
  const pendingToday = todayActivities.filter((a) => a.status === "planned").length;
  const pipelineValue = leads
    .filter((l) => l.status !== "closed_lost")
    .reduce((sum, l) => sum + l.dealValue, 0);
  const recentActivities = [...activities].sort((a, b) => b.dateTime.localeCompare(a.dateTime)).slice(0, 5);
  const overdueActivities = activities.filter(
    (a) => a.status === "planned" && a.dateTime < `${today}T00:00`
  );

  const typeIcons: Record<string, typeof Phone> = {
    call: Phone,
    email: Mail,
    demo: Monitor,
    meeting: Users,
    "follow-up": ArrowUpRight,
  };

  return (
    <AppLayout title="Dashboard">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Activities Today</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{todayActivities.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
              <CalendarCheck className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-success">{completedToday}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-warning">{pendingToday}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pipeline Value</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">${(pipelineValue / 1000).toFixed(0)}K</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivities.map((act) => {
                const Icon = typeIcons[act.type] || Activity;
                return (
                  <div key={act.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{act.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {getLeadName(act.leadId)} · {getUserName(act.assignedTo)}
                      </p>
                    </div>
                    <ActivityStatusBadge status={act.status} />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Overdue / Reminders */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Overdue & Reminders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {overdueActivities.length === 0 ? (
                <p className="text-sm text-muted-foreground">No overdue activities 🎉</p>
              ) : (
                overdueActivities.map((act) => (
                  <div key={act.id} className="flex items-start gap-3 p-2 rounded-lg bg-destructive/5 border border-destructive/20">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{act.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Due: {new Date(act.dateTime).toLocaleDateString()} · {getUserName(act.assignedTo)}
                      </p>
                    </div>
                    <PriorityBadge priority={act.priority} />
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
