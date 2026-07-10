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
    noPayable: string;
    noReceivable: string;
    noCash: string;
    asOf: string;
  };
  debts: {
    title: string;
    subtitle: string;
    newDebt: string;
    youOwe: string;
    owedToYou: string;
    total: string;
    emptyPayable: string;
    emptyReceivable: string;
    remaining: string;
    of: string;
    paid: string;
    due: string;
    noDue: string;
    overdue: string;
    record: string;
    recordPayment: string;
    settle: string;
    history: string;
    noHistory: string;
    close: string;
    priorities: { low: string; normal: string; high: string; urgent: string };
    form: {
      newTitle: string;
      kind: string;
      payable: string;
      receivable: string;
      customer: string;
      selectCustomer: string;
      addNew: string;
      customerName: string;
      phone: string;
      currency: string;
      amount: string;
      reason: string;
      reasonPlaceholder: string;
      priority: string;
      dueDate: string;
      notes: string;
      create: string;
      creating: string;
      cancel: string;
      errRequired: string;
      errGeneric: string;
    };
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
      noPayable: "You're all settled — no money owed to customers.",
      noReceivable: "Nobody owes you right now.",
      noCash: "No cash accounts yet.",
      asOf: "As of",
    },
    debts: {
      title: "Debts",
      subtitle:
        "Everyone you owe, and everyone who owes you. Nothing gets forgotten.",
      newDebt: "New debt",
      youOwe: "You owe",
      owedToYou: "Owed to you",
      total: "Total",
      emptyPayable: "You don't owe anyone right now.",
      emptyReceivable: "Nobody owes you right now.",
      remaining: "remaining",
      of: "of",
      paid: "paid",
      due: "Due",
      noDue: "No due date",
      overdue: "Overdue",
      record: "Record",
      recordPayment: "Record a payment",
      settle: "Settle in full",
      history: "Payment history",
      noHistory: "No payments recorded yet.",
      close: "Close",
      priorities: { low: "Low", normal: "Normal", high: "High", urgent: "Urgent" },
      form: {
        newTitle: "New debt",
        kind: "Type",
        payable: "I owe them",
        receivable: "They owe me",
        customer: "Customer",
        selectCustomer: "Select a customer…",
        addNew: "+ New customer",
        customerName: "Customer name",
        phone: "Phone / WhatsApp (optional)",
        currency: "Currency",
        amount: "Amount",
        reason: "Reason",
        reasonPlaceholder: "e.g. Sent 500 USDT, paid 300",
        priority: "Priority",
        dueDate: "Due date (optional)",
        notes: "Notes (optional)",
        create: "Create debt",
        creating: "Creating…",
        cancel: "Cancel",
        errRequired: "Pick a customer and enter an amount.",
        errGeneric: "Something went wrong. Try again.",
      },
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
      noPayable: "Tout est réglé — tu ne dois rien aux clients.",
      noReceivable: "Personne ne te doit d'argent pour l'instant.",
      noCash: "Aucun compte caisse pour l'instant.",
      asOf: "Au",
    },
    debts: {
      title: "Dettes",
      subtitle:
        "Tous ceux à qui tu dois, et tous ceux qui te doivent. Rien ne se perd.",
      newDebt: "Nouvelle dette",
      youOwe: "Tu dois",
      owedToYou: "On te doit",
      total: "Total",
      emptyPayable: "Tu ne dois rien à personne pour l'instant.",
      emptyReceivable: "Personne ne te doit d'argent pour l'instant.",
      remaining: "restant",
      of: "sur",
      paid: "payé",
      due: "Échéance",
      noDue: "Sans échéance",
      overdue: "En retard",
      record: "Valider",
      recordPayment: "Enregistrer un paiement",
      settle: "Solder en totalité",
      history: "Historique des paiements",
      noHistory: "Aucun paiement enregistré.",
      close: "Fermer",
      priorities: { low: "Basse", normal: "Normale", high: "Haute", urgent: "Urgente" },
      form: {
        newTitle: "Nouvelle dette",
        kind: "Type",
        payable: "Je lui dois",
        receivable: "Il me doit",
        customer: "Client",
        selectCustomer: "Choisir un client…",
        addNew: "+ Nouveau client",
        customerName: "Nom du client",
        phone: "Téléphone / WhatsApp (optionnel)",
        currency: "Devise",
        amount: "Montant",
        reason: "Motif",
        reasonPlaceholder: "ex. Envoyé 500 USDT, payé 300",
        priority: "Priorité",
        dueDate: "Échéance (optionnel)",
        notes: "Notes (optionnel)",
        create: "Créer la dette",
        creating: "Création…",
        cancel: "Annuler",
        errRequired: "Choisis un client et saisis un montant.",
        errGeneric: "Une erreur est survenue. Réessaie.",
      },
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
