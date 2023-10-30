namespace API.SignalR
{
    public class PresenceTracker
    {
        private static readonly Dictionary<string, List<string>> OnlineUsers = new();

        public Task UserConnected(string email, string connectionId)
        {
            lock (OnlineUsers)
            {
                if (OnlineUsers.ContainsKey(email)) OnlineUsers[email].Add(connectionId);
                else OnlineUsers.Add(email, new List<string>{connectionId});
            }
            
            return Task.CompletedTask;
        }

        public Task UserDisconnected(string email, string connectionId)
        {
            lock (OnlineUsers)
            {
                if (!OnlineUsers.ContainsKey(email)) return Task.CompletedTask;
                
                OnlineUsers[email].Remove(connectionId);

                if(OnlineUsers[email].Count == 0) OnlineUsers.Remove(email);
            }

            return Task.CompletedTask;
        }

        public Task<string[]> GetOnlineUsers()
        {
            string[] onlineUsers;

            lock (OnlineUsers) onlineUsers = OnlineUsers.OrderBy(k => k.Key).Select(k => k.Key).ToArray();

            return Task.FromResult(onlineUsers);
        }

    }
}