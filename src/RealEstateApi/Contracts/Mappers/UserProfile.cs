using AutoMapper;
using RealEstateApi.Model;

namespace RealEstateApi.Contracts.Mappers
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<User, User>()
                .ReverseMap();
        }
    }
}
