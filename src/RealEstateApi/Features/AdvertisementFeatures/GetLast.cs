using MediatR;
using RealEstateApi.Contracts.Services;
using RealEstateApi.Model;

namespace RealEstateApi.Features.AdvertisementFeatures
{
    public class GetLast
    {
        public record Request : IRequest<Advertisement>;

        public class Handler : IRequestHandler<Request, Advertisement>
        {
            private readonly IAdvertisementService advertisementService;
            public Handler(IAdvertisementService advertisementService)
            {
                this.advertisementService = advertisementService;
            }
            public async Task<Advertisement> Handle(Request request, CancellationToken cancellationToken)
            {
                return await advertisementService.GetLast();
            }
        }
    }
}
