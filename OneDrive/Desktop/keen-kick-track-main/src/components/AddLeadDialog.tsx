import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

const industries = ["Bank", "NBFC", "Startup", "Insurance", "Payments", "Lending", "WealthTech", "RegTech"];
const sources = ["Website", "Referral", "LinkedIn", "Cold Call", "Conference", "Partner"];

interface AddLeadDialogProps {
  onLeadAdded: () => void;
}

export function AddLeadDialog({ onLeadAdded }: AddLeadDialogProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    industry: "",
    email: "",
    phone: "",
    source: "",
    deal_value: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!form.name || !form.company || !form.industry) {
      toast({ title: "Error", description: "Name, company, and industry are required.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("leads").insert({
      name: form.name,
      company: form.company,
      industry: form.industry,
      email: form.email || null,
      phone: form.phone || null,
      source: form.source || null,
      deal_value: form.deal_value ? Number(form.deal_value) : 0,
      assigned_to: user.id,
      created_by: user.id,
      status: "new",
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error adding lead", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Lead added successfully" });
      setForm({ name: "", company: "", industry: "", email: "", phone: "", source: "", deal_value: "" });
      setOpen(false);
      onLeadAdded();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" /> Add Lead
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Contact name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company *</Label>
            <Input id="company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="industry">Industry *</Label>
            <Select value={form.industry} onValueChange={(v) => setForm({ ...form, industry: v })}>
              <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
              <SelectContent>
                {industries.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Select value={form.source} onValueChange={(v) => setForm({ ...form, source: v })}>
                <SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger>
                <SelectContent>
                  {sources.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deal_value">Deal Value</Label>
              <Input id="deal_value" type="number" value={form.deal_value} onChange={(e) => setForm({ ...form, deal_value: e.target.value })} placeholder="0" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Lead"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
