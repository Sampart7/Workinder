using API.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    [Authorize]
    public class PresenceHub : Hub
    {
        private PresenceTracker _tracker;

        public PresenceHub(PresenceTracker tracker)
        {
            _tracker = tracker;
        }
        public override async Task OnConnectedAsync() 
        {
            var userEmail = Context.User.GetEmail();
            var isOnline = await _tracker.UserConnected(userEmail, Context.ConnectionId);

            if (isOnline) await Clients.Others.SendAsync("UserIsOnline", userEmail);

            var currentUsers = await _tracker.GetOnlineUsers();
            await Clients.Caller.SendAsync("GetOnlineUsers", currentUsers);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var userEmail = Context.User.GetEmail();
            var isOffline = await _tracker.UserDisconnected(userEmail, Context.ConnectionId);

            if (isOffline) await Clients.Others.SendAsync("UserIsOffline", userEmail);

            await base.OnDisconnectedAsync(exception);
        }
    }
}