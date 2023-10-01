namespace API.DTOs
{
    public class MemberDTO
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string PhotoUrl { get; set; }
        public int Age { get; set; }
        public string KnownAs { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
        public string Gender { get; set; }
        public string Interests { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public ICollection<PhotoDTO> Photos { get; set; }
        public ICollection<TagDTO> Tags { get; set; }
    }
}