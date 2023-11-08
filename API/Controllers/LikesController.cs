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
        private readonly IUnitOfWork _unitOfWork;
        public LikesController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpPost("{email}")]
        public async Task<ActionResult> AddLike(string email)
        {
            var sourceUserId = User.GetId();

            var likedUser = await _unitOfWork.UserRepository.GetUserByEmailAsync(email);
            var sourceUser = await _unitOfWork.LikesRepository.GetUserWithLikes(sourceUserId);
            
            if (likedUser == null) return NotFound();
            if (sourceUser.Email == email) return BadRequest("You cannot like yourself!");

            var userLike = await _unitOfWork.LikesRepository.GetUserLike(sourceUserId, likedUser.Id);
            if (userLike != null) return BadRequest("You already like this user!");

            userLike = new UserLike
            {
                SourceUserId = sourceUserId,
                TargetUserId = likedUser.Id
            };

            sourceUser.LikedUsers.Add(userLike);

            if (await _unitOfWork.Complete()) return Ok();

            return BadRequest("Failed to like the user");
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<LikeDTO>>> GetUserLikes([FromQuery] LikesParams likesParams)
        {
            likesParams.UserId = User.GetId();

            var users = await _unitOfWork.LikesRepository.GetUserLikes(likesParams);

            Response.AddPaginationHeader(
                new PaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages));
                
            return Ok(users);
        }
        
    }
}