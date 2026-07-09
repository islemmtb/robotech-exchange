export type Currency = "USDT" | "EUR" | "USD" | "DZD";

export type AccountType = "cash" | "binance" | "redotpay" | "onchain" | "bank";

export type CashSummaryRow = {
  currency: Currency;
  total: number;
};

export type DebtSummaryRow = {
  kind: "payable" | "receivable";
  currency: Currency;
  total_remaining: number | null;
  overdue_remaining: number | null;
  open_count: number;
};

export type AccountBalanceRow = {
  id: string;
  name: string;
  type: AccountType;
  currency: Currency;
  is_active: boolean;
  opening_balance: number;
  balance: number;
};
