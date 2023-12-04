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
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IHubContext<PresenceHub> _presenceHub;

        public MessageHub(IUnitOfWork unitOfWork, IMapper mapper, IHubContext<PresenceHub> presenceHub)
        {
            _unitOfWork = unitOfWork;
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
            await Clients.Group(groupName).SendAsync("UserOnlineInGroup", group);

            var messages = await 
                _unitOfWork.MessageRepository.GetMessageThread(Context.User.GetEmail(), otherUser);

            if (_unitOfWork.HasChanges()) await _unitOfWork.Complete();

            await Clients.Caller.SendAsync("ReceiveMessageThread", messages);
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

            var sender = await _unitOfWork.UserRepository.GetUserByEmailAsync(email);
            var recipient = await _unitOfWork.UserRepository.GetUserByEmailAsync(createMessageDTO.RecipientEmail);

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

            var group = await _unitOfWork.MessageRepository.GetMessageGroup(groupName);

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

            _unitOfWork.MessageRepository.AddMessage(message);

            if (await _unitOfWork.Complete()) 
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
            var group = await _unitOfWork.MessageRepository.GetMessageGroup(groupName);
            var connection = new Connection(Context.ConnectionId, Context.User.GetEmail());

            if (group == null) 
            {
                group = new Group(groupName);
                _unitOfWork.MessageRepository.AddGroup(group);
            }

            group.Connections.Add(connection);
            
            if (await _unitOfWork.Complete()) return group;

            throw new HubException("Failed to add to group");
        }

        private async Task<Group> RemoveFromGroup()
        {
            var group = await _unitOfWork.MessageRepository.GetGroupForConnection(Context.ConnectionId);
            var connection = group.Connections.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            _unitOfWork.MessageRepository.RemoveConnection(connection);

            if (await _unitOfWork.Complete()) return group;

            throw new HubException("Failed to remove from group");
        }

        public async Task MuteMicro(bool muteMicro)
        {
            var group = await _unitOfWork.MessageRepository.GetGroupForConnection(Context.ConnectionId);
            
            if (group != null)
            {
                await Clients.Group(group.Name).SendAsync("OnMuteMicro", new { 
                    username = Context.User.GetEmail(), 
                    mute = muteMicro 
                });
            }
            else throw new HubException("group == null");
        }

        public async Task MuteCamera(bool muteCamera)
        {
            var group = await _unitOfWork.MessageRepository.GetGroupForConnection(Context.ConnectionId);
            
            if(group != null) 
            {
                await Clients.Group(group.Name).SendAsync("OnMuteCamera", new { 
                    username = Context.User.GetEmail(), 
                    mute = muteCamera 
                });
            }
            else throw new HubException("group == null");
        }
    }
}