namespace GreenHaven.API.DTOs
{
    public class UpdateOrderDto
    {
        public string Status { get; set; }
        public string? OrderIdentifier { get; set; }
        public string? Notes { get; set; }
        public List<OrderItemUpdateDto>? Items { get; set; }
    }
}
