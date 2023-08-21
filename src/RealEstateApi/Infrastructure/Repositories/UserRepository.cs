using Microsoft.EntityFrameworkCore;
using RealEstateApi.Contracts.Repositories;
using RealEstateApi.Model;
using shortid;
using RealEstateApi.Contracts.Data;
using System.Security.Cryptography;
using RealEstateApi.Contracts.Services;

namespace RealEstateApi.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly CoreContext _coreContext;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;

        public UserRepository(CoreContext coreContext, IConfiguration configuration, IEmailService emailService)
        {
            _coreContext = coreContext;
            _configuration = configuration;
            _emailService = emailService;
        }

        public async Task<User> GetUserByIdAsync(string id)
        {
            User user = _coreContext.Users.Where(x => x.Id == id && !x.IsDeleted).SingleOrDefault();
            if (user == null)
            {
                throw new NotImplementedException();
            }
            return user;
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            IEnumerable<User> users = await _coreContext.Users.ToListAsync();
            return users;
        }

        public async Task<User> GetUserByEmailAsync(string email)
        {
            return _coreContext.Users.Where(x => x.Email == email && !x.IsDeleted).SingleOrDefault();
        }

        public async Task<User> GetReplier(string replierId)
        {
            return _coreContext.Users.Where(x => x.Id == replierId && !x.IsDeleted).SingleOrDefault();
        }

        public async Task<User> EditUserAsync(User user)
        {
            User editUser = _coreContext.Users.Update(user).Entity;
            await _coreContext.SaveChangesAsync();

            return editUser;
        }

        public async Task DeleteUserAsync(string id)
        {
            User user = await GetUserByIdAsync(id);
            user.IsDeleted = true;
            await EditUserAsync(user);
        }

        public async Task<User> RegistrateUserAsync(UserRegistration user)
        {
            string token = GenerateVerificationToken();

            User newUser = new User
            {
                Id = ShortId.Generate(),
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Address = user.Address,
                PhoneNumber = user.PhoneNumber,
                Points = 0,
                RoleId = Model.Enum.Roles.RegisteredUser,
                Password = user.Password,
                VerificationToken = token,
            };

            User savedUser = (await _coreContext.Users.AddAsync(newUser)).Entity;
            try
            {
                await _coreContext.SaveChangesAsync();
            }catch (Exception e)
            {
                Console.WriteLine("Failed to save user: " + e.Message);
            }

            try
            {
                await SendEmailConfirmationEmail(user, token);
                savedUser.IsVerified = true;
                await _coreContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine("Failed to send email: " + ex.Message);
            }

            return savedUser;
        }

        private string GenerateVerificationToken()
        {
            byte[] tokenBytes = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(tokenBytes);
            }
            string token = Convert.ToBase64String(tokenBytes);

            return token;
        }

        private async Task SendEmailConfirmationEmail(UserRegistration user, string token)
        {
            string appDomain = _configuration.GetValue<string>("AppDomain");
            string confirmationLink = _configuration.GetValue<string>("EmailConfirmation");

            UserEmailOptions options = new UserEmailOptions
            {
                ToEmails = new List<string>() { user.Email },
                PlaceHolders = new List<KeyValuePair<string, string>>()
                {
                    new KeyValuePair<string, string>("{{UserName}}", user.FirstName),
                    new KeyValuePair<string, string>("{{Link}}",
                        string.Format("http://localhost:3000/login/" + appDomain + "/" + confirmationLink, user.Email, token))
                }
            };

            await _emailService.SendEmailForEmailConfirmation(options);
        }

        public async Task<User> LoginUserAsync(UserLoginDto userLoginDto)
        {
            User user = _coreContext.Users.Where(x => x.Email == userLoginDto.Email && x.Password == userLoginDto.Password && !x.IsDeleted).FirstOrDefault();
            return user;
        }
    }
}
