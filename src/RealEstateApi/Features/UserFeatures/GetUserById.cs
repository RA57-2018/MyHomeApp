using MediatR;
using RealEstateApi.Contracts.Services;
using RealEstateApi.Model;

namespace RealEstateApi.Features.UserFeatures
{
    public class GetUserById
    {
        public record Request(string id) : IRequest<User>;

        public class Handler : IRequestHandler<Request, User>
        {
            private readonly IUserService userService;
            public Handler(IUserService userService)
            {
                this.userService = userService;
            }
            public async Task<User> Handle(Request request, CancellationToken cancellationToken)
            {
                var user = await userService.GetUserByIdAsync(request.id);
                return user;
            }
        }
    }
}
