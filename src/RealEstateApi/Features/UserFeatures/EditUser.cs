using AutoMapper;
using MediatR;
using RealEstateApi.Contracts.Services;
using RealEstateApi.Model;

namespace RealEstateApi.Features.UserFeatures
{
    public class EditUser
    {
        public record Request(User editUser) : IRequest<User>;

        public class Handler : IRequestHandler<Request, User>
        {
            private readonly IUserService userService;
            private readonly IMapper mapper;

            public Handler(IUserService userService, IMapper mapper)
            {
                this.userService = userService;
                this.mapper = mapper;
            }
            public async Task<User> Handle(Request request, CancellationToken cancellationToken)
            {
                var user = mapper.Map<User>(request.editUser);
                await userService.EditUserAsync(user);

                return request.editUser;
            }
        }
    }
}
