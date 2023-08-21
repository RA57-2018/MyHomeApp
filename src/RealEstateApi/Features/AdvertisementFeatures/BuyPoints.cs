using MediatR;
using RealEstateApi.Contracts.Data;
using RealEstateApi.Contracts.Services;
using Stripe;

namespace RealEstateApi.Features.AdvertisementFeatures
{
    public class BuyPoints
    {
        public record Request(PaymentDto paymentDto) : IRequest<PaymentIntent>;

        public class Handler : IRequestHandler<Request, PaymentIntent>
        {
            private readonly IAdvertisementService advertisementService;
            public Handler(IAdvertisementService advertisementService)
            {
                this.advertisementService = advertisementService;
            }
            public async Task<PaymentIntent> Handle(Request request, CancellationToken cancellationToken)
            {
                return await advertisementService.CreateCharge(request.paymentDto);
            }
        }
    }
}
