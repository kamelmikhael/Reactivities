using System;

namespace Domain
{
    public class Comment
    {
        public Guid Id { get; set; }
        public string Body { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public string AuthorId { get; set; }
        public AppUser Author { get; set; }

        public Guid ActivityId { get; set; }
        public Activity Activity { get; set; }
    }
}