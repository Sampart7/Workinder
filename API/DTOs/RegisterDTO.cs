using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDTO
    {
        [Required(ErrorMessage = "Email is required")]
        public string Email { get; set; }

        [Required(ErrorMessage = "KnownAs is required")]
        public string KnownAs { get; set; }

        [Required(ErrorMessage = "Gender is required")]
        public string Gender { get; set; }

        [Required(ErrorMessage = "DateOfBirth is required")]
        public DateTime DateOfBirth { get; set; }

        [Required(ErrorMessage = "City is required")]
        public string City { get; set; }

        [Required(ErrorMessage = "Country is required")]
        public string Country { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [StringLength(24, MinimumLength = 6, ErrorMessage = "Password must be between 6 and 24 characters")]
        [RegularExpression(@"^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]+$", 
        ErrorMessage = "Password must contain at least one uppercase letter and one special character")]
        public string Password { get; set; }
    }
}