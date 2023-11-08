using API.Entities;

namespace API.Helpers
{
    public static class QueryableExtensions
    {
        public static IQueryable<Message> MarkUnreadAsRead(this IQueryable<Message> query, string currentEmail)
        {
            var unreadMessages = query
                .Where(m => m.TimeRead == null&& m.RecipientEmail == currentEmail)
                .ToList();

            if (unreadMessages.Any())
            {
                foreach (var message in unreadMessages) message.TimeRead = DateTime.UtcNow;
            }

            return query;
        }
    }
}