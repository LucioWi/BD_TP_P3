(function () {
    const $app = document.getElementById("app");

    // Loader simple (skeleton)
    function showLoader(heightPx) {
        const h = heightPx || 220;
        $app.innerHTML =
            '<div class="skeleton rounded" style="height:' + h + 'px"></div>';
    }

    // Marca activo en el navbar
    function setActiveFromUrl(url) {
        // Si #app está vacío (carga inicial), no marcamos ninguna sección por defecto
        if (!$app || $app.innerHTML.trim() === "") {
            document
                .querySelectorAll(".nav-link[data-section]")
                .forEach(function (a) {
                    a.classList.remove("active");
                    a.removeAttribute("aria-current");
                });
            return;
        }

        if (!url) return;

        const parts = url.split("/");
        const file = parts[parts.length - 1]; // section1.html
        const key = file.replace(".html", ""); // section1
        document
            .querySelectorAll(".nav-link[data-section]")
            .forEach(function (a) {
                const active = a.dataset.section === key;
                if (active) {
                    a.classList.add("active");
                    a.setAttribute("aria-current", "page");
                } else {
                    a.classList.remove("active");
                    a.removeAttribute("aria-current");
                }
            });
    }

    // Carga un parcial HTML dentro de #app
    window.load_content = function (url) {
        showLoader(220);
        // fetch del parcial
        fetch(url, { cache: "no-store" })
            .then(function (response) {
                if (!response.ok) {
                    throw new Error(
                        "HTTP " + response.status + " al cargar " + url
                    );
                }
                return response.text();
            })
            .then(function (html) {
                $app.innerHTML = html;
                setActiveFromUrl(url);
                // Auto-load first tab content for section1 and section2
                try {
                    if (url && (url.endsWith("section1.html") || url.endsWith("section2.html"))) {
                        // find first tab/button inside the loaded partial and trigger it
                        const firstTab = $app.querySelector('.nav-section .nav-link, .nav-section button');
                        if (firstTab) {
                            // defer to next tick so any inline handlers are available
                            setTimeout(() => firstTab.click(), 0);
                        }
                    }
                } catch (err) {
                    console.error("Error auto-loading default tab:", err);
                }
                // scroll top suave
                window.scrollTo({ top: 0, behavior: "smooth" });
            })
            .catch(function (err) {
                // Mensaje de error simple
                $app.innerHTML =
                    '<div class="alert alert-danger">No se pudo cargar la sección.</div>';
                console.error(err);
                alert(
                    "No se pudo cargar la sección. Revisa la consola para más detalles."
                );
            });
    };

    // Listener para clicks en el navbar (opcional) para marcar activo aunque llamen manualmente a load_content
    document.addEventListener("click", function (ev) {
        const el = ev.target.closest("a.nav-link[data-section]");
        if (!el) return;
        // Si el desarrollador no pasó el onclick con load_content, igual prevenimos y resolvemos
        if (!el.hasAttribute("onclick")) {
            ev.preventDefault();
            var key = el.getAttribute("data-section");
            window.load_content("./routes/" + key + ".html");
        }
    });

    // Carga inicial (por defecto: section1 si existe el link)
    // document.addEventListener("DOMContentLoaded", function () {
    //     var first = document.querySelector("a.nav-link[data-section]");
    //     if (first) {
    //         var key = first.getAttribute("data-section");
    //         setActiveFromUrl("./routes/" + key + ".html");
    //     }
    // });
})();

