using Microsoft.Extensions.Options;
using RealEstateApi.Contracts.Services;
using RealEstateApi.Model;
using System.Net.Mail;
using System.Net;
using System.Text;

namespace RealEstateApi.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private const string templatePath = @"Template/EmailTemplate.html";
        private readonly SMTPConfigModel _smtpConfig;

        public EmailService(IOptions<SMTPConfigModel> smtpConfig)
        {
            _smtpConfig = smtpConfig.Value;
        }

        public async Task SendTestEmail(UserEmailOptions userEmailOptions)
        {
            userEmailOptions.Subject = UpdatePlaceHolders("Hello {{UserName}}, This is test email subject from book store web app", userEmailOptions.PlaceHolders);

            userEmailOptions.Body = UpdatePlaceHolders(GetEmailBody("TestEmail"), userEmailOptions.PlaceHolders);

            await SendEmail(userEmailOptions);
        }

        public async Task SendEmailForEmailConfirmation(UserEmailOptions userEmailOptions)
        {
            if (userEmailOptions.ToEmails == null || userEmailOptions.ToEmails.Count == 0)
            {
                throw new ArgumentNullException(nameof(userEmailOptions.ToEmails), "Email address cannot be null");
            }
            userEmailOptions.Subject = UpdatePlaceHolders("Hello {{UserName}}, Confirm your email.", userEmailOptions.PlaceHolders);

            userEmailOptions.Body = UpdatePlaceHolders(GetEmailBody("EmailConfirm"), userEmailOptions.PlaceHolders);

            await SendEmail(userEmailOptions);
        }

        private async Task SendEmail(UserEmailOptions userEmailOptions)
        {
            MailMessage mail = new MailMessage
            {
                Subject = userEmailOptions.Subject,
                Body = userEmailOptions.Body,
                From = new MailAddress(_smtpConfig.SenderAddress)
            };

            foreach (var toEmail in userEmailOptions.ToEmails)
            {
                mail.To.Add(toEmail);
            }

            NetworkCredential networkCredential = new NetworkCredential(_smtpConfig.UserName, _smtpConfig.Password);

            SmtpClient smtpClient = new SmtpClient
            {
                Host = _smtpConfig.Host,
                Port = _smtpConfig.Port,
                Credentials = networkCredential
            };

            mail.BodyEncoding = Encoding.Default;

            try
            {
                await smtpClient.SendMailAsync(mail);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Failed to send email: " + ex.Message);
            }
        }

        private string GetEmailBody(string templateName)
        {
            var body = File.ReadAllText(string.Format(templatePath, templateName));
            return body;
        }

        private string UpdatePlaceHolders(string text, List<KeyValuePair<string, string>> keyValuePairs)
        {
            if (!string.IsNullOrEmpty(text) && keyValuePairs != null)
            {
                foreach (var placeholder in keyValuePairs)
                {
                    if (text.Contains(placeholder.Key))
                    {
                        text = text.Replace(placeholder.Key, placeholder.Value);
                    }
                }
            }

            return text;
        }
    }
}
