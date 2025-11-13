// ShowAMBCMovies: definida en este archivo por solicitud del autor.
// Reemplaza el contenedor de soporte por el partial movies.html
(function () {
    function showTickets() {
        const url = "./routes/progra/support/tickets.html";

        const container =
            document.querySelector(".support-containter") ||
            document.querySelector(".support-container") ||
            document.querySelector(".progra-support");

        if (!container) {
            console.warn("ShowAMBCMovies: contenedor de soporte no encontrado.");
            return;
        }

        container.innerHTML = "<p>Cargando...</p>";

        fetch(url, { cache: "no-store" })
            .then((res) => {
                if (!res.ok) throw new Error(res.status + " " + res.statusText);
                return res.text();
            })
            .then((html) => {
                container.innerHTML = html;
            })
            .catch((err) => {
                console.error("Error cargando", url, err);
                container.innerHTML = "<p>Error al cargar los tickets.</p>";
            });
    }

    // Exponer la función globalmente con el nombre requerido por el onclick
    window.ShowAMBCTickets = showTickets;
})();

// Función para volver al partial de soporte (support.html)
(function () {
    function showSupport() {
        const url = "./routes/progra/support.html";

        const container =
            document.querySelector(".support-containter") ||
            document.querySelector(".support-container") ||
            document.querySelector(".progra-support");

        if (!container) {
            console.warn("ShowAMBCBack: contenedor de soporte no encontrado.");
            return;
        }

        container.innerHTML = "<p>Cargando...</p>";

        fetch(url, { cache: "no-store" })
            .then((res) => {
                if (!res.ok) throw new Error(res.status + " " + res.statusText);
                return res.text();
            })
            .then((html) => {
                container.innerHTML = html;
            })
            .catch((err) => {
                console.error("Error cargando", url, err);
                container.innerHTML = "<p>Error al cargar la vista de soporte.</p>";
            });
    }

    // Exponer la función globalmente con el nombre ShowAMBCBack
    window.ShowAMBCBack = showSupport;
})();




