namespace RealEstateApi.Contracts.Data
{
    public record UserRegistration(string Email, string Password, string FirstName, string LastName, string Address, string PhoneNumber);
}
