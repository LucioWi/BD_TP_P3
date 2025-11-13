// topProductosKiosco.js
(function () {
    // ===== Config =====
    const API_URL = "http://localhost:5200/api/Report/top-productos-kiosco"; // Cambiá el puerto si corresponde

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
    const uniq = (arr) => [...new Set(arr)];
    const groupBy = (arr, k) =>
        arr.reduce((m, i) => ((m[i[k]] ??= []).push(i), m), {});
    const pickColor = (i) =>
        ["primary", "success", "warning", "danger", "info", "secondary"][i % 6];

    // ===== Secciones =====

    // 1) KPIs globales
    function renderKPIs(list) {
        const totalRows = list.length;
        const totalUnidades = sum(list, "cantidadVendida");
        const totalMonto = sum(list, "montoTotal");
        const generos = uniq(list.map((x) => x.genero));
        return `
    <h3 class="mb-2">Top de productos de kiosco</h3>
    <p class="text-secondary">Resumen de productos más vendidos por género.</p>
    <div class="row g-3">
      <div class="col-12 col-sm-6 col-lg-3">
        <div class="card border-0 shadow-sm h-100"><div class="card-body">
          <div class="fs-5 fw-bold">${fmtInt(totalRows)}</div>
          <div class="text-secondary">Registros</div>
        </div></div>
      </div>
      <div class="col-12 col-sm-6 col-lg-3">
        <div class="card border-0 shadow-sm h-100"><div class="card-body">
          <div class="fs-5 fw-bold">${fmtInt(totalUnidades)}</div>
          <div class="text-secondary">Unidades vendidas</div>
        </div></div>
      </div>
      <div class="col-12 col-sm-6 col-lg-3">
        <div class="card border-0 shadow-sm h-100"><div class="card-body">
          <div class="fs-5 fw-bold">${fmtMoney(totalMonto)}</div>
          <div class="text-secondary">Monto total</div>
        </div></div>
      </div>
      <div class="col-12 col-sm-6 col-lg-3">
        <div class="card border-0 shadow-sm h-100"><div class="card-body">
          <div class="fs-5 fw-bold">${fmtInt(generos.length)}</div>
          <div class="text-secondary">Géneros distintos</div>
        </div></div>
      </div>
    </div>
  `;
    }

    // 2) Ranking global por monto (barras)
    function renderRanking(list) {
        const sorted = [...list].sort(
            (a, b) => (b.montoTotal ?? 0) - (a.montoTotal ?? 0)
        );
        const max = Math.max(...sorted.map((x) => x.montoTotal || 0), 1);
        return `
    <h3 class="mt-4 mb-2">Ranking global por monto</h3>
    <div class="vstack gap-3">
      ${sorted
          .map((r, i) => {
              const pct = Math.round(((r.montoTotal || 0) / max) * 100);
              return `
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div><span class="badge bg-${pickColor(i)} me-2">#${
                  i + 1
              }</span><strong class="text-white">${
                  r.producto
              }</strong> <span class="text-secondary">· ${r.genero}</span></div>
                <div class="text-nowrap">${fmtMoney(r.montoTotal)}</div>
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
      <td>${r.genero ?? ""}</td>
      <td>${r.producto ?? ""}</td>
      <td class="text-end">${fmtInt(r.cantidadVendida)}</td>
      <td class="text-end">${fmtMoney(r.montoTotal)}</td>
      <td class="text-end">${(r.promedioGastoPorTicket ?? 0).toLocaleString(
          "es-AR"
      )}</td>
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
            <th>Género</th>
            <th>Producto</th>
            <th class="text-end">Cantidad</th>
            <th class="text-end">Monto</th>
            <th class="text-end">Prom. gasto/ticket</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
        <tfoot class="table-dark">
          <tr>
            <th colspan="2" class="text-end">Totales:</th>
            <th class="text-end">${fmtInt(sum(list, "cantidadVendida"))}</th>
            <th class="text-end">${fmtMoney(sum(list, "montoTotal"))}</th>
            <th></th>
          </tr>
        </tfoot>
      </table>
    </div>
  `;
    }

    // 4) Cards por género (Top productos del género)
    function renderCardsPorGenero(list) {
        const byGenero = groupBy(list, "genero");
        const cards = Object.entries(byGenero)
            .map(([genero, rows]) => {
                const top = [...rows].sort(
                    (a, b) => (b.montoTotal ?? 0) - (a.montoTotal ?? 0)
                );
                const lis = top
                    .map(
                        (r, i) => `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <span><span class="badge bg-${pickColor(i)} me-2">${i + 1}</span>${
                            r.producto
                        }</span>
        <span class="text-nowrap">
          <span class="badge text-bg-primary me-2">${fmtInt(
              r.cantidadVendida
          )}</span>
          <span class="badge text-bg-success">${fmtMoney(r.montoTotal)}</span>
        </span>
      </li>
    `
                    )
                    .join("");
                const totalG = sum(rows, "montoTotal");
                const unidadesG = sum(rows, "cantidadVendida");
                return `
      <div class="col-12 col-md-6 col-xl-5">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <h5 class="card-title mb-2">${genero}</h5>
              <div class="text-end small text-secondary">
                <div>Unidades: <strong class="text-white">${fmtInt(unidadesG)}</strong></div>
                <div>Monto: <strong class="text-white">${fmtMoney(totalG)}</strong></div>
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
    <h3 class="mt-4 mb-2">Top por género</h3>
    <div class="row g-3 d-flex justify-content-center">${cards}</div>
  `;
    }

    // 5) Distribución por género (monto) con progress apilada
    function renderDistribucionGenero(list) {
        const byGenero = groupBy(list, "genero");
        const totGlobal = sum(list, "montoTotal") || 1;
        const segs = Object.entries(byGenero)
            .map(([genero, rows]) => ({
                genero,
                monto: sum(rows, "montoTotal"),
            }))
            .sort((a, b) => b.monto - a.monto);

        const bars = segs
            .map((s, i) => {
                const pct = Math.round((s.monto / totGlobal) * 100);
                return `<div class="progress-bar bg-${pickColor(
                    i
                )}" style="width:${pct}%">${pct >= 12 ? pct + "%" : ""}</div>`;
            })
            .join("");

        const legend = segs
            .map(
                (s, i) =>
                    `<span class="badge text-bg-${pickColor(i)}">${
                        s.genero
                    } · ${fmtMoney(s.monto)}</span>`
            )
            .join(" ");

        return `
    <h3 class="mt-4 mb-2">Distribución por género (monto)</h3>
    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <div class="progress" style="height: 26px;">${bars}</div>
        <div class="mt-2 d-flex flex-wrap gap-2">${legend}</div>
      </div>
    </div>
  `;
    }

    // ===== Fetch + Render =====
    async function showProductsKiosco() {
    const container = document.getElementById("productsKioscoContainer");
    if (!container) return;

    // Toggle behavior: if currently hidden, show and load; if visible, hide and clear.
    const isHidden = container.classList.contains("hidden");
    if (!isHidden) {
      // Hide and clear
      container.classList.add("hidden");
      container.innerHTML = "";
      return;
    }

    // Remove hidden and load content
    container.classList.remove("hidden");
    container.innerHTML = `
  <div class="py-4 text-center text-secondary">
    <div class="spinner-border me-2" role="status" aria-hidden="true"></div>
    Cargando datos...
  </div>`;

    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json(); // IEnumerable<ProductoKioscoDTO>

      const html = [
        renderKPIs(data),
        renderRanking(data),
        renderTabla(data),
        renderCardsPorGenero(data),
        renderDistribucionGenero(data),
      ].join("");

      container.innerHTML = html;
    } catch (err) {
      console.error("❌ Error al cargar top productos kiosco:", err);
      container.innerHTML = `<p class="text-danger text-center mt-4">Error al cargar los datos</p>`;
    }
    }

    // Exponer globalmente
    window.showProductsKiosco = showProductsKiosco;
})();
