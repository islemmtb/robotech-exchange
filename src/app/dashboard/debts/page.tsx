import { createClient } from "@/lib/supabase/server";
import { DebtsClient } from "@/components/debts/DebtsClient";
import type {
  DebtBalanceRow,
  CustomerRow,
  DebtPaymentRow,
  DebtIncreaseRow,
} from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DebtsPage() {
  const supabase = await createClient();

  const [debtRes, custRes, payRes, incRes] = await Promise.all([
    supabase
      .from("debt_balances")
      .select("*")
      .neq("status", "cancelled")
      .order("due_date", { ascending: true, nullsFirst: false }),
    supabase
      .from("customers")
      .select("id, full_name, phone, whatsapp, email, notes, verification, archived")
      .eq("archived", false)
      .order("full_name"),
    supabase.from("debt_payments").select("*").order("paid_at", { ascending: false }),
    supabase.from("debt_increases").select("*").order("created_at", { ascending: false }),
  ]);

  return (
    <DebtsClient
      debts={(debtRes.data as DebtBalanceRow[]) ?? []}
      customers={(custRes.data as CustomerRow[]) ?? []}
      payments={(payRes.data as DebtPaymentRow[]) ?? []}
      increases={(incRes.data as DebtIncreaseRow[]) ?? []}
    />
  );
}
