namespace API.DTOs
{
    public class LikeDTO
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public int Age { get; set; }
        public string KnownAs { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string PhotoUrl { get; set; }
    }
}