import { createClient } from "@/lib/supabase/server";
import { Overview } from "@/components/overview/Overview";
import type {
  CashSummaryRow,
  DebtSummaryRow,
  AccountBalanceRow,
} from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [cashRes, debtRes, accRes] = await Promise.all([
    supabase.from("cash_summary").select("*"),
    supabase.from("dashboard_debt_summary").select("*"),
    supabase.from("account_balances").select("*").order("type"),
  ]);

  return (
    <Overview
      cash={(cashRes.data as CashSummaryRow[]) ?? []}
      debt={(debtRes.data as DebtSummaryRow[]) ?? []}
      accounts={(accRes.data as AccountBalanceRow[]) ?? []}
    />
  );
}
