using System.Collections.Generic;

namespace Application.Dtos
{
    public class ProfileDto
    {
        
        public string Username { get; set; }
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public string Image { get; set; }

        public bool Following { get; set; } // متابع
        public int FollowersCount { get; set; }
        public int FollowingsCount { get; set; }

        public ICollection<PhotoDto> Photos { get; set; }
    }
}