import { createClient } from "@/lib/supabase/server";
import { ReservationsClient } from "@/components/reservations/ReservationsClient";
import type { ReservationRow, CustomerRow } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ReservationsPage() {
  const supabase = await createClient();

  const [resRes, custRes] = await Promise.all([
    supabase
      .from("reservations")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("customers")
      .select("id, full_name, phone, whatsapp, email, notes, verification, archived")
      .eq("archived", false)
      .order("full_name"),
  ]);

  return (
    <ReservationsClient
      reservations={(resRes.data as ReservationRow[]) ?? []}
      customers={(custRes.data as CustomerRow[]) ?? []}
    />
  );
}
