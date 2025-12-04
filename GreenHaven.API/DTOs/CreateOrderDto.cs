namespace GreenHaven.API.DTOs
{
    public class CreateOrderDto
    {
        public List<CartItemDto> Items { get; set; }
        public string? OrderIdentifier { get; set; }
    }
}
