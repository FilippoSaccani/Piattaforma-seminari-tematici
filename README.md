# Piattaforma seminari tematici

Web app commissionata da UNIMORE che consente alle scuole superiori di scegliere e prenotare i seminari di orientamento dell'università, tramite un carrello in stile e-commerce.

Progetto di tirocinio / prova finale – Laurea triennale in Ingegneria Informatica.

## Struttura

```
├── frontend/   # React + Vite
├── backend/    # Python + Flask
└── docs/       # Documentazione
```

## Requisiti

- Node.js (LTS) e npm, per il frontend
- Python 3.12 o superiore, per il backend

## Avvio in sviluppo

Servono due terminali, uno per il backend e uno per il frontend.

### Backend (API Flask, porta 5000)

La prima volta, crea l'ambiente virtuale e installa le dipendenze:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

Le volte successive:

```bash
cd backend
.venv\Scripts\activate
flask run
```

Su macOS/Linux l'ambiente virtuale si attiva con `source .venv/bin/activate` e il file `.env` si crea con `cp .env.example .env`.

Dopo aver installato una nuova libreria con `pip install`, aggiorna l'elenco delle dipendenze:

```bash
pip freeze > requirements.txt
```

### Frontend (server di sviluppo Vite, da aprire nel browser)

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

La cartella `frontend/dist/` generata contiene i file statici del sito, che possono essere serviti da Flask o da un web server.
