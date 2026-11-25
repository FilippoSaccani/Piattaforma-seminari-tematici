"""
Crea una versione statica del sito, da pubblicare gratis (per esempio su Netlify)
per mostrare il prototipo senza tenere acceso il backend.

1. Compila il frontend in modalità statica (frontend/dist-statico).
2. Salva le risposte delle API in file JSON dentro dist-statico/api,
   così i dati di esempio restano "congelati" al momento dell'esecuzione.
3. Aggiunge il file _redirects, che fa funzionare le pagine anche se ricaricate.

Uso, dalla cartella backend con l'ambiente virtuale attivo:
    python crea_sito_statico.py
"""

import json
import shutil
import subprocess
import sys
from pathlib import Path

CARTELLA_BACKEND = Path(__file__).resolve().parent
CARTELLA_FRONTEND = CARTELLA_BACKEND.parent / "frontend"
CARTELLA_SITO = CARTELLA_FRONTEND / "dist-statico"

sys.path.insert(0, str(CARTELLA_BACKEND))

from app import create_app  # noqa: E402
from app.routes.api import SEMINARI, UTENTI  # noqa: E402

# Endpoint che non dipendono dal ruolo né da parametri
ENDPOINT = [
    "impostazioni",
    "categorie",
    "dipartimenti",
    "stati-seminari",
    "stati-prenotazioni",
    "modalita-seminario",
    "seminari",
    "prenotazioni",
    "miei-seminari",
    "recensioni",
    "proposte",
    "docenti",
    "statistiche-admin"
]


def compila_frontend():
    print("Compilazione del frontend...")

    npm = shutil.which("npm")

    if npm is None:
        sys.exit("npm non trovato: installa Node.js o aggiungilo al PATH.")

    subprocess.run([npm, "run", "build:statico"], cwd=CARTELLA_FRONTEND, check=True)


def salva_json(percorso, dati):
    file = CARTELLA_SITO / "api" / f"{percorso}.json"
    file.parent.mkdir(parents=True, exist_ok=True)
    file.write_text(json.dumps(dati, ensure_ascii=False, indent=2), encoding="utf-8")


def esporta_api():
    print("Esportazione dei dati...")

    client = create_app().test_client()

    def leggi(percorso, intestazioni=None):
        risposta = client.get(f"/api/{percorso}", headers=intestazioni or {})

        if risposta.status_code != 200:
            sys.exit(f"Errore {risposta.status_code} su /api/{percorso}")

        return risposta.get_json()

    for percorso in ENDPOINT:
        salva_json(percorso, leggi(percorso))

    for seminario in SEMINARI:
        salva_json(f"seminari/{seminario['id']}", leggi(f"seminari/{seminario['id']}"))

    # Un file per ogni ruolo del selettore: utente-docente, utente-scuola, utente-admin
    for ruolo in UTENTI:
        salva_json(f"utente-{ruolo.lower()}", leggi("utente", {"X-Ruolo": ruolo}))


def scrivi_redirects():
    # Gli indirizzi che non corrispondono a un file (per esempio /prenotazioni)
    # vengono serviti da index.html, che poi mostra la pagina giusta
    (CARTELLA_SITO / "_redirects").write_text("/*    /index.html    200\n", encoding="utf-8")


if __name__ == "__main__":
    compila_frontend()
    esporta_api()
    scrivi_redirects()

    print(f"\nSito statico pronto in: {CARTELLA_SITO}")
    print("Per pubblicarlo, trascina questa cartella su https://app.netlify.com/drop")
