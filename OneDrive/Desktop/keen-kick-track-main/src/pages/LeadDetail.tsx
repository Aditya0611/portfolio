import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { leads, getUserName } from "@/lib/mock-data";
import { LeadStatusBadge, ActivityStatusBadge, PriorityBadge } from "@/components/StatusBadge";
import { ArrowLeft, Plus, Building2, Mail, Phone as PhoneIcon, Globe, DollarSign, User } from "lucide-react";
import { useActivities } from "@/contexts/ActivityContext";

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const lead = leads.find((l) => l.id === id);

  const { getActivitiesByLead } = useActivities();

  if (!lead) {
    return (
      <AppLayout title="Lead Not Found">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Lead not found</p>
        </div>
      </AppLayout>
    );
  }

  const leadActivities = getActivitiesByLead(lead.id);

  return (
    <AppLayout title={lead.name}>
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/leads")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Leads
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lead Info */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Lead Info</CardTitle>
                <LeadStatusBadge status={lead.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {lead.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="font-semibold">{lead.name}</p>
                  <p className="text-sm text-muted-foreground">{lead.company}</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4" /> {lead.industry}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" /> {lead.email}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <PhoneIcon className="h-4 w-4" /> {lead.phone}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="h-4 w-4" /> {lead.source}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="h-4 w-4" /> ${lead.dealValue.toLocaleString()}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" /> {getUserName(lead.assignedTo)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Activity Timeline</CardTitle>
                <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Activity</Button>
              </div>
            </CardHeader>
            <CardContent>
              {leadActivities.length === 0 ? (
                <p className="text-sm text-muted-foreground">No activities yet</p>
              ) : (
                <div className="space-y-4">
                  {leadActivities.map((act, i) => (
                    <div key={act.id} className="relative flex gap-4">
                      {i < leadActivities.length - 1 && (
                        <div className="absolute left-[15px] top-8 bottom-0 w-px bg-border" />
                      )}
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 z-10">
                        <span className="text-xs font-medium text-primary capitalize">{act.type[0].toUpperCase()}</span>
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium">{act.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{act.description}</p>
                          </div>
                          <div className="flex gap-1.5 shrink-0">
                            <ActivityStatusBadge status={act.status} />
                            <PriorityBadge priority={act.priority} />
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5">
                          {new Date(act.dateTime).toLocaleString()} · {getUserName(act.assignedTo)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
