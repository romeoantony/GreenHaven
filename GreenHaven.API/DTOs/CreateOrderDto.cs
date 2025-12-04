namespace GreenHaven.API.DTOs
{
    public class CreateOrderDto
    {
        public List<CartItemDto> Items { get; set; }
        public string? OrderIdentifier { get; set; }
        public string ShippingAddress { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
    }
}
