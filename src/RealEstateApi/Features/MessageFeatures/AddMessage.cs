using AutoMapper;
using MediatR;
using RealEstateApi.Contracts.Data;
using RealEstateApi.Contracts.Services;

namespace RealEstateApi.Features.MessageFeatures
{
    public class AddMessage
    {
        public record Request(MessageDto newMessage) : IRequest<MessageDto>;

        public class Handler : IRequestHandler<Request, MessageDto>
        {
            private readonly IMessageService messagesService;
            private readonly IMapper mapper;
            public Handler(IMessageService messagesService, IMapper mapper)
            {
                this.messagesService = messagesService;
                this.mapper = mapper;
            }
            public async Task<MessageDto> Handle(
                Request request, CancellationToken cancellationToken)
            {
                var message = mapper.Map<MessageDto>(request.newMessage);
                await messagesService.AddMessageAsync(message);

                return request.newMessage;
            }
        }
    }
}
