using RealEstateApi.Contracts.Data;
using RealEstateApi.Model;

namespace RealEstateApi.Contracts.Services
{
    public interface IUserService
    {
        Task DeleteUserAsync(string id);
        Task<User> EditUserAsync(User user);
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User> RegistrateUserAsync(UserRegistration user);
        Task<IResult> LoginUser(UserLoginDto login);
        Task<User> GetUserByEmailAsync(string email);
        Task<User> GetUserByIdAsync(string id);
        Task<User> GetReplier(string replierId);
    }
}
