// recaudacionPelicula.js
(function () {
    // ===== Config =====
    const API_URL = "http://localhost:5200/api/Report/recaudacion-peliculas"; // Ajustá el puerto si corresponde

    // ===== Helpers =====
    const $ = (sel) => document.querySelector(sel);
    const fmtMoney = (n) =>
        new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            maximumFractionDigits: 0,
        }).format(n || 0);
    const fmtInt = (n) => new Intl.NumberFormat("es-AR").format(n || 0);
    const sum = (arr, k) =>
        arr.reduce((acc, it) => acc + (Number(it[k]) || 0), 0);
    const mean = (arr, k) =>
        arr.length
            ? arr.reduce((a, i) => a + (Number(i[k]) || 0), 0) / arr.length
            : 0;
    const uniq = (arr) => [...new Set(arr)];
    const groupBy = (arr, k) =>
        arr.reduce((m, i) => ((m[i[k]] ??= []).push(i), m), {});
    const pickColor = (i) =>
        ["primary", "success", "warning", "danger", "info", "secondary"][i % 6];

    // ===== Secciones =====

    // 1) KPIs globales
    function renderKPIs(list) {
        const totalPeliculas = list.length;
        const totalRecaudado = sum(list, "totalRecaudado");
        const totalTickets = sum(list, "ticketsVendidos");
        const promTicket = mean(list, "promedioRecaudadoPorTicket");
        const paises = uniq(
            list.map((x) => x.paisOrigen ?? "Desconocido")
        ).length;

        return `
    <h3 class="mb-2">Recaudación por película</h3>
    <p class="text-secondary">Resumen general de recaudación, tickets y promedios.</p>
    <div class="row g-3">
      <div class="col-12 col-sm-6 col-lg-3">
        <div class="card border-0 shadow-sm h-100"><div class="card-body">
          <div class="fs-5 fw-bold">${fmtInt(totalPeliculas)}</div>
          <div class="text-secondary">Películas analizadas</div>
        </div></div>
      </div>
      <div class="col-12 col-sm-6 col-lg-3">
        <div class="card border-0 shadow-sm h-100"><div class="card-body">
          <div class="fs-5 fw-bold">${fmtMoney(totalRecaudado)}</div>
          <div class="text-secondary">Recaudación total</div>
        </div></div>
      </div>
      <div class="col-12 col-sm-6 col-lg-3">
        <div class="card border-0 shadow-sm h-100"><div class="card-body">
          <div class="fs-5 fw-bold">${fmtInt(totalTickets)}</div>
          <div class="text-secondary">Tickets vendidos</div>
        </div></div>
      </div>
      <div class="col-12 col-sm-6 col-lg-3">
        <div class="card border-0 shadow-sm h-100"><div class="card-body">
          <div class="fs-5 fw-bold">${fmtMoney(Math.round(promTicket))}</div>
          <div class="text-secondary">Prom. recaudado/ticket</div>
        </div></div>
      </div>
    </div>
  `;
    }

    // 2) Ranking global por recaudación (barras)
    function renderRanking(list) {
        const sorted = [...list].sort(
            (a, b) => (b.totalRecaudado ?? 0) - (a.totalRecaudado ?? 0)
        );
        const max = Math.max(...sorted.map((x) => x.totalRecaudado || 0), 1);

        return `
    <h3 class="mt-4 mb-2">Ranking global por recaudación</h3>
    <div class="vstack gap-3">
      ${sorted
          .map((r, i) => {
              const pct = Math.round(((r.totalRecaudado || 0) / max) * 100);
              return `
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div><span class="badge bg-${pickColor(i)} me-2">#${
                  i + 1
              }</span><strong class="text-white">${
                  r.pelicula ?? "(Sin título)"
              }</strong> <span class="text-secondary">· ${
                  r.paisOrigen ?? "?"
              }</span></div>
                <div class="text-nowrap">${fmtMoney(r.totalRecaudado)}</div>
              </div>
              <div class="progress mt-2">
                <div class="progress-bar bg-${pickColor(
                    i
                )}" style="width:${pct}%"></div>
              </div>
            </div>
          </div>`;
          })
          .join("")}
    </div>
  `;
    }

    // 3) Tabla analítica
    function renderTabla(list) {
        const rows = list
            .map(
                (r) => `
    <tr>
      <td>${r.codPelicula}</td>
      <td>${r.pelicula ?? ""}</td>
      <td>${r.paisOrigen ?? ""}</td>
      <td class="text-end">${fmtInt(r.duracionMinutos)}</td>
      <td class="text-end">${fmtMoney(r.totalRecaudado)}</td>
      <td class="text-end">${fmtInt(r.ticketsVendidos)}</td>
      <td class="text-end">${fmtMoney(
          Math.round(r.promedioRecaudadoPorTicket || 0)
      )}</td>
      <td class="text-end">${fmtInt(r.cantidadVentas)}</td>
    </tr>
  `
            )
            .join("");

        return `
    <h3 class="mt-4 mb-2">Tabla analítica</h3>
    <div class="table-responsive">
      <table class="table table-sm table-hover align-middle">
        <thead class="table-dark">
          <tr>
            <th>Cod</th>
            <th>Pelicula</th>
            <th>País</th>
            <th class="text-end">Duración (min)</th>
            <th class="text-end">Recaudación</th>
            <th class="text-end">Tickets</th>
            <th class="text-end">Prom./ticket</th>
            <th class="text-end"># Ventas</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
        <tfoot class="table-dark">
          <tr>
            <th colspan="3" class="text-end">Totales:</th>
            <th class="text-end">${fmtInt(sum(list, "duracionMinutos"))}</th>
            <th class="text-end">${fmtMoney(sum(list, "totalRecaudado"))}</th>
            <th class="text-end">${fmtInt(sum(list, "ticketsVendidos"))}</th>
            <th class="text-end">${fmtMoney(
                Math.round(mean(list, "promedioRecaudadoPorTicket"))
            )}</th>
            <th class="text-end">${fmtInt(sum(list, "cantidadVentas"))}</th>
          </tr>
        </tfoot>
      </table>
    </div>
  `;
    }

    // 4) Cards por país de origen (Top películas del país por recaudación)
    function renderCardsPorPais(list) {
        const byPais = groupBy(
            list.map((x) => ({
                ...x,
                paisOrigen: x.paisOrigen ?? "Desconocido",
            })),
            "paisOrigen"
        );
        const cards = Object.entries(byPais)
            .map(([pais, rows]) => {
                const top = [...rows]
                    .sort(
                        (a, b) =>
                            (b.totalRecaudado ?? 0) - (a.totalRecaudado ?? 0)
                    )
                    .slice(0, 3);
                const totalPais = sum(rows, "totalRecaudado");
                const ticketsPais = sum(rows, "ticketsVendidos");
                const lis = top
                    .map(
                        (r, i) => `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <span><span class="badge bg-${pickColor(i)} me-2">${i + 1}</span>${
                            r.pelicula ?? "(Sin título)"
                        }</span>
        <span class="text-nowrap">
          <span class="badge text-bg-primary me-2 text-white">${fmtInt(
              r.ticketsVendidos
          )} tkts</span>
          <span class="badge text-bg-success text-white">${fmtMoney(
              r.totalRecaudado
          )}</span>
        </span>
      </li>
    `
                    )
                    .join("");

                return `
      <div class="col-12 col-md-6 col-xl-6">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <h5 class="card-title mb-2">${pais}</h5>
              <div class="text-end small text-secondary">
                <div>Tickets: <strong class="text-white">${fmtInt(ticketsPais)}</strong></div>
                <div>Recaudación: <strong class="text-white">${fmtMoney(totalPais)}</strong></div>
              </div>
            </div>
            <ul class="list-group list-group-flush">${lis}</ul>
          </div>
        </div>
      </div>
    `;
            })
            .join("");

        return `
    <h3 class="mt-4 mb-2">Top por país de origen</h3>
    <div class="row g-3">${cards}</div>
  `;
    }

    // 5) Distribución por rangos de duración (recaudación)
    function renderDistribucionDuracion(list) {
        const buckets = [
            { name: "≤ 90m", test: (m) => m <= 90 },
            { name: "91–120m", test: (m) => m > 90 && m <= 120 },
            { name: "121–150m", test: (m) => m > 120 && m <= 150 },
            { name: "150m+", test: (m) => m > 150 },
        ];
        const agg = buckets
            .map((b, i) => {
                const rows = list.filter((x) => b.test(x.duracionMinutos || 0));
                return {
                    name: b.name,
                    monto: sum(rows, "totalRecaudado"),
                    idx: i,
                };
            })
            .sort((a, b) => b.monto - a.monto);

        const tot = Math.max(
            1,
            agg.reduce((a, i) => a + i.monto, 0)
        );
        const bars = agg
            .map((a) => {
                const pct = Math.round((a.monto / tot) * 100);
                return `<div class="progress-bar bg-${pickColor(
                    a.idx
                )}" style="width:${pct}%">${pct >= 12 ? pct + "%" : ""}</div>`;
            })
            .join("");

        const legend = agg
            .map(
                (a) =>
                    `<span class="badge text-bg-${pickColor(a.idx)}">${
                        a.name
                    } · ${fmtMoney(a.monto)}</span>`
            )
            .join(" ");

        return `
    <h3 class="mt-4 mb-2">Distribución por duración (recaudación)</h3>
    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <div class="progress" style="height:26px;">${bars}</div>
        <div class="mt-2 d-flex flex-wrap gap-2">${legend}</div>
      </div>
    </div>
  `;
    }

    // ===== Fetch + Render =====
    async function showRecaudacionPelicula() {
    const container = document.getElementById(
      "recaudacionPeliculaContainer"
    );
    if (!container) return;

    // Toggle: if currently visible, hide and clear; if hidden, unhide and load
    const isHidden = container.classList.contains("hidden");
    if (!isHidden) {
      container.classList.add("hidden");
      container.innerHTML = "";
      return;
    }

    container.classList.remove("hidden");
    container.innerHTML = `
  <div class="py-4 text-center text-secondary">
    <div class="spinner-border me-2" role="status" aria-hidden="true"></div>
    Cargando datos...
  </div>`;

    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json(); // IEnumerable<RecaudacionPeliculaDTO>

      const html = [
        renderKPIs(data),
        renderRanking(data),
        renderTabla(data),
        renderCardsPorPais(data),
        renderDistribucionDuracion(data),
      ].join("");

      container.innerHTML = html;
    } catch (err) {
      console.error("❌ Error al cargar recaudación por película:", err);
      container.innerHTML = `<p class="text-danger text-center mt-4">Error al cargar los datos</p>`;
    }
    }

    // Exponer globalmente
    window.showRecaudacionPelicula = showRecaudacionPelicula;
})();
