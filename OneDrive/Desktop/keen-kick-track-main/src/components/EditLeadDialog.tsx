import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const industries = ["Bank", "NBFC", "Startup", "Insurance", "Payments", "Lending", "WealthTech", "RegTech"];
const sources = ["Website", "Referral", "LinkedIn", "Cold Call", "Conference", "Partner"];
const statuses = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "proposal", label: "Proposal" },
  { value: "closed_won", label: "Closed Won" },
  { value: "closed_lost", label: "Closed Lost" },
];

interface LeadData {
  id: string;
  name: string;
  company: string;
  industry: string;
  email: string | null;
  phone: string | null;
  source: string | null;
  status: string;
  deal_value: number | null;
}

interface EditLeadDialogProps {
  lead: LeadData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLeadUpdated: () => void;
}

export function EditLeadDialog({ lead, open, onOpenChange, onLeadUpdated }: EditLeadDialogProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: lead.name,
    company: lead.company,
    industry: lead.industry,
    email: lead.email || "",
    phone: lead.phone || "",
    source: lead.source || "",
    status: lead.status,
    deal_value: String(lead.deal_value ?? 0),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.company || !form.industry) {
      toast({ title: "Error", description: "Name, company, and industry are required.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("leads").update({
      name: form.name,
      company: form.company,
      industry: form.industry,
      email: form.email || null,
      phone: form.phone || null,
      source: form.source || null,
      status: form.status,
      deal_value: form.deal_value ? Number(form.deal_value) : 0,
    }).eq("id", lead.id);
    setLoading(false);
    if (error) {
      toast({ title: "Error updating lead", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Lead updated successfully" });
      onOpenChange(false);
      onLeadUpdated();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Lead</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Name *</Label>
            <Input id="edit-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-company">Company *</Label>
            <Input id="edit-company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Industry *</Label>
              <Select value={form.industry} onValueChange={(v) => setForm({ ...form, industry: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {industries.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input id="edit-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input id="edit-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Source</Label>
              <Select value={form.source} onValueChange={(v) => setForm({ ...form, source: v })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {sources.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-deal">Deal Value</Label>
              <Input id="edit-deal" type="number" value={form.deal_value} onChange={(e) => setForm({ ...form, deal_value: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
