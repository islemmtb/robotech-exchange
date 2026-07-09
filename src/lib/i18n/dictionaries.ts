export type Lang = "en" | "fr";

export type Dict = {
  appName: string;
  appTag: string;
  nav: {
    overview: string;
    exchanges: string;
    debts: string;
    customers: string;
    cash: string;
    wallets: string;
    notifications: string;
    settings: string;
    soon: string;
  };
  topbar: { signOut: string; theme: string; lang: string };
  login: {
    title: string;
    subtitle: string;
    email: string;
    password: string;
    submit: string;
    loading: string;
    error: string;
  };
  overview: {
    title: string;
    subtitle: string;
    youOwe: string;
    owedToYou: string;
    overdue: string;
    openLabel: string;
    cashOnHand: string;
    walletBalances: string;
    noPayable: string;
    noReceivable: string;
    noCash: string;
    noWallets: string;
    asOf: string;
  };
  types: {
    cash: string;
    binance: string;
    redotpay: string;
    onchain: string;
    bank: string;
  };
};

export const dict: Record<Lang, Dict> = {
  en: {
    appName: "Robo Tech DZ",
    appTag: "Exchange Console",
    nav: {
      overview: "Overview",
      exchanges: "Exchanges",
      debts: "Debts",
      customers: "Customers",
      cash: "Cash",
      wallets: "Wallets",
      notifications: "Notifications",
      settings: "Settings",
      soon: "Soon",
    },
    topbar: { signOut: "Sign out", theme: "Theme", lang: "Language" },
    login: {
      title: "Sign in",
      subtitle: "Admin access to the exchange console",
      email: "Email",
      password: "Password",
      submit: "Sign in",
      loading: "Signing in…",
      error: "Wrong email or password.",
    },
    overview: {
      title: "Overview",
      subtitle:
        "Your position right now — cash, and every balance you owe or are owed.",
      youOwe: "You owe customers",
      owedToYou: "Owed to you",
      overdue: "Overdue",
      openLabel: "open",
      cashOnHand: "Cash on hand",
      walletBalances: "Wallet & account balances",
      noPayable: "You're all settled — no money owed to customers.",
      noReceivable: "Nobody owes you right now.",
      noCash: "No cash accounts yet.",
      noWallets: "No wallet or bank accounts yet.",
      asOf: "As of",
    },
    types: {
      cash: "Cash",
      binance: "Binance",
      redotpay: "RedotPay",
      onchain: "On-chain",
      bank: "Bank",
    },
  },
  fr: {
    appName: "Robo Tech DZ",
    appTag: "Console d'échange",
    nav: {
      overview: "Vue d'ensemble",
      exchanges: "Échanges",
      debts: "Dettes",
      customers: "Clients",
      cash: "Caisse",
      wallets: "Wallets",
      notifications: "Notifications",
      settings: "Réglages",
      soon: "Bientôt",
    },
    topbar: { signOut: "Déconnexion", theme: "Thème", lang: "Langue" },
    login: {
      title: "Connexion",
      subtitle: "Accès admin à la console d'échange",
      email: "Email",
      password: "Mot de passe",
      submit: "Se connecter",
      loading: "Connexion…",
      error: "Email ou mot de passe incorrect.",
    },
    overview: {
      title: "Vue d'ensemble",
      subtitle:
        "Ta position à l'instant — cash, et chaque solde que tu dois ou qu'on te doit.",
      youOwe: "Tu dois aux clients",
      owedToYou: "On te doit",
      overdue: "En retard",
      openLabel: "en cours",
      cashOnHand: "Cash en main",
      walletBalances: "Soldes wallets & comptes",
      noPayable: "Tout est réglé — tu ne dois rien aux clients.",
      noReceivable: "Personne ne te doit d'argent pour l'instant.",
      noCash: "Aucun compte caisse pour l'instant.",
      noWallets: "Aucun wallet ou compte bancaire pour l'instant.",
      asOf: "Au",
    },
    types: {
      cash: "Caisse",
      binance: "Binance",
      redotpay: "RedotPay",
      onchain: "On-chain",
      bank: "Banque",
    },
  },
};
