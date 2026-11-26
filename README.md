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

Il frontend legge i dati dal backend: Vite inoltra a Flask tutte le chiamate che iniziano con `/api`, quindi anche il backend deve essere avviato.

## Build di produzione

```bash
cd frontend
npm run build
```

La cartella `frontend/dist/` generata contiene i file statici del sito, che possono essere serviti da Flask o da un web server.

## Sito statico per la demo

Per mostrare il prototipo senza tenere acceso il backend si può creare una versione statica del sito, con i dati di esempio "congelati" in file JSON. Dalla cartella `backend`, con l'ambiente virtuale attivo:

```bash
cd backend
.venv\Scripts\activate
python crea_sito_statico.py
```

Lo script compila il frontend in modalità statica (`npm run build:statico`), salva le risposte delle API in `frontend/dist-statico/api/` e aggiunge il file `_redirects`, che fa funzionare le pagine anche quando vengono ricaricate.

Per pubblicarla gratis basta trascinare la cartella `frontend/dist-statico` su [Netlify Drop](https://app.netlify.com/drop) (serve un account Netlify).

Da sapere:
- i dati sono quelli presenti al momento dell'esecuzione dello script: conviene rigenerare il sito poco prima della demo, perché stati, preavviso e statistiche dipendono dalla data;
- le modifiche fatte nella demo (prenotazioni, recensioni, ecc.) restano solo nella pagina e si perdono ricaricandola;
- il selettore del ruolo funziona anche nella versione statica.
