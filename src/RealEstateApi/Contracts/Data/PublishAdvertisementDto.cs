using RealEstateApi.Model;
using RealEstateApi.Model.Enum;

namespace RealEstateApi.Contracts.Data
{
    public class PublishAdvertisementDto
    {
        public string Title { get; set; }
        public RealEstateType Type { get; set; }
        public AdvertisementType AdvertisementType { get; set; }
        public StatusType Status { get; set; }
        public DateTime RealiseDate { get; set; }
        public int Quadrature { get; set; }
        public int Price { get; set; }
        public string Description { get; set; }
        public LocationDto Address { get; set; }
        public string UserId { get; set; }
    }
}
