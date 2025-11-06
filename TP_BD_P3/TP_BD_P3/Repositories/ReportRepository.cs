using Microsoft.EntityFrameworkCore;
using TP_BD_P3.DTOs;
using TP_BD_P3.Models.Scaffolded;

namespace TP_BD_P3.Repositories
{
    public class ReportRepository : IReportRepository
    {
        private readonly TP_BD_P2Context _context;

        public ReportRepository(TP_BD_P2Context context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TopGeneroDTO>> GetTopGeneroPorTipoCliente()
        {
            return await _context.Set<TopGeneroDTO>()
                .FromSqlRaw("EXEC sp_TopGeneroPorTipoCliente")
                .ToListAsync();
        }

        public async Task<IEnumerable<ReporteConsumoKioscoSummaryDTO>> GetReporteConsumoKiosco()
        {
            return await _context.Set<ReporteConsumoKioscoSummaryDTO>()
                .FromSqlRaw("EXEC sp_ReporteConsumoKiosco")
                .ToListAsync();
        }

        public async Task<IEnumerable<ProductoKioscoDTO>> GetTopProductosKioscoPorGenero()
        {
            return await _context.Set<ProductoKioscoDTO>()
                .FromSqlRaw("EXEC usp_TopProductosKioscoPorGenero_AnioActual")
                .ToListAsync();
        }

        public async Task<IEnumerable<RecaudacionPeliculaDTO>> GetRecaudacionPorPelicula()
        {
            return await _context.Set<RecaudacionPeliculaDTO>()
                .FromSqlRaw("EXEC usp_RecaudacionPorPelicula")
                .ToListAsync();
        }
    }
}
