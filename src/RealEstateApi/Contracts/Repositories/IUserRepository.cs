using RealEstateApi.Contracts.Data;
using RealEstateApi.Model;

namespace RealEstateApi.Contracts.Repositories
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User> EditUserAsync(User user);
        Task DeleteUserAsync(string id);
        Task<User> RegistrateUserAsync(UserRegistration user);
        Task<User> LoginUserAsync(UserLoginDto userLoginDto);
        Task<User> GetUserByEmailAsync(string email);
        Task<User> GetUserByIdAsync(string id);
        Task<User> GetReplier(string replierId);
    }
}
