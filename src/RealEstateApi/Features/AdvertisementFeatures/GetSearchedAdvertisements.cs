using MediatR;
using RealEstateApi.Contracts.Data;
using RealEstateApi.Contracts.Services;
using RealEstateApi.Model;

namespace RealEstateApi.Features.AdvertisementFeatures
{
    public class GetSearchedAdvertisements
    {
        public record Request(SearchDto s) : IRequest<IEnumerable<Advertisement>>;

        public class Handler : IRequestHandler<Request, IEnumerable<Advertisement>>
        {
            private readonly IAdvertisementService advertisementService;
            public Handler(IAdvertisementService advertisementService)
            {
                this.advertisementService = advertisementService;
            }
            public async Task<IEnumerable<Advertisement>> Handle(Request request, CancellationToken cancellationToken)
            {
                var chosenAdvertisements = await advertisementService.GetSearchedAdvertisementsAsync(request.s);
                return chosenAdvertisements;
            }
        }
    }
}
