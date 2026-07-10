import { createClient } from "@/lib/supabase/server";
import { HistoryClient } from "@/components/history/HistoryClient";
import type {
  CustomerRow,
  DebtBalanceRow,
  DebtPaymentRow,
} from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const supabase = await createClient();

  const [custRes, debtRes, payRes] = await Promise.all([
    supabase.from("customers").select("*").order("full_name"),
    supabase
      .from("debt_balances")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("debt_payments")
      .select("*")
      .order("paid_at", { ascending: true }),
  ]);

  return (
    <HistoryClient
      customers={(custRes.data as CustomerRow[]) ?? []}
      debts={(debtRes.data as DebtBalanceRow[]) ?? []}
      payments={(payRes.data as DebtPaymentRow[]) ?? []}
    />
  );
}
