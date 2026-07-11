import { createClient } from "@/lib/supabase/server";
import { ChecklistClient } from "@/components/checklist/ChecklistClient";
import type { ChecklistItemRow } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ChecklistPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("checklist_items")
    .select("*")
    .order("created_at", { ascending: false });

  return <ChecklistClient items={(data as ChecklistItemRow[]) ?? []} />;
}
