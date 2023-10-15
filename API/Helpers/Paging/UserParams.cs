namespace API.Helpers.Paging
{
    public class UserParams
    {
        private const int MaxPageSize = 50;
        public int PageNumber { get; set; } = 1;
        private int pageSize = 4;
        public int PageSize 
        { 
            get => pageSize; 
            set => pageSize = (value > MaxPageSize) ? MaxPageSize : value; 
        }

        public string CurrentEmail { get; set; }
        public string Gender { get; set; }
        public int MinAge { get; set; } = 18;
        public int MaxAge { get; set; } = 100;
        public string SelectedTag { get; set; }
        //public string OrderBy { get; set; } = "lastActive";
    }
}