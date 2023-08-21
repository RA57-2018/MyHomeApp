using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RealEstateApi.Contracts.Data;
using RealEstateApi.Contracts.Repositories;
using RealEstateApi.Infrastructure.Services;
using RealEstateApi.Model;

namespace RealEstateApi.Infrastructure.Repositories
{
    public class MessageRepository : IMessageRepository
    {
        private readonly CoreContext _context;
        private readonly IUserRepository _userRepository;

        public MessageRepository(CoreContext context, IUserRepository userRepository)
        {
            _context = context;
            _userRepository = userRepository;
        }

        public async Task<Messages> GetMessageByIdAsync(int messageId)
        {
            Messages message = await _context.Messages.SingleOrDefaultAsync(x => x.Id == messageId);
            if (message == null)
            {
                throw new NotImplementedException();
            }
            return message;
        }

        public async Task<IEnumerable<Messages>> GetAllMessagesAsync()
        {
            IEnumerable<Messages> messages = await _context.Messages.ToListAsync();
            return messages;
        }

        public async Task<IEnumerable<Messages>> GetMyMessagesAsync(string id)
        {
            User user = await _userRepository.GetUserByIdAsync(id);
            IEnumerable<Messages> mess = await _context.Messages.Where(x => (x.Sender == user.Id || x.Replier == user.Id) && !x.IsDeleted).ToListAsync();
            return mess;
        }

        public async Task<Messages> AddMessageAsync(Messages message)
        {

            Messages messageSaved = (await _context.Messages.AddAsync(message)).Entity;
            await _context.SaveChangesAsync();

            return messageSaved;
        }

        public async Task<Messages> UpdateMessageAsync(Messages messages)
        {
            Messages m = _context.Messages.Update(messages).Entity;
            await _context.SaveChangesAsync();
            return m;
        }

        public async Task DeleteMessageAsync(int id)
        {
            Messages message = await GetMessageByIdAsync(id);
            message.IsDeleted = true;
            await UpdateMessageAsync(message);
        }
    }
}
