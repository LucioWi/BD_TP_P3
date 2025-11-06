using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TP_BD_P3.DTOs;
using TP_BD_P3.Repositories;

namespace TP_BD_P3.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly IReportRepository _repo;

        public ReportController(IReportRepository repo)
        {
            _repo = repo;
        }

        [HttpGet("top-genero")]
        [ProducesResponseType(typeof(IEnumerable<TopGeneroDTO>), 200)]
        public async Task<IActionResult> GetTopGeneroPorTipoCliente(CancellationToken cancellationToken)
        {
            var result = await _repo.GetTopGeneroPorTipoCliente();
            if (result == null || !result.Any())
                return NoContent();

            return Ok(result);
        }

        [HttpGet("consumo-kiosco")]
        [ProducesResponseType(typeof(ReporteConsumoKioscoSummaryDTO), 200)]
        [ProducesResponseType(204)]
        public async Task<IActionResult> GetReporteConsumoKiosco(CancellationToken cancellationToken)
        {
            var list = await _repo.GetReporteConsumoKiosco();
            var first = list?.FirstOrDefault();
            if (first == null)
                return NoContent();

            return Ok(first);
        }

        [HttpGet("top-productos-kiosco")]
        [ProducesResponseType(typeof(IEnumerable<ProductoKioscoDTO>), 200)]
        [ProducesResponseType(204)]
        public async Task<IActionResult> GetTopProductosKiosco(CancellationToken cancellationToken)
        {
            var list = await _repo.GetTopProductosKioscoPorGenero();
            if (list == null || !list.Any())
                return NoContent();

            return Ok(list);
        }

        [HttpGet("recaudacion-peliculas")]
        [ProducesResponseType(typeof(IEnumerable<RecaudacionPeliculaDTO>), 200)]
        [ProducesResponseType(204)]
        public async Task<IActionResult> GetRecaudacionPorPelicula(CancellationToken cancellationToken)
        {
            var list = await _repo.GetRecaudacionPorPelicula();
            if (list == null || !list.Any())
                return NoContent();

            return Ok(list);
        }
    }
}
