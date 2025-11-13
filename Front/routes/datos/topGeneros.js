// topGeneros.mobile.js
(function () {
    // ===== Config =====
    const API_URL = "http://localhost:5200/api/Report/top-genero"; // Ajustá el puerto si corresponde

    // ===== Helpers =====
    const $ = (sel) => document.querySelector(sel);
    const fmtMoney = (n) =>
        new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            maximumFractionDigits: 0,
        }).format(n || 0);
    const fmtInt = (n) => new Intl.NumberFormat("es-AR").format(n || 0);
    const sum = (arr, k) => arr.reduce((a, i) => a + (Number(i[k]) || 0), 0);
    const mean = (arr, k) =>
        arr.length
            ? arr.reduce((a, i) => a + (Number(i[k]) || 0), 0) / arr.length
            : 0;
    const uniq = (arr) => [...new Set(arr)];
    const groupBy = (arr, k) =>
        arr.reduce((m, i) => ((m[i[k]] ??= []).push(i), m), {});
    const pickColor = (i) =>
        ["primary", "success", "warning", "danger", "info", "secondary"][i % 6];

    // ===== Secciones (mobile-first con Bootstrap) =====

    // 1) KPIs globales
    function renderKPIs(data) {
        const kpis = [
            {
                label: "Ventas Totales",
                value: fmtMoney(sum(data, "totalVentas")),
            },
            {
                label: "Tickets Totales",
                value: fmtInt(sum(data, "totalTickets")),
            },
            {
                label: "Prom. Asistencia (media)",
                value: fmtInt(Math.round(mean(data, "promedioAsistencia"))),
            },
            {
                label: "Géneros distintos",
                value: fmtInt(uniq(data.map((d) => d.genero)).length),
            },
        ];

        return `
    <h3 class="mb-2">Resumen de ventas, tickets, asistencia y variedad de géneros</h3>
    <div class=" row g-3">
      ${kpis
          .map(
              (k) => `
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <div class="fs-5 fw-bold">${k.value}</div>
              <div class="text-secondary">${k.label}</div>
            </div>
          </div>
        </div>
      `
          )
          .join("")}
    </div>
  `;
    }

    // 2) Ranking global por Ventas (progress bars)
    function renderRankingGlobal(data, metric = "totalVentas") {   // TotalVentas o TotalTickets
        const sorted = [...data].sort(
            (a, b) => (b[metric] ?? 0) - (a[metric] ?? 0)
        );
        const max = Math.max(...sorted.map((d) => d[metric] || 0), 1);
        return `
    <h3 class="mt-4 mb-2">Ranking global por ${
        metric === "totalVentas" ? "Ventas" : "Tickets"
    }</h3>
    <div class="vstack gap-3">
      ${sorted
          .map((d, i) => {
              const pct = Math.round((d[metric] / max) * 100);
              const label =
                  metric === "totalVentas"
                      ? fmtMoney(d.totalVentas)
                      : fmtInt(d.totalTickets);
              return `
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div><span class="badge bg-${pickColor(i)} me-2">#${
                  i + 1
              }</span><strong class="text-white">${
                  d.genero
              }</strong> <span class="text-secondary">· ${
                  d.tipoCliente
              }</span></div>
                <div>${label}</div>
              </div>
              <div class="progress mt-2"><div class="progress-bar bg-${pickColor(
                  i
              )}" style="width:${pct}%"></div></div>
            </div>
          </div>`;
          })
          .join("")}
    </div>`;
    }

    // 3) Tabla analítica (table responsive + totales)
    function renderTabla(data) {
        const rows = data
            .map(
                (d) => `
    <tr>
      <td>${d.tipoCliente}</td>
      <td>${d.genero}</td>
      <td class="text-end">${fmtInt(d.peliculasCount)}</td>
      <td class="text-end">${fmtInt(d.totalTickets)}</td>
      <td class="text-end">${fmtMoney(d.totalVentas)}</td>
      <td class="text-end">${fmtInt(d.promedioAsistencia)}</td>
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
            <th>Tipo de Cliente</th>
            <th>Género</th>
            <th class="text-end">Películas</th>
            <th class="text-end">Tickets</th>
            <th class="text-end">Ventas</th>
            <th class="text-end">Prom. asistencia</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
        <tfoot class="table-dark">
          <tr>
            <th colspan="2" class="text-end">Totales:</th>
            <th class="text-end">${fmtInt(sum(data, "peliculasCount"))}</th>
            <th class="text-end">${fmtInt(sum(data, "totalTickets"))}</th>
            <th class="text-end">${fmtMoney(sum(data, "totalVentas"))}</th>
            <th class="text-end">${fmtInt(
                Math.round(mean(data, "promedioAsistencia"))
            )}</th>
          </tr>
        </tfoot>
      </table>
    </div>
  `;
    }

    // 4) Cards por segmento (Top 3 por ventas) — grid responsive
    function renderCardsSegmentos(data) {
        const byTipo = groupBy(data, "tipoCliente");
        const cards = Object.entries(byTipo)
            .map(([tipo, rows]) => {
                const segTickets = sum(rows, "totalTickets");
                const segVentas = sum(rows, "totalVentas");
                const top3 = [...rows]
                    .sort((a, b) => (b.totalVentas ?? 0) - (a.totalVentas ?? 0))
                    .slice(0, 3);

                const lis = top3
                    .map(
                        (r, i) => `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <span>
          <span class="badge bg-${pickColor(i)} me-2">${i + 1}</span>${r.genero}
          <span class="small text-secondary ms-2">${fmtInt(
              r.peliculasCount
          )} pelis</span>
        </span>
        <span class="text-nowrap">
          <span class="badge text-bg-primary me-2">${fmtInt(
              r.totalTickets
          )} tkts</span>
          <span class="badge text-bg-success">${fmtMoney(r.totalVentas)}</span>
        </span>
      </li>
    `
                    )
                    .join("");

                return `
      <div class="col-12 col-sm-6 col-xl-6">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <h5 class="card-title mb-2">${tipo}</h5>
              <div class="text-end small text-secondary">
                <div>Tickets: <strong class="text-white">${fmtInt(
                    segTickets
                )}</strong></div>
                <div>Ventas: <strong class="text-white">${fmtMoney(
                    segVentas
                )}</strong></div>
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
    <h3 class="mt-4 mb-2">Top 3 géneros por segmento</h3>
    <div class="row g-3 d-flex justify-content-center">${cards}</div>
  `;
    }

    // 5) Heatmap (Tipo x Género) por asistencia (celdas escaladas)
    function renderHeatmap(data) {
        const tipos = uniq(data.map((d) => d.tipoCliente));
        const generos = uniq(data.map((d) => d.genero));
        const maxAsis = Math.max(
            ...data.map((d) => d.promedioAsistencia || 0),
            1
        );

        const head = `<tr>
    <th class="bg-body-secondary">Tipo \\ Género</th>
    ${generos
        .map((g) => `<th class="bg-body-secondary text-center">${g}</th>`)
        .join("")}
  </tr>`;

        const body = tipos
            .map((t) => {
                const tds = generos
                    .map((g) => {
                        const row = data.find(
                            (d) => d.tipoCliente === t && d.genero === g
                        );
                        const val = row ? row.promedioAsistencia : 0;
                        const op = 0.15 + 0.65 * (val / maxAsis);
                        return `<td class="text-center">
        <div class="p-2 rounded" style="background-color:rgba(25,135,84,${op});">
          <div class="fw-semibold">${fmtInt(val)}</div>
          <div class="small text-secondary">asis.</div>
        </div>
      </td>`;
                    })
                    .join("");
                return `<tr><th class="bg-body-secondary">${t}</th>${tds}</tr>`;
            })
            .join("");

        return `
    <h3 class="mt-4 mb-2">Heatmap: asistencia promedio</h3>
    <div class="table-responsive">
      <table class="table table-bordered align-middle">
        <thead>${head}</thead>
        <tbody>${body}</tbody>
      </table>
    </div>
  `;
    }

    // 6) Distribución de tickets por segmento (barra apilada) — tarjetas apiladas en mobile
    function renderStackedBySegment(data) {
        const byTipo = groupBy(data, "tipoCliente");
        const cards = Object.entries(byTipo)
            .map(([tipo, rows]) => {
                const totalTk = Math.max(1, sum(rows, "totalTickets"));
                const ordered = [...rows].sort(
                    (a, b) => (b.totalTickets ?? 0) - (a.totalTickets ?? 0)
                );

                const bars = ordered
                    .map((r, i) => {
                        const pct = Math.round(
                            (r.totalTickets / totalTk) * 100
                        );
                        return `<div class="progress-bar bg-${pickColor(
                            i
                        )}" style="width:${pct}%">${
                            pct >= 12 ? pct + "%" : ""
                        }</div>`;
                    })
                    .join("");

                const legend = ordered
                    .map(
                        (r, i) =>
                            `<span class="badge text-bg-${pickColor(i)}">${
                                r.genero
                            }</span>`
                    )
                    .join(" ");

                return `
      <div class="card border-0 shadow-sm">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h6 class="mb-0">${tipo}</h6>
            <small class="text-secondary">${fmtInt(totalTk)} tickets</small>
          </div>
          <div class="progress" style="height:26px;">${bars}</div>
          <div class="mt-2 d-flex flex-wrap gap-2">${legend}</div>
        </div>
      </div>
    `;
            })
            .join("");

        return `
    <h3 class="mt-4 mb-2">Distribución de Tickets por segmento</h3>
    <div class="vstack gap-3">${cards}</div>
  `;
    }

    // ===== Fetch + Render root =====
    async function showTopGeneros() {
    const cont = document.getElementById("topGenerosContainer");
    if (!cont) return;

    // Toggle behavior: if currently hidden, show and load; if visible, hide and clear.
    const isHidden = cont.classList.contains("hidden");
    if (!isHidden) {
      cont.classList.add("hidden");
      cont.innerHTML = "";
      return;
    }

    // Unhide and load
    cont.classList.remove("hidden");
    cont.innerHTML = `
  <div class="py-4 text-center text-secondary">
    <div class="spinner-border me-2" role="status" aria-hidden="true"></div>
    Cargando datos...
  </div>
  `;

    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();

      const html = [
        renderKPIs(data),
        renderRankingGlobal(data, "totalVentas"),
        renderTabla(data),
        renderCardsSegmentos(data),
        renderHeatmap(data),
        renderStackedBySegment(data),
      ].join("");

      cont.innerHTML = html;
    } catch (err) {
      console.error("❌ Error al cargar top-géneros:", err);
      cont.innerHTML = `<p class="text-danger text-center mt-4">Error al cargar los datos</p>`;
    }
    }

    // Exponer globalmente
    window.showTopGeneros = showTopGeneros;
})();
