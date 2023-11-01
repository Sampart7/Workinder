using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Helpers.Paging;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext _ctx;
        private readonly IMapper _mapper;
        public MessageRepository(DataContext ctx, IMapper mapper)
        {
            _ctx = ctx;
            _mapper = mapper;
        }

        public void AddGroup(Group group)
        {
            _ctx.Groups.Add(group);
        }

        public void AddMessage(Message message)
        {
            _ctx.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            _ctx.Messages.Remove(message);
        }

        public async Task<Connection> GetConnection(string connectionId)
        {
            return await _ctx.Connections.FindAsync(connectionId);
        }

        public async Task<Group> GetGroupForConnection(string connectionId)
        {
            return await _ctx.Groups.Include(x => x.Connections)
                .Where(x => x.Connections.Any(c => c.ConnectionId == connectionId))
                .FirstOrDefaultAsync();
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _ctx.Messages.FindAsync(id);
        }

        public async Task<Group> GetMessageGroup(string groupName)
        {
            return await _ctx.Groups.Include(c => c.Connections).FirstOrDefaultAsync(n => n.Name == groupName);
        }

        public async Task<PagedList<MessageDTO>> GetMessagesForUser(MessageParams messageParams)
        {
            var query = _ctx.Messages.OrderByDescending(m => m.TimeSent).AsQueryable();

            query = messageParams.Container switch
            {
                "Inbox" => query.Where(u => u.RecipientEmail == messageParams.Email && u.RecipientDeleted == false),
                "Outbox" => query.Where(u => u.SenderEmail == messageParams.Email && u.SenderDeleted == false),
                _ => query.Where(u => u.RecipientEmail == messageParams.Email && u.RecipientDeleted == false 
                                  && u.TimeRead == null) 
            };
            var messages = query.ProjectTo<MessageDTO>(_mapper.ConfigurationProvider);

            return await PagedList<MessageDTO>
                .CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<MessageDTO>> GetMessageThread(string currentEmail, string recipientEmail)
        {
            var messages = await _ctx.Messages
                .Include(u => u.Sender).ThenInclude(p => p.Photos)
                .Include(u => u.Recipient).ThenInclude(p => p.Photos)
                .Where(m => 
                    m.RecipientEmail == currentEmail && 
                    m.RecipientDeleted == false &&
                    m.SenderEmail == recipientEmail 
                    ||
                    m.SenderEmail == currentEmail && 
                    m.SenderDeleted == false && 
                    m.RecipientEmail == recipientEmail
                )
                .OrderBy(m => m.TimeSent)
                .ToListAsync();

            var unreadMessages = messages.Where(m => m.TimeRead == null && m.RecipientEmail == currentEmail).ToList();

            if (unreadMessages.Any())
            {
                foreach (var message in unreadMessages) message.TimeRead = DateTime.UtcNow;

                await _ctx.SaveChangesAsync();
            }

            return _mapper.Map<IEnumerable<MessageDTO>>(messages);
        }

        public void RemoveConnection(Connection connection)
        {
            _ctx.Connections.Remove(connection);
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _ctx.SaveChangesAsync() > 0;
        }
    }
}