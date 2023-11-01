using System.Security.AccessControl;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    [Authorize]
    public class MessageHub : Hub
    {
        private readonly IMessageRepository _messageRepo;
        private readonly IUserRepository _userRepo;
        private readonly IMapper _mapper;
        private readonly IHubContext<PresenceHub> _presenceHub;

        public MessageHub(IMessageRepository messageRepo, IUserRepository userRepo, 
            IMapper mapper, IHubContext<PresenceHub> presenceHub)
        {
            _messageRepo = messageRepo;
            _userRepo = userRepo;
            _mapper = mapper;
            _presenceHub = presenceHub;
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var otherUser = httpContext.Request.Query["user"];
            var groupName = GetGroupName(Context.User.GetEmail(), otherUser);

            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            var group = await AddToGroup(groupName);

            await Clients.Group(groupName).SendAsync("UpdatedGroup", group);

            var messages = await _messageRepo.GetMessageThread(Context.User.GetEmail(), otherUser);

            await Clients.Group(groupName).SendAsync("ReceiveMessageThread", messages);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var group = await RemoveFromGroup();
            await Clients.Group(group.Name).SendAsync("UpdatedGroup");
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(CreateMessageDTO createMessageDTO)
        {
            var email = Context.User.GetEmail();

            if (email == createMessageDTO.RecipientEmail.ToLower())
                throw new HubException("You cannot send messages to yourself");

            var sender = await _userRepo.GetUserByEmailAsync(email);
            var recipient = await _userRepo.GetUserByEmailAsync(createMessageDTO.RecipientEmail);

            if (recipient == null) throw new HubException("Not found user");

            var message = new Message
            {
                Sender = sender,
                Recipient = recipient,
                SenderEmail = sender.Email,
                RecipientEmail = recipient.Email,
                Content = createMessageDTO.Content
            };

            var groupName = GetGroupName(sender.Email, recipient.Email);

            var group = await _messageRepo.GetMessageGroup(groupName);

            if (group.Connections.Any(u => u.Email == recipient.Email))
            {
                message.TimeRead = DateTime.UtcNow;
            }
            else
            {
                var connections = await PresenceTracker.GetConnectionsForUser(recipient.Email);
                if (connections != null)
                {
                    await _presenceHub.Clients.Clients(connections).SendAsync("NewMessageReceived",
                       new {email = sender.Email, knownAs = sender.KnownAs});
                }
            }

            _messageRepo.AddMessage(message);

            if (await _messageRepo.SaveAllAsync()) 
            {
                await Clients.Group(groupName).SendAsync("NewMessage", _mapper.Map<MessageDTO>(message));
            }
        }

        private string GetGroupName(string caller, string other)
        {
            var stringCompare = string.CompareOrdinal(caller, other) < 0;
            return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}";
        }

        private async Task<Group> AddToGroup(string groupName)
        {
            var group = await _messageRepo.GetMessageGroup(groupName);
            var connection = new Connection(Context.ConnectionId, Context.User.GetEmail());

            if (group == null) 
            {
                group = new Group(groupName);
                _messageRepo.AddGroup(group);
            }

            group.Connections.Add(connection);
            
            if (await _messageRepo.SaveAllAsync()) return group;

            throw new HubException("Failed to add to group");
        }

        private async Task<Group> RemoveFromGroup()
        {
            var group = await _messageRepo.GetGroupForConnection(Context.ConnectionId);
            var connection = group.Connections.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            _messageRepo.RemoveConnection(connection);

            if (await _messageRepo.SaveAllAsync()) return group;

            throw new HubException("Failed to remove from group");
        }
    }
}