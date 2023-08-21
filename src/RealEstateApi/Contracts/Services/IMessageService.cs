using Microsoft.AspNetCore.Mvc;
using RealEstateApi.Contracts.Data;
using RealEstateApi.Model;

namespace RealEstateApi.Contracts.Services
{
    public interface IMessageService
    {
        Task<Messages> GetMessageByIdAsync(int messageId);
        Task<IEnumerable<Messages>> GetAllMessagesAsync();
        Task<IEnumerable<Messages>> GetMyMessagesAsync(string id);
        Task<Messages> AddMessageAsync(MessageDto message);
        Task<Messages> UpdateMessageAsync(Messages messages);
        Task DeleteMessageAsync(int id);
    }
}
