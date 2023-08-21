using Org.BouncyCastle.Bcpg;
using Org.BouncyCastle.Crypto.Tls;
using RealEstateApi.Interfaces;
using RealEstateApi.Model.Enum;

namespace RealEstateApi.Model
{
    public class Advertisement : IIdentifiedObject<int>, ITimestampedObject
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public RealEstateType Type { get; set; }
        public AdvertisementType AdvertisementType { get; set;}
        public StatusType Status { get; set; }
        public DateTime RealiseDate { get; set; }
        public int Quadrature { get; set; }
        public int Price { get; set; }
        public string Description { get; set; }
        public int AddressId { get; set; }
        public Location Address { get; set; }
        public List<int> ImageId { get; set; }
        public ICollection<Image> Images { get; set; }
        public bool IsDeleted { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
        public bool IsFavourite { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool IsPublished { get; set; }

        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
    }
}
