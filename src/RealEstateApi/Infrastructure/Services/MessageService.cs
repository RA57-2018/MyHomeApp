using RealEstateApi.Contracts.Data;
using RealEstateApi.Contracts.Repositories;
using RealEstateApi.Contracts.Services;
using RealEstateApi.Model;

namespace RealEstateApi.Infrastructure.Services
{
    public class MessageService : IMessageService
    {
        private readonly IMessageRepository _messageRepository;
        private readonly IUserRepository _userRepository;

        public MessageService(IMessageRepository messageRepository, IUserRepository userRepository)
        {
            _messageRepository = messageRepository;
            _userRepository = userRepository;
        }

        public async Task<Messages> GetMessageByIdAsync(int messageId)
        {
            return await _messageRepository.GetMessageByIdAsync(messageId);
        }

        public async Task<IEnumerable<Messages>> GetAllMessagesAsync()
        {
            return await _messageRepository.GetAllMessagesAsync();
        }

        public async Task<IEnumerable<Messages>> GetMyMessagesAsync(string id)
        {
            return await _messageRepository.GetMyMessagesAsync(id);
        }

        public async Task<Messages> AddMessageAsync(MessageDto message)
        {
            User user = await _userRepository.GetUserByEmailAsync(message.Email);
            User replier = await _userRepository.GetReplier(message.Replier);
            Messages newMessage = new Messages
            {
                RequestMessage = message.RequestMessage,
                ResponseMessage = "",
                CreatedBy = user.FirstName,
                UpdatedBy = replier.FirstName,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                IsDeleted = false,
                Sender = message.Sender,
                Replier = message.Replier
            };

            return await _messageRepository.AddMessageAsync(newMessage);
        }

        public async Task<Messages> UpdateMessageAsync(Messages messages)
        {
            Messages updatedMessages = await _messageRepository.UpdateMessageAsync(messages);
            return updatedMessages;
        }

        public async Task DeleteMessageAsync(int id)
        {
            await _messageRepository.DeleteMessageAsync(id);
        }
    }
}
