using RealEstateApi.Interfaces;

namespace RealEstateApi.Model
{
    public class Image : IIdentifiedObject<int>
    {
        public int Id { get; set; }
        public int AdvertisementId { get; set; }
        public string FileName { get; set; }
        public string ContentType { get; set; }
        public byte[] Content { get; set; }
        public bool IsDeleted { get; set; }
    }
}
