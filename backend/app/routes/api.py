from flask import Blueprint, jsonify

api_bp = Blueprint("api", __name__)


# Dati temporanei, in attesa del database

UTENTE = {
    "ruolo": "Docente",
    "nome": "Marco Rossi",
    "email": "marco.rossi@unimore.it"
}

CATEGORIE = [
    "Scienze e Ingegneria",
    "Medicina e Vita",
    "Società e Cultura"
]

DIPARTIMENTI = [
    "DIEF",
    "Scienze e Metodi dell'Ingegneria",
    "Scienze fisiche, informatiche e matematiche",
    "Scienze chimiche e geologiche"
]

SEMINARI = [
    {
        "id": 1,
        "titolo": "Intelligenza artificiale",
        "descrizione": "Introduzione alle nuove tecnologie e alle applicazioni dell'intelligenza artificiale.",
        "categoria": "Scienze e Ingegneria",
        "dipartimento": "DIEF",
        "mediaRecensioni": 4.5,
        "numeroRecensioni": 10
    },
    {
        "id": 2,
        "titolo": "Robotica",
        "descrizione": "Alla scoperta dei robot e dei sistemi automatizzati.",
        "categoria": "Scienze e Ingegneria",
        "dipartimento": "Scienze e Metodi dell'Ingegneria",
        "mediaRecensioni": 4.2,
        "numeroRecensioni": 8
    },
    {
        "id": 3,
        "titolo": "Sostenibilità",
        "descrizione": "Le sfide ambientali e le possibili soluzioni.",
        "categoria": "Società e Cultura",
        "dipartimento": "Scienze chimiche e geologiche",
        "mediaRecensioni": 0,
        "numeroRecensioni": 0
    }
]

DETTAGLI_SEMINARIO = {
    "id": 1,
    "docente": "Prof. Marco Rossi",
    "email": "marco.rossi@unimore.it",
    "dipartimento": "Dipartimento di Ingegneria Enzo Ferrari",
    "categoria": "Scienze e Ingegneria",
    "titolo": "Intelligenza artificiale: applicazioni e prospettive future",
    "descrizione_breve": "Un seminario dedicato alla scoperta dell'intelligenza artificiale e delle sue principali applicazioni.",
    "descrizione_dettagliata": "Un seminario dedicato alla scoperta dell'intelligenza artificiale, delle sue principali applicazioni e delle prospettive di sviluppo.\n\nNon sono richieste conoscenze pregresse di programmazione.",
    "requisiti": "",
    "durata": 120,
    "modalita": ["In presenza"],
    "anni": [3, 4, 5],
    "limite_prenotazioni": 10,
    "video": "/video/intelligenza-artificiale.mp4",

    "disponibilita": [
        {
            "data": "2026-12-15",
            "fasceOrarie": [
                {
                    "oraInizio": "09:00",
                    "prenotazione": None
                },
                {
                    "oraInizio": "14:00",
                    "prenotazione": {
                        "id": 1,
                        "scuola": "Liceo Scientifico Aldo Moro",
                        "numeroStudenti": 25
                    }
                }
            ]
        },
        {
            "data": "2026-12-17",
            "fasceOrarie": [
                {
                    "oraInizio": "10:00",
                    "prenotazione": None
                }
            ]
        },
        {
            "data": "2026-12-18",
            "fasceOrarie": [
                {
                    "oraInizio": "09:00",
                    "prenotazione": None
                }
            ]
        }
    ],

    "mediaRecensioni": 4.7,
    "numeroRecensioni": 3,

    "recensioni": [
        {
            "id": 1,
            "scuola": "Liceo Scientifico Aldo Moro",
            "voto": 5,
            "testo": "Seminario molto interessante e ben organizzato. Gli studenti hanno apprezzato particolarmente gli esempi pratici.",
            "anno": 2026
        },
        {
            "id": 2,
            "scuola": "Istituto Tecnico Blaise Pascal",
            "voto": 4,
            "testo": "Un'esperienza formativa interessante, che ha permesso di approfondire argomenti affrontati durante le lezioni.",
            "anno": 2025
        },
        {
            "id": 3,
            "scuola": "Liceo delle Scienze Applicate",
            "voto": 5,
            "testo": "Relatore molto preparato e contenuti spiegati in modo chiaro e coinvolgente.",
            "anno": 2025
        }
    ]
}

PRENOTAZIONI = [
    {
        "id": 1,
        "titolo": "Intelligenza artificiale e robotica",
        "dipartimento": "Dipartimento di Ingegneria Enzo Ferrari",
        "data": "2026-11-20",
        "oraInizio": "10:00",
        "durata": 120,
        "numeroStudenti": 25,
        "modalita": "In presenza",
        "modalitaDisponibili": ["In presenza", "A distanza"],
        "disponibilita": [
            {
                "data": "2026-12-15",
                "fasceOrarie": [
                    {"oraInizio": "09:00", "prenotazione": None},
                    {"oraInizio": "14:00", "prenotazione": None}
                ]
            },
            {
                "data": "2026-12-17",
                "fasceOrarie": [
                    {"oraInizio": "10:00", "prenotazione": None}
                ]
            },
            {
                "data": "2026-12-18",
                "fasceOrarie": [
                    {"oraInizio": "09:00", "prenotazione": None}
                ]
            }
        ],
        "stato": "Da confermare",
        "recensione": None
    },
    {
        "id": 2,
        "titolo": "Cybersecurity e protezione dei dati",
        "dipartimento": "Dipartimento di Scienze e Metodi dell'Ingegneria",
        "data": "2026-11-25",
        "oraInizio": "14:00",
        "durata": 120,
        "numeroStudenti": 20,
        "modalita": "In presenza",
        "modalitaDisponibili": ["In presenza", "A distanza"],
        "disponibilita": [
            {
                "data": "2026-12-20",
                "fasceOrarie": [
                    {"oraInizio": "09:00", "prenotazione": None},
                    {"oraInizio": "14:00", "prenotazione": None}
                ]
            },
            {
                "data": "2026-12-17",
                "fasceOrarie": [
                    {"oraInizio": "10:00", "prenotazione": None}
                ]
            },
            {
                "data": "2026-12-18",
                "fasceOrarie": [
                    {"oraInizio": "09:00", "prenotazione": None}
                ]
            }
        ],
        "stato": "Da confermare",
        "recensione": None
    },
    {
        "id": 3,
        "titolo": "Sviluppo di applicazioni web",
        "dipartimento": "Dipartimento di Ingegneria Enzo Ferrari",
        "data": "2026-11-28",
        "oraInizio": "09:00",
        "durata": 120,
        "numeroStudenti": 30,
        "modalita": "A distanza",
        "modalitaDisponibili": ["A distanza"],
        "disponibilita": [
            {
                "data": "2026-12-15",
                "fasceOrarie": [
                    {"oraInizio": "09:00", "prenotazione": None},
                    {"oraInizio": "14:00", "prenotazione": None}
                ]
            },
            {
                "data": "2026-12-17",
                "fasceOrarie": [
                    {"oraInizio": "10:00", "prenotazione": None}
                ]
            },
            {
                "data": "2026-12-18",
                "fasceOrarie": [
                    {"oraInizio": "09:00", "prenotazione": None}
                ]
            }
        ],
        "stato": "Da confermare",
        "recensione": None
    },
    {
        "id": 4,
        "titolo": "La transizione energetica",
        "dipartimento": "Dipartimento di Scienze Fisiche, Informatiche e Matematiche",
        "data": "2026-11-10",
        "oraInizio": "09:00",
        "durata": 120,
        "numeroStudenti": 22,
        "modalita": "In presenza",
        "stato": "Da svolgere",
        "recensione": None
    },
    {
        "id": 5,
        "titolo": "Comunicazione e social media",
        "dipartimento": "Dipartimento di Comunicazione ed Economia",
        "data": "2026-11-05",
        "oraInizio": "14:00",
        "durata": 120,
        "numeroStudenti": 18,
        "modalita": "A distanza",
        "stato": "Da svolgere",
        "recensione": None
    },
    {
        "id": 6,
        "titolo": "Seminario di sostenibilità",
        "dipartimento": "Dipartimento di Scienze e Metodi dell'Ingegneria",
        "data": "2026-10-05",
        "oraInizio": "10:00",
        "durata": 120,
        "numeroStudenti": 20,
        "modalita": "In presenza",
        "stato": "Concluso",
        "recensione": None
    }
]

MIEI_SEMINARI = [
    {
        "id": 1,
        "docente": "Marco Rossi",
        "email": "marco.rossi@unimore.it",
        "dipartimento": "DIEF",
        "categoria": "Scienze e Ingegneria",
        "titolo": "Intelligenza artificiale",
        "descrizione_breve": "Introduzione alle nuove tecnologie e alle applicazioni dell'intelligenza artificiale.",
        "descrizione_dettagliata": "Un approfondimento sulle tecnologie di intelligenza artificiale, sui principali algoritmi e sulle loro applicazioni nella vita quotidiana e nel mondo del lavoro.",
        "requisiti": "",
        "durata": 120,
        "modalita": ["In presenza"],
        "anni": [3, 4, 5],
        "limite_prenotazioni": 10,
        "video": None,
        "mediaRecensioni": 4.5,
        "numeroRecensioni": 10,
        "disponibilita": [
            {
                "data": "2026-12-15",
                "fasceOrarie": [
                    {
                        "oraInizio": "09:00",
                        "prenotazione": {
                            "id": 1,
                            "scuola": "Liceo Scientifico Aldo Moro",
                            "numeroStudenti": 25
                        }
                    },
                    {
                        "oraInizio": "14:00",
                        "prenotazione": None
                    }
                ]
            },
            {
                "data": "2026-12-17",
                "fasceOrarie": [
                    {
                        "oraInizio": "10:00",
                        "prenotazione": {
                            "id": 2,
                            "scuola": "Istituto Blaise Pascal",
                            "numeroStudenti": 20
                        }
                    }
                ]
            }
        ]
    },
    {
        "id": 2,
        "docente": "Marco Rossi",
        "email": "marco.rossi@unimore.it",
        "dipartimento": "Scienze e Metodi dell'Ingegneria",
        "categoria": "Scienze e Ingegneria",
        "titolo": "Robotica",
        "descrizione_breve": "Alla scoperta dei robot e dei sistemi automatizzati.",
        "descrizione_dettagliata": "Un viaggio nel mondo della robotica, dai componenti fondamentali dei robot ai sistemi automatizzati e alle loro applicazioni industriali.",
        "requisiti": "",
        "durata": 120,
        "modalita": ["In presenza"],
        "anni": [3, 4, 5],
        "limite_prenotazioni": 10,
        "video": None,
        "mediaRecensioni": 4.2,
        "numeroRecensioni": 8,
        "disponibilita": [
            {
                "data": "2026-10-10",
                "fasceOrarie": [
                    {
                        "oraInizio": "09:00",
                        "prenotazione": {
                            "id": 3,
                            "scuola": "Istituto Tecnico Fermi",
                            "numeroStudenti": 22
                        }
                    }
                ]
            },
            {
                "data": "2026-12-20",
                "fasceOrarie": [
                    {
                        "oraInizio": "14:00",
                        "prenotazione": None
                    }
                ]
            }
        ]
    },
    {
        "id": 3,
        "docente": "Marco Rossi",
        "email": "marco.rossi@unimore.it",
        "dipartimento": "Scienze chimiche e geologiche",
        "categoria": "Società e Cultura",
        "titolo": "Sostenibilità",
        "descrizione_breve": "Le sfide ambientali e le possibili soluzioni.",
        "descrizione_dettagliata": "Un'analisi delle principali sfide ambientali contemporanee e delle soluzioni tecnologiche e sociali per promuovere uno sviluppo sostenibile.",
        "requisiti": "",
        "durata": 120,
        "modalita": ["In presenza"],
        "anni": [3, 4, 5],
        "limite_prenotazioni": 10,
        "video": None,
        "mediaRecensioni": 0,
        "numeroRecensioni": 0,
        "disponibilita": [
            {
                "data": "2026-12-18",
                "fasceOrarie": [
                    {
                        "oraInizio": "09:00",
                        "prenotazione": None
                    },
                    {
                        "oraInizio": "14:00",
                        "prenotazione": None
                    }
                ]
            }
        ]
    },
    {
        "id": 4,
        "docente": "Marco Rossi",
        "email": "marco.rossi@unimore.it",
        "dipartimento": "DIEF",
        "categoria": "Scienze e Ingegneria",
        "titolo": "Sicurezza informatica",
        "descrizione_breve": "I principali rischi informatici e le tecniche per proteggere dati e sistemi.",
        "descrizione_dettagliata": "Un'introduzione alle minacce informatiche, alle vulnerabilità dei sistemi e alle principali tecniche utilizzate per proteggere informazioni e infrastrutture digitali.",
        "requisiti": "",
        "durata": 120,
        "modalita": ["In presenza"],
        "anni": [3, 4, 5],
        "limite_prenotazioni": 10,
        "video": None,
        "mediaRecensioni": 4.8,
        "numeroRecensioni": 5,
        "disponibilita": [
            {
                "data": "2026-11-10",
                "fasceOrarie": [
                    {
                        "oraInizio": "09:00",
                        "prenotazione": {
                            "id": 4,
                            "scuola": "Istituto Tecnico Einaudi",
                            "numeroStudenti": 24
                        }
                    },
                    {
                        "oraInizio": "14:00",
                        "prenotazione": {
                            "id": 5,
                            "scuola": "Liceo Scientifico Aldo Moro",
                            "numeroStudenti": 20
                        }
                    }
                ]
            }
        ]
    }
]


# Endpoint

@api_bp.get("/utente")
def utente():
    return jsonify(UTENTE)


@api_bp.get("/categorie")
def categorie():
    return jsonify(CATEGORIE)


@api_bp.get("/dipartimenti")
def dipartimenti():
    return jsonify(DIPARTIMENTI)


@api_bp.get("/seminari")
def seminari():
    return jsonify(SEMINARI)


@api_bp.get("/seminari/<int:id_seminario>")
def dettagli_seminario(id_seminario):
    # Per ora esiste un solo seminario di esempio, restituito per qualsiasi id
    return jsonify(DETTAGLI_SEMINARIO)


@api_bp.get("/prenotazioni")
def prenotazioni():
    return jsonify(PRENOTAZIONI)


@api_bp.get("/miei-seminari")
def miei_seminari():
    return jsonify(MIEI_SEMINARI)
