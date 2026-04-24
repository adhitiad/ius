import { Dictionary } from "./id";

export const en: Dictionary = {
  navigation: {
    dashboard: "Dashboard",
    screener: "Screener",
    backtester: "Backtester",
    signals: "Signals",
    admin_panel: "Admin Panel",
    settings: "Settings",
    profile: "Profile",
    billing: "Billing",
    finances: "Finances",
  },
  common: {
    save: "Save",
    saving: "Saving...",
    loading: "Loading...",
    language: "Language",
    back_to_dashboard: "Back to Dashboard",
  },
  profile: {
    title: "Profile Settings",
    subtitle: "Manage your personal information and notification integrations.",
    full_name: "Full Name",
    email: "Email Address",
    telegram_id: "Telegram ID",
    email_help: "Email cannot be changed (used for authentication).",
    telegram_help: "Used to send signal alerts to your Telegram account via @userinfobot.",
    success: "Your profile has been successfully updated!",
    error: "Failed to save data.",
  },
  admin: {
    users_title: "User Management",
    finances_title: "Finance Management",
    table: {
      name: "Name",
      plan: "Plan",
      role: "Role",
      telegram_id: "Telegram ID",
      date: "Date",
      description: "Description",
      type: "Type",
      amount: "Amount",
      category: "Category",
      status: "Status",
      income: "Income",
      expense: "Expense",
    }
  }
};
