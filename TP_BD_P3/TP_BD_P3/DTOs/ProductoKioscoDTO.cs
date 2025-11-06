namespace TP_BD_P3.DTOs
{
    public class ProductoKioscoDTO
    {
        public string? Genero { get; set; }
        public string? Producto { get; set; }
        public int CantidadVendida { get; set; }
        public decimal MontoTotal { get; set; }
        public double PromedioGastoPorTicket { get; set; }
    }
}
