using API.DTOs;

namespace API.Interfaces
{
    public interface ITagService
    {
    Task<TagDTO> CreateTagAsync(int appUserId, TagDTO tagDTO);
    Task<bool> DeleteTagAsync(int appUserId, int tagId);
    }
}