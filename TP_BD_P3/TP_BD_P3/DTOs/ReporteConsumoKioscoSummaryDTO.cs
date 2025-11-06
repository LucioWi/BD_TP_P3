namespace TP_BD_P3.DTOs
{
    public class ReporteConsumoKioscoSummaryDTO
    {
        public int CategoriasAnalizadas { get; set; }
        public int TotalProductosTop3 { get; set; }
        public int TotalCombosTop3 { get; set; }
        public decimal GananciaTotalTop6 { get; set; }
    }
}
