using MediatR;
using RealEstateApi.Contracts.Data;
using RealEstateApi.Contracts.Services;

namespace RealEstateApi.Features.AdvertisementFeatures
{
    public class ChooseAdvertisement
    {
        public record Request(IdDto ids) : IRequest<IResult>;

        public class Handler : IRequestHandler<Request, IResult>
        {
            private readonly IAdvertisementService advertisementService;
            public Handler(IAdvertisementService advertisementService)
            {
                this.advertisementService = advertisementService;
            }
            public async Task<IResult> Handle(Request request, CancellationToken cancellationToken)
            {
                await advertisementService.ChooseAdvertisementAsync(request.ids);
                return Results.Ok();
            }
        }
    }
}
