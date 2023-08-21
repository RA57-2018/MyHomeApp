using AutoMapper;
using MediatR;
using RealEstateApi.Contracts.Data;
using RealEstateApi.Contracts.Services;
using RealEstateApi.Model;

namespace RealEstateApi.Features.AdvertisementFeatures
{
    public class PublishAdvertisement
    {
        public record Request(PublishAdvertisementDto newAdvertisement) : IRequest<PublishAdvertisementDto>;

        public class Handler : IRequestHandler<Request, PublishAdvertisementDto>
        {
            private readonly IAdvertisementService advertisementService;
            private readonly IMapper mapper;
            public Handler(IAdvertisementService advertisementService, IMapper mapper)
            {
                this.advertisementService = advertisementService;
                this.mapper = mapper;
            }
            public async Task<PublishAdvertisementDto> Handle(Request request, CancellationToken cancellationToken)
            {
                var publishAdvertisement = mapper.Map<PublishAdvertisementDto>(request.newAdvertisement);
                await advertisementService.PublishAdvertisementAsync(publishAdvertisement);

                return request.newAdvertisement;
            }
        }
    }
}
