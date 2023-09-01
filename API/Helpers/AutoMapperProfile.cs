using API.DataTransferObjects;
using API.Entities;
using AutoMapper;

namespace API.Middleware
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<AppUser, MemberDTO>()
                .ForMember(x => x.PhotoUrl, 
                    option => option.MapFrom(source => 
                        source.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(x => x.Age,
                    option => option.MapFrom(source =>
                        source.GetAge()));
            CreateMap<Photo, PhotoDTO>();
            CreateMap<Tag, TagDTO>();
        }
    }
}