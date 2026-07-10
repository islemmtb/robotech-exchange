import { createClient } from "@/lib/supabase/server";
import { CustomersClient } from "@/components/customers/CustomersClient";
import type { CustomerRow, DebtBalanceRow } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const supabase = await createClient();

  const [custRes, debtRes] = await Promise.all([
    supabase.from("customers").select("*").order("full_name"),
    supabase
      .from("debt_balances")
      .select("customer_id, kind, currency, remaining_amount, status")
      .in("status", ["open", "partially_paid"]),
  ]);

  return (
    <CustomersClient
      customers={(custRes.data as CustomerRow[]) ?? []}
      debts={(debtRes.data as Partial<DebtBalanceRow>[]) ?? []}
    />
  );
}
