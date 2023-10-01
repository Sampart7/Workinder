using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly DataContext _ctx;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;

        public AccountController(DataContext ctx, ITokenService tokenService, IMapper mapper)
        {
            _mapper = mapper;
            _ctx = ctx;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDTO>> Register(RegisterDTO registerDTO)
        {
            if (await UserExists(registerDTO.Email)) return BadRequest("Email is taken");

            var user = _mapper.Map<AppUser>(registerDTO);

            using var hmac = new HMACSHA512();

            user.Email = registerDTO.Email.ToLower();
            user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDTO.Password));
            user.PasswordSalt = hmac.Key;

            _ctx.Users.Add(user);
            await _ctx.SaveChangesAsync();

            return new UserDTO
            {
                Email = user.Email,
                Token = _tokenService.CreateToken(user),
                KnownAs = user.KnownAs,
                Gender = user.Gender
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDTO)
        {
            var user = await _ctx.Users.Include(photos => photos.Photos)
                .FirstOrDefaultAsync(user => user.Email == loginDTO.Email);

            if (user == null) return Unauthorized("Invalid Email");

            using var hmac = new HMACSHA512(user.PasswordSalt);

            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDTO.Password));

            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid password");
            }

            return new UserDTO
            {
                Email = user.Email,
                Token = _tokenService.CreateToken(user),
                PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                KnownAs = user.KnownAs,
                Gender = user.Gender
            };
        }

        private async Task<bool> UserExists(string Email)
        {
            return await _ctx.Users.AnyAsync(x => x.Email == Email.ToLower());
        }
    }
}