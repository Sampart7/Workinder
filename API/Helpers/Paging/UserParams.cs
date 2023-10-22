namespace API.Helpers.Paging
{
    public class UserParams : PaginationParams
    {
        public string CurrentEmail { get; set; }
        public string Gender { get; set; }
        public int MinAge { get; set; } = 18;
        public int MaxAge { get; set; } = 100;
        public string SelectedTag { get; set; }
        public string OrderBy { get; set; } = "lastActive";
    }
}