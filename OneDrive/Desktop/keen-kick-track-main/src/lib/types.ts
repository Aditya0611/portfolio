export type UserRole = "admin" | "manager" | "rep";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export type LeadStatus = "new" | "contacted" | "qualified" | "proposal" | "closed_won" | "closed_lost";
export type LeadIndustry = "Bank" | "NBFC" | "Startup" | "Insurance" | "Payments" | "Lending" | "WealthTech" | "RegTech";
export type LeadSource = "Website" | "Referral" | "LinkedIn" | "Cold Call" | "Conference" | "Partner";

export interface Lead {
  id: string;
  name: string;
  company: string;
  industry: LeadIndustry;
  email: string;
  phone: string;
  source: LeadSource;
  status: LeadStatus;
  dealValue: number;
  assignedTo: string;
  createdAt: string;
}

export type ActivityType = "call" | "meeting" | "email" | "demo" | "follow-up" | "note";
export type ActivityStatus = "planned" | "completed" | "missed";
export type Priority = "high" | "medium" | "low";

export interface Activity {
  id: string;
  title: string;
  description: string;
  type: ActivityType;
  leadId: string;
  assignedTo: string;
  dateTime: string;
  status: ActivityStatus;
  priority: Priority;
}
