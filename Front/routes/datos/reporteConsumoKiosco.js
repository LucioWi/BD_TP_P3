// consumoKiosco.js
(function () {
    const API_URL_CONSUMO = "http://localhost:5200/api/Report/consumo-kiosco"; // Cambiá el puerto si corresponde

    // ===== Helpers =====
    const $qs = (sel) => document.querySelector(sel);
    const fmtMoney = (n) =>
        new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            maximumFractionDigits: 0,
        }).format(n || 0);
    const fmtInt = (n) => new Intl.NumberFormat("es-AR").format(n || 0);
    const clampPct = (n) => Math.max(0, Math.min(100, Math.round(n)));

    // ===== Render sections (Bootstrap responsive) =====
    function renderKPIs(s) {
        return `
    <h3 class="mb-2">Resumen de consumo en kiosco</h3>
    <p class="text-secondary">Totales consolidados del top de productos y combos.</p>
    <div class="row g-3">
      <div class="col-12 col-sm-6 col-lg-3">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <div class="fs-5 fw-bold">${fmtInt(s.categoriasAnalizadas)}</div>
            <div class="text-secondary">Categorías analizadas</div>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-lg-3">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <div class="fs-5 fw-bold">${fmtInt(s.totalProductosTop3)}</div>
            <div class="text-secondary">Unidades Top 3 (productos)</div>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-lg-3">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <div class="fs-5 fw-bold">${fmtInt(s.totalCombosTop3)}</div>
            <div class="text-secondary">Unidades Top 3 (combos)</div>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-lg-3">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <div class="fs-5 fw-bold">${fmtMoney(s.gananciaTotalTop6)}</div>
            <div class="text-secondary">Ganancia total (Top 6)</div>
          </div>
        </div>
      </div>
    </div>
  `;
    }

    function renderDistribucionBars(s) {
        const totalUnidades =
            (s.totalProductosTop3 || 0) + (s.totalCombosTop3 || 0);
        const pctProd = totalUnidades
            ? clampPct((s.totalProductosTop3 * 100) / totalUnidades)
            : 0;
        const pctCombo = totalUnidades ? 100 - pctProd : 0;

        return `
    <h3 class="mt-4 mb-2">Distribución de unidades Top 3</h3>
    <p class="text-secondary">Proporción entre productos individuales y combos (por unidades).</p>
    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <div class="d-flex justify-content-between small text-secondary mb-1">
          <span>Productos</span><span>Combos</span>
        </div>
        <div class="progress" style="height: 28px;">
          <div class="progress-bar bg-primary" style="width:${pctProd}%">
            ${pctProd >= 12 ? pctProd + "%" : ""}
          </div>
          <div class="progress-bar bg-success" style="width:${pctCombo}%">
            ${pctCombo >= 12 ? pctCombo + "%" : ""}
          </div>
        </div>
        <div class="d-flex justify-content-between mt-2 small">
          <span class="badge text-bg-primary">Productos: ${fmtInt(
              s.totalProductosTop3
          )}</span>
          <span class="badge text-bg-success">Combos: ${fmtInt(
              s.totalCombosTop3
          )}</span>
        </div>
      </div>
    </div>
  `;
    }

    function renderTablaResumen(s) {
        return `
    <h3 class="mt-4 mb-2">Tabla resumen</h3>
    <div class="table-responsive">
      <table class="table table-sm table-hover align-middle">
        <thead class="table-dark">
          <tr>
            <th>Categorías Analizadas</th>
            <th class="text-end">Unidades Top 3 (Productos)</th>
            <th class="text-end">Unidades Top 3 (Combos)</th>
            <th class="text-end">Ganancia Total (Top 6)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${fmtInt(s.categoriasAnalizadas)}</td>
            <td class="text-end">${fmtInt(s.totalProductosTop3)}</td>
            <td class="text-end">${fmtInt(s.totalCombosTop3)}</td>
            <td class="text-end">${fmtMoney(s.gananciaTotalTop6)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
    }

    function renderNotas(s) {
        // Texto corto “legible” para un cliente
        const quienGana =
            (s.totalProductosTop3 || 0) >= (s.totalCombosTop3 || 0)
                ? "productos"
                : "combos";
        return `
    <h3 class="mt-4 mb-2">Notas</h3>
    <div class="alert alert-info" role="alert">
      Se analizaron <strong>${fmtInt(
          s.categoriasAnalizadas
      )}</strong> categorías. En el Top 3 por unidades,
      ${
          quienGana === "productos"
              ? "<strong>los productos individuales</strong>"
              : "<strong>los combos</strong>"
      } lideran la participación.
      La <strong>ganancia total</strong> combinada del Top 6 asciende a <strong>${fmtMoney(
          s.gananciaTotalTop6
      )}</strong>.
    </div>
  `;
    }

    // ===== Fetch + render root =====
    async function showConsumoKiosco() {
    const container = document.getElementById("consumoKioscoContainer");
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
  </div>
  `;

    try {
      const res = await fetch(API_URL_CONSUMO);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json(); // El controller devuelve UN objeto resumen

      const sections = [
        renderKPIs(data),
        renderDistribucionBars(data),
        renderTablaResumen(data),
        renderNotas(data),
      ].join("");

      container.innerHTML = sections;
    } catch (err) {
      console.error("❌ Error al cargar consumo kiosco:", err);
      container.innerHTML = `<p class="text-danger text-center mt-4">Error al cargar los datos</p>`;
    }
    }

    // Exponer globalmente para tu botón/onclick
    window.showConsumoKiosco = showConsumoKiosco;
})();
