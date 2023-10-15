using API.DTOs;
using API.Entities;
using API.Helpers.Paging;
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

        public async Task<PagedList<MemberDTO>> GetMembersAsync(UserParams userParams)
        {
            var query = _ctx.Users.Include(user => user.Tags).AsQueryable();

            query = query.Where(user => user.Email != userParams.CurrentEmail);

            var minBD = DateTime.Today.AddYears(-userParams.MaxAge - 1);
            var maxDB = DateTime.Today.AddYears(-userParams.MinAge);

            query = query.Where(user => user.DateofBirth >= minBD && user.DateofBirth <= maxDB);

            if (userParams.Gender != "all") query = query.Where(u => u.Gender == userParams.Gender);

            if (!string.IsNullOrEmpty(userParams.SelectedTag))
            {
                query = query.Where(u => u.Tags.Any(tag => tag.Name == userParams.SelectedTag));
            }

            return await PagedList<MemberDTO>.CreateAsync(
                query.AsNoTracking().ProjectTo<MemberDTO>(_mapper.ConfigurationProvider), 
                userParams.PageNumber, userParams.PageSize);
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