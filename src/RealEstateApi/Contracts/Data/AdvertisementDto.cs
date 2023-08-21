using RealEstateApi.Model.Enum;

namespace RealEstateApi.Contracts.Data
{
    public class AdvertisementDto
    {
        public RealEstateType RealEstateType { get; set; }
        public AdvertisementType AdvertisementType { get; set; }
        public string City { get; set; }
        public int Price { get; set; }
        public int Quadrature { get; set; }
    }
}
