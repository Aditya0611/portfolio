import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { activities, leads, users } from "@/lib/mock-data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, FunnelChart } from "recharts";

const COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#22c55e", "#ef4444"];

export default function Reports() {
  // Activities per rep
  const reps = users.filter((u) => u.role === "rep");
  const actPerRep = reps.map((rep) => ({
    name: rep.name.split(" ")[0],
    total: activities.filter((a) => a.assignedTo === rep.id).length,
    completed: activities.filter((a) => a.assignedTo === rep.id && a.status === "completed").length,
  }));

  // Completion rate
  const totalActs = activities.length;
  const completedActs = activities.filter((a) => a.status === "completed").length;
  const missedActs = activities.filter((a) => a.status === "missed").length;
  const plannedActs = activities.filter((a) => a.status === "planned").length;
  const completionData = [
    { name: "Completed", value: completedActs },
    { name: "Planned", value: plannedActs },
    { name: "Missed", value: missedActs },
  ];
  const completionColors = ["#22c55e", "#3b82f6", "#ef4444"];

  // Lead funnel
  const funnelStages = ["new", "contacted", "qualified", "proposal", "closed_won", "closed_lost"];
  const funnelLabels: Record<string, string> = {
    new: "New", contacted: "Contacted", qualified: "Qualified",
    proposal: "Proposal", closed_won: "Won", closed_lost: "Lost",
  };
  const funnelData = funnelStages.map((s) => ({
    name: funnelLabels[s],
    value: leads.filter((l) => l.status === s).length,
  }));

  // Pipeline by stage
  const pipelineData = funnelStages.filter(s => s !== "closed_lost").map((s) => ({
    name: funnelLabels[s],
    value: leads.filter((l) => l.status === s).reduce((sum, l) => sum + l.dealValue, 0) / 1000,
  }));

  return (
    <AppLayout title="Reports">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activities per rep */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Activities per Sales Rep</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={actPerRep}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Bar dataKey="total" fill="hsl(231, 65%, 55%)" name="Total" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" fill="hsl(152, 60%, 40%)" name="Completed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Completion Rate */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Activity Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={completionData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={4} dataKey="value">
                  {completionData.map((_, i) => (
                    <Cell key={i} fill={completionColors[i]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Lead Funnel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lead Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={funnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" className="text-xs" />
                <YAxis dataKey="name" type="category" className="text-xs" width={80} />
                <Tooltip />
                <Bar dataKey="value" name="Leads" radius={[0, 4, 4, 0]}>
                  {funnelData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pipeline by Stage */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pipeline by Stage ($K)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={pipelineData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip formatter={(val: number) => `$${val}K`} />
                <Bar dataKey="value" fill="hsl(231, 65%, 55%)" name="Value ($K)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
