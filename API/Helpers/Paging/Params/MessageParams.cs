using API.Helpers.Paging;

namespace API.Helpers
{
    public class MessageParams : PaginationParams
    {
        public string Email { get; set; }
        public string Container { get; set; } = "Unread";
    }
}