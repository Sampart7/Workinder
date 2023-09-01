using System.ComponentModel.DataAnnotations;

namespace API.DataTransferObjects
{
    public class RegisterDTO
    {
        [Required]
        public string Username { get; set; }
        [Required]
        [StringLength(24, MinimumLength = 6)]
        public string Password { get; set; }
    }
}