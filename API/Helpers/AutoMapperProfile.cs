using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers
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
                        source.DateofBirth.CalculateAge()));
                        
            CreateMap<Photo, PhotoDTO>();
            CreateMap<Tag, TagDTO>();
            CreateMap<MemberUpdateDTO, AppUser>();
            CreateMap<RegisterDTO, AppUser>();

            CreateMap<Message, MessageDTO>()
                .ForMember(x => x.SenderPhotoUrl, 
                    y => y.MapFrom(sender => 
                        sender.Sender.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(x => x.RecipientPhotoUrl, 
                    y => y.MapFrom(sender => 
                        sender.Recipient.Photos.FirstOrDefault(x => x.IsMain).Url));
            
            CreateMap<DateTime, DateTime>()
                .ConvertUsing(d => DateTime.SpecifyKind(d, DateTimeKind.Utc));
            CreateMap<DateTime?, DateTime?>()
                .ConvertUsing(d => d.HasValue ? DateTime.SpecifyKind(d.Value, DateTimeKind.Utc) : null);
        }
    }
}