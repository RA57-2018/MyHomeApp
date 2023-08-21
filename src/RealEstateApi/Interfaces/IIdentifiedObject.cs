namespace RealEstateApi.Interfaces
{
    public interface IIdentifiedObject<T>
    {
        T Id { get; set; }
    }
}
