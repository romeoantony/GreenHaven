namespace GreenHaven.API.Entities;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public List<Plant> Plants { get; set; } = new();
}
