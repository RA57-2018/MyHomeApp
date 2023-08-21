using MediatR;
using RealEstateApi.Contracts.Services;
using RealEstateApi.Model;

namespace RealEstateApi.Features.AdvertisementFeatures
{
    public class GetMyAdvertisements
    {
        public record Request(string id) : IRequest<IEnumerable<Advertisement>>;

        public class Handler : IRequestHandler<Request, IEnumerable<Advertisement>>
        {
            private readonly IAdvertisementService advertisementService;
            public Handler(IAdvertisementService advertisementService)
            {
                this.advertisementService = advertisementService;
            }
            public async Task<IEnumerable<Advertisement>> Handle(Request request, CancellationToken cancellationToken)
            {
                return await advertisementService.GetMyAdvertisementsAsync(request.id);
            }
        }
    }
}
