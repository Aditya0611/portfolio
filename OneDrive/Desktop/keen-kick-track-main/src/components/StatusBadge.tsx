import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const leadStatusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700 border-blue-200",
  contacted: "bg-amber-100 text-amber-700 border-amber-200",
  qualified: "bg-violet-100 text-violet-700 border-violet-200",
  proposal: "bg-indigo-100 text-indigo-700 border-indigo-200",
  closed_won: "bg-emerald-100 text-emerald-700 border-emerald-200",
  closed_lost: "bg-red-100 text-red-700 border-red-200",
};

const activityStatusColors: Record<string, string> = {
  planned: "bg-blue-100 text-blue-700 border-blue-200",
  completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  missed: "bg-red-100 text-red-700 border-red-200",
};

const priorityColors: Record<string, string> = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

export function LeadStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={cn("text-xs font-medium capitalize", leadStatusColors[status])}>
      {status.replace("_", " ")}
    </Badge>
  );
}

export function ActivityStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={cn("text-xs font-medium capitalize", activityStatusColors[status])}>
      {status}
    </Badge>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  return (
    <Badge variant="outline" className={cn("text-xs font-medium capitalize", priorityColors[priority])}>
      {priority}
    </Badge>
  );
}
