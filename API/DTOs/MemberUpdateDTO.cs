using API.DataTransferObjects;

namespace API.DTOs
{
    public class MemberUpdateDTO
    {
        public string Interests { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string KnownAs { get; set; }
        public string Gender { get; set; }
        public string DateofBirth { get; set; }

        //public ICollection<TagDTO> Tags { get; set; }
    }
}