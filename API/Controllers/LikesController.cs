using System.Security.Claims;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Helpers.Paging;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class LikesController : ControllerBase
    {
        private readonly IUserRepository _userRepo;
        private readonly ILikesRepository _likesRepo;

        public LikesController(IUserRepository userRepo, ILikesRepository likesRepo)
        {
            _userRepo = userRepo;
            _likesRepo = likesRepo;
        }

        [HttpPost("{email}")]
        public async Task<ActionResult> AddLike(string email)
        {
            var sourceUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var likedUser = await _userRepo.GetUserByEmailAsync(email);
            var sourceUser = await _likesRepo.GetUserWithLikes(sourceUserId);
            
            if (likedUser == null) return NotFound();
            if (sourceUser.Email == email) return BadRequest("You cannot like yourself!");

            var userLike = await _likesRepo.GetUserLike(sourceUserId, likedUser.Id);
            if (userLike != null) return BadRequest("You already like this user!");

            userLike = new UserLike
            {
                SourceUserId = sourceUserId,
                TargetUserId = likedUser.Id
            };

            sourceUser.LikedUsers.Add(userLike);
            if (await _userRepo.SaveAllAsync()) return Ok();
            return BadRequest("Failed to like the user");
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<LikeDTO>>> GetUserLikes([FromQuery] LikesParams likesParams)
        {
            likesParams.UserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var users = await _likesRepo.GetUserLikes(likesParams);

            Response.AddPaginationHeader(
                new PaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages));
                
            return Ok(users);
        }
        
    }
}