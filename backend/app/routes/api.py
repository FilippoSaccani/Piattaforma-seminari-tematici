from datetime import datetime, timedelta
from flask import Blueprint, jsonify, request

api_bp = Blueprint("api", __name__)


# Docenti

DOCENTI = [
    {"id": 1, "nome": "Marco Rossi", "email": "marco.rossi@unimore.it"},
    {"id": 2, "nome": "Giulia Bianchi", "email": "giulia.bianchi@unimore.it"},
    {"id": 3, "nome": "Luca Ferrari", "email": "luca.ferrari@unimore.it"},
    {"id": 4, "nome": "Elena Conti", "email": "elena.conti@unimore.it"},
    {"id": 5, "nome": "Andrea Gallo", "email": "andrea.gallo@unimore.it"},
    {"id": 6, "nome": "Sara Moretti", "email": "sara.moretti@unimore.it"},
    {"id": 7, "nome": "Paolo Ricci", "email": "paolo.ricci@unimore.it"},
    {"id": 8, "nome": "Chiara Marino", "email": "chiara.marino@unimore.it"},
    {"id": 9, "nome": "Davide Greco", "email": "davide.greco@unimore.it"}
]


# Utenti

# Nella vista docente l'utente collegato è Marco Rossi
UTENTE_DOCENTE = {
    "ruolo": "Docente",
    **DOCENTI[0]
}

UTENTE_SCUOLA = {
    "ruolo": "Scuola",
    "nome": "Liceo Scientifico Aldo Moro",
    "indirizzo": "Via XX Settembre 5, Reggio Emilia"
}

UTENTE_ADMIN = {
    "ruolo": "Admin"
}

UTENTE = UTENTE_DOCENTE

# Utenti tra cui si può scegliere nel prototipo con il selettore del ruolo
UTENTI = {
    "Docente": UTENTE_DOCENTE,
    "Scuola": UTENTE_SCUOLA,
    "Admin": UTENTE_ADMIN
}


# Valori fissi

CATEGORIE = [
    "Scienze e Ingegneria",
    "Medicina e Vita",
    "Società e Cultura"
]

DIPARTIMENTI = [
    "DIEF",
    "Scienze e Metodi dell'Ingegneria",
    "Scienze fisiche, informatiche e matematiche",
    "Scienze chimiche e geologiche",
    "Scienze della Vita",
    "Scienze Biomediche, Metaboliche e Neuroscienze",
    "Economia Marco Biagi",
    "Studi Linguistici e Culturali",
    "Educazione e Scienze Umane"
]

STATI_SEMINARI = [
    "Pubblicato",
    "Prenotato",
    "Concluso"
]

STATI_PRENOTAZIONI = [
    "Da confermare",
    "Da svolgere",
    "Concluso"
]

MODALITA_SEMINARIO = [
    "In presenza",
    "A distanza"
]


# Impostazioni della piattaforma (in futuro modificabili dall'amministrazione)

IMPOSTAZIONI = {
    # Giorni di anticipo minimo con cui una scuola può prenotare o confermare una fascia
    "giorniPreavvisoPrenotazione": 14,

    # Giorni di anticipo minimo con cui una scuola può disdire una prenotazione
    "giorniTermineDisdetta": 2
}


# Funzioni per scrivere i dati in modo compatto

def fascia(id_fascia, ora_inizio, prenotazione=None):
    return {"id": id_fascia, "oraInizio": ora_inizio, "prenotazione": prenotazione}


def prenotazione(id_prenotazione, scuola, numero_studenti, modalita="In presenza", disdetta=False):
    return {
        "id": id_prenotazione,
        "scuola": scuola,
        "numeroStudenti": numero_studenti,
        "modalita": modalita,
        "disdetta": disdetta
    }


# Catalogo dei seminari.
# Docente, recensioni, media e stato vengono aggiunti dagli endpoint.

SEMINARI = [
    {
        "id": 1,
        "idDocente": 1,
        "titolo": "Intelligenza artificiale",
        "descrizione_breve": "Introduzione alle nuove tecnologie e alle applicazioni dell'intelligenza artificiale.",
        "descrizione_dettagliata": "Un seminario dedicato alla scoperta dell'intelligenza artificiale, delle sue principali applicazioni e delle prospettive di sviluppo.\n\nNon sono richieste conoscenze pregresse di programmazione.",
        "requisiti": "",
        "categoria": "Scienze e Ingegneria",
        "dipartimento": "DIEF",
        "durata": 120,
        "modalita": ["In presenza"],
        "anni": [3, 4, 5],
        "limite_prenotazioni": 10,
        "video": None,
        "disponibilita": [
            {"id": 1, "data": "2026-12-15", "fasceOrarie": [
                fascia(1, "09:00", prenotazione(1, "Liceo Scientifico Aldo Moro", 25)),
                fascia(2, "14:00")
            ]},
            {"id": 2, "data": "2026-12-17", "fasceOrarie": [
                fascia(3, "10:00", prenotazione(2, "Istituto Tecnico Blaise Pascal", 20, disdetta=True))
            ]},
            {"id": 3, "data": "2026-12-18", "fasceOrarie": [
                fascia(4, "09:00")
            ]}
        ]
    },
    {
        "id": 2,
        "idDocente": 1,
        "titolo": "Robotica",
        "descrizione_breve": "Alla scoperta dei robot e dei sistemi automatizzati.",
        "descrizione_dettagliata": "Un viaggio nel mondo della robotica, dai componenti fondamentali dei robot ai sistemi automatizzati e alle loro applicazioni industriali.",
        "requisiti": "",
        "categoria": "Scienze e Ingegneria",
        "dipartimento": "DIEF",
        "durata": 120,
        "modalita": ["In presenza", "A distanza"],
        "anni": [3, 4, 5],
        "limite_prenotazioni": 10,
        "video": None,
        "disponibilita": [
            {"id": 4, "data": "2027-01-12", "fasceOrarie": [
                fascia(5, "09:00"),
                fascia(6, "14:00")
            ]}
        ]
    },
    {
        "id": 3,
        "idDocente": 1,
        "titolo": "Sicurezza informatica",
        "descrizione_breve": "I principali rischi informatici e le tecniche per proteggere dati e sistemi.",
        "descrizione_dettagliata": "Un'introduzione alle minacce informatiche, alle vulnerabilità dei sistemi e alle principali tecniche utilizzate per proteggere informazioni e infrastrutture digitali.",
        "requisiti": "",
        "categoria": "Scienze e Ingegneria",
        "dipartimento": "DIEF",
        "durata": 120,
        "modalita": ["In presenza"],
        "anni": [3, 4, 5],
        "limite_prenotazioni": 10,
        "video": None,
        "disponibilita": [
            {"id": 5, "data": "2026-11-10", "fasceOrarie": [
                fascia(7, "09:00", prenotazione(3, "Istituto Tecnico Einaudi", 24)),
                fascia(8, "14:00", prenotazione(4, "Liceo Scientifico Aldo Moro", 20))
            ]}
        ]
    },
    {
        "id": 4,
        "idDocente": 1,
        "titolo": "Introduzione alla programmazione",
        "descrizione_breve": "I primi passi nel mondo del codice, dagli algoritmi ai programmi.",
        "descrizione_dettagliata": "Gli studenti scoprono che cos'è un algoritmo e scrivono i loro primi programmi con esempi pratici e giochi di logica.\n\nIl seminario si svolge online con esercizi da svolgere insieme.",
        "requisiti": "Un computer per ogni gruppo di studenti.",
        "categoria": "Scienze e Ingegneria",
        "dipartimento": "DIEF",
        "durata": 90,
        "modalita": ["A distanza"],
        "anni": [1, 2, 3],
        "limite_prenotazioni": 8,
        "video": None,
        "disponibilita": [
            {"id": 6, "data": "2026-10-14", "fasceOrarie": [
                fascia(9, "10:00", prenotazione(5, "Istituto Tecnico Fermi", 25, modalita="A distanza"))
            ]},
            {"id": 7, "data": "2027-01-19", "fasceOrarie": [
                fascia(10, "10:00"),
                fascia(11, "15:00")
            ]}
        ]
    },
    {
        "id": 5,
        "idDocente": 2,
        "titolo": "Sostenibilità e cambiamento climatico",
        "descrizione_breve": "Le sfide ambientali e le possibili soluzioni.",
        "descrizione_dettagliata": "Un'analisi delle principali sfide ambientali contemporanee e delle soluzioni tecnologiche e sociali per promuovere uno sviluppo sostenibile.",
        "requisiti": "",
        "categoria": "Società e Cultura",
        "dipartimento": "Scienze chimiche e geologiche",
        "durata": 120,
        "modalita": ["In presenza"],
        "anni": [3, 4, 5],
        "limite_prenotazioni": 10,
        "video": None,
        "disponibilita": [
            {"id": 8, "data": "2026-10-16", "fasceOrarie": [
                fascia(12, "09:00", prenotazione(6, "Liceo delle Scienze Applicate", 22))
            ]},
            {"id": 9, "data": "2026-12-10", "fasceOrarie": [
                fascia(13, "09:00"),
                fascia(14, "14:00", prenotazione(7, "Liceo Classico Ariosto", 28))
            ]}
        ]
    },
    {
        "id": 6,
        "idDocente": 2,
        "titolo": "La chimica in cucina",
        "descrizione_breve": "Le reazioni chimiche che avvengono ogni giorno ai fornelli.",
        "descrizione_dettagliata": "Perché il pane lievita? Che cosa succede quando si cuoce un uovo? Attraverso semplici esperimenti gli studenti scoprono la chimica nascosta negli alimenti.",
        "requisiti": "",
        "categoria": "Scienze e Ingegneria",
        "dipartimento": "Scienze chimiche e geologiche",
        "durata": 90,
        "modalita": ["In presenza"],
        "anni": [1, 2],
        "limite_prenotazioni": 6,
        "video": None,
        "disponibilita": [
            {"id": 10, "data": "2026-12-14", "fasceOrarie": [
                fascia(15, "10:00"),
                fascia(16, "14:30")
            ]},
            {"id": 11, "data": "2027-02-09", "fasceOrarie": [
                fascia(17, "09:00")
            ]}
        ]
    },
    {
        "id": 7,
        "idDocente": 3,
        "titolo": "Il mondo dei quanti",
        "descrizione_breve": "Un viaggio tra le stranezze della fisica quantistica.",
        "descrizione_dettagliata": "Sovrapposizione, entanglement e computer quantistici spiegati con esempi intuitivi e senza formule complesse.",
        "requisiti": "Conoscenze di base di fisica.",
        "categoria": "Scienze e Ingegneria",
        "dipartimento": "Scienze fisiche, informatiche e matematiche",
        "durata": 120,
        "modalita": ["In presenza", "A distanza"],
        "anni": [4, 5],
        "limite_prenotazioni": 8,
        "video": None,
        "disponibilita": [
            {"id": 12, "data": "2026-10-20", "fasceOrarie": [
                fascia(18, "09:00", prenotazione(8, "Liceo Scientifico Aldo Moro", 22))
            ]},
            {"id": 13, "data": "2027-01-26", "fasceOrarie": [
                fascia(19, "09:00")
            ]}
        ]
    },
    {
        "id": 8,
        "idDocente": 3,
        "titolo": "Matematica e crittografia",
        "descrizione_breve": "Come i numeri proteggono i nostri messaggi.",
        "descrizione_dettagliata": "Dal cifrario di Cesare alla crittografia moderna: gli studenti scoprono la matematica che rende sicuri pagamenti e messaggi.",
        "requisiti": "",
        "categoria": "Scienze e Ingegneria",
        "dipartimento": "Scienze fisiche, informatiche e matematiche",
        "durata": 90,
        "modalita": ["A distanza"],
        "anni": [3, 4, 5],
        "limite_prenotazioni": 10,
        "video": None,
        "disponibilita": [
            {"id": 14, "data": "2026-12-03", "fasceOrarie": [
                fascia(20, "14:00")
            ]},
            {"id": 15, "data": "2026-12-21", "fasceOrarie": [
                fascia(21, "10:00")
            ]}
        ]
    },
    {
        "id": 9,
        "idDocente": 4,
        "titolo": "Biotecnologie e DNA",
        "descrizione_breve": "Che cosa sono le biotecnologie e come leggiamo il DNA.",
        "descrizione_dettagliata": "Il seminario presenta le tecniche con cui si studia il DNA e le applicazioni delle biotecnologie in medicina, agricoltura e ambiente.",
        "requisiti": "Conoscenze di base di biologia.",
        "categoria": "Medicina e Vita",
        "dipartimento": "Scienze della Vita",
        "durata": 120,
        "modalita": ["In presenza"],
        "anni": [3, 4, 5],
        "limite_prenotazioni": 6,
        "video": None,
        "disponibilita": [
            {"id": 16, "data": "2026-12-16", "fasceOrarie": [
                fascia(22, "10:00"),
                fascia(23, "14:00", prenotazione(9, "Istituto Professionale Galvani", 18))
            ]}
        ]
    },
    {
        "id": 10,
        "idDocente": 5,
        "titolo": "Economia e risparmio",
        "descrizione_breve": "Le basi dell'educazione finanziaria per i più giovani.",
        "descrizione_dettagliata": "Come funzionano banche, interessi e inflazione? Un incontro per imparare a gestire il denaro in modo consapevole.",
        "requisiti": "",
        "categoria": "Società e Cultura",
        "dipartimento": "Economia Marco Biagi",
        "durata": 60,
        "modalita": ["A distanza"],
        "anni": [4, 5],
        "limite_prenotazioni": 12,
        "video": None,
        "disponibilita": [
            {"id": 17, "data": "2026-09-29", "fasceOrarie": [
                fascia(24, "11:00", prenotazione(10, "Istituto Tecnico Blaise Pascal", 30, modalita="A distanza"))
            ]},
            {"id": 18, "data": "2026-11-12", "fasceOrarie": [
                fascia(25, "11:00", prenotazione(11, "Liceo Classico Ariosto", 26, modalita="A distanza"))
            ]}
        ]
    },
    {
        "id": 11,
        "idDocente": 6,
        "titolo": "Lingue e culture nell'era digitale",
        "descrizione_breve": "Come internet sta cambiando il modo in cui comunichiamo.",
        "descrizione_dettagliata": "Emoji, traduttori automatici e nuove parole: un percorso tra linguistica e culture per capire come evolvono le lingue online.",
        "requisiti": "",
        "categoria": "Società e Cultura",
        "dipartimento": "Studi Linguistici e Culturali",
        "durata": 90,
        "modalita": ["In presenza"],
        "anni": [1, 2, 3, 4, 5],
        "limite_prenotazioni": 10,
        "video": None,
        "disponibilita": [
            {"id": 19, "data": "2027-02-16", "fasceOrarie": [
                fascia(26, "09:00"),
                fascia(27, "11:00")
            ]}
        ]
    },
    {
        "id": 12,
        "idDocente": 7,
        "titolo": "Il cervello e le neuroscienze",
        "descrizione_breve": "Come funziona il cervello quando impariamo e ricordiamo.",
        "descrizione_dettagliata": "Neuroni, memoria e attenzione: il seminario racconta le scoperte più recenti delle neuroscienze e i loro effetti sullo studio.",
        "requisiti": "",
        "categoria": "Medicina e Vita",
        "dipartimento": "Scienze Biomediche, Metaboliche e Neuroscienze",
        "durata": 120,
        "modalita": ["In presenza"],
        "anni": [4, 5],
        "limite_prenotazioni": 8,
        "video": None,
        "disponibilita": [
            {"id": 20, "data": "2027-01-20", "fasceOrarie": [
                fascia(28, "09:00"),
                fascia(29, "14:00")
            ]}
        ]
    },
    {
        "id": 13,
        "idDocente": 7,
        "titolo": "Primo soccorso e salute",
        "descrizione_breve": "Le manovre di base che tutti dovrebbero conoscere.",
        "descrizione_dettagliata": "Un incontro pratico sulle principali manovre di primo soccorso e sui comportamenti corretti in caso di emergenza.",
        "requisiti": "",
        "categoria": "Medicina e Vita",
        "dipartimento": "Scienze Biomediche, Metaboliche e Neuroscienze",
        "durata": 90,
        "modalita": ["In presenza"],
        "anni": [1, 2, 3],
        "limite_prenotazioni": 6,
        "video": None,
        "disponibilita": [
            {"id": 21, "data": "2026-11-03", "fasceOrarie": [
                fascia(30, "10:00", prenotazione(12, "Liceo delle Scienze Applicate", 24))
            ]}
        ]
    },
    {
        "id": 14,
        "idDocente": 8,
        "titolo": "Educazione digitale e social media",
        "descrizione_breve": "Usare i social in modo consapevole e sicuro.",
        "descrizione_dettagliata": "Privacy, notizie false e benessere digitale: un confronto con gli studenti sulle abitudini online e su come difendersi dai rischi.",
        "requisiti": "",
        "categoria": "Società e Cultura",
        "dipartimento": "Educazione e Scienze Umane",
        "durata": 60,
        "modalita": ["A distanza"],
        "anni": [1, 2, 3],
        "limite_prenotazioni": 12,
        "video": None,
        "disponibilita": [
            {"id": 22, "data": "2026-12-11", "fasceOrarie": [
                fascia(31, "09:00", prenotazione(13, "Liceo Scientifico Aldo Moro", 27, modalita="A distanza")),
                fascia(32, "11:00")
            ]}
        ]
    },
    {
        "id": 15,
        "idDocente": 9,
        "titolo": "Energie rinnovabili",
        "descrizione_breve": "Sole, vento e acqua: l'energia del futuro.",
        "descrizione_dettagliata": "Come funzionano pannelli solari, turbine eoliche e accumulatori, e quali sfide restano per la transizione energetica.",
        "requisiti": "",
        "categoria": "Scienze e Ingegneria",
        "dipartimento": "Scienze e Metodi dell'Ingegneria",
        "durata": 120,
        "modalita": ["In presenza"],
        "anni": [4, 5],
        "limite_prenotazioni": 8,
        "video": None,
        "disponibilita": [
            {"id": 23, "data": "2027-01-14", "fasceOrarie": [
                fascia(33, "09:00", prenotazione(14, "Istituto Tecnico Fermi", 23)),
                fascia(34, "14:00")
            ]}
        ]
    }
]


# "data" è il giorno in cui si è svolto il seminario recensito
RECENSIONI = [
    # Intelligenza artificiale
    {"id": 1, "idSeminario": 1, "scuola": "Liceo Scientifico Aldo Moro", "voto": 5, "data": "2025-03-14",
     "testo": "Seminario molto interessante e ben organizzato. Gli studenti hanno apprezzato particolarmente gli esempi pratici."},
    {"id": 2, "idSeminario": 1, "scuola": "Istituto Tecnico Blaise Pascal", "voto": 4, "data": "2025-05-09",
     "testo": "Un'esperienza formativa interessante, che ha permesso di approfondire argomenti affrontati durante le lezioni."},
    {"id": 3, "idSeminario": 1, "scuola": "Liceo delle Scienze Applicate", "voto": 5, "data": "2025-11-10",
     "testo": "Relatore molto preparato e contenuti spiegati in modo chiaro e coinvolgente."},
    {"id": 4, "idSeminario": 1, "scuola": "Istituto Tecnico Fermi", "voto": 4, "data": "2026-04-22",
     "testo": "Bel seminario, forse un po' lungo per le classi terze."},

    # Robotica
    {"id": 5, "idSeminario": 2, "scuola": "Istituto Tecnico Einaudi", "voto": 4, "data": "2025-02-18",
     "testo": "Le dimostrazioni con i robot hanno catturato l'attenzione di tutta la classe."},
    {"id": 6, "idSeminario": 2, "scuola": "Liceo Scientifico Aldo Moro", "voto": 5, "data": "2025-10-21",
     "testo": "Ottimo equilibrio tra teoria e pratica."},
    {"id": 7, "idSeminario": 2, "scuola": "Liceo Classico Ariosto", "voto": 4, "data": "2026-05-11",
     "testo": "Interessante anche per studenti senza basi tecniche."},

    # Sicurezza informatica
    {"id": 8, "idSeminario": 3, "scuola": "Istituto Professionale Galvani", "voto": 5, "data": "2025-04-03",
     "testo": "Argomento attualissimo, gli studenti hanno fatto moltissime domande."},
    {"id": 9, "idSeminario": 3, "scuola": "Istituto Tecnico Fermi", "voto": 5, "data": "2026-01-15",
     "testo": "Consigli pratici utili per la vita di tutti i giorni."},
    {"id": 10, "idSeminario": 3, "scuola": "Istituto Tecnico Blaise Pascal", "voto": 4, "data": "2026-03-20",
     "testo": "Chiaro ed esauriente."},
    {"id": 11, "idSeminario": 3, "scuola": "Istituto Tecnico Einaudi", "voto": 5, "data": "2026-11-10",
     "testo": "Esempi concreti e molto coinvolgenti."},
    {"id": 12, "idSeminario": 3, "scuola": "Liceo Scientifico Aldo Moro", "voto": 4, "data": "2026-11-10",
     "testo": "Molto utile, avremmo voluto più tempo per le domande."},

    # Introduzione alla programmazione
    {"id": 13, "idSeminario": 4, "scuola": "Istituto Tecnico Fermi", "voto": 5, "data": "2026-10-14",
     "testo": "Perfetto per avvicinare i ragazzi alla programmazione."},

    # Sostenibilità e cambiamento climatico
    {"id": 14, "idSeminario": 5, "scuola": "Liceo Classico Ariosto", "voto": 4, "data": "2026-02-11",
     "testo": "Dati aggiornati e spunti di riflessione per tutta la classe."},
    {"id": 15, "idSeminario": 5, "scuola": "Liceo delle Scienze Applicate", "voto": 5, "data": "2026-10-16",
     "testo": "La relatrice ha saputo coinvolgere tutti gli studenti."},

    # Il mondo dei quanti
    {"id": 16, "idSeminario": 7, "scuola": "Istituto Tecnico Blaise Pascal", "voto": 5, "data": "2026-03-03",
     "testo": "Argomenti difficili spiegati in modo semplice."},

    # Economia e risparmio
    {"id": 17, "idSeminario": 10, "scuola": "Istituto Tecnico Blaise Pascal", "voto": 4, "data": "2026-09-29",
     "testo": "Utile e concreto."},
    {"id": 18, "idSeminario": 10, "scuola": "Liceo Classico Ariosto", "voto": 5, "data": "2026-11-12",
     "testo": "Gli studenti hanno chiesto di approfondire l'argomento."},

    # Il cervello e le neuroscienze
    {"id": 19, "idSeminario": 12, "scuola": "Istituto Tecnico Einaudi", "voto": 5, "data": "2026-04-15",
     "testo": "Affascinante, con molti collegamenti al metodo di studio."},

    # Primo soccorso e salute
    {"id": 20, "idSeminario": 13, "scuola": "Liceo delle Scienze Applicate", "voto": 4, "data": "2026-11-03",
     "testo": "Molto pratico, le simulazioni sono state la parte migliore."}
]


# Carrello della scuola collegata: prenotazioni ancora da confermare
CARRELLO = [
    {"id": 101, "idSeminario": 9, "data": "2026-12-16", "oraInizio": "10:00", "numeroStudenti": 25, "modalita": "In presenza"},
    {"id": 102, "idSeminario": 12, "data": "2027-01-20", "oraInizio": "09:00", "numeroStudenti": 22, "modalita": "In presenza"},
    {"id": 103, "idSeminario": 8, "data": "2026-12-03", "oraInizio": "14:00", "numeroStudenti": 20, "modalita": "A distanza"}
]


PROPOSTE = [
    {
        "id": 1,
        "scuola": "Istituto Tecnico Blaise Pascal",
        "testo": "Sarebbe interessante approfondire il tema della cybersecurity.",
        "data": "2026-11-20"
    },
    {
        "id": 2,
        "scuola": "Liceo Scientifico Aldo Moro",
        "testo": "Proponiamo un seminario dedicato all'intelligenza artificiale.",
        "data": "2026-11-22"
    }
]


# Funzioni di utilità

def calcola_fine(data, ora_inizio, durata):
    inizio = datetime.strptime(f"{data} {ora_inizio}", "%Y-%m-%d %H:%M")
    return inizio + timedelta(minutes=durata)


def calcola_stato_seminario(seminario, adesso):
    ha_prenotazioni_future = False
    ha_disponibilita_future = False

    for disponibilita in seminario["disponibilita"]:
        for fascia_oraria in disponibilita["fasceOrarie"]:
            fine = calcola_fine(disponibilita["data"], fascia_oraria["oraInizio"], seminario["durata"])

            # Una prenotazione disdetta libera la fascia
            prenotazione_fascia = fascia_oraria["prenotazione"]
            occupata = prenotazione_fascia is not None and not prenotazione_fascia.get("disdetta", False)

            if fine > adesso:
                if occupata:
                    ha_prenotazioni_future = True
                else:
                    ha_disponibilita_future = True

    if ha_prenotazioni_future:
        return "Prenotato"

    if ha_disponibilita_future:
        return "Pubblicato"

    return "Concluso"


def trova_seminario(id_seminario):
    return next((s for s in SEMINARI if s["id"] == id_seminario), None)


def trova_docente(id_docente):
    return next((d for d in DOCENTI if d["id"] == id_docente), None)


def recensioni_seminario(id_seminario):
    return [r for r in RECENSIONI if r["idSeminario"] == id_seminario]


# Aggiunge al seminario i dati calcolati: docente, recensioni, media e stato
def componi_seminario(seminario, adesso):
    docente = trova_docente(seminario["idDocente"])
    recensioni = recensioni_seminario(seminario["id"])
    voti = [r["voto"] for r in recensioni]

    return {
        **seminario,
        "docente": docente["nome"],
        "email": docente["email"],
        "mediaRecensioni": round(sum(voti) / len(voti), 1) if voti else 0,
        "numeroRecensioni": len(voti),
        "recensioni": recensioni,
        "stato": calcola_stato_seminario(seminario, adesso)
    }


# Dati della card di un seminario nell'elenco
def riassumi_seminario(seminario, adesso):
    completo = componi_seminario(seminario, adesso)

    return {
        "id": completo["id"],
        "titolo": completo["titolo"],
        "descrizione": completo["descrizione_breve"],
        "categoria": completo["categoria"],
        "dipartimento": completo["dipartimento"],
        "mediaRecensioni": completo["mediaRecensioni"],
        "numeroRecensioni": completo["numeroRecensioni"],
        "stato": completo["stato"]
    }


# Prenotazioni della scuola collegata: quelle nel carrello e quelle già confermate
def prenotazioni_scuola(scuola, adesso):
    risultato = []

    for elemento in CARRELLO:
        seminario = trova_seminario(elemento["idSeminario"])

        risultato.append({
            "id": elemento["id"],
            "idSeminario": seminario["id"],
            "titolo": seminario["titolo"],
            "dipartimento": seminario["dipartimento"],
            "data": elemento["data"],
            "oraInizio": elemento["oraInizio"],
            "durata": seminario["durata"],
            "numeroStudenti": elemento["numeroStudenti"],
            "modalita": elemento["modalita"],
            "modalitaDisponibili": seminario["modalita"],
            "disponibilita": seminario["disponibilita"],
            "stato": "Da confermare",
            "recensione": None
        })

    for seminario in SEMINARI:
        for disponibilita in seminario["disponibilita"]:
            for fascia_oraria in disponibilita["fasceOrarie"]:
                prenotazione_fascia = fascia_oraria["prenotazione"]

                if (
                    prenotazione_fascia is None
                    or prenotazione_fascia["scuola"] != scuola
                    or prenotazione_fascia["disdetta"]
                ):
                    continue

                fine = calcola_fine(disponibilita["data"], fascia_oraria["oraInizio"], seminario["durata"])

                recensione = next(
                    (
                        {"voto": r["voto"], "testo": r["testo"]}
                        for r in recensioni_seminario(seminario["id"])
                        if r["scuola"] == scuola and r["data"] == disponibilita["data"]
                    ),
                    None
                )

                risultato.append({
                    "id": prenotazione_fascia["id"],
                    "idSeminario": seminario["id"],
                    "titolo": seminario["titolo"],
                    "dipartimento": seminario["dipartimento"],
                    "data": disponibilita["data"],
                    "oraInizio": fascia_oraria["oraInizio"],
                    "durata": seminario["durata"],
                    "numeroStudenti": prenotazione_fascia["numeroStudenti"],
                    "modalita": prenotazione_fascia["modalita"],
                    "stato": "Concluso" if fine <= adesso else "Da svolgere",
                    "recensione": recensione
                })

    return risultato


# Endpoint

@api_bp.get("/utente")
def utente():
    # Il frontend indica nell'header X-Ruolo il ruolo scelto con il selettore
    return jsonify(UTENTI.get(request.headers.get("X-Ruolo"), UTENTE))


@api_bp.get("/impostazioni")
def impostazioni():
    return jsonify(IMPOSTAZIONI)


@api_bp.get("/categorie")
def categorie():
    return jsonify(CATEGORIE)


@api_bp.get("/dipartimenti")
def dipartimenti():
    return jsonify(DIPARTIMENTI)


@api_bp.get("/stati-seminari")
def stati_seminari():
    return jsonify(STATI_SEMINARI)


@api_bp.get("/stati-prenotazioni")
def stati_prenotazioni():
    return jsonify(STATI_PRENOTAZIONI)


@api_bp.get("/modalita-seminario")
def modalita_seminario():
    return jsonify(MODALITA_SEMINARIO)


@api_bp.get("/seminari")
def seminari():
    adesso = datetime.now()

    return jsonify([riassumi_seminario(seminario, adesso) for seminario in SEMINARI])


@api_bp.get("/seminari/<int:id_seminario>")
def dettagli_seminario(id_seminario):
    seminario = trova_seminario(id_seminario)

    if seminario is None:
        return jsonify({"errore": "Seminario non trovato"}), 404

    return jsonify(componi_seminario(seminario, datetime.now()))


@api_bp.get("/prenotazioni")
def prenotazioni():
    return jsonify(prenotazioni_scuola(UTENTE_SCUOLA["nome"], datetime.now()))


@api_bp.get("/miei-seminari")
def miei_seminari():
    adesso = datetime.now()

    return jsonify([
        componi_seminario(seminario, adesso)
        for seminario in SEMINARI
        if seminario["idDocente"] == UTENTE_DOCENTE["id"]
    ])


@api_bp.get("/recensioni")
def recensioni():
    return jsonify(RECENSIONI)


@api_bp.get("/proposte")
def proposte():
    return jsonify(PROPOSTE)
