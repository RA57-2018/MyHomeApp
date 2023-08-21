using AutoMapper;
using RealEstateApi.Contracts.Data;
using RealEstateApi.Model;

namespace RealEstateApi.Contracts.Mappers
{
    public class AdvertisementProfile : Profile
    {
        public AdvertisementProfile()
        {
            CreateMap<Advertisement, PublishAdvertisementDto>()
                .ReverseMap();
        }
    }
}
