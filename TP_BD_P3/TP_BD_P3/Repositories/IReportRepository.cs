using TP_BD_P3.DTOs;

namespace TP_BD_P3.Repositories
{
    public interface IReportRepository
    {
        Task<IEnumerable<TopGeneroDTO>> GetTopGeneroPorTipoCliente();
        Task<IEnumerable<ReporteConsumoKioscoSummaryDTO>> GetReporteConsumoKiosco();
        Task<IEnumerable<ProductoKioscoDTO>> GetTopProductosKioscoPorGenero();
        Task<IEnumerable<RecaudacionPeliculaDTO>> GetRecaudacionPorPelicula();
    }
}
