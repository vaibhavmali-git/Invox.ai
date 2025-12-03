import { BarChart2, FileSpreadsheet, LayoutGrid, BadgePlus, CircleUserRound, Mail, Sparkles, BarChart3, FileCheck } from "lucide-react";

export const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Invoice Creation",
    description:
     "Convert any text, email, or note into a neat invoice instantly using AI.",
  },
  {
    icon: BarChart3,
    title: "AI-Powered Dashboard",
    description:
      "Get smart, actionable insights about your business finances, generated automatically by AI.",
  },
  {
    icon: Mail,
    title: "Smart Reminders",
    description:
      "Get ready-to-send reminder emails for overdue invoices with just one click.",
  },
  {
    icon: FileCheck,
    title: "Easy Invoice Management",
    description:
        "Create, organize, and track invoices easily with a clean and minimal UI.",
  },
];

export const NAVIGATION_MENU = [
  { id: "dashboard", name: "Overview", icon: LayoutGrid },
  { id: "invoices", name: "Invoices", icon: FileSpreadsheet },
  { id: "invoices/new", name: "Create Invoice", icon: BadgePlus },
  { id: "profile", name: "Profile", icon: CircleUserRound },
];
