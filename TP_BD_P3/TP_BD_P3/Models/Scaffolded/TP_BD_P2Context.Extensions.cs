#nullable disable
using Microsoft.EntityFrameworkCore;
using TP_BD_P3.DTOs;

namespace TP_BD_P3.Models.Scaffolded
{
    public partial class TP_BD_P2Context
    {
        partial void OnModelCreatingPartial(ModelBuilder modelBuilder)
        {
            // Registrar DTOs como keyless para poder usar FromSqlRaw/Set<T>()
            modelBuilder.Entity<TopGeneroDTO>(eb =>
            {
                eb.HasNoKey();
                eb.ToView(null);
                eb.Property(e => e.TipoCliente).HasColumnName("Tipo de cliente");
                eb.Property(e => e.Genero).HasColumnName("Género");
                eb.Property(e => e.PeliculasCount).HasColumnName("Cantidad de peliculas en el año");
                eb.Property(e => e.TotalTickets).HasColumnName("Cantidad de ventas");
                eb.Property(e => e.TotalVentas).HasColumnName("Monto total de ventas");
                eb.Property(e => e.PromedioAsistencia).HasColumnName("Promedio de asistencia por pelicula");
            });

            modelBuilder.Entity<ReporteConsumoKioscoSummaryDTO>(eb =>
            {
                eb.HasNoKey();
                eb.ToView(null);
                eb.Property(e => e.CategoriasAnalizadas).HasColumnName("categorias_analizadas");
                eb.Property(e => e.TotalProductosTop3).HasColumnName("total_productos_top3");
                eb.Property(e => e.TotalCombosTop3).HasColumnName("total_combos_top3");
                eb.Property(e => e.GananciaTotalTop6).HasColumnName("ganancia_total_top6");
            });

            modelBuilder.Entity<ProductoKioscoDTO>(eb =>
            {
                eb.HasNoKey();
                eb.ToView(null);
                eb.Property(e => e.Genero).HasColumnName("Género");
                eb.Property(e => e.Producto).HasColumnName("Producto");
                eb.Property(e => e.CantidadVendida).HasColumnName("Cantidad Vendida (Producto)");
                eb.Property(e => e.MontoTotal).HasColumnName("Monto Total Recaudado (Producto)");
                eb.Property(e => e.PromedioGastoPorTicket).HasColumnName("Promedio Gasto por Ticket del Género");
            });

            modelBuilder.Entity<RecaudacionPeliculaDTO>(eb =>
            {
                eb.HasNoKey();
                eb.ToView(null);
                eb.Property(e => e.CodPelicula).HasColumnName("cod_pelicula");
                eb.Property(e => e.Pelicula).HasColumnName("Pelicula");
                eb.Property(e => e.PaisOrigen).HasColumnName("Pais_Origen");
                eb.Property(e => e.DuracionMinutos).HasColumnName("Duracion_Minutos");
                eb.Property(e => e.TotalRecaudado).HasColumnName("Total_Recaudado");
                eb.Property(e => e.TicketsVendidos).HasColumnName("Tickets_Vendidos");
                eb.Property(e => e.PromedioRecaudadoPorTicket).HasColumnName("Promedio_Recaudado_Por_Ticket");
                eb.Property(e => e.CantidadVentas).HasColumnName("Cantidad_Ventas");
            });
        }
    }
}
