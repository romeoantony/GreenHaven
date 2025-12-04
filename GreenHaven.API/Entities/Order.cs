using System.ComponentModel.DataAnnotations.Schema;

namespace GreenHaven.API.Entities
{
    public class Order
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }
        
        public string? OrderIdentifier { get; set; }
        public string? Notes { get; set; }
        public string ShippingAddress { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public DateTime? LastUpdated { get; set; }

        public string Status { get; set; } = "Pending";

        public ApplicationUser User { get; set; }
        public List<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
