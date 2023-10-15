using System.Security.Claims;
using API.DTOs;
using API.Entities;
using API.Helpers.Paging;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepo;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;
        public UsersController(IUserRepository userRepo, IMapper mapper, IPhotoService photoService)
        {
            _mapper = mapper;
            _userRepo = userRepo;
            _photoService = photoService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<MemberDTO>>> GetUsers([FromQuery]UserParams userParams)
        {
            var currentUser = await _userRepo.GetUserByEmailAsync(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            userParams.CurrentEmail = currentUser.Email;

            var users = await _userRepo.GetMembersAsync(userParams);

            Response.AddPaginationHeader(new PaginationHeader(users.CurrentPage, 
                users.PageSize, users.TotalCount, users.TotalPages));

            return Ok(users);
        }

        [HttpGet("{email}", Name = "GetUser")]
        public async Task<ActionResult<MemberDTO>> GetUser(string email)
        {
            return await _userRepo.GetMemberAsync(email);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDTO memberUpdateDTO)
        {
            var email = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userRepo.GetUserByEmailAsync(email);

            if (user == null) return NotFound();

            _mapper.Map(memberUpdateDTO, user);
            _userRepo.Update(user);

            if (await _userRepo.SaveAllAsync()) return NoContent();
            return BadRequest("Failed to update user");
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDTO>> AddPhoto(IFormFile file)
        {
            var email = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userRepo.GetUserByEmailAsync(email);

            if (user == null) return NotFound();

            var result = await _photoService.AddPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            if (user.Photos.Count == 0) photo.IsMain = true;

            user.Photos.Add(photo);

            if (await _userRepo.SaveAllAsync())
            {
                return CreatedAtAction(nameof(GetUser), new {email = user.Email}, _mapper.Map<PhotoDTO>(photo));
            }

            return BadRequest("Problem addding photo");
        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var email = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userRepo.GetUserByEmailAsync(email);
            if (user == null) return NotFound();

            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);
            if (photo == null) return NotFound();
            if (photo.IsMain) return BadRequest("This is already your main photo");

            var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);
            if (currentMain != null) currentMain.IsMain = false;

            photo.IsMain = true;

            if (await _userRepo.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to set main photo");
        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var email = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userRepo.GetUserByEmailAsync(email);
            if (user == null) return NotFound();

            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);
            if (photo == null) return NotFound();

            if (photo.IsMain) return BadRequest("You cannot delete your main photo");

            if (photo.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
            }

            user.Photos.Remove(photo);

            if (await _userRepo.SaveAllAsync()) return Ok();

            return BadRequest("Failed to delete the photo");
        }

        [HttpPost("add-tag")]
        public async Task<ActionResult> AddTags([FromBody] TagDTO tagDTO)
        {
            var email = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userRepo.GetUserByEmailAsync(email);

            if (user == null) return NotFound();

            var tag = new Tag
            {
                Name = tagDTO.Name,
                AppUser = user
            };
            
            user.Tags.Add(tag);

            if (await _userRepo.SaveAllAsync()) return Ok();

            return BadRequest("Failed to add the tag");
        }

        [HttpDelete("delete-tag/{tagId}")]
        public async Task<ActionResult> DeleteTag(int tagId)
        {
            var email = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userRepo.GetUserByEmailAsync(email);
            if (user == null) return NotFound();

            var tag = user.Tags.FirstOrDefault(t => t.Id == tagId);

            if (tag == null) return NotFound();

            user.Tags.Remove(tag);

            if (await _userRepo.SaveAllAsync()) return Ok();
            
            return BadRequest("Failed to delete the photo");
        }
        
    }
}