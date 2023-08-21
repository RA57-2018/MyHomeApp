using RealEstateApi.Model;

namespace RealEstateApi.Contracts.Data
{
    public class LoginResponseModel
    {
        public string Access { get; set; }
        public string Refresh { get; set; }
        public User User { get; set; }
    }
}
