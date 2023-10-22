namespace API.Helpers.Paging
{
    public class PaginationParams
    {
        private const int MaxPageSize = 50;
        public int PageNumber { get; set; } = 1;
        private int pageSize = 4;
        public int PageSize 
        { 
            get => pageSize; 
            set => pageSize = (value > MaxPageSize) ? MaxPageSize : value; 
        }
    }
}