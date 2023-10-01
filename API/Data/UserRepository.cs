using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _ctx;
        private readonly IMapper _mapper;
        public UserRepository(DataContext ctx, IMapper mapper)
        {
            _mapper = mapper;
            _ctx = ctx;
        }

        public async Task<MemberDTO> GetMemberAsync(string email)
        {
            return await _ctx.Users
                .Where(x => x.Email == email)
                .ProjectTo<MemberDTO>(_mapper.ConfigurationProvider)
                .SingleOrDefaultAsync();
        }

        public async Task<IEnumerable<MemberDTO>> GetMembersAsync()
        {
            return await _ctx.Users 
                .ProjectTo<MemberDTO>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }

        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            return await _ctx.Users.FindAsync(id);
        }

        public async Task<AppUser> GetUserByEmailAsync(string email)
        {
            return await _ctx.Users
                .Include(p => p.Photos)
                .Include(t => t.Tags)
                .SingleOrDefaultAsync(x => x.Email == email);
        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            return await _ctx.Users
                .Include(p => p.Photos)
                .Include(t => t.Tags)
                .ToListAsync();
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _ctx.SaveChangesAsync() > 0;
        }

        public void Update(AppUser user)
        {
            _ctx.Entry(user).State = EntityState.Modified;
        }
    }
}