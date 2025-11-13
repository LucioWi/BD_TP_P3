// ShowAMBCMovies: definida en este archivo por solicitud del autor.
// Reemplaza el contenedor de soporte por el partial movies.html
(function () {
    function showMovies() {
        const url = "./routes/progra/support/movies.html";

        const container =
            document.querySelector(".support-containter") ||
            document.querySelector(".support-container") ||
            document.querySelector(".progra-support");

        if (!container) {
            console.warn(
                "ShowAMBCMovies: contenedor de soporte no encontrado."
            );
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
                container.innerHTML = "<p>Error al cargar las películas.</p>";
            });
    }

    // Exponer la función globalmente con el nombre requerido por el onclick
    window.ShowAMBCMovies = showMovies;
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
                container.innerHTML =
                    "<p>Error al cargar la vista de soporte.</p>";
            });
    }

    // Exponer la función globalmente con el nombre ShowAMBCBack
    window.ShowAMBCBack = showSupport;
})();

//Importar API para GET: api/peliculas

(function () {
    const API_MOVIES_URL = "http://localhost:5256/api/Pelicula";

    async function fetchMovies() {
        try {
            const response = await fetch(API_MOVIES_URL, {
                method: "GET",
                headers: { Accept: "application/json" },
            });
            if (!response.ok)
                throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error("Error fetching movies:", error);
            return [];
        }
    }

    function normalizeValue(val) {
        if (val === null || val === undefined) return "";
        if (typeof val === "object") return JSON.stringify(val);
        return String(val);
    }

    // Renderizar la lista de películas en el contenedor .movies-get
    function renderMoviesList(movies) {
        const container = document.querySelector(".movies-get");
        if (!container) return;

        if (!Array.isArray(movies) || movies.length === 0) {
            container.innerHTML = "<p>No hay películas para mostrar.</p>";
            return;
        }

        container.innerHTML = "";
        const frag = document.createDocumentFragment();

        movies.forEach((movie) => {
            // --- Card ---
            const card = document.createElement("div");
            card.className = "card-get-movies";
            card.style.width = "18rem";

            // --- Header (título) ---
            const titleKey = ["titulo"].find((k) => k in movie);
            const header = document.createElement("div");
            header.className = "card-header";
            header.textContent = titleKey
                ? normalizeValue(movie[titleKey])
                : "Película";
            card.appendChild(header);

            // --- List group ---
            const ul = document.createElement("ul");
            ul.className = "list-group list-group-flush";

            // Propiedades a mostrar
            const displayProps = [
                { key: "formatoNombre", label: "Formato" },
                { key: "duracionMin", label: "Duración" },
                { key: "clasificacionNombre", label: "Clasificación" },
                { key: "generos", label: "Género" },
            ];

            displayProps.forEach(({ key, label }) => {
                if (!(key in movie)) return;

                let value = movie[key];

                // Arrays (géneros) → "A, B, C"
                if (Array.isArray(value)) value = value.join(", ");

                // Duración → "NN min"
                if (key === "duracionMin") value = `${value} min`;

                const li = document.createElement("li");
                li.className = "list-group-item";
                li.textContent = `${label}: ${normalizeValue(value)}`;
                ul.appendChild(li);
            });

            card.appendChild(ul);
            frag.appendChild(card);
        });

        container.appendChild(frag);
    }

    async function loadAndRenderMovies() {
        const container = document.querySelector(".movies-get");
        if (container) container.innerHTML = "<p>Cargando...</p>";
        const movies = await fetchMovies();
        renderMoviesList(movies);
    }

    function observeAndRender() {
        if (document.querySelector(".movies-get")) {
            loadAndRenderMovies();
            return;
        }
        const obs = new MutationObserver(() => {
            if (document.querySelector(".movies-get")) {
                obs.disconnect();
                loadAndRenderMovies();
            }
        });
        obs.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", observeAndRender, {
            once: true,
        });
    } else {
        observeAndRender();
    }

    
    window.fetchMovies = fetchMovies;
    window.renderMoviesList = renderMoviesList;
    window.loadAndRenderMovies = loadAndRenderMovies;
})();
