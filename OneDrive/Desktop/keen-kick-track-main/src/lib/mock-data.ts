import { User, Lead, Activity } from "./types";

export const currentUser: User = {
  id: "u1",
  name: "Alex Morgan",
  email: "alex@fintechcrm.com",
  role: "admin",
};

export const users: User[] = [
  currentUser,
  { id: "u2", name: "Sarah Chen", email: "sarah@fintechcrm.com", role: "manager" },
  { id: "u3", name: "Raj Patel", email: "raj@fintechcrm.com", role: "rep" },
  { id: "u4", name: "Emily Davis", email: "emily@fintechcrm.com", role: "rep" },
];

export const leads: Lead[] = [
  { id: "l1", name: "Vikram Shah", company: "PayFlow", industry: "Payments", email: "vikram@payflow.com", phone: "+91 98765 43210", source: "LinkedIn", status: "qualified", dealValue: 150000, assignedTo: "u3", createdAt: "2026-03-01" },
  { id: "l2", name: "Priya Nair", company: "LendEase", industry: "Lending", email: "priya@lendease.com", phone: "+91 87654 32109", source: "Referral", status: "proposal", dealValue: 320000, assignedTo: "u3", createdAt: "2026-02-15" },
  { id: "l3", name: "James Wu", company: "NeoBank Asia", industry: "Bank", email: "james@neobank.asia", phone: "+65 9123 4567", source: "Conference", status: "new", dealValue: 500000, assignedTo: "u4", createdAt: "2026-03-20" },
  { id: "l4", name: "Anita Rao", company: "InsureTech", industry: "Insurance", email: "anita@insuretech.in", phone: "+91 76543 21098", source: "Website", status: "contacted", dealValue: 85000, assignedTo: "u4", createdAt: "2026-03-10" },
  { id: "l5", name: "Michael Torres", company: "WealthPrime", industry: "WealthTech", email: "michael@wealthprime.com", phone: "+1 555 0123", source: "Partner", status: "closed_won", dealValue: 220000, assignedTo: "u3", createdAt: "2026-01-05" },
  { id: "l6", name: "Deepa Menon", company: "RegShield", industry: "RegTech", email: "deepa@regshield.io", phone: "+91 65432 10987", source: "Cold Call", status: "closed_lost", dealValue: 95000, assignedTo: "u4", createdAt: "2026-02-01" },
  { id: "l7", name: "Arjun Mehta", company: "QuickLoan", industry: "NBFC", email: "arjun@quickloan.in", phone: "+91 54321 09876", source: "LinkedIn", status: "qualified", dealValue: 180000, assignedTo: "u3", createdAt: "2026-03-25" },
  { id: "l8", name: "Lisa Chen", company: "FinStart", industry: "Startup", email: "lisa@finstart.co", phone: "+1 555 0456", source: "Website", status: "new", dealValue: 60000, assignedTo: "u4", createdAt: "2026-04-01" },
];

const today = "2026-04-07";

export const activities: Activity[] = [
  { id: "a1", title: "Discovery Call with PayFlow", description: "Initial discovery call to understand requirements", type: "call", leadId: "l1", assignedTo: "u3", dateTime: `${today}T10:00`, status: "planned", priority: "high" },
  { id: "a2", title: "Demo for LendEase", description: "Product demo for lending platform integration", type: "demo", leadId: "l2", assignedTo: "u3", dateTime: `${today}T14:00`, status: "planned", priority: "high" },
  { id: "a3", title: "Follow-up email to NeoBank", description: "Send pricing proposal follow-up", type: "email", leadId: "l3", assignedTo: "u4", dateTime: `${today}T09:00`, status: "completed", priority: "medium" },
  { id: "a4", title: "Meeting with InsureTech", description: "Requirements gathering session", type: "meeting", leadId: "l4", assignedTo: "u4", dateTime: "2026-04-08T11:00", status: "planned", priority: "medium" },
  { id: "a5", title: "Call with WealthPrime", description: "Onboarding kickoff call", type: "call", leadId: "l5", assignedTo: "u3", dateTime: "2026-04-06T15:00", status: "completed", priority: "low" },
  { id: "a6", title: "Follow-up QuickLoan", description: "Check on proposal status", type: "follow-up", leadId: "l7", assignedTo: "u3", dateTime: "2026-04-05T10:00", status: "missed", priority: "high" },
  { id: "a7", title: "FinStart intro email", description: "Send introductory email with brochure", type: "email", leadId: "l8", assignedTo: "u4", dateTime: `${today}T16:00`, status: "planned", priority: "low" },
  { id: "a8", title: "RegShield debrief", description: "Internal debrief on lost deal", type: "meeting", leadId: "l6", assignedTo: "u4", dateTime: "2026-04-03T13:00", status: "completed", priority: "medium" },
  { id: "a9", title: "PayFlow proposal review", description: "Review and send final proposal", type: "follow-up", leadId: "l1", assignedTo: "u3", dateTime: "2026-04-09T10:00", status: "planned", priority: "high" },
  { id: "a10", title: "NeoBank demo", description: "Full platform demo for the banking team", type: "demo", leadId: "l3", assignedTo: "u4", dateTime: "2026-04-10T14:00", status: "planned", priority: "high" },
];

export function getUserName(id: string) {
  return users.find((u) => u.id === id)?.name ?? "Unknown";
}

export function getLeadName(id: string) {
  return leads.find((l) => l.id === id)?.name ?? "Unknown";
}

export function getLeadCompany(id: string) {
  return leads.find((l) => l.id === id)?.company ?? "";
}
