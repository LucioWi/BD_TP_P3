namespace TP_BD_P3.DTOs
{
    public class RecaudacionPeliculaDTO
    {
        public int CodPelicula { get; set; }
        public string? Pelicula { get; set; }
        public string? PaisOrigen { get; set; }
        public int DuracionMinutos { get; set; }
        public decimal TotalRecaudado { get; set; }
        public int TicketsVendidos { get; set; }
        public double PromedioRecaudadoPorTicket { get; set; }
        public int CantidadVentas { get; set; }
    }
}
