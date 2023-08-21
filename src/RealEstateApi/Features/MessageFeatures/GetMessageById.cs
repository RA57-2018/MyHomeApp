using AutoMapper;
using MediatR;
using RealEstateApi.Contracts.Services;
using RealEstateApi.Model;

namespace RealEstateApi.Features.MessageFeatures
{
    public class GetMessageById
    {
        public record Request(int id) : IRequest<Messages>;

        public class Handler : IRequestHandler<Request, Messages>
        {
            private readonly IMessageService messagesService;
            private readonly IMapper mapper;
            public Handler(IMessageService messagesService, IMapper mapper)
            {
                this.messagesService = messagesService;
                this.mapper = mapper;
            }
            public async Task<Messages> Handle(Request request, CancellationToken cancellationToken)
            {
                var messages = await messagesService.GetMessageByIdAsync(request.id);
                return messages;
            }
        }
    }
}
