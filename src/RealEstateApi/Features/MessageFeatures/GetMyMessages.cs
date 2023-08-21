using AutoMapper;
using MediatR;
using RealEstateApi.Contracts.Services;
using RealEstateApi.Model;

namespace RealEstateApi.Features.MessageFeatures
{
    public class GetMyMessages
    {
        public record Request(string id) : IRequest<IEnumerable<Messages>>;

        public class Handler : IRequestHandler<Request, IEnumerable<Messages>>
        {
            private readonly IMessageService messagesService;
            private readonly IMapper mapper;
            public Handler(IMessageService messagesService, IMapper mapper)
            {
                this.messagesService = messagesService;
                this.mapper = mapper;
            }
            public async Task<IEnumerable<Messages>> Handle(Request request, CancellationToken cancellationToken)
            {
                var messages = await messagesService.GetMyMessagesAsync(request.id);
                return messages;
            }
        }
    }
}
