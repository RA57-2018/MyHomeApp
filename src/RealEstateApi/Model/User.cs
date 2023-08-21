using RealEstateApi.Interfaces;
using RealEstateApi.Model.Enum;
using System.ComponentModel.DataAnnotations.Schema;

namespace RealEstateApi.Model
{
    public class User : IIdentifiedObject<string>
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public int Points { get; set; }
        public Roles RoleId { get; set; }
        public ICollection<Advertisement> Advertisements { get; set; }
        public bool IsVerified { get; set; }
        public string Id { get; set; }
        public bool IsDeleted { get; set; }
        public string VerificationToken { get; set; }
    }
}
