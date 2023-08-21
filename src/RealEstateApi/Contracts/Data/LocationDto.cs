namespace RealEstateApi.Contracts.Data
{
    public class LocationDto
    {
        public string Road { get; set; }
        public int HouseNumber { get; set; }
        public string City { get; set; }
        public int PostCode { get; set; }
        public string State { get; set; }
        public Double Lat { get; set; }
        public Double Lng { get; set; }
    }
}
