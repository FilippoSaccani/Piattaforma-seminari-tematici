# Piattaforma seminari tematici

Web app commissionata da UNIMORE che consente alle scuole superiori di scegliere e prenotare i seminari di orientamento dell'università, tramite un carrello in stile e-commerce.

Progetto di tirocinio / prova finale – Laurea triennale in Ingegneria Informatica.

## Struttura

```
├── frontend/   # React + Vite
├── backend/    # Node.js + Express
└── docs/       # Documentazione
```

## Requisiti

- Node.js (LTS)
- npm

## Avvio in sviluppo

Servono due terminali, uno per il backend e uno per il frontend.

Backend (API Express, riavvio automatico con nodemon):

```bash
cd backend
npm install
npm run dev
```

Frontend (server di sviluppo Vite, da aprire nel browser):

```bash
cd frontend
npm install
npm run dev
```

## Build di produzione

```bash
cd frontend
npm run build
```

```bash
cd backend
npm start
```
