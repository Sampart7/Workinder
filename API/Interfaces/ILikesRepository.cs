using API.DTOs;
using API.Entities;
using API.Helpers.Paging;

namespace API.Interfaces
{
    public interface ILikesRepository
    {
        Task<UserLike> GetUserLike(int sourceUserId, int targetUserId);
        Task<AppUser> GetUserWithLikes(int userId);
        Task<PagedList<LikeDTO>> GetUserLikes(LikesParams likesParams);
        void DeleteLike(UserLike userLike);
    }
}