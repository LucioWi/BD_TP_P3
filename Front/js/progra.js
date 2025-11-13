// ~~~~~| Carga y gestión de pestañas en sección de Programación |~~~~~

const PROGRA = {
    introUrl: "./routes/progra/introProgra.html",
    loadedOnce: false,
};

// Carga un parcial dentro de .progra-main
function changueTab(url, className) {
    const container = document.querySelector(className);
    if (!container) return console.warn(className + " no encontrado");

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
            container.innerHTML = "<p>Error al cargar el contenido.</p>";
        });
}

// Marca activo el botón clickeado
// document.addEventListener("click", (e) => {
//     const btn = e.target.closest(".btn-progra");
//     if (!btn) return;

//     document
//         .querySelectorAll(".btn-progra.active")
//         .forEach((el) => el.classList.remove("active"));
//     btn.classList.add("active");

//     // Si el botón trae la URL en el onclick (tu formato actual)
//     const onclick = btn.getAttribute("onclick") || "";

//     // Si el onclick invoca changueSubTab, NO interceptamos aquí —
//     // dejamos que el inline handler (o la función global) se ejecute
//     // porque changueSubTab gestiona un contenedor interno.
//     if (onclick.includes("changueSubTab(")) return;

//     const match = onclick ? onclick.match(/'(.*?)'/) : null;
//     const url = match ? match[1] : btn.dataset.url;

//     if (url) {
//         e.preventDefault();
//         changueTab(url);
//     }
// });

// Carga inicial: espera a que aparezca .progra-main y carga Intro una sola vez
// function tryLoadIntroOnce() {
//     if (PROGRA.loadedOnce) return;
//     const container = document.querySelector(".progra-main");
//     if (container) {
//         PROGRA.loadedOnce = true;
//         // Setea “Introducción” como active si existe ese botón
//         const introBtn =
//             document.querySelector(
//                 '.btn-progra[id="intro-tab"], .btn-progra[data-section="intro"]'
//             ) || document.querySelector(".btn-progra");
//         if (introBtn) {
//             document
//                 .querySelectorAll(".btn-progra.active")
//                 .forEach((el) => el.classList.remove("active"));
//             introBtn.classList.add("active");
//         }
//         changueTab(PROGRA.introUrl);
//         return true;
//     }
//     return false;
// }

// Observa el #app (o body) para detectar cuando se inserta section1.html → .progra-main
// document.addEventListener("DOMContentLoaded", () => {
//     if (tryLoadIntroOnce()) return;

//     const root = document.getElementById("app") || document.body;
//     const obs = new MutationObserver(() => {
//         if (tryLoadIntroOnce()) obs.disconnect();
//     });
//     obs.observe(root, { childList: true, subtree: true });
// });

// (opcional) Exponer para depuración
window.changueTab = changueTab;


window.changueTab = changueTab;

// Función genérica para cargar un partial dentro de un contenedor dado
function changueSubTab(url, containerSelector) {
    if (!url) return console.warn("changueSubTab: falta la URL");

    const sel = containerSelector;
    const container = document.querySelector(sel);
    if (!container) return console.warn(`changueSubTab: contenedor "${sel}" no encontrado`);

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
            container.innerHTML = "<p>Error al cargar el contenido.</p>";
        });
}

// Exponer globalmente para los onclick inline en los partials
window.changueSubTab = changueSubTab;

// Intentamos cargar el script de soporte de Películas para que
// la función `ShowAMBCMovies` esté definida dentro de `movies.js`.
(function loadSupportMoviesScript() {
    const scriptPath = "./routes/progra/support/movies.js";
    if (document.querySelector('script[data-support-movies]')) return;
    const s = document.createElement("script");
    s.src = scriptPath;
    s.defer = true;
    s.setAttribute("data-support-movies", "1");
    s.onerror = function () {
        console.warn("No se pudo cargar el script:", scriptPath);
    };
    document.head.appendChild(s);
})();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


(function loadSupportTicketsScript() {
    const scriptPath = "./routes/progra/support/tickets.js";
    if (document.querySelector('script[data-support-tickets]')) return;
    const s = document.createElement("script");
    s.src = scriptPath;
    s.defer = true;
    s.setAttribute("data-support-tickets", "1");
    s.onerror = function () {
        console.warn("No se pudo cargar el script:", scriptPath);
    };
    document.head.appendChild(s);
})();


