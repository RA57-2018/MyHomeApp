using Microsoft.IdentityModel.Tokens;
using RealEstateApi.Contracts.Data;
using RealEstateApi.Contracts.Repositories;
using RealEstateApi.Contracts.Services;
using RealEstateApi.Model;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace RealEstateApi.Infrastructure.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public Task DeleteUserAsync(string id)
        {
            return _userRepository.DeleteUserAsync(id);
        }

        public async Task<User> EditUserAsync(User user)
        {
            return await _userRepository.EditUserAsync(user);
        }

        public async Task<User> GetReplier(string replierId)
        {
            return await _userRepository.GetReplier(replierId);
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _userRepository.GetAllUsersAsync();
        }

        public async Task<User> GetUserByEmailAsync(string email)
        {
            return await _userRepository.GetUserByEmailAsync(email);
        }

        public async Task<User> GetUserByIdAsync(string id)
        {
            return await _userRepository.GetUserByIdAsync(id);
        }

        public async Task<User> RegistrateUserAsync(UserRegistration user)
        {
            return await _userRepository.RegistrateUserAsync(user);
        }

        public async Task<IResult> LoginUser(UserLoginDto login)
        {
            string accessToken = "";
            string refreshToken = "";
            User currentUser = null;
            var userFound = await _userRepository.LoginUserAsync(login);

            //if (userFound != null)
            //{
                accessToken = GenerateAccessToken(login.Email);
                refreshToken = GenerateRefreshToken();
                currentUser = userFound;
            //}
            //else
            //{
            //    return Results.Unauthorized();
            //}

            return Results.Ok(new LoginResponseModel
            {
                Access = accessToken,
                Refresh = refreshToken,
                User = currentUser
            });
        }

        private string GenerateAccessToken(string email)
        {
            var key = GenerateRandomString(50);
            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));

            var expirationTime = DateTime.UtcNow.AddHours(1);

            var claims = new[]
            {
                new Claim(ClaimTypes.Email, email)
            };

            var token = new JwtSecurityToken(
                issuer: "smtp.mailtrap.live",
                audience: "userservice",
                claims: claims,
                expires: expirationTime,
                signingCredentials: new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256)
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            return tokenString;
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var rng = new RNGCryptoServiceProvider())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }

        private string GenerateRandomString(int length)
        {
            const string validChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+-=[]{}|;:,.<>?";

            using (var rng = new RNGCryptoServiceProvider())
            {
                var randomBytes = new byte[length];
                rng.GetBytes(randomBytes);

                var stringBuilder = new StringBuilder(length);

                foreach (byte randomByte in randomBytes)
                {
                    stringBuilder.Append(validChars[randomByte % validChars.Length]);
                }

                return stringBuilder.ToString();
            }
        }
    }
}
