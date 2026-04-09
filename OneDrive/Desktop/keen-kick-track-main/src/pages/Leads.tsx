import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LeadStatusBadge } from "@/components/StatusBadge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AddLeadDialog } from "@/components/AddLeadDialog";
import { EditLeadDialog } from "@/components/EditLeadDialog";
import { DeleteLeadDialog } from "@/components/DeleteLeadDialog";
import { Search, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

interface LeadRow {
  id: string;
  name: string;
  company: string;
  industry: string;
  status: string;
  deal_value: number | null;
  email: string | null;
  phone: string | null;
  source: string | null;
  assigned_to: string | null;
}

export default function Leads() {
  const navigate = useNavigate();
  const { role, user } = useAuth();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  // Edit/delete state
  const [editLead, setEditLead] = useState<LeadRow | null>(null);
  const [deleteLead, setDeleteLead] = useState<LeadRow | null>(null);

  const canEdit = (lead: LeadRow) => {
    if (role === "admin" || role === "manager") return true;
    return lead.assigned_to === user?.id;
  };

  const canDelete = () => {
    return role === "admin" || role === "manager";
  };

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (!error && data) setLeads(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLeads();
    supabase.from("profiles").select("user_id, display_name").then(({ data }) => {
      if (data) {
        const map: Record<string, string> = {};
        data.forEach((p) => { map[p.user_id] = p.display_name || "Unknown"; });
        setProfiles(map);
      }
    });
  }, [fetchLeads]);

  const filtered = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.company.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AppLayout title="Leads">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-3 flex-1 w-full sm:w-auto">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search leads..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="proposal">Proposal</SelectItem>
                <SelectItem value="closed_won">Closed Won</SelectItem>
                <SelectItem value="closed_lost">Closed Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AddLeadDialog onLeadAdded={fetchLeads} />
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Loading leads...</div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No leads found. Add your first lead!</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Company</TableHead>
                    <TableHead className="hidden lg:table-cell">Industry</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Deal Value</TableHead>
                    <TableHead className="hidden lg:table-cell">Assigned To</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((lead) => (
                    <TableRow key={lead.id} className="cursor-pointer">
                      <TableCell onClick={() => navigate(`/leads/${lead.id}`)}>
                        <div>
                          <p className="font-medium">{lead.name}</p>
                          <p className="text-xs text-muted-foreground md:hidden">{lead.company}</p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell" onClick={() => navigate(`/leads/${lead.id}`)}>{lead.company}</TableCell>
                      <TableCell className="hidden lg:table-cell" onClick={() => navigate(`/leads/${lead.id}`)}>{lead.industry}</TableCell>
                      <TableCell onClick={() => navigate(`/leads/${lead.id}`)}><LeadStatusBadge status={lead.status as any} /></TableCell>
                      <TableCell className="hidden md:table-cell" onClick={() => navigate(`/leads/${lead.id}`)}>${(lead.deal_value ?? 0).toLocaleString()}</TableCell>
                      <TableCell className="hidden lg:table-cell" onClick={() => navigate(`/leads/${lead.id}`)}>{lead.assigned_to ? profiles[lead.assigned_to] || "Unknown" : "—"}</TableCell>
                      <TableCell>
                        {(canEdit(lead) || canDelete()) && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {canEdit(lead) && (
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setEditLead(lead); }}>
                                  <Pencil className="h-4 w-4 mr-2" /> Edit
                                </DropdownMenuItem>
                              )}
                              {canDelete() && (
                                <DropdownMenuItem className="text-destructive" onClick={(e) => { e.stopPropagation(); setDeleteLead(lead); }}>
                                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {editLead && (
        <EditLeadDialog
          lead={editLead}
          open={!!editLead}
          onOpenChange={(open) => { if (!open) setEditLead(null); }}
          onLeadUpdated={fetchLeads}
        />
      )}

      {deleteLead && (
        <DeleteLeadDialog
          leadId={deleteLead.id}
          leadName={deleteLead.name}
          open={!!deleteLead}
          onOpenChange={(open) => { if (!open) setDeleteLead(null); }}
          onDeleted={fetchLeads}
        />
      )}
    </AppLayout>
  );
}
