using MediatR;
using AutoMapper;
using RealEstateApi.Contracts.Services;
using RealEstateApi.Contracts.Data;

namespace RealEstateApi.Features.UserFeatures
{
    public class Register
    {
        public record Request(UserRegistration newUser) : IRequest<UserRegistration>;

        public class Handler : IRequestHandler<Request, UserRegistration>
        {
            private readonly IUserService userService;
            private readonly IMapper mapper;

            public Handler(IUserService userService, IMapper mapper)
            {
                this.userService = userService;
                this.mapper = mapper;
            }
            public async Task<UserRegistration> Handle(Request request, CancellationToken cancellationToken)
            {
                var user = mapper.Map<UserRegistration>(request.newUser);
                await userService.RegistrateUserAsync(user);
                return request.newUser;
            }
        }
    }
}
