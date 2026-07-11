export type Currency = "USDT" | "EUR" | "USD" | "DZD";
export type AccountType = "cash" | "binance" | "redotpay" | "onchain" | "bank";
export type DebtKind = "payable" | "receivable";
export type DebtPriority = "low" | "normal" | "high" | "urgent";
export type DebtStatus = "open" | "partially_paid" | "settled" | "cancelled";

export type CashSummaryRow = {
  currency: Currency;
  total: number;
};

export type DebtSummaryRow = {
  kind: DebtKind;
  currency: Currency;
  total_remaining: number | null;
  overdue_remaining: number | null;
  open_count: number;
};

export type DebtBalanceRow = {
  id: string;
  customer_id: string;
  exchange_id: string | null;
  kind: DebtKind;
  currency: Currency;
  original_amount: number;
  reason: string | null;
  priority: DebtPriority;
  due_date: string | null;
  notes: string | null;
  status: DebtStatus;
  created_at: string;
  updated_at: string;
  paid_amount: number;
  remaining_amount: number;
  is_overdue: boolean;
  increased_amount: number;
  total_amount: number;
};

export type DebtIncreaseRow = {
  id: string;
  debt_id: string;
  amount: number;
  notes: string | null;
  created_at: string;
};

export type VerificationStatus =
  | "unverified"
  | "pending"
  | "verified"
  | "rejected";

export type CustomerRow = {
  id: string;
  full_name: string;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  notes: string | null;
  verification: VerificationStatus;
  archived: boolean;
};

export type DebtPaymentRow = {
  id: string;
  debt_id: string;
  amount: number;
  paid_at: string;
  notes: string | null;
};
