# Frontend

React single-page dApp that talks to the `hello-world` contract on Soroban Testnet.

See the [repository README](../../README.md) for the full documentation in English, Español and Português.

## Stack

| | |
| --- | --- |
| UI | React 19, TypeScript 6, Tailwind CSS 4 |
| Tooling | Vite 8, oxlint, `tsc -b` |
| Stellar | `@stellar/stellar-sdk` 17, `@creit.tech/stellar-wallets-kit` 2.7 |
| Wallets | Freighter, xBull, Lobstr |

## Getting started

```bash
# from the repository root (Node 24+ — see .nvmrc)
node --version
npm --prefix soroban-hello-world/frontend ci
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | start Vite with hot reload |
| `npm run build` | `tsc -b` then production build |
| `npm run lint` | run oxlint |
| `npm run preview` | serve the production build locally |

## Environment variables

```bash
cp .env.example .env
```

| Variable | Description | Default |
| --- | --- | --- |
| `VITE_CONTRACT_ID` | deployed contract address | `CBDKHW25…MSCQE` |
| `VITE_SOROBAN_RPC_URL` | Soroban RPC endpoint | `https://soroban-testnet.stellar.org` |
| `VITE_NETWORK_PASSPHRASE` | passphrase used when signing | `Test SDF Network ; September 2015` |

`.env` is git-ignored; only `.env.example` is tracked. Every value has a hard-coded fallback, so the app runs without an `.env` file.

## How a call works

1. `loadSdk()` and `loadWalletKit()` lazily import the Stellar SDK and the wallet kit on first use — the 794 kB vendor chunk and each wallet module are split into their own files, keeping the initial payload at 226 kB (71 kB gzipped).
2. The transaction is built against the connected account and **simulated** through Soroban RPC.
3. On success, the prepared transaction is **signed** in the wallet and submitted.
4. The result is polled until it leaves `NOT_FOUND`, then the Soroban return value is decoded from `resultMetaXdr` and rendered.

Both paths (`simulate` and `call`) are independent buttons in `src/App.tsx`.

## Layout

```text
frontend/
├── index.html
├── vite.config.ts
├── .env.example
└── src/
    ├── main.tsx        # React entry point
    ├── App.tsx         # UI + wallet and RPC logic
    ├── App.css
    └── index.css
```
