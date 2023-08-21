using RealEstateApi.Model;

namespace RealEstateApi.Contracts.Services
{
    public interface IEmailService
    {
        Task SendTestEmail(UserEmailOptions userEmailOptions);
        Task SendEmailForEmailConfirmation(UserEmailOptions userEmailOptions);
    }
}
