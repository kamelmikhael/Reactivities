using Application.Activities.Queries;
using Application.Core;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplicationLayer(this IServiceCollection services)
        {
            services.AddMediatR(typeof(ActivityListQuery).Assembly);
            services.AddAutoMapper(typeof(MappingProfile).Assembly);
            return services;
        }
    }
}