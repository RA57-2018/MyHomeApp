namespace RealEstateApi.Interfaces
{
    public interface ITimestampedObject
    {
        DateTime CreatedAt { get; set; }
        DateTime UpdatedAt { get; set; }
    }
}
