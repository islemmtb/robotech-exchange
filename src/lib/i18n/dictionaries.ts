export type Lang = "en" | "fr";

export type Dict = {
  appName: string;
  appTag: string;
  nav: {
    overview: string;
    exchanges: string;
    debts: string;
    customers: string;
    history: string;
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
    settleConfirm: string;
    history: string;
    noHistory: string;
    opened: string;
    note: string;
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
      similarHint: string;
      reviewTitle: string;
      reviewHint: string;
      back: string;
      confirm: string;
    };
  };
  customers: {
    title: string;
    subtitle: string;
    add: string;
    search: string;
    empty: string;
    emptySearch: string;
    verification: {
      unverified: string;
      pending: string;
      verified: string;
      rejected: string;
    };
    youOwe: string;
    owesYou: string;
    contact: { call: string; whatsapp: string; email: string };
    form: {
      addTitle: string;
      editTitle: string;
      name: string;
      phone: string;
      whatsapp: string;
      email: string;
      notes: string;
      verification: string;
      save: string;
      saving: string;
      cancel: string;
      delete: string;
      deleteConfirm: string;
      errName: string;
      errGeneric: string;
      errHasDebts: string;
    };
    duplicates: { hint: string; usingExisting: string; unlink: string };
  };
  history: {
    title: string;
    subtitle: string;
    search: string;
    selectPrompt: string;
    noCustomers: string;
    noHistory: string;
    youOwe: string;
    owesYou: string;
    opened: string;
    payment: string;
    note: string;
    remaining: string;
    paid: string;
    of: string;
    status: {
      open: string;
      partially_paid: string;
      settled: string;
      cancelled: string;
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
      history: "History",
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
      settleConfirm:
        "Record full settlement of {amount} from {name}? Only do this if they've actually paid.",
      history: "Payment history",
      noHistory: "No payments recorded yet.",
      opened: "Opened",
      note: "Note",
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
        similarHint: "Might already be saved:",
        reviewTitle: "Confirm the details",
        reviewHint: "Check everything is correct before saving.",
        back: "Back",
        confirm: "Confirm & create",
      },
    },
    customers: {
      title: "Customers",
      subtitle:
        "Everyone you deal with — contacts, notes, and what you owe each other.",
      add: "Add customer",
      search: "Search by name or phone…",
      empty: "No customers yet. Add your first one.",
      emptySearch: "No customer matches your search.",
      verification: {
        unverified: "Unverified",
        pending: "Pending",
        verified: "Verified",
        rejected: "Rejected",
      },
      youOwe: "You owe",
      owesYou: "Owes you",
      contact: { call: "Call", whatsapp: "WhatsApp", email: "Email" },
      form: {
        addTitle: "Add customer",
        editTitle: "Edit customer",
        name: "Full name",
        phone: "Phone",
        whatsapp: "WhatsApp",
        email: "Email",
        notes: "Notes",
        verification: "Verification",
        save: "Save",
        saving: "Saving…",
        cancel: "Cancel",
        delete: "Delete",
        deleteConfirm: "Delete this customer? This can't be undone.",
        errName: "Enter a name.",
        errGeneric: "Something went wrong. Try again.",
        errHasDebts: "Can't delete — this customer still has debts on record.",
      },
      duplicates: {
        hint: "Might already be saved:",
        usingExisting:
          "Editing an existing customer — saving updates their profile.",
        unlink: "Not them",
      },
    },
    history: {
      title: "History",
      subtitle: "Every debt and payment, customer by customer.",
      search: "Search a customer…",
      selectPrompt: "Pick a customer to see their full history.",
      noCustomers: "No customers yet.",
      noHistory: "No debts or payments for this customer yet.",
      youOwe: "You owe",
      owesYou: "Owes you",
      opened: "Opened",
      payment: "Payment",
      note: "Note",
      remaining: "remaining",
      paid: "paid",
      of: "of",
      status: {
        open: "Open",
        partially_paid: "Partially paid",
        settled: "Settled",
        cancelled: "Cancelled",
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
      history: "Historique",
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
      settleConfirm:
        "Enregistrer le solde complet de {amount} de {name} ? À faire seulement s'il a réellement payé.",
      history: "Historique des paiements",
      noHistory: "Aucun paiement enregistré.",
      opened: "Créée",
      note: "Note",
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
        similarHint: "Peut-être déjà enregistré :",
        reviewTitle: "Confirme les détails",
        reviewHint: "Vérifie que tout est correct avant d'enregistrer.",
        back: "Retour",
        confirm: "Confirmer et créer",
      },
    },
    customers: {
      title: "Clients",
      subtitle:
        "Tous ceux avec qui tu traites — contacts, notes, et ce que vous vous devez.",
      add: "Ajouter un client",
      search: "Rechercher par nom ou téléphone…",
      empty: "Aucun client pour l'instant. Ajoute le premier.",
      emptySearch: "Aucun client ne correspond à ta recherche.",
      verification: {
        unverified: "Non vérifié",
        pending: "En attente",
        verified: "Vérifié",
        rejected: "Rejeté",
      },
      youOwe: "Tu dois",
      owesYou: "Te doit",
      contact: { call: "Appeler", whatsapp: "WhatsApp", email: "Email" },
      form: {
        addTitle: "Ajouter un client",
        editTitle: "Modifier le client",
        name: "Nom complet",
        phone: "Téléphone",
        whatsapp: "WhatsApp",
        email: "Email",
        notes: "Notes",
        verification: "Vérification",
        save: "Enregistrer",
        saving: "Enregistrement…",
        cancel: "Annuler",
        delete: "Supprimer",
        deleteConfirm: "Supprimer ce client ? Action irréversible.",
        errName: "Saisis un nom.",
        errGeneric: "Une erreur est survenue. Réessaie.",
        errHasDebts:
          "Suppression impossible — ce client a encore des dettes enregistrées.",
      },
      duplicates: {
        hint: "Peut-être déjà enregistré :",
        usingExisting:
          "Modification d'un client existant — l'enregistrement mettra à jour son profil.",
        unlink: "Pas lui",
      },
    },
    history: {
      title: "Historique",
      subtitle: "Chaque dette et paiement, client par client.",
      search: "Rechercher un client…",
      selectPrompt: "Choisis un client pour voir tout son historique.",
      noCustomers: "Aucun client pour l'instant.",
      noHistory: "Aucune dette ni paiement pour ce client.",
      youOwe: "Tu dois",
      owesYou: "Te doit",
      opened: "Ouverte",
      payment: "Paiement",
      note: "Note",
      remaining: "restant",
      paid: "payé",
      of: "sur",
      status: {
        open: "Ouverte",
        partially_paid: "Partiellement payée",
        settled: "Soldée",
        cancelled: "Annulée",
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
