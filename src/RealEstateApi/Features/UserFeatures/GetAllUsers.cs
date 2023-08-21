using MediatR;
using RealEstateApi.Contracts.Services;
using RealEstateApi.Model;

namespace RealEstateApi.Features.UserFeatures
{
    public class GetAllUsers
    {
        public record Request : IRequest<IEnumerable<User>>;

        public class Handler : IRequestHandler<Request, IEnumerable<User>>
        {
            private readonly IUserService userService;
            public Handler(IUserService userService)
            {
                this.userService = userService;
            }
            public async Task<IEnumerable<User>> Handle
                (Request request, CancellationToken cancellationToken)
            {
                var allUsers = await userService.GetAllUsersAsync();
                return allUsers;
            }
        }
    }
}
