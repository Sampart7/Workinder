namespace API.Entities
{
    public class Connection
    {
        public Connection() {}
        public Connection(string connectionId, string email)
        {
            ConnectionId = connectionId;
            Email = email;
        }

        public string ConnectionId { get; set; }
        public string Email { get; set; }
    }
}