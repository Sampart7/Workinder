using API.Data;
using API.DTOs;
using API.Entities;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API.Interfaces
{
    public class TagService : ITagService
    {
        private readonly DataContext _ctx;
        private readonly IMapper _mapper;

        public TagService(DataContext ctx, IMapper mapper)
        {
            _ctx = ctx;
            _mapper = mapper;
        }

        public async Task<TagDTO> CreateTagAsync(int appUserId, TagDTO tagDTO)
        {
            var user = await _ctx.Users
                .Include(u => u.Tags)
                .FirstOrDefaultAsync(u => u.Id == appUserId);

            if (user == null) return null;

            var existingTag = user.Tags.FirstOrDefault(t => t.Name == tagDTO.Name);

            if (existingTag != null) return null;

            var tag = new Tag
            {
                Name = tagDTO.Name
            };

            user.Tags.Add(tag);

            if (await _ctx.SaveChangesAsync() > 0) return _mapper.Map<TagDTO>(tag);

            return null;
        }

        public async Task<bool> DeleteTagAsync(int appUserId, int tagId)
        {
            var user = await _ctx.Users
                .Include(u => u.Tags)
                .FirstOrDefaultAsync(u => u.Id == appUserId);

            if (user == null) return false;

            var tag = user.Tags.FirstOrDefault(t => t.Id == tagId);

            if (tag == null) return false;

            user.Tags.Remove(tag);

            return await _ctx.SaveChangesAsync() > 0;
        }
    }
}
