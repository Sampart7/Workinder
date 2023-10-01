using API.DTOs;
using API.Entities;

namespace API.Interfaces
{
    public interface IUserRepository
    {
        void Update(AppUser user);
        Task<bool> SaveAllAsync();
        Task<IEnumerable<AppUser>> GetUsersAsync();
        Task<AppUser> GetUserByIdAsync(int id);
        Task<AppUser> GetUserByEmailAsync(string email);
        Task<IEnumerable<MemberDTO>> GetMembersAsync();
        Task<MemberDTO> GetMemberAsync(string email);
    }
}