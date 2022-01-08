using Application.Dtos;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<ActivityUpdateCreateDto, Activity>().ReverseMap();
            
            CreateMap<Activity, ActivityDto>();
        }
    }
}