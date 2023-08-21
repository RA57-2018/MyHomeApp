using AutoMapper;
using MediatR;
using RealEstateApi.Contracts.Services;
using RealEstateApi.Model;

namespace RealEstateApi.Features.AdvertisementFeatures
{
    public class GetChosenAdvertisement
    {
        public record Request(string id) : IRequest<IEnumerable<Advertisement>>;

        public class Handler : IRequestHandler<Request, IEnumerable<Advertisement>>
        {
            private readonly IAdvertisementService advertisementService;
            private readonly IMapper mapper;
            public Handler(IAdvertisementService advertisementService, IMapper mapper)
            {
                this.advertisementService = advertisementService;
                this.mapper = mapper;
            }
            public async Task<IEnumerable<Advertisement>> Handle(Request request, CancellationToken cancellationToken)
            {
                var chosenAdvertisements = await advertisementService.GetChosenAdvertisementsAsync(request.id);
                return chosenAdvertisements.Select(mapper.Map<Advertisement>);
            }
        }
    }
}
