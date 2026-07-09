# Robo Tech DZ — Exchange Console

Console d'opérations (change devises + crypto) pour Robo Tech DZ.
Next.js (App Router) · TypeScript · Tailwind · Supabase (Auth + Postgres, RLS admin-only).

Phase 1 livrée : **login admin + vue d'ensemble** (obligations, caisse, wallets).

## 1. Prérequis

- Node.js 18.18+ (20+ recommandé)
- Le schéma SQL `0001_init_robotech_exchange.sql` déjà exécuté dans Supabase
- Un utilisateur créé dans Supabase → Authentication → Users (Auto Confirm coché)

## 2. Installation

```bash
npm install
cp .env.local.example .env.local
```

Remplis `.env.local` avec les valeurs de ton projet
(Supabase Dashboard → Project Settings → API) :

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

## 3. Lancer en local

```bash
npm run dev
```

Ouvre http://localhost:3000 → redirigé vers `/login`.
Connecte-toi avec l'email/mot de passe créés dans Supabase.

## 4. Déploiement Vercel

1. Push le repo sur GitHub.
2. Sur Vercel : New Project → importe le repo.
3. Ajoute les deux variables d'environnement (les mêmes que `.env.local`).
4. Deploy.

## Ce qui est branché

- **Auth** : Supabase Auth (email/mot de passe), garde via `middleware.ts` +
  vérification serveur dans `dashboard/layout.tsx`. Tout compte Auth = admin (phase 1).
- **Vue d'ensemble** (`/dashboard`) : lit les vues SQL `dashboard_debt_summary`,
  `cash_summary`, `account_balances`. Rien n'est calculé côté front — les soldes
  viennent du grand livre.
- **Bilingue** EN/FR (bascule en haut à droite), **thème** clair/sombre.

## Structure

```
src/
  app/
    layout.tsx              racine (fonts, thème, providers)
    page.tsx                redirige selon la session
    login/page.tsx          connexion admin
    dashboard/
      layout.tsx            garde d'auth + shell
      page.tsx              fetch des vues -> Overview
  components/
    overview/Overview.tsx   écran vue d'ensemble
    Sidebar / Topbar / DashboardShell / Brand / Toggles ...
  lib/
    supabase/{client,server}.ts
    i18n/{dictionaries,LangProvider}.tsx
    format.ts  types.ts
  middleware.ts             refresh session + redirections
```

## Prochains écrans (à venir)

Les entrées de menu marquées « Soon » sont prêtes à recevoir : Exchanges,
Debts (payable/receivable + paiements partiels), Customers, Cash, Wallets,
Notifications, Settings. Chacun se branchera sur les tables/vues déjà créées.
