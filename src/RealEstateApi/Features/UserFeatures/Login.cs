using AutoMapper;
using MediatR;
using RealEstateApi.Contracts.Data;
using RealEstateApi.Contracts.Services;

namespace RealEstateApi.Features.UserFeatures
{
    public class Login
    {
        public record Request(UserLoginDto loginUser) : IRequest<IResult>;

        public class Handler : IRequestHandler<Request, IResult>
        {
            private readonly IUserService userService;
            private readonly IMapper mapper;

            public Handler(IUserService userService, IMapper mapper)
            {
                this.userService = userService;
                this.mapper = mapper;
            }
            public async Task<IResult> Handle(Request request, CancellationToken cancellationToken)
            {
                var user = mapper.Map<UserLoginDto>(request.loginUser);
                return await userService.LoginUser(user);
            }
        }
    }
}
