namespace Application.Core
{
    public class PagingParams
    {
        private const int MinPageSize = 10;
        private const int MaxPageSize = 50;
        private const int MinPageNumber = 1;
        
        private int _pageNumber = MinPageNumber;
        public int PageNumber
        {
            get => _pageNumber;
            set => _pageNumber = (value <= 0) ? MinPageNumber : value;
        }
        

        private int _pageSize = MinPageSize;
        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }
        
    }
}