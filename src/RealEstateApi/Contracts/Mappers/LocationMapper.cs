using AutoMapper;
using RealEstateApi.Contracts.Data;
using RealEstateApi.Model;

namespace RealEstateApi.Contracts.Mappers
{
    public class LocationProfile : Profile
    {
        public LocationProfile()
        {
            CreateMap<LocationDto, Location>();
        }
    }
}
