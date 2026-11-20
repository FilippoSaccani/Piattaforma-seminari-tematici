
import { useState, useEffect } from "react";

function GestioneVideo({ video, setVideo }) {
    const [anteprima, setAnteprima] = useState("");

    useEffect(() => {
        if (!video) {
            setAnteprima("");
            return;
        }

        const url = URL.createObjectURL(video);
        setAnteprima(url);

        return () => URL.revokeObjectURL(url);
    }, [video]);

    function selezionaVideo(event) {
        const file = event.target.files[0];

        if (!file) {
            return;
        }

        const formatiValidi = ["video/mp4", "video/webm"];

        if (!formatiValidi.includes(file.type)) {
            alert("Seleziona un video in formato MP4 o WebM.");
            event.target.value = "";
            return;
        }

        if (file.size > 100 * 1024 * 1024) {
            alert("Il video non può superare i 100 MB.");
            event.target.value = "";
            return;
        }

        setVideo(file);
        event.target.value = "";
    }

    function rimuoviVideo() {
        setVideo(null);
    }

    function formattaDimensione(dimensione) {
        return (dimensione / (1024 * 1024)).toFixed(2) + " MB";
    }

    return (
        <div className="flex-column gap-1">

            <div className="flex-column gap-05">
                <p>Video del seminario</p>

                <p className="info-label">
                    Aggiungi un video di presentazione del seminario.
                    Il caricamento avverrà al salvataggio.
                </p>
            </div>

            {video ? (

                <div className="video-preview-container">

                    <video
                        src={anteprima}
                        controls
                        className="video-preview"
                    />

                    <div className="flex-between flex-align-center gap-1">
                        <div className="flex-column gap-05">
                            <p className="video-file-name">
                                {video.name}
                            </p>

                            <p className="info-label">
                                {formattaDimensione(video.size)}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={rimuoviVideo}
                            className="background-red color-cream padding-05 rounded hover pointer"
                        >
                            Rimuovi
                        </button>
                    </div>

                    <label className="video-change-button">
                        Sostituisci video
                        <input
                            type="file"
                            accept="video/mp4,video/webm"
                            onChange={selezionaVideo}
                            hidden
                        />
                    </label>

                </div>

            ) : (

                <label className="video-upload-area">

                    <i className="fa-solid fa-cloud-arrow-up video-upload-icon"></i>

                    <span className="video-upload-title">
                        Seleziona un video
                    </span>

                    <span className="info-label">
                        MP4 o WebM · Massimo 100 MB
                    </span>

                    <input
                        type="file"
                        accept="video/mp4,video/webm"
                        onChange={selezionaVideo}
                        hidden
                    />

                </label>

            )}

            <p className="info-label">
                Un solo video per seminario.
            </p>

        </div>
    );
}

export default GestioneVideo;
